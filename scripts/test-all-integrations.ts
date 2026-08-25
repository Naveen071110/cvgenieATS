import fs from 'fs';
import path from 'path';

// Safely load .env if not loaded
const envPath = path.resolve(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, 'utf8').split('\n');
  lines.forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx !== -1) {
      const key = trimmed.slice(0, eqIdx).trim();
      let val = trimmed.slice(eqIdx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      process.env[key] = val;
    }
  });
}

async function runDiagnostics() {
  console.log('\n=============================================');
  console.log('🔍 CVGenie Integrations & API Keys Verification');
  console.log('=============================================\n');

  console.log('--- Configuration Prefix Analysis (No Secrets) ---');
  console.log('DATABASE_URL prefix:', process.env.DATABASE_URL ? process.env.DATABASE_URL.substring(0, 16) + '...' : 'EMPTY');
  console.log('DODO_PAYMENTS_MODE:', process.env.DODO_PAYMENTS_MODE || 'live_mode (default)');
  console.log('VITE_CLERK_PUBLISHABLE_KEY prefix:', process.env.VITE_CLERK_PUBLISHABLE_KEY ? process.env.VITE_CLERK_PUBLISHABLE_KEY.substring(0, 10) + '...' : 'EMPTY');
  console.log('CLERK_SECRET_KEY prefix:', process.env.CLERK_SECRET_KEY ? process.env.CLERK_SECRET_KEY.substring(0, 10) + '...' : 'EMPTY');
  console.log('--------------------------------------------------\n');

  // 1. Database Check (Neon / PostgreSQL)
  console.log('--- [1/4] PostgreSQL / Neon Database ---');
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl || dbUrl.includes('your_') || dbUrl.includes('placeholder')) {
    console.log('⚠️ DATABASE_URL is not set or has placeholder value.');
  } else {
    try {
      const { neon } = await import('@neondatabase/serverless');
      const sql = neon(dbUrl);
      const testResult = await sql`SELECT 1 as connected, NOW() as server_time;`;
      console.log('✅ Database Connection: SUCCESS');
      console.log(`   Connected to PostgreSQL at ${testResult[0]?.server_time}`);

      // Check tables
      try {
        const tables = await sql`
          SELECT table_name 
          FROM information_schema.tables 
          WHERE table_schema = 'public';
        `;
        const tableNames = tables.map((t: any) => t.table_name);
        console.log(`   Found tables: ${tableNames.join(', ') || 'None (run npm run db:push)'}`);
      } catch (err: any) {
        console.log(`   ⚠️ Table inspection note: ${err.message}`);
      }
    } catch (err: any) {
      console.error('❌ Database Connection FAILED:', err.message);
    }
  }

  // 2. DeepSeek AI Check
  console.log('\n--- [2/4] DeepSeek AI API ---');
  const deepseekKey = process.env.DEEPSEEK_API_KEY;
  if (!deepseekKey || deepseekKey.includes('your_') || deepseekKey.includes('placeholder')) {
    console.log('⚠️ DEEPSEEK_API_KEY is not set or has placeholder value.');
  } else {
    try {
      const res = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${deepseekKey}`,
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [{ role: 'user', content: 'Reply with the single word: "READY"' }],
          max_tokens: 10,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const reply = data.choices?.[0]?.message?.content?.trim();
        console.log('✅ DeepSeek API: SUCCESS');
        console.log(`   Model response: "${reply}"`);
      } else {
        const errText = await res.text();
        console.error(`❌ DeepSeek API FAILED: HTTP ${res.status} ${res.statusText}`);
        console.error(`   Error details: ${errText}`);
      }
    } catch (err: any) {
      console.error('❌ DeepSeek API Network Error:', err.message);
    }
  }

  // 3. Dodo Payments Check
  console.log('\n--- [3/4] Dodo Payments API ---');
  const dodoKey = process.env.DODO_PAYMENTS_API_KEY;
  const dodoProd = process.env.DODO_PAYMENTS_PRODUCT_ID;
  const dodoMode = process.env.DODO_PAYMENTS_MODE || 'live_mode';

  if (!dodoKey || dodoKey.includes('your_') || dodoKey.includes('placeholder')) {
    console.log('⚠️ DODO_PAYMENTS_API_KEY is not set or has placeholder value.');
  } else {
    try {
      const { default: DodoPayments } = await import('dodopayments');
      const client = new DodoPayments({
        bearerToken: dodoKey,
        environment: dodoMode === 'test' || dodoMode === 'test_mode' ? 'test_mode' : 'live_mode',
      });

      const productsRes: any = await client.products.list({});
      const products = productsRes.items || productsRes.products || [];
      console.log('✅ Dodo Payments API: SUCCESS');
      console.log(`   Environment: ${client.environment}`);
      console.log(`   Total products found: ${products.length}`);
      
      if (products.length > 0) {
        products.forEach((p: any) => {
          console.log(`   - Product: "${p.name}" (ID: ${p.product_id})`);
        });
      }

      if (dodoProd) {
        const found = products.some((p: any) => p.product_id === dodoProd);
        if (found) {
          console.log(`✅ Configured Product ID (${dodoProd.substring(0, 10)}...) verified in dashboard.`);
        } else {
          console.log(`⚠️ Configured Product ID (${dodoProd}) not found in current ${client.environment} list.`);
        }
      }
    } catch (err: any) {
      console.error('❌ Dodo Payments API FAILED:', err.message);
    }
  }

  // 4. Clerk Authentication Check
  console.log('\n--- [4/4] Clerk Authentication ---');
  const clerkPub = process.env.VITE_CLERK_PUBLISHABLE_KEY || process.env.CLERK_PUBLISHABLE_KEY;
  const clerkSecret = process.env.CLERK_SECRET_KEY;

  if (!clerkPub) {
    console.log('⚠️ VITE_CLERK_PUBLISHABLE_KEY is not set.');
  } else {
    const isTestKey = clerkPub.startsWith('pk_test_');
    const isLiveKey = clerkPub.startsWith('pk_live_');
    console.log(`✅ Clerk Publishable Key present (${isTestKey ? 'Development / Test' : isLiveKey ? 'Production / Live' : 'Custom'})`);
    if (!isTestKey) {
      console.log('⚠️ Note: For localhost development, Clerk requires a test key (pk_test_...) to prevent origin mismatch.');
    }
  }

  if (!clerkSecret) {
    console.log('⚠️ CLERK_SECRET_KEY (backend) is not set.');
  } else {
    try {
      const { createClerkClient } = await import('@clerk/express');
      const clerk = createClerkClient({ secretKey: clerkSecret, publishableKey: clerkPub });
      const count = await clerk.users.getCount();
      console.log('✅ Clerk Backend Secret Key: SUCCESS');
      console.log(`   Registered users count in Clerk: ${count}`);
    } catch (err: any) {
      console.error('❌ Clerk Backend Secret Key verification failed:', err.message);
    }
  }

  console.log('\n=============================================');
  console.log('Diagnostics Complete.');
  console.log('=============================================\n');
}

runDiagnostics().catch(console.error);
