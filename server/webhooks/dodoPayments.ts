import { Router, Request, Response } from 'express';
import { Webhook } from 'standardwebhooks';

const router = Router();

if (!process.env.DODO_PAYMENTS_WEBHOOK_SECRET) {
  console.warn('⚠️ DODO_PAYMENTS_WEBHOOK_SECRET is not set. Webhook verification will fail.');
}

const webhook = process.env.DODO_PAYMENTS_WEBHOOK_SECRET
  ? new Webhook(process.env.DODO_PAYMENTS_WEBHOOK_SECRET)
  : null;

interface WebhookPayload {
  event_type: string;
  data: {
    payment_id?: string;
    subscription_id?: string;
    customer_id?: string;
    status?: string;
    customer_reference?: string; // userId passed from checkout URL
    metadata?: {
      userId?: string; // Alternative location for userId
      customer_reference?: string;
    };
    customer?: {
      customer_id?: string;
      email?: string;
      name?: string;
      customer_reference?: string;
    };
    subscription?: {
      subscription_id?: string;
      status?: string;
    };
  };
}

router.post('/dodo-payments', async (req: Request, res: Response) => {
  try {
    const rawBody = (req as any).rawBody
      ? (req as any).rawBody.toString('utf8')
      : JSON.stringify(req.body);
    
    const webhookHeaders = {
      'webhook-id': req.headers['webhook-id'] as string || '',
      'webhook-signature': req.headers['webhook-signature'] as string || '',
      'webhook-timestamp': req.headers['webhook-timestamp'] as string || '',
    };

    try {
      if (!webhook) {
        console.error('Webhook verification skipped: DODO_PAYMENTS_WEBHOOK_SECRET is not configured');
        return res.status(400).json({ error: 'Webhook secret not configured' });
      }
      await webhook.verify(rawBody, webhookHeaders);
    } catch (err) {
      console.error('Webhook verification failed:', err);
      return res.status(400).json({ error: 'Webhook verification failed' });
    }

    const payload = req.body as WebhookPayload;

    console.log('Received webhook event:', payload.event_type);

    switch (payload.event_type) {
      case 'payment.succeeded':
        await handlePaymentSucceeded(payload);
        break;
      
      case 'subscription.created':
        await handleSubscriptionCreated(payload);
        break;
      
      case 'subscription.updated':
        await handleSubscriptionUpdated(payload);
        break;
      
      case 'subscription.cancelled':
        await handleSubscriptionCancelled(payload);
        break;
      
      case 'payment.failed':
        console.log('Payment failed:', payload.data.payment_id);
        break;
      
      default:
        console.log('Unhandled webhook event:', payload.event_type);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

async function handlePaymentSucceeded(payload: WebhookPayload) {
  console.log('Payment succeeded:', {
    paymentId: payload.data.payment_id,
    customerId: payload.data.customer_id,
  });
}

async function handleSubscriptionCreated(payload: WebhookPayload) {
  const subscriptionId = payload.data.subscription?.subscription_id || payload.data.subscription_id;
  const customerId = payload.data.customer?.customer_id || payload.data.customer_id;
  const customerEmail = payload.data.customer?.email;
  
  // Try to get userId from multiple possible locations
  const userId = payload.data.customer_reference || 
                 payload.data.metadata?.userId ||
                 payload.data.metadata?.customer_reference ||
                 payload.data.customer?.customer_reference;

  console.log('Subscription created:', {
    subscriptionId,
    customerId,
    customerEmail,
    userId,
  });

  if (subscriptionId) {
    await updateUserSubscriptionStatus(
      userId,
      customerEmail || '',
      subscriptionId,
      customerId || '',
      'active'
    );
  }
}

async function handleSubscriptionUpdated(payload: WebhookPayload) {
  const subscriptionId = payload.data.subscription?.subscription_id || payload.data.subscription_id;
  const status = payload.data.subscription?.status || payload.data.status;
  const customerEmail = payload.data.customer?.email;
  
  // Try to get userId from multiple possible locations
  const userId = payload.data.customer_reference || 
                 payload.data.metadata?.userId ||
                 payload.data.metadata?.customer_reference ||
                 payload.data.customer?.customer_reference;

  console.log('Subscription updated:', {
    subscriptionId,
    status,
    userId,
  });

  if (status) {
    await updateUserSubscriptionStatus(
      userId,
      customerEmail || '',
      subscriptionId || '',
      payload.data.customer?.customer_id || '',
      status
    );
  }
}

async function handleSubscriptionCancelled(payload: WebhookPayload) {
  const subscriptionId = payload.data.subscription?.subscription_id || payload.data.subscription_id;
  const customerEmail = payload.data.customer?.email;
  
  // Try to get userId from multiple possible locations
  const userId = payload.data.customer_reference || 
                 payload.data.metadata?.userId ||
                 payload.data.metadata?.customer_reference ||
                 payload.data.customer?.customer_reference;

  console.log('Subscription cancelled:', {
    subscriptionId,
    userId,
  });

  await updateUserSubscriptionStatus(
    userId,
    customerEmail || '',
    subscriptionId || '',
    payload.data.customer?.customer_id || '',
    'cancelled'
  );
}

async function updateUserSubscriptionStatus(
  userId: string | undefined,
  email: string,
  subscriptionId: string,
  customerId: string,
  status: string
) {
  try {
    const { updateUserSubscription, getUserByDodoCustomerId } = await import('../database/subscriptionQueries');
    
    // Priority 1: Use userId from customer_reference if available
    let finalUserId = userId;
    
    // Priority 2: Try to find user by Dodo customer ID if userId not provided
    if (!finalUserId && customerId) {
      finalUserId = (await getUserByDodoCustomerId(customerId)) || undefined;
    }
    
    // Priority 3: Try to find by email as last resort
    if (!finalUserId && email) {
      const { clerkClient } = await import('@clerk/express');
      try {
        // Search for user by email in Clerk
        const users = await clerkClient.users.getUserList({ emailAddress: [email] });
        if (users.data && users.data.length > 0) {
          finalUserId = users.data[0].id;
          console.log(`Found user by email lookup: ${finalUserId}`);
        }
      } catch (emailError) {
        console.error('Error looking up user by email:', emailError);
      }
    }
    
    if (!finalUserId) {
      console.warn(`⚠️ Could not identify user. customerId: ${customerId}, email: ${email}, userId: ${userId}. Subscription update skipped.`);
      return;
    }

    console.log(`Updating subscription for user ${finalUserId} (${email}):`, {
      subscriptionId,
      customerId,
      status,
    });

    // STRICT: Only set Pro if status is explicitly "active"
    // Any other status (cancelled, expired, paused, etc.) = FREE tier
    if (status === 'active') {
      await updateUserSubscription(finalUserId, customerId, subscriptionId, 'active');
      console.log(`✅ Successfully activated Pro subscription for user ${finalUserId}`);
    } else {
      // For any other status, explicitly set to free
      await updateUserSubscription(finalUserId, customerId, subscriptionId, 'free');
      console.log(`❌ Deactivated Pro subscription for user ${finalUserId}, status: ${status}`);
    }
  } catch (error) {
    console.error('Error updating user subscription status:', error);
  }
}

export default router;
