import DodoPayments from 'dodopayments';

if (!process.env.DODO_PAYMENTS_API_KEY) {
  throw new Error('DODO_PAYMENTS_API_KEY is not set in environment variables');
}

if (!process.env.DODO_PAYMENTS_PRODUCT_ID) {
  throw new Error('DODO_PAYMENTS_PRODUCT_ID is not set in environment variables');
}

export const dodoClient = new DodoPayments({
  bearerToken: process.env.DODO_PAYMENTS_API_KEY,
  environment: process.env.NODE_ENV === 'production' ? 'live_mode' : 'test_mode',
});

export const PRODUCT_ID = process.env.DODO_PAYMENTS_PRODUCT_ID;

/**
 * Get or create a Dodo Payments customer by email
 */
export async function getOrCreateCustomer(email: string, name: string) {
  try {
    // Try to find existing customer by email
    const customers = await dodoClient.customers.list({});
    const existingCustomer = customers.customers?.find((c: any) => c.email === email);
    
    if (existingCustomer) {
      return {
        customerId: existingCustomer.customer_id,
        email: existingCustomer.email,
      };
    }
    
    // Create new customer if not found
    const newCustomer = await dodoClient.customers.create({
      email,
      name,
    });
    
    return {
      customerId: newCustomer.customer_id,
      email: newCustomer.email,
    };
  } catch (error) {
    console.error('Error getting or creating customer:', error);
    throw new Error('Failed to get or create customer');
  }
}

export async function createCheckoutSession(userEmail: string, userName: string, userId: string) {
  try {
    // Ensure customer exists before creating payment
    await getOrCreateCustomer(userEmail, userName);
    
    const session = await dodoClient.payments.create({
      payment_link: true,
      customer: {
        email: userEmail,
        name: userName,
      },
      billing: {
        city: 'N/A',
        country: 'US',
        state: 'N/A',
        street: 'N/A',
        zipcode: '00000',
      },
      product_cart: [{
        product_id: PRODUCT_ID,
        quantity: 1,
      }],
      metadata: {
        userId,
      },
    });

    return {
      sessionId: session.payment_id,
      paymentLink: session.payment_link || '',
    };
  } catch (error: any) {
    console.error('Error creating Dodo Payments checkout session:', error);
    console.error('Dodo error details:', error.message, error.response?.data);
    throw new Error(`Failed to create checkout session: ${error.message}`);
  }
}

export async function verifyPaymentStatus(paymentId: string) {
  try {
    const payment = await dodoClient.payments.retrieve(paymentId);
    return {
      status: payment.status,
      customerId: payment.customer?.customer_id,
      subscriptionId: payment.subscription_id,
    };
  } catch (error) {
    console.error('Error verifying payment status:', error);
    throw new Error('Failed to verify payment status');
  }
}

export async function getSubscriptionStatus(subscriptionId: string) {
  try {
    const subscription = await dodoClient.subscriptions.retrieve(subscriptionId);
    return {
      status: subscription.status,
      customerId: subscription.customer?.customer_id,
      isActive: subscription.status === 'active',
    };
  } catch (error) {
    console.error('Error getting subscription status:', error);
    throw new Error('Failed to get subscription status');
  }
}

export async function cancelSubscription(subscriptionId: string) {
  try {
    const subscription = await dodoClient.subscriptions.update(subscriptionId, {
      status: 'cancelled',
    });
    return {
      status: subscription.status,
      success: true,
    };
  } catch (error) {
    console.error('Error canceling subscription:', error);
    throw new Error('Failed to cancel subscription');
  }
}
