import { Router, Request, Response } from 'express';
import { Webhook } from 'standardwebhooks';

const router = Router();

if (!process.env.DODO_PAYMENTS_WEBHOOK_SECRET) {
  console.warn('DODO_PAYMENTS_WEBHOOK_SECRET is not set. Webhook verification will fail.');
}

const webhook = new Webhook(process.env.DODO_PAYMENTS_WEBHOOK_SECRET || '');

interface WebhookPayload {
  event_type: string;
  data: {
    payment_id?: string;
    subscription_id?: string;
    customer_id?: string;
    status?: string;
    customer?: {
      customer_id?: string;
      email?: string;
      name?: string;
    };
    subscription?: {
      subscription_id?: string;
      status?: string;
    };
  };
}

router.post('/dodo-payments', async (req: Request, res: Response) => {
  try {
    const rawBody = JSON.stringify(req.body);
    
    const webhookHeaders = {
      'webhook-id': req.headers['webhook-id'] as string || '',
      'webhook-signature': req.headers['webhook-signature'] as string || '',
      'webhook-timestamp': req.headers['webhook-timestamp'] as string || '',
    };

    try {
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

  console.log('Subscription created:', {
    subscriptionId,
    customerId,
    customerEmail,
  });

  if (customerEmail && subscriptionId) {
    await updateUserSubscriptionStatus(
      customerEmail,
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

  console.log('Subscription updated:', {
    subscriptionId,
    status,
  });

  if (customerEmail && status) {
    await updateUserSubscriptionStatus(
      customerEmail,
      subscriptionId || '',
      payload.data.customer?.customer_id || '',
      status
    );
  }
}

async function handleSubscriptionCancelled(payload: WebhookPayload) {
  const subscriptionId = payload.data.subscription?.subscription_id || payload.data.subscription_id;
  const customerEmail = payload.data.customer?.email;

  console.log('Subscription cancelled:', {
    subscriptionId,
  });

  if (customerEmail) {
    await updateUserSubscriptionStatus(
      customerEmail,
      subscriptionId || '',
      payload.data.customer?.customer_id || '',
      'cancelled'
    );
  }
}

async function updateUserSubscriptionStatus(
  email: string,
  subscriptionId: string,
  customerId: string,
  status: string
) {
  try {
    const { updateUserSubscription, getUserByDodoCustomerId } = await import('../database/subscriptionQueries');
    
    // First try to find user by Dodo customer ID
    let userId = await getUserByDodoCustomerId(customerId);
    
    if (!userId) {
      console.warn(`No user found with Dodo customer ID ${customerId}. Subscription update skipped.`);
      return;
    }

    console.log(`Updating subscription for user ${userId} (${email}):`, {
      subscriptionId,
      customerId,
      status,
    });

    // STRICT: Only set Pro if status is explicitly "active"
    // Any other status (cancelled, expired, paused, etc.) = FREE tier
    if (status === 'active') {
      await updateUserSubscription(userId, customerId, subscriptionId, 'active');
      console.log(`✅ Successfully activated Pro subscription for user ${userId}`);
    } else {
      // For any other status, explicitly set to free
      await updateUserSubscription(userId, customerId, subscriptionId, 'free');
      console.log(`❌ Deactivated Pro subscription for user ${userId}, status: ${status}`);
    }
  } catch (error) {
    console.error('Error updating user subscription status:', error);
  }
}

export default router;
