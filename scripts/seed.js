const mysql = require('mysql2/promise');
const { drizzle } = require('drizzle-orm/mysql2');

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error('DATABASE_URL is not set');
    process.exit(1);
  }

  console.log('Seeding database...');
  const connection = await mysql.createConnection(connectionString);
  const db = drizzle(connection);

  // Direct SQL execution for seeding to keep it simple and independent of schema imports if needed,
  // or use the schema imports if they are compiled. Since we're running raw node:
  await connection.execute(`
    INSERT INTO users (name, email)
    VALUES ('Shopora Admin', 'admin@shopora.com')
    ON DUPLICATE KEY UPDATE name = name;
  `);

  console.log('Database seeded successfully!');
  await connection.end();
}

main().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
