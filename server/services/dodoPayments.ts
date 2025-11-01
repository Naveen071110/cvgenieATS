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
 * Debug function to list all available products in current environment
 */
export async function listAvailableProducts() {
  try {
    const products = await dodoClient.products.list({});
    console.log('📦 Available products in Dodo Payments:');
    if (products.products && products.products.length > 0) {
      products.products.forEach((product: any) => {
        console.log(`  - ${product.name}: ${product.product_id}`);
      });
      return products.products;
    } else {
      console.log('  ⚠️ No products found in current environment');
      return [];
    }
  } catch (error: any) {
    console.error('❌ Error listing products:', error.message);
    return [];
  }
}

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

export async function createCheckoutSession(
  customerEmail: string,
  customerName: string,
  userId: string
): Promise<{ sessionId: string; paymentLink: string }> {
  const apiKey = process.env.DODO_PAYMENTS_API_KEY;
  const productId = process.env.DODO_PAYMENTS_PRODUCT_ID;

  if (!apiKey || !productId) {
    console.error("❌ Missing Dodo Payments configuration");
    throw new Error("Dodo Payments API key or Product ID not configured");
  }

  // Log the product ID being used (first 10 chars only for security)
  console.log(`🔧 Using Product ID: ${productId.substring(0, 10)}...`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV === 'production' ? 'live_mode' : 'test_mode'}`);

  // Validate product ID format
  if (!productId.startsWith('pdt_') && !productId.startsWith('prod_')) {
    console.error(`❌ Invalid product ID format: ${productId}`);
    throw new Error("Invalid Dodo Payments Product ID format. Must start with 'pdt_' or 'prod_'");
  }

  try {
    // Debug: List all available products to verify configuration
    console.log('🔍 Verifying product availability...');
    const availableProducts = await listAvailableProducts();
    const productExists = availableProducts.some((p: any) => p.product_id === productId);
    
    if (!productExists && availableProducts.length > 0) {
      console.error(`❌ Product ID '${productId}' not found in available products`);
      console.error(`💡 Available product IDs: ${availableProducts.map((p: any) => p.product_id).join(', ')}`);
    }

    // Ensure customer exists before creating payment
    await getOrCreateCustomer(customerEmail, customerName);

    const session = await dodoClient.payments.create({
      payment_link: true,
      customer: {
        email: customerEmail,
        name: customerName,
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

    // Specific handling for 404 product not found
    if (error.response?.status === 404 && error.response?.data?.error?.includes('Product id')) {
      console.error(`❌ Product ID '${productId}' does not exist in Dodo Payments dashboard`);
      throw new Error(
        `Product configuration error: The Product ID '${productId}' does not exist in your Dodo Payments dashboard. ` +
        `Please verify the correct Product ID in your Dodo Payments dashboard and update the DODOPAYMENTSPRODUCTID environment variable.`
      );
    }

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