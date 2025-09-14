const express = require('express');
const mysql = require('mysql2/promise');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads-roti-marawa')));

// Database connection
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'roti_marawa_db'
};

let connection;

async function initDatabase() {
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log('Connected to MySQL database');
    
    // Create tables if they don't exist
    await createTables();
  } catch (error) {
    console.error('Database connection failed:', error);
  }
}

async function createTables() {
  const createCategoriesTable = `
    CREATE TABLE IF NOT EXISTS categories (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `;

  const createProductsTable = `
    CREATE TABLE IF NOT EXISTS products (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      price DECIMAL(10, 2) NOT NULL,
      category_id INT,
      image_path VARCHAR(255),
      variants JSON,
      in_stock BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
    )
  `;

  const createSettingsTable = `
    CREATE TABLE IF NOT EXISTS settings (
      id INT AUTO_INCREMENT PRIMARY KEY,
      key_name VARCHAR(255) UNIQUE NOT NULL,
      value TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `;

  try {
    await connection.execute(createCategoriesTable);
    await connection.execute(createProductsTable);
    await connection.execute(createSettingsTable);
    console.log('Database tables created successfully');

    // Insert default settings
    await insertDefaultSettings();
  } catch (error) {
    console.error('Error creating tables:', error);
  }
}

async function insertDefaultSettings() {
  const defaultSettings = [
    ['company_name', 'Roti Marawa'],
    ['email', 'info@rotimarawa.com'],
    ['phone', '+62 123 456 789'],
    ['address', 'Jl. Roti Manis No. 123, Jakarta'],
    ['instagram', '@rotimarawa'],
    ['about_us', 'Roti Marawa adalah toko roti yang telah berdiri sejak 1985...'],
    ['operating_hours', '7.30 - 22.00 WITA']
  ];

  for (const [key, value] of defaultSettings) {
    try {
      await connection.execute(
        'INSERT IGNORE INTO settings (key_name, value) VALUES (?, ?)',
        [key, value]
      );
    } catch (error) {
      console.error('Error inserting default settings:', error);
    }
  }
}

// Multer configuration for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads-roti-marawa/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// ================ CATEGORIES ROUTES ================

