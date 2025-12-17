import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database(path.join(__dirname, '../data/nexuscrm.db'));

export const initDatabase = () => {
  // Users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      firstName TEXT,
      lastName TEXT,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Leads table
  db.exec(`
    CREATE TABLE IF NOT EXISTS leads (
      id TEXT PRIMARY KEY,
      firstName TEXT NOT NULL,
      lastName TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      company TEXT,
      position TEXT,
      status TEXT NOT NULL,
      value REAL NOT NULL,
      channel TEXT NOT NULL,
      gaData TEXT,
      interactions TEXT,
      score INTEGER,
      lastContacted TEXT,
      avatarUrl TEXT,
      userId INTEGER,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      updatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id)
    )
  `);

  // Tasks table
  db.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      type TEXT NOT NULL,
      date TEXT NOT NULL,
      time TEXT,
      completed INTEGER DEFAULT 0,
      priority INTEGER DEFAULT 0,
      description TEXT,
      amount REAL,
      userId INTEGER,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id)
    )
  `);

  // Quotes table
  db.exec(`
    CREATE TABLE IF NOT EXISTS quotes (
      id TEXT PRIMARY KEY,
      leadId TEXT NOT NULL,
      date TEXT NOT NULL,
      status TEXT NOT NULL,
      totalAmount REAL NOT NULL,
      items TEXT NOT NULL,
      userId INTEGER,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (leadId) REFERENCES leads(id),
      FOREIGN KEY (userId) REFERENCES users(id)
    )
  `);

  // Create default admin user if not exists
  const adminExists = db.prepare('SELECT * FROM users WHERE email = ?').get(process.env.ADMIN_EMAIL || 'admin@nexuscrm.com');

  if (!adminExists) {
    const hashedPassword = bcrypt.hashSync(process.env.ADMIN_PASSWORD || 'admin123', 10);
    db.prepare('INSERT INTO users (email, password, firstName, lastName) VALUES (?, ?, ?, ?)').run(
      process.env.ADMIN_EMAIL || 'admin@nexuscrm.com',
      hashedPassword,
      'Admin',
      'User'
    );
    console.log('✅ Default admin user created');
  }

  console.log('✅ Database initialized');
};

export default db;
