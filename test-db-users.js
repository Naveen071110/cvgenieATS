
const { neon } = require('@neondatabase/serverless');
const sql = neon(process.env.DATABASE_URL);

async function checkUsers() {
  try {
    const users = await sql`
      SELECT session_id, is_pro, subscription_status, dodo_customer_id, dodo_subscription_id
      FROM usage_sessions
      ORDER BY id DESC
      LIMIT 10
    `;

    console.log('\n📊 Current User Status (Last 10):');
    console.log('=====================================');
    
    if (users.length === 0) {
      console.log('No users found in database');
    } else {
      users.forEach((user, index) => {
        const tier = user.is_pro === 1 && user.subscription_status === 'active' ? '👑 PRO' : '🆓 FREE';
        console.log(`\n${index + 1}. User: ${user.session_id.substring(0, 20)}...`);
        console.log(`   Status: ${tier}`);
        console.log(`   DB is_pro: ${user.is_pro}`);
        console.log(`   DB subscription_status: ${user.subscription_status}`);
        console.log(`   Dodo Customer ID: ${user.dodo_customer_id || 'None'}`);
      });
    }

    const proCount = users.filter(u => u.is_pro === 1 && u.subscription_status === 'active').length;
    const freeCount = users.length - proCount;
    
    console.log('\n=====================================');
    console.log(`Total shown: ${users.length} | Pro: ${proCount} | Free: ${freeCount}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkUsers();