// GET all categories
app.get('/api/categories', async (req, res) => {
  try {
    const [rows] = await connection.execute('SELECT * FROM categories ORDER BY name');
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET category by ID
app.get('/api/categories/:id', async (req, res) => {
  try {
    const [rows] = await connection.execute('SELECT * FROM categories WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST create category
app.post('/api/categories', async (req, res) => {
  const { name, description } = req.body;
  
  if (!name) {
    return res.status(400).json({ success: false, message: 'Category name is required' });
  }

  try {
    const [result] = await connection.execute(
      'INSERT INTO categories (name, description) VALUES (?, ?)',
      [name, description || '']
    );
    
    res.status(201).json({ 
      success: true, 
      message: 'Category created successfully',
      data: { id: result.insertId, name, description }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT update category
app.put('/api/categories/:id', async (req, res) => {
  const { name, description } = req.body;
  
  if (!name) {
    return res.status(400).json({ success: false, message: 'Category name is required' });
  }

  try {
    const [result] = await connection.execute(
      'UPDATE categories SET name = ?, description = ? WHERE id = ?',
      [name, description || '', req.params.id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    
    res.json({ success: true, message: 'Category updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE category
app.delete('/api/categories/:id', async (req, res) => {
  try {
    const [result] = await connection.execute('DELETE FROM categories WHERE id = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    
    res.json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ================ PRODUCTS ROUTES ================

// GET all products with pagination and filtering
app.get('/api/products', async (req, res) => {
  try {
    const { category, search, page = 1, limit = 12 } = req.query;
    let query = `
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id
    `;
    const params = [];
    const conditions = [];

    if (category) {
      conditions.push('c.name = ?');
      params.push(category);
    }

    if (search) {
      conditions.push('(p.name LIKE ? OR p.description LIKE ?)');
      params.push(`%${search}%`, `%${search}%`);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY p.created_at DESC';

    // Get total count for pagination
    let countQuery = `
      SELECT COUNT(*) as total 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id
    `;
    if (conditions.length > 0) {
      countQuery += ' WHERE ' + conditions.join(' AND ');
    }
    
    const [countResult] = await connection.execute(countQuery, params);
    const total = countResult[0].total;

    // Add pagination
    const offset = (page - 1) * limit;
    query += ` LIMIT ${limit} OFFSET ${offset}`;

    const [rows] = await connection.execute(query, params);
    
    // Parse variants JSON
    const products = rows.map(product => ({
      ...product,
      variants: product.variants ? JSON.parse(product.variants) : []
    }));

    // Calculate pagination info
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    res.json({ 
      success: true, 
      data: products,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems: total,
        itemsPerPage: parseInt(limit),
        hasNextPage,
        hasPrevPage
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET product by ID
app.get('/api/products/:id', async (req, res) => {
  try {
    const [rows] = await connection.execute(
      'SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.id = ?',
      [req.params.id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const product = {
      ...rows[0],
      variants: rows[0].variants ? JSON.parse(rows[0].variants) : []
    };

    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST create product with image upload
app.post('/api/products', upload.single('image'), async (req, res) => {
  const { name, description, price, category_id, variants, in_stock } = req.body;
  
  if (!name || !price) {
    return res.status(400).json({ success: false, message: 'Product name and price are required' });
  }

  const imagePath = req.file ? req.file.filename : null;
  const variantsJson = variants ? JSON.stringify(JSON.parse(variants)) : JSON.stringify([]);

  try {
    const [result] = await connection.execute(
      'INSERT INTO products (name, description, price, category_id, image_path, variants, in_stock) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, description || '', parseFloat(price), category_id || null, imagePath, variantsJson, in_stock !== 'false']
    );
    
    res.status(201).json({ 
      success: true, 
      message: 'Product created successfully',
      data: { id: result.insertId }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT update product
app.put('/api/products/:id', upload.single('image'), async (req, res) => {
  const { name, description, price, category_id, variants, in_stock } = req.body;
  
  if (!name || !price) {
    return res.status(400).json({ success: false, message: 'Product name and price are required' });
  }

  try {
    // Get current product to handle image replacement
    const [currentProduct] = await connection.execute('SELECT * FROM products WHERE id = ?', [req.params.id]);
    if (currentProduct.length === 0) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    let imagePath = currentProduct[0].image_path;
    
    // If new image is uploaded, delete old image and use new one
    if (req.file) {
      if (imagePath && fs.existsSync(path.join(__dirname, 'uploads-roti-marawa', imagePath))) {
        fs.unlinkSync(path.join(__dirname, 'uploads-roti-marawa', imagePath));
      }
      imagePath = req.file.filename;
    }

    const variantsJson = variants ? JSON.stringify(JSON.parse(variants)) : JSON.stringify([]);

    const [result] = await connection.execute(
      'UPDATE products SET name = ?, description = ?, price = ?, category_id = ?, image_path = ?, variants = ?, in_stock = ? WHERE id = ?',
      [name, description || '', parseFloat(price), category_id || null, imagePath, variantsJson, in_stock !== 'false', req.params.id]
    );
    
    res.json({ success: true, message: 'Product updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE product
app.delete('/api/products/:id', async (req, res) => {
  try {
    // Get product to delete image file
    const [product] = await connection.execute('SELECT image_path FROM products WHERE id = ?', [req.params.id]);
    
    const [result] = await connection.execute('DELETE FROM products WHERE id = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Delete image file if exists
    if (product[0]?.image_path) {
      const imagePath = path.join(__dirname, 'uploads-roti-marawa', product[0].image_path);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ================ SETTINGS ROUTES ================

// GET all settings
app.get('/api/settings', async (req, res) => {
  try {
    const [rows] = await connection.execute('SELECT * FROM settings');
    const settings = {};
    rows.forEach(row => {
      settings[row.key_name] = row.value;
    });
    res.json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT update settings
app.put('/api/settings', async (req, res) => {
  const settings = req.body;

  try {
    for (const [key, value] of Object.entries(settings)) {
      await connection.execute(
        'INSERT INTO settings (key_name, value) VALUES (?, ?) ON DUPLICATE KEY UPDATE value = ?',
        [key, value, value]
      );
    }
    
    res.json({ success: true, message: 'Settings updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ================ DASHBOARD ROUTES ================

// GET dashboard statistics
app.get('/api/dashboard/stats', async (req, res) => {
  try {
    // Get total products count
    const [productsResult] = await connection.execute('SELECT COUNT(*) as total FROM products');
    const totalProducts = productsResult[0].total;

    // Get total categories count
    const [categoriesResult] = await connection.execute('SELECT COUNT(*) as total FROM categories');
    const totalCategories = categoriesResult[0].total;

    // Get products in stock count
    const [inStockResult] = await connection.execute('SELECT COUNT(*) as total FROM products WHERE in_stock = true');
    const inStockProducts = inStockResult[0].total;

    // Get out of stock products count
    const [outOfStockResult] = await connection.execute('SELECT COUNT(*) as total FROM products WHERE in_stock = false');
    const outOfStockProducts = outOfStockResult[0].total;

    // Get total value of all products (sum of all prices)
    const [totalValueResult] = await connection.execute('SELECT SUM(price) as total FROM products WHERE in_stock = true');
    const totalValue = totalValueResult[0].total || 0;

    // Get average product price
    const [avgPriceResult] = await connection.execute('SELECT AVG(price) as average FROM products WHERE in_stock = true');
    const averagePrice = avgPriceResult[0].average || 0;

    // Get products by category
    const [categoryStats] = await connection.execute(`
      SELECT c.name as category_name, COUNT(p.id) as product_count 
      FROM categories c 
      LEFT JOIN products p ON c.id = p.category_id 
      GROUP BY c.id, c.name 
      ORDER BY product_count DESC
    `);

    res.json({ 
      success: true, 
      data: {
        totalProducts,
        totalCategories,
        inStockProducts,
        outOfStockProducts,
        totalValue: parseFloat(totalValue),
        averagePrice: parseFloat(averagePrice),
        categoryStats
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ================ GENERAL ROUTES ================

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is running', timestamp: new Date().toISOString() });
});

// Handle 404
app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ success: false, message: error.message });
});

// Start server
app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  await initDatabase();
});