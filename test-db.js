import mysql from 'mysql2/promise';

const DATABASE_URL = 'mysql://3w4XpVQP5yJengn.root:9yu08FnWfjuNyaVG@gateway01.eu-central-1.prod.aws.tidbcloud.com:4000/xterics_design?ssl=true';

async function testConnection() {
  try {
    const connection = await mysql.createConnection(DATABASE_URL);
    console.log('✅ Database connection successful!');
    
    const [rows] = await connection.execute('SELECT COUNT(*) as count FROM services');
    console.log('✅ Services count:', rows[0].count);
    
    const [services] = await connection.execute('SELECT id, name, price FROM services LIMIT 3');
    console.log('✅ Sample services:', services);
    
    await connection.end();
  } catch (error) {
    console.error('❌ Database error:', error.message);
    process.exit(1);
  }
}

testConnection();
