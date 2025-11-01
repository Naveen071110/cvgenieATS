import DodoPayments from 'dodopayments';

if (!process.env.DODO_PAYMENTS_API_KEY) {
  throw new Error('DODO_PAYMENTS_API_KEY is not set in environment variables');
}

if (!process.env.DODO_PAYMENTS_PRODUCT_ID) {
  throw new Error('DODO_PAYMENTS_PRODUCT_ID is not set in environment variables');
}

/**
 * Determine Dodo Payments environment mode
 * Priority:
 * 1. Explicit DODO_PAYMENTS_MODE env var ('live' or 'test')
 * 2. Default to 'live_mode' for production-like deployments
 * 
 * NOTE: This is independent of NODE_ENV to allow testing live mode in development
 */
const getDodoEnvironment = (): 'live_mode' | 'test_mode' => {
  const explicitMode = process.env.DODO_PAYMENTS_MODE?.toLowerCase();
  
  if (explicitMode === 'live' || explicitMode === 'live_mode') {
    return 'live_mode';
  }
  
  if (explicitMode === 'test' || explicitMode === 'test_mode') {
    return 'test_mode';
  }
  
  // Default to live_mode if not explicitly set
  // This allows live keys to work in development environment
  return 'live_mode';
};

export const DODO_ENVIRONMENT = getDodoEnvironment();
export const PRODUCT_ID = process.env.DODO_PAYMENTS_PRODUCT_ID;

// Log configuration at startup
console.log('🔧 Dodo Payments Configuration:');
console.log(`   Environment: ${DODO_ENVIRONMENT}`);
console.log(`   Product ID: ${PRODUCT_ID.substring(0, 15)}...`);
console.log(`   API Key: ${process.env.DODO_PAYMENTS_API_KEY?.substring(0, 10)}...`);

export const dodoClient = new DodoPayments({
  bearerToken: process.env.DODO_PAYMENTS_API_KEY,
  environment: DODO_ENVIRONMENT,
});

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
  const productId = PRODUCT_ID;
  const requestTimestamp = new Date().toISOString();

  console.log('\n🛒 ===== CHECKOUT SESSION REQUEST =====');
  console.log(`📅 Timestamp: ${requestTimestamp}`);
  console.log(`👤 Customer: ${customerEmail} (User ID: ${userId})`);
  console.log(`🌍 Dodo Environment: ${DODO_ENVIRONMENT}`);
  console.log(`🆔 Product ID: ${productId}`);
  console.log(`🔑 API Key (first 10 chars): ${apiKey?.substring(0, 10)}...`);

  if (!apiKey || !productId) {
    console.error("❌ Missing Dodo Payments configuration");
    throw new Error("Dodo Payments API key or Product ID not configured");
  }

  // Validate product ID format
  if (!productId.startsWith('pdt_') && !productId.startsWith('prod_')) {
    console.error(`❌ Invalid product ID format: ${productId}`);
    throw new Error("Invalid Dodo Payments Product ID format. Must start with 'pdt_' or 'prod_'");
  }

  try {
    // Debug: List all available products to verify configuration
    console.log('🔍 Verifying product availability in Dodo Payments...');
    const availableProducts = await listAvailableProducts();
    const productExists = availableProducts.some((p: any) => p.product_id === productId);
    
    if (!productExists) {
      console.error(`❌ CRITICAL: Product ID '${productId}' NOT FOUND in Dodo Payments ${DODO_ENVIRONMENT}`);
      if (availableProducts.length > 0) {
        console.error(`💡 Available products in ${DODO_ENVIRONMENT}:`);
        availableProducts.forEach((p: any) => {
          console.error(`   - ${p.name}: ${p.product_id}`);
        });
      } else {
        console.error(`⚠️ No products found in ${DODO_ENVIRONMENT}. Check your Dodo dashboard.`);
      }
      throw new Error(`Product not found in ${DODO_ENVIRONMENT}. Please verify your product exists in the correct environment.`);
    } else {
      console.log(`✅ Product verified: ${productId} exists in ${DODO_ENVIRONMENT}`);
    }

    // Ensure customer exists before creating payment
    console.log(`👤 Getting or creating customer: ${customerEmail}`);
    await getOrCreateCustomer(customerEmail, customerName);

    console.log('💳 Creating payment session...');
    console.log(`📦 Request payload: product_cart=[{product_id: "${PRODUCT_ID}", quantity: 1}]`);
    
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
    
    console.log(`✅ Payment session created successfully: ${session.payment_id}`);

    return {
      sessionId: session.payment_id,
      paymentLink: session.payment_link || '',
    };
  } catch (error: any) {
    console.error('\n❌ ===== CHECKOUT SESSION FAILED =====');
    console.error(`📅 Timestamp: ${new Date().toISOString()}`);
    console.error(`🌍 Environment: ${DODO_ENVIRONMENT}`);
    console.error(`🆔 Product ID: ${productId}`);
    console.error(`👤 Customer: ${customerEmail}`);
    console.error(`🔴 Error Type: ${error.constructor.name}`);
    console.error(`🔴 Error Message: ${error.message}`);
    console.error(`🔴 Status Code: ${error.status || error.response?.status || 'N/A'}`);
    console.error(`🔴 Response Data:`, JSON.stringify(error.response?.data || error.body || 'No response data', null, 2));
    
    // Specific handling for 404 product not found
    if ((error.status === 404 || error.response?.status === 404)) {
      console.error(`\n⚠️ DIAGNOSIS: Product ID '${productId}' does not exist in ${DODO_ENVIRONMENT}`);
      console.error(`💡 ACTION REQUIRED:`);
      console.error(`   1. Verify product exists in Dodo Payments dashboard in ${DODO_ENVIRONMENT}`);
      console.error(`   2. Check that API key matches the environment (live vs test)`);
      console.error(`   3. Ensure product is active and not archived`);
      throw new Error(
        `Product configuration error: The Product ID '${productId}' does not exist in your Dodo Payments ${DODO_ENVIRONMENT} dashboard. ` +
        `Please verify the correct Product ID and ensure your API key matches the environment.`
      );
    }
    
    // Handling for 401 unauthorized (wrong API key or environment mismatch)
    if (error.status === 401 || error.response?.status === 401) {
      console.error(`\n⚠️ DIAGNOSIS: API key authentication failed for ${DODO_ENVIRONMENT}`);
      console.error(`💡 ACTION REQUIRED:`);
      console.error(`   1. Verify DODO_PAYMENTS_API_KEY is for ${DODO_ENVIRONMENT}`);
      console.error(`   2. Check that API key is not expired or revoked`);
      console.error(`   3. Confirm you're using the correct environment (live vs test)`);
      throw new Error(
        `Authentication error: API key does not match ${DODO_ENVIRONMENT}. ` +
        `Please verify your DODO_PAYMENTS_API_KEY is the correct ${DODO_ENVIRONMENT} key.`
      );
    }

    console.error('=====================================\n');
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