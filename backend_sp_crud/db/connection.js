// const mysql = require('mysql2');
// require('dotenv').config();

// const connection = mysql.createPool({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0
// });
// connection.getConnection(async(err, conn) => {
//     if (err) {
//       console.error('Database connection failed:', err);
//       const [dbName] = await conn.query('SELECT DATABASE() AS db');
//     console.log('📂 Current Database:', dbName[0].db);

//     const [tables] = await conn.query('SHOW TABLES');
//     console.log('📋 Tables in Database:');
//     tables.forEach((table, index) => {
//       console.log(`${index + 1}. ${Object.values(table)[0]}`);
//     });
//     } else {
//       console.log('Database connected successfully!');
//       conn.release();
//     }
//   });
// module.exports = connection.promise();  // use promise API for async/await


const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Check DB connection and log database + tables
connection.getConnection(async (err, conn) => {
  if (err) {
    console.error('❌ Database connection failed:', err);
    return;
  }

  try {
    console.log('✅ Database connected successfully!');
    
    // Use promise wrapper on the connection
    const promiseConn = conn.promise();

    const [dbName] = await promiseConn.query('SELECT DATABASE() AS db');
    console.log('📂 Current Database:', dbName[0].db);

    const [tables] = await promiseConn.query('SHOW TABLES');
    console.log('📋 Tables in Database:');
    tables.forEach((table, index) => {
      console.log(`${index + 1}. ${Object.values(table)[0]}`);
    });

  } catch (queryErr) {
    console.error('❌ Error running DB info queries:', queryErr);
  } finally {
    conn.release();
  }
});

// Export the pool with promises
module.exports = connection.promise();
