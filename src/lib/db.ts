import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'nucha.db');

let db: Database.Database;

function getDb(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    initializeDatabase();
  }
  return db;
}

function initializeDatabase() {
  const database = db;
  
  database.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'user',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      price TEXT,
      location TEXT,
      image_url TEXT,
      category TEXT,
      status TEXT DEFAULT 'available',
      featured INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      service TEXT NOT NULL,
      booking_date TEXT NOT NULL,
      booking_time TEXT NOT NULL,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      notes TEXT,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS portfolio (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      image_url TEXT,
      category TEXT,
      before_image TEXT,
      after_image TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS services (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      icon TEXT,
      features TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Seed default services
  const serviceCount = database.prepare('SELECT COUNT(*) as count FROM services').get() as { count: number };
  if (serviceCount.count === 0) {
    const insertService = database.prepare(
      'INSERT INTO services (title, description, icon, features) VALUES (?, ?, ?, ?)'
    );
    insertService.run('Construction', 'Full-scale construction services from foundation to finishing', 'building', JSON.stringify(['Residential Construction', 'Commercial Building', 'Renovation', 'Structural Work']));
    insertService.run('Built-in Furniture', 'Custom built-in furniture designed for your space', 'sofa', JSON.stringify(['Kitchen Cabinets', 'Wardrobes', 'TV Units', 'Shelving Systems']));
    insertService.run('Decoration', 'Complete decoration solutions for walls and floors', 'palette', JSON.stringify(['Curtains & Drapes', 'Wallpaper Installation', 'Vinyl Flooring', 'Wall Panels']));
    insertService.run('Design & Graphics', 'Creative design and visual communication services', 'design', JSON.stringify(['Interior Design', '3D Visualization', 'Brand Identity', 'Marketing Materials']));
  }

  // Seed sample projects
  const projectCount = database.prepare('SELECT COUNT(*) as count FROM projects').get() as { count: number };
  if (projectCount.count === 0) {
    const insertProject = database.prepare(
      'INSERT INTO projects (title, description, price, location, image_url, category, status, featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
    );
    insertProject.run('Modern Luxury Villa', 'Contemporary 4-bedroom villa with panoramic views', '$850,000', 'Bangkok, Thailand', '/images/project1.jpg', 'residential', 'available', 1);
    insertProject.run('Urban Penthouse', 'Sky-high living with premium finishes', '$1,200,000', 'Sukhumvit, Bangkok', '/images/project2.jpg', 'residential', 'available', 1);
    insertProject.run('Commercial Office Space', 'Modern office space designed for productivity', '$500,000', 'Silom, Bangkok', '/images/project3.jpg', 'commercial', 'available', 0);
    insertProject.run('Beachfront Resort', 'Luxury resort with stunning ocean views', '$2,500,000', 'Phuket, Thailand', '/images/project4.jpg', 'hospitality', 'available', 1);
  }

  // Seed admin user
  const adminCount = database.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'admin'").get() as { count: number };
  if (adminCount.count === 0) {
    const bcrypt = require('bcryptjs');
    const hashedPassword = bcrypt.hashSync('admin123', 10);
    database.prepare('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)').run('Admin', 'admin@nucha.com', hashedPassword, 'admin');
  }
}

export default getDb;
