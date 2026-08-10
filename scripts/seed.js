const mysql = require('mysql2/promise');
const crypto = require('crypto');

async function main() {
  const connectionString = process.env.DATABASE_URL || 'mysql://shopora:shopora_password@127.0.0.1:3306/shopora';
  console.log('Seeding database with URL:', connectionString.replace(/:[^:@/]+@/, ':***@'));
  let connection;
  let retries = 10;
  while (retries > 0) {
    try {
      connection = await mysql.createConnection(connectionString);
      break;
    } catch (err) {
      console.log(`Database connection failed. Retrying in 3 seconds... (${retries} attempts left)`);
      retries -= 1;
      if (retries === 0) throw err;
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
  }

  try {
    console.log('Clearing existing data...');
    await connection.execute('SET FOREIGN_KEY_CHECKS = 0');
    
    const tables = [
      'activity_logs', 'coupon_usages', 'coupons', 'payment_transactions', 'payments', 
      'order_status_logs', 'order_items', 'orders', 'addresses', 'wishlists', 
      'cart_items', 'carts', 'stock_logs', 'inventories', 'warehouses', 
      'variant_attribute_values', 'product_variants', 'attribute_values', 'product_attributes', 
      'product_tags', 'product_images', 'product_categories', 'products', 
      'brands', 'categories', 'sessions', 'oauth_accounts', 'users', 
      'role_permissions', 'permissions', 'roles', 'banners', 'pages', 'faqs', 'notifications', 'settings',
      'blog_posts', 'landing_pages', 'campaigns'
    ];
    
    for (const table of tables) {
      await connection.execute(`TRUNCATE TABLE \`${table}\``);
    }
    
    console.log('All tables cleared.');

    // 1. Seed Roles
    console.log('Seeding roles...');
    const adminRoleId = crypto.randomUUID();
    const customerRoleId = crypto.randomUUID();
    const managerRoleId = crypto.randomUUID();

    await connection.execute(`
      INSERT INTO roles (id, name, description) VALUES 
      (?, 'Admin', 'Full administrator privileges'),
      (?, 'Customer', 'Default role for storefront customers'),
      (?, 'Manager', 'Staff role with inventory and catalog permissions')
    `, [adminRoleId, customerRoleId, managerRoleId]);

    // 2. Seed Permissions
    console.log('Seeding permissions...');
    const permissionsList = [
      { id: crypto.randomUUID(), name: 'manage_catalog', desc: 'Create, update, delete products, brands, and categories' },
      { id: crypto.randomUUID(), name: 'manage_orders', desc: 'View, process, and update order statuses' },
      { id: crypto.randomUUID(), name: 'manage_inventory', desc: 'Log stocks, adjust warehouse parameters' },
      { id: crypto.randomUUID(), name: 'manage_coupons', desc: 'Create and edit promotional codes' },
      { id: crypto.randomUUID(), name: 'manage_users', desc: 'View and manage customer / staff profiles' },
      { id: crypto.randomUUID(), name: 'view_analytics', desc: 'Access admin dashboard reports and statistics' }
    ];

    for (const perm of permissionsList) {
      await connection.execute(
        'INSERT INTO permissions (id, name, description) VALUES (?, ?, ?)',
        [perm.id, perm.name, perm.desc]
      );
    }

    // Role Permissions mapping
    console.log('Mapping role permissions...');
    for (const perm of permissionsList) {
      await connection.execute(
        'INSERT INTO role_permissions (role_id, permission_id) VALUES (?, ?)',
        [adminRoleId, perm.id]
      );
    }
    const managerPerms = ['manage_catalog', 'manage_orders', 'manage_inventory', 'manage_coupons', 'view_analytics'];
    for (const perm of permissionsList) {
      if (managerPerms.includes(perm.name)) {
        await connection.execute(
          'INSERT INTO role_permissions (role_id, permission_id) VALUES (?, ?)',
          [managerRoleId, perm.id]
        );
      }
    }

    // 3. Seed Users (using pbkdf2 hashed password for admin123 and customer123)
    console.log('Seeding users...');
    const adminUserId = crypto.randomUUID();
    const customerUserId = crypto.randomUUID();
    
    const adminPasswordHash = 'c244964cdbae7bab4f5965a6d8650125196aa2f4c810cd5b70f7c7ac0ff77d805ceb354623dd99f5736d026511efff15b63cbd806dc8eff44d17135a484cf503'; // admin123
    const customerPasswordHash = 'cd70ebc525aba9cef9d15cd255375f9b6d7facd7a2a0eca1f7d87e2c71de9203e9a55e6907876d0785dd81bb82e6e59d56a79f5f73bff01e3b21fdf4d581f27d'; // customer123

    await connection.execute(`
      INSERT INTO users (id, name, email, password_hash, role_id, avatar_url, reward_points) VALUES 
      (?, 'Shopora Administrator', 'admin@shopora.com', ?, ?, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256', 500),
      (?, 'Jane Doe Storefront', 'customer@shopora.com', ?, ?, 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=256', 120)
    `, [adminUserId, adminPasswordHash, adminRoleId, customerUserId, customerPasswordHash, customerRoleId]);

    // 4. Seed Addresses for Customer
    console.log('Seeding customer addresses...');
    const addressId = crypto.randomUUID();
    await connection.execute(`
      INSERT INTO addresses (id, user_id, title, address_line1, address_line2, city, state, postal_code, country, is_default) VALUES 
      (?, ?, 'Home Address', '123 E-commerce Boulevard', 'Suite 400', 'San Francisco', 'California', '94107', 'United States', 1)
    `, [addressId, customerUserId]);

    // 5. Seed Warehouses
    console.log('Seeding warehouse...');
    const warehouseId = crypto.randomUUID();
    await connection.execute(`
      INSERT INTO warehouses (id, name, location) VALUES 
      (?, 'San Francisco Main Depot', 'Pier 39, San Francisco, CA')
    `, [warehouseId]);

    // 6. Super Shop Categories & Subcategories
    console.log('Seeding categories...');
    const categoryTemplates = [
      {
        name: 'Fruits & Vegetables',
        slug: 'fruits-vegetables',
        bannerUrl: 'https://images.unsplash.com/photo-1610348725531-843dff163e2c?q=80&w=1200',
        iconUrl: 'https://images.unsplash.com/photo-1610348725531-843dff163e2c?q=80&w=256',
        subcategories: ['Fruits', 'Vegetables']
      },
      {
        name: 'Dairy & Eggs',
        slug: 'dairy-eggs',
        bannerUrl: 'https://images.unsplash.com/photo-1528750901443-e9c17d12afae?q=80&w=1200',
        iconUrl: 'https://images.unsplash.com/photo-1528750901443-e9c17d12afae?q=80&w=256',
        subcategories: ['Milk', 'Cheese', 'Eggs']
      },
      {
        name: 'Bakery & Bread',
        slug: 'bakery-bread',
        bannerUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1200',
        iconUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=256',
        subcategories: ['Bread', 'Pastries']
      },
      {
        name: 'Meat & Seafood',
        slug: 'meat-seafood',
        bannerUrl: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?q=80&w=1200',
        iconUrl: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?q=80&w=256',
        subcategories: ['Poultry', 'Beef & Pork', 'Seafood']
      },
      {
        name: 'Beverages',
        slug: 'beverages',
        bannerUrl: 'https://images.unsplash.com/photo-1527960656-26902793b858?q=80&w=1200',
        iconUrl: 'https://images.unsplash.com/photo-1527960656-26902793b858?q=80&w=256',
        subcategories: ['Soda & Soft Drinks', 'Juices', 'Tea & Coffee']
      },
      {
        name: 'Snacks & Sweets',
        slug: 'snacks-sweets',
        bannerUrl: 'https://images.unsplash.com/photo-1599490659213-e2b9527b0876?q=80&w=1200',
        iconUrl: 'https://images.unsplash.com/photo-1599490659213-e2b9527b0876?q=80&w=256',
        subcategories: ['Chips', 'Chocolates & Candy', 'Nuts & Seeds']
      },
      {
        name: 'Pantry & Groceries',
        slug: 'pantry-groceries',
        bannerUrl: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?q=80&w=1200',
        iconUrl: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?q=80&w=256',
        subcategories: ['Cooking Oils', 'Pasta & Rice', 'Sauces & Spices']
      },
      {
        name: 'Frozen Foods',
        slug: 'frozen-foods',
        bannerUrl: 'https://images.unsplash.com/photo-1547050605-2f8854215563?q=80&w=1200',
        iconUrl: 'https://images.unsplash.com/photo-1547050605-2f8854215563?q=80&w=256',
        subcategories: ['Frozen Meals', 'Ice Creams']
      },
      {
        name: 'Personal Care',
        slug: 'personal-care',
        bannerUrl: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=1200',
        iconUrl: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=256',
        subcategories: ['Hair Care', 'Dental Care', 'Soaps']
      },
      {
        name: 'Household & Cleaning',
        slug: 'household-cleaning',
        bannerUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=1200',
        iconUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=256',
        subcategories: ['Laundry', 'Paper Products', 'Cleaners']
      }
    ];

    const categoryMap = {}; // Maps subcat name or parent slug to ID

    for (const cat of categoryTemplates) {
      const parentId = crypto.randomUUID();
      await connection.execute(`
        INSERT INTO categories (id, parent_id, name, slug, banner_url, icon_url, featured, visible) VALUES 
        (?, NULL, ?, ?, ?, ?, 1, 1)
      `, [parentId, cat.name, cat.slug, cat.bannerUrl, cat.iconUrl]);
      categoryMap[cat.slug] = parentId;

      for (const sub of cat.subcategories) {
        const subId = crypto.randomUUID();
        const subSlug = sub.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        await connection.execute(`
          INSERT INTO categories (id, parent_id, name, slug, banner_url, icon_url, featured, visible) VALUES 
          (?, ?, ?, ?, ?, ?, 0, 1)
        `, [subId, parentId, sub, subSlug, cat.bannerUrl, cat.iconUrl]);
        categoryMap[sub] = subId;
      }
    }

    // 7. Super Shop Brands
    console.log('Seeding brands...');
    const brandTemplates = [
      { name: 'Organic Valley', slug: 'organic-valley' },
      { name: 'Dole', slug: 'dole' },
      { name: 'Land O Lakes', slug: 'land-o-lakes' },
      { name: 'Sara Lee', slug: 'sara-lee' },
      { name: 'Tyson Foods', slug: 'tyson-foods' },
      { name: 'Coca-Cola', slug: 'coca-cola' },
      { name: 'Lay\'s', slug: 'lays' },
      { name: 'Heinz', slug: 'heinz' },
      { name: 'Ben & Jerry\'s', slug: 'ben-jerrys' },
      { name: 'Dove', slug: 'dove' },
      { name: 'Tide', slug: 'tide' },
      { name: 'Colgate', slug: 'colgate' },
      { name: 'PepsiCo', slug: 'pepsico' }
    ];

    const brandMap = {};
    for (const b of brandTemplates) {
      const id = crypto.randomUUID();
      await connection.execute(`
        INSERT INTO brands (id, name, slug, featured, status) VALUES 
        (?, ?, ?, 1, 'ACTIVE')
      `, [id, b.name, b.slug]);
      brandMap[b.slug] = id;
    }

    // 8. Seeding 200+ Products Programmatically
    console.log('Generating 200+ product seeds...');
    const productsTemplates = [
      // Fruits & Vegetables (24 products)
      { name: 'Organic Bananas', category: 'Fruits', brand: 'dole', price: 1.99, salePrice: 1.49, image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?q=80&w=300', desc: 'Fresh organic bananas, rich in potassium and sweet in flavor.' },
      { name: 'Honeycrisp Apples', category: 'Fruits', brand: 'dole', price: 2.99, salePrice: 2.49, image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?q=80&w=300', desc: 'Sweet, crisp, and extremely juicy red apples.' },
      { name: 'Organic Strawberries', category: 'Fruits', brand: 'organic-valley', price: 4.99, salePrice: 3.99, image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?q=80&w=300', desc: 'Fresh, sweet, and locally harvested organic strawberries.' },
      { name: 'Hass Avocados', category: 'Fruits', brand: 'dole', price: 3.49, salePrice: 2.99, image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?q=80&w=300', desc: 'Creamy Hass avocados, perfect for salads and guacamole.' },
      { name: 'Seedless Red Grapes', category: 'Fruits', brand: 'dole', price: 3.99, salePrice: null, image: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?q=80&w=300', desc: 'Fresh, plump, and sweet seedless red grapes.' },
      { name: 'Fresh Blueberries', category: 'Fruits', brand: 'organic-valley', price: 3.49, salePrice: 2.99, image: 'https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?q=80&w=300', desc: 'Antioxidant-rich fresh blueberries, sweet and tart.' },
      { name: 'Organic Lemons', category: 'Fruits', brand: 'dole', price: 2.49, salePrice: 1.99, image: 'https://images.unsplash.com/photo-1590502593747-42a996133562?q=80&w=300', desc: 'Zesty and sour organic lemons, perfect for culinary use.' },
      { name: 'Sweet Clementines', category: 'Fruits', brand: 'dole', price: 4.99, salePrice: 4.29, image: 'https://images.unsplash.com/photo-1618228473775-680fa246067b?q=80&w=300', desc: 'Easy-to-peel clementines, sweet and seedless.' },
      { name: 'Fresh Raspberries', category: 'Fruits', brand: 'organic-valley', price: 3.99, salePrice: null, image: 'https://images.unsplash.com/photo-1577069861033-55d04cec4ef5?q=80&w=300', desc: 'Fragile and sweet fresh raspberries.' },
      { name: 'Anjou Pears', category: 'Fruits', brand: 'dole', price: 2.79, salePrice: 2.29, image: 'https://images.unsplash.com/photo-1514756331096-242fdeb70d4a?q=80&w=300', desc: 'Sweet and juicy Anjou pears.' },
      { name: 'Fresh Pineapples', category: 'Fruits', brand: 'dole', price: 3.99, salePrice: 3.49, image: 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?q=80&w=300', desc: 'Tropical golden pineapples, juicy and sweet.' },
      { name: 'Fresh Cantaloupe', category: 'Fruits', brand: 'dole', price: 4.49, salePrice: null, image: 'https://images.unsplash.com/photo-1571244856002-4b20a32506e7?q=80&w=300', desc: 'Sweet orange-fleshed cantaloupe melon.' },
      { name: 'Fresh Broccoli Crown', category: 'Vegetables', brand: 'dole', price: 1.89, salePrice: 1.49, image: 'https://images.unsplash.com/photo-1584270354949-c26b0d5b4a0c?q=80&w=300', desc: 'Crisp green broccoli crowns, packed with vitamins.' },
      { name: 'Organic Baby Spinach', category: 'Vegetables', brand: 'organic-valley', price: 3.29, salePrice: 2.79, image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?q=80&w=300', desc: 'Pre-washed baby spinach leaves, ideal for salads.' },
      { name: 'Roma Tomatoes', category: 'Vegetables', brand: 'dole', price: 2.19, salePrice: 1.89, image: 'https://images.unsplash.com/photo-1595855759920-86582396756a?q=80&w=300', desc: 'Fleshy Roma tomatoes, excellent for making sauces.' },
      { name: 'Sweet Orange Carrots', category: 'Vegetables', brand: 'dole', price: 1.49, salePrice: null, image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?q=80&w=300', desc: 'Crisp, sweet, and healthy orange carrots.' },
      { name: 'Russet Potatoes 5lb', category: 'Vegetables', brand: 'dole', price: 4.99, salePrice: 3.99, image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?q=80&w=300', desc: 'Starchy Russet baking potatoes, bag of 5 pounds.' },
      { name: 'Red Onions 3lb Bag', category: 'Vegetables', brand: 'dole', price: 3.29, salePrice: 2.99, image: 'https://images.unsplash.com/photo-1618519764620-7403abdbfee9?q=80&w=300', desc: 'Pungent red cooking onions, bag of 3 pounds.' },
      { name: 'Garlic Bulbs 3-pack', category: 'Vegetables', brand: 'dole', price: 1.99, salePrice: null, image: 'https://images.unsplash.com/photo-1589625345719-75a7c50a4176?q=80&w=300', desc: 'Flavorful fresh garlic bulbs, package of three.' },
      { name: 'English Cucumber', category: 'Vegetables', brand: 'dole', price: 1.79, salePrice: 1.49, image: 'https://images.unsplash.com/photo-1604974244018-0130099f4523?q=80&w=300', desc: 'Seedless, crisp English cucumber.' },
      { name: 'Red Bell Peppers', category: 'Vegetables', brand: 'dole', price: 2.99, salePrice: 2.49, image: 'https://images.unsplash.com/photo-1563565088-913583b1c0b2?q=80&w=300', desc: 'Sweet, crisp red bell peppers.' },
      { name: 'Fresh Asparagus Bunch', category: 'Vegetables', brand: 'dole', price: 3.99, salePrice: 3.49, image: 'https://images.unsplash.com/photo-1515471209610-dae1c92d8777?q=80&w=300', desc: 'Fresh green asparagus spears, tender and crisp.' },
      { name: 'Baby Bella Mushrooms', category: 'Vegetables', brand: 'organic-valley', price: 2.89, salePrice: null, image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?q=80&w=300', desc: 'Earthy baby bella cremini mushrooms.' },
      { name: 'Sweet Yellow Corn 4ct', category: 'Vegetables', brand: 'dole', price: 3.49, salePrice: 2.99, image: 'https://images.unsplash.com/photo-1551754626-78724a734db3?q=80&w=300', desc: 'Sweet yellow corn on the cob, pack of four.' },

      // Dairy & Eggs (22 products)
      { name: 'Whole Milk 1 Gallon', category: 'Milk', brand: 'organic-valley', price: 4.49, salePrice: 3.99, image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?q=80&w=300', desc: 'Fresh vitamin D whole milk, one gallon.' },
      { name: 'Skim Milk 1 Gallon', category: 'Milk', brand: 'organic-valley', price: 4.29, salePrice: null, image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?q=80&w=300', desc: 'Fat-free skim milk, one gallon.' },
      { name: 'Organic Almond Milk', category: 'Milk', brand: 'organic-valley', price: 3.49, salePrice: 2.99, image: 'https://images.unsplash.com/photo-1553456558-aff63285bdd1?q=80&w=300', desc: 'Unsweetened organic vanilla almond milk.' },
      { name: 'Creamy Oat Milk', category: 'Milk', brand: 'organic-valley', price: 3.99, salePrice: 3.49, image: 'https://images.unsplash.com/photo-1600788886242-5c96aabe3757?q=80&w=300', desc: 'Rich and creamy original oat milk.' },
      { name: 'Cheddar Cheese Slices', category: 'Cheese', brand: 'land-o-lakes', price: 3.29, salePrice: 2.79, image: 'https://images.unsplash.com/photo-1618164435735-413d3b066c9a?q=80&w=300', desc: 'Sharp cheddar cheese slices, 8oz pack.' },
      { name: 'Shredded Mozzarella Cheese', category: 'Cheese', brand: 'land-o-lakes', price: 3.49, salePrice: null, image: 'https://images.unsplash.com/photo-1552763484-5d60dd6c17e3?q=80&w=300', desc: 'Low-moisture shredded mozzarella, perfect for pizza.' },
      { name: 'Grated Parmesan Cheese', category: 'Cheese', brand: 'land-o-lakes', price: 4.29, salePrice: 3.79, image: 'https://images.unsplash.com/photo-1608686207856-001b95cf60ca?q=80&w=300', desc: 'Grated parmesan cheese, 8oz tub.' },
      { name: 'Creamy Greek Yogurt 32oz', category: 'Cheese', brand: 'organic-valley', price: 4.99, salePrice: 4.49, image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=300', desc: 'Plain unsweetened Greek yogurt, tub of 32oz.' },
      { name: 'Salted Butter 4-sticks', category: 'Butter & Cream', brand: 'land-o-lakes', price: 4.89, salePrice: 4.19, image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?q=80&w=300', desc: 'Creamy salted sweet cream butter, pack of four sticks.' },
      { name: 'Unsalted Butter 4-sticks', category: 'Butter & Cream', brand: 'land-o-lakes', price: 4.89, salePrice: null, image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?q=80&w=300', desc: 'Creamy unsalted baking butter, pack of four sticks.' },
      { name: 'Heavy Whipping Cream', category: 'Butter & Cream', brand: 'organic-valley', price: 2.99, salePrice: 2.49, image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?q=80&w=300', desc: 'Ultra-pasteurized heavy whipping cream, pint.' },
      { name: 'Organic Large Brown Eggs 12ct', category: 'Eggs', brand: 'organic-valley', price: 5.49, salePrice: 4.99, image: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?q=80&w=300', desc: 'Free-range organic large brown eggs, one dozen.' },
      { name: 'Large White Eggs 12ct', category: 'Eggs', brand: 'land-o-lakes', price: 3.29, salePrice: 2.99, image: 'https://images.unsplash.com/photo-1516448424440-9dbca97779c1?q=80&w=300', desc: 'Grade A large white chicken eggs, one dozen.' },
      { name: 'Sour Cream 16oz', category: 'Butter & Cream', brand: 'organic-valley', price: 2.49, salePrice: null, image: 'https://images.unsplash.com/photo-1571260899304-425edd4c2222?q=80&w=300', desc: 'Creamy original sour cream, 16oz tub.' },
      { name: 'Original Cream Cheese 8oz', category: 'Cheese', brand: 'land-o-lakes', price: 2.79, salePrice: 2.29, image: 'https://images.unsplash.com/photo-1505576391880-b3f9d713ff4f?q=80&w=300', desc: 'Soft and spreadable cream cheese block.' },
      { name: 'Swiss Cheese Slices', category: 'Cheese', brand: 'land-o-lakes', price: 3.79, salePrice: null, image: 'https://images.unsplash.com/photo-1528256846576-0f1ce8965f3c?q=80&w=300', desc: 'Swiss cheese slices with classic nut-like flavor.' },
      { name: 'Provolone Cheese Slices', category: 'Cheese', brand: 'land-o-lakes', price: 3.79, salePrice: 3.29, image: 'https://images.unsplash.com/photo-1486299267070-83823f5448dd?q=80&w=300', desc: 'Provolone cheese slices, 8oz pack.' },
      { name: 'Strawberry Yogurt 4-pack', category: 'Cheese', brand: 'organic-valley', price: 2.99, salePrice: 2.49, image: 'https://images.unsplash.com/photo-1571260899304-425edd4c2222?q=80&w=300', desc: 'Strawberry blended lowfat yogurt, pack of four.' },
      { name: 'Cottage Cheese 16oz', category: 'Cheese', brand: 'land-o-lakes', price: 3.19, salePrice: null, image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=300', desc: 'Small curd cottage cheese, 4% milkfat.' },
      { name: 'Organic Half & Half Creamer', category: 'Butter & Cream', brand: 'organic-valley', price: 2.99, salePrice: 2.49, image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?q=80&w=300', desc: 'Organic half milk and half cream, pint.' },
      { name: 'Whipped Cream Canister', category: 'Butter & Cream', brand: 'land-o-lakes', price: 2.89, salePrice: null, image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?q=80&w=300', desc: 'Whipped heavy cream in an aerosol spray canister.' },
      { name: 'Crumbled Feta Cheese', category: 'Cheese', brand: 'land-o-lakes', price: 3.99, salePrice: 3.49, image: 'https://images.unsplash.com/photo-1618164435735-413d3b066c9a?q=80&w=300', desc: 'Tangy crumbled feta cheese tub, 6oz.' },

      // Bakery & Bread (20 products)
      { name: 'Sourdough Bread Loaf', category: 'Bread', brand: 'sara-lee', price: 3.99, salePrice: 3.49, image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=300', desc: 'Artisanal sourdough bread loaf, sliced.' },
      { name: 'Whole Wheat Bread', category: 'Bread', brand: 'sara-lee', price: 3.29, salePrice: null, image: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?q=80&w=300', desc: '100% whole wheat honey bread loaf, sliced.' },
      { name: 'White Sandwich Bread', category: 'Bread', brand: 'sara-lee', price: 2.79, salePrice: 2.29, image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=300', desc: 'Classic soft white bread, ideal for sandwiches.' },
      { name: 'Butter Croissants 4ct', category: 'Pastries', brand: 'sara-lee', price: 4.49, salePrice: 3.99, image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=300', desc: 'Flaky and buttery French croissants, pack of four.' },
      { name: 'Plain Bagels 6ct', category: 'Bread', brand: 'sara-lee', price: 3.69, salePrice: null, image: 'https://images.unsplash.com/photo-1585478259715-876acc5be8eb?q=80&w=300', desc: 'Chewy, pre-sliced plain bagels, pack of six.' },
      { name: 'Hamburger Buns 8ct', category: 'Bread', brand: 'sara-lee', price: 2.49, salePrice: 1.99, image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=300', desc: 'Soft white hamburger buns, pack of eight.' },
      { name: 'Blueberry Muffins 4ct', category: 'Pastries', brand: 'sara-lee', price: 4.29, salePrice: 3.79, image: 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?q=80&w=300', desc: 'Large moist muffins baked with real blueberries.' },
      { name: 'Chocolate Chip Cookies 12ct', category: 'Pastries', brand: 'sara-lee', price: 4.99, salePrice: null, image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?q=80&w=300', desc: 'Chewy fresh-baked chocolate chip cookies.' },
      { name: 'Stone Baked Pita Bread', category: 'Bread', brand: 'sara-lee', price: 2.99, salePrice: 2.49, image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=300', desc: 'Pockets of pita bread, great for stuffing.' },
      { name: 'Flour Tortillas 10ct', category: 'Bread', brand: 'sara-lee', price: 2.89, salePrice: null, image: 'https://images.unsplash.com/photo-1568254183919-78a4f43a2877?q=80&w=300', desc: 'Soft taco-size flour tortillas, package of ten.' },
      { name: 'English Muffins 6ct', category: 'Bread', brand: 'sara-lee', price: 3.19, salePrice: 2.69, image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=300', desc: 'Fork-split English muffins, pack of six.' },
      { name: 'Hot Dog Buns 8ct', category: 'Bread', brand: 'sara-lee', price: 2.49, salePrice: 1.99, image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=300', desc: 'Classic split hot dog buns, pack of eight.' },
      { name: 'Glazed Donuts 6ct', category: 'Pastries', brand: 'sara-lee', price: 4.49, salePrice: null, image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=300', desc: 'Yeast raised donuts with sugar glaze.' },
      { name: 'Cinnamon Rolls 4ct', category: 'Pastries', brand: 'sara-lee', price: 4.99, salePrice: 4.19, image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=300', desc: 'Sweet cinnamon rolls topped with cream cheese icing.' },
      { name: 'French Baguette', category: 'Bread', brand: 'sara-lee', price: 1.99, salePrice: null, image: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?q=80&w=300', desc: 'Crispy crust French baguette.' },
      { name: 'Sliced Brioche Bread', category: 'Bread', brand: 'sara-lee', price: 4.49, salePrice: 3.99, image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=300', desc: 'Rich and buttery brioche loaf, sliced.' },
      { name: 'Blueberry Bagels 6ct', category: 'Bread', brand: 'sara-lee', price: 3.79, salePrice: null, image: 'https://images.unsplash.com/photo-1585478259715-876acc5be8eb?q=80&w=300', desc: 'Blueberry-infused sliced bagels, pack of six.' },
      { name: 'Chocolate Muffins 4ct', category: 'Pastries', brand: 'sara-lee', price: 4.29, salePrice: 3.79, image: 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?q=80&w=300', desc: 'Double chocolate muffins with chocolate chips.' },
      { name: 'Apple Pie 8-inch', category: 'Pastries', brand: 'sara-lee', price: 6.99, salePrice: 5.99, image: 'https://images.unsplash.com/photo-1519869325930-281384150729?q=80&w=300', desc: 'Classic double-crust sweet apple pie.' },
      { name: 'Dinner Yeast Rolls 12ct', category: 'Bread', brand: 'sara-lee', price: 3.49, salePrice: null, image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=300', desc: 'Soft yeast dinner rolls, package of twelve.' },

      // Meat & Seafood (20 products)
      { name: 'Boneless Chicken Breast', category: 'Poultry', brand: 'tyson-foods', price: 9.99, salePrice: 8.49, image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?q=80&w=300', desc: 'Fresh boneless skinless chicken breasts, approx 2lb.' },
      { name: 'Chicken Wings 3lb Bag', category: 'Poultry', brand: 'tyson-foods', price: 12.99, salePrice: null, image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?q=80&w=300', desc: 'Fresh chicken wings, great for baking or frying.' },
      { name: 'Chicken Drumsticks', category: 'Poultry', brand: 'tyson-foods', price: 5.99, salePrice: 4.99, image: 'https://images.unsplash.com/photo-1598112972224-83e200778688?q=80&w=300', desc: 'Chicken drumsticks, bone-in skin-on pack.' },
      { name: 'Ground Beef 85% Lean 1lb', category: 'Beef & Pork', brand: 'tyson-foods', price: 6.99, salePrice: 5.99, image: 'https://images.unsplash.com/photo-1588168333986-5078644a8863?q=80&w=300', desc: 'Fresh ground beef, 85% lean 15% fat, 1 pound.' },
      { name: 'Ribeye Steak Choice Grade', category: 'Beef & Pork', brand: 'tyson-foods', price: 16.99, salePrice: 14.99, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=300', desc: 'USDA Choice beef ribeye steak, thick cut.' },
      { name: 'Boneless Pork Chops', category: 'Beef & Pork', brand: 'tyson-foods', price: 7.99, salePrice: null, image: 'https://images.unsplash.com/photo-1602491453631-e2a5ad90a131?q=80&w=300', desc: 'Boneless loin pork chops, center-cut package.' },
      { name: 'Hickory Smoked Bacon', category: 'Beef & Pork', brand: 'tyson-foods', price: 5.99, salePrice: 4.99, image: 'https://images.unsplash.com/photo-1608039755401-742074f0548d?q=80&w=300', desc: 'Thick cut hickory smoked pork bacon, 16oz.' },
      { name: 'Fresh Atlantic Salmon Fillet', category: 'Seafood', brand: 'tyson-foods', price: 14.99, salePrice: 12.99, image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=300', desc: 'Farmed Atlantic salmon fillets, skin-on.' },
      { name: 'Raw White Shrimp 1lb Bag', category: 'Seafood', brand: 'tyson-foods', price: 10.99, salePrice: null, image: 'https://images.unsplash.com/photo-1559737558-2f5a35f4523b?q=80&w=300', desc: 'Peeled and deveined raw white shrimp, tail-on.' },
      { name: 'Fresh Sea Bass Fillet', category: 'Seafood', brand: 'tyson-foods', price: 18.99, salePrice: 16.49, image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=300', desc: 'Wild caught fresh white sea bass fillet.' },
      { name: 'Sliced Turkey Breast 16oz', category: 'Poultry', brand: 'tyson-foods', price: 6.49, salePrice: 5.49, image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?q=80&w=300', desc: 'Oven roasted deli sliced turkey breast.' },
      { name: 'T-Bone Steak Choice Grade', category: 'Beef & Pork', brand: 'tyson-foods', price: 19.99, salePrice: 17.99, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=300', desc: 'USDA Choice thick cut T-Bone steak.' },
      { name: 'Pork Loin Roast 3lb', category: 'Beef & Pork', brand: 'tyson-foods', price: 11.99, salePrice: null, image: 'https://images.unsplash.com/photo-1602491453631-e2a5ad90a131?q=80&w=300', desc: 'Tender pork loin roast, center cut.' },
      { name: 'Fresh Cod Fillet', category: 'Seafood', brand: 'tyson-foods', price: 11.99, salePrice: 9.99, image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=300', desc: 'Wild caught flaky cod fish fillets.' },
      { name: 'Chicken Thighs Boneless 2lb', category: 'Poultry', brand: 'tyson-foods', price: 7.99, salePrice: 6.99, image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?q=80&w=300', desc: 'Fresh boneless skinless chicken thighs.' },
      { name: 'Sweet Italian Sausage', category: 'Beef & Pork', brand: 'tyson-foods', price: 4.99, salePrice: null, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=300', desc: 'Sweet Italian pork sausage links, 16oz.' },
      { name: 'Beef Stew Meat 1lb', category: 'Beef & Pork', brand: 'tyson-foods', price: 7.49, salePrice: 6.49, image: 'https://images.unsplash.com/photo-1588168333986-5078644a8863?q=80&w=300', desc: 'USDA Choice beef cubes, perfect for slow cooking.' },
      { name: 'Whole Chicken 5lb', category: 'Poultry', brand: 'tyson-foods', price: 8.99, salePrice: null, image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?q=80&w=300', desc: 'Fresh whole young chicken, approx 5 pounds.' },
      { name: 'Fresh Sea Scallops 10oz', category: 'Seafood', brand: 'tyson-foods', price: 15.99, salePrice: 13.99, image: 'https://images.unsplash.com/photo-1559737558-2f5a35f4523b?q=80&w=300', desc: 'Wild caught sweet giant sea scallops.' },
      { name: 'Ground Turkey 93% Lean 1lb', category: 'Poultry', brand: 'tyson-foods', price: 5.49, salePrice: null, image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?q=80&w=300', desc: '93% lean ground turkey breast, 1 pound.' },

      // Beverages (20 products)
      { name: 'Coca-Cola 12-pack Cans', category: 'Soda & Soft Drinks', brand: 'coca-cola', price: 7.99, salePrice: 6.49, image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=300', desc: 'Classic Coca-Cola soda, twelve 12oz cans.' },
      { name: 'Diet Coke 12-pack Cans', category: 'Soda & Soft Drinks', brand: 'coca-cola', price: 7.99, salePrice: null, image: 'https://images.unsplash.com/photo-1581636625402-29b2a704ef13?q=80&w=300', desc: 'Sugar-free Diet Coke soda, twelve 12oz cans.' },
      { name: 'Sprite 12-pack Cans', category: 'Soda & Soft Drinks', brand: 'coca-cola', price: 7.99, salePrice: 6.49, image: 'https://images.unsplash.com/photo-1625772290748-160b2168865c?q=80&w=300', desc: 'Lemon-lime crisp Sprite soda, twelve 12oz cans.' },
      { name: 'Pepsi Soda 12-pack Cans', category: 'Soda & Soft Drinks', brand: 'pepsico', price: 7.49, salePrice: 5.99, image: 'https://images.unsplash.com/photo-1531130176101-b5d3cb066c9a?q=80&w=300', desc: 'Classic Pepsi Cola soda, twelve 12oz cans.' },
      { name: 'Simply Orange Juice 52oz', category: 'Juices', brand: 'coca-cola', price: 4.49, salePrice: 3.99, image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?q=80&w=300', desc: '100% pasteurized orange juice, pulp-free.' },
      { name: '100% Apple Juice 64oz', category: 'Juices', brand: 'pepsico', price: 3.29, salePrice: null, image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?q=80&w=300', desc: '100% apple juice from concentrate with vitamin C.' },
      { name: 'Cranberry Juice Cocktail 64oz', category: 'Juices', brand: 'pepsico', price: 3.79, salePrice: 3.29, image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=300', desc: 'Tart and refreshing cranberry juice blend.' },
      { name: 'Pure Coconut Water 1L', category: 'Juices', brand: 'pepsico', price: 3.99, salePrice: null, image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?q=80&w=300', desc: 'Hydrating natural coconut water, pack of 1 liter.' },
      { name: 'Green Tea Bags 40ct', category: 'Tea & Coffee', brand: 'pepsico', price: 3.49, salePrice: 2.99, image: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?q=80&w=300', desc: 'Organic green tea filter bags, package of forty.' },
      { name: 'House Blend Ground Coffee 12oz', category: 'Tea & Coffee', brand: 'coca-cola', price: 7.99, salePrice: 6.99, image: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=300', desc: 'Medium roast rich ground coffee, 12oz bag.' },
      { name: 'English Breakfast Black Tea 20ct', category: 'Tea & Coffee', brand: 'pepsico', price: 2.99, salePrice: null, image: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?q=80&w=300', desc: 'Robust black tea breakfast blend, 20 tea bags.' },
      { name: 'Organic Whole Bean Coffee 12oz', category: 'Tea & Coffee', brand: 'pepsico', price: 9.99, salePrice: 8.49, image: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=300', desc: 'Dark roast organic single-origin coffee beans.' },
      { name: 'Unsweetened Iced Tea 64oz', category: 'Tea & Coffee', brand: 'pepsico', price: 3.29, salePrice: 2.79, image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?q=80&w=300', desc: 'Freshly brewed unsweetened black iced tea.' },
      { name: 'Premium Sparkling Water 8-pack', category: 'Soda & Soft Drinks', brand: 'pepsico', price: 4.49, salePrice: null, image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=300', desc: 'Grapefruit infused sparkling water cans, 8-pack.' },
      { name: 'Dr. Pepper Soda 12-pack Cans', category: 'Soda & Soft Drinks', brand: 'pepsico', price: 7.99, salePrice: 6.49, image: 'https://images.unsplash.com/photo-1531130176101-b5d3cb066c9a?q=80&w=300', desc: '23 signature flavors Dr Pepper, 12oz cans.' },
      { name: 'Mountain Dew 12-pack Cans', category: 'Soda & Soft Drinks', brand: 'pepsico', price: 7.99, salePrice: null, image: 'https://images.unsplash.com/photo-1531130176101-b5d3cb066c9a?q=80&w=300', desc: 'Citrus charged Mountain Dew soda, 12oz cans.' },
      { name: 'Classic Ginger Ale 12ct Cans', category: 'Soda & Soft Drinks', brand: 'coca-cola', price: 7.49, salePrice: 5.99, image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=300', desc: 'Sweet, sparkling ginger ale soda cans, 12-pack.' },
      { name: 'Lemonade Juice Pitcher 59oz', category: 'Juices', brand: 'coca-cola', price: 2.99, salePrice: null, image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?q=80&w=300', desc: 'Sweet and sour fresh lemon juice beverage.' },
      { name: 'Pineapple Juice 46oz Can', category: 'Juices', brand: 'dole', price: 3.19, salePrice: 2.69, image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?q=80&w=300', desc: '100% pure pineapple juice in a metal can.' },
      { name: 'Tomato Vegetable Juice 46oz', category: 'Juices', brand: 'heinz', price: 3.49, salePrice: null, image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?q=80&w=300', desc: 'Savory tomato and vegetable juice blend.' },

      // Snacks & Sweets (20 products)
      { name: 'Original Potato Chips', category: 'Chips', brand: 'lays', price: 4.29, salePrice: 3.49, image: 'https://images.unsplash.com/photo-1566478989037-eec170784d20?q=80&w=300', desc: 'Classic salted crispy potato chips bag.' },
      { name: 'Sour Cream & Onion Chips', category: 'Chips', brand: 'lays', price: 4.29, salePrice: null, image: 'https://images.unsplash.com/photo-1566478989037-eec170784d20?q=80&w=300', desc: 'Sour cream and onion seasoned potato chips.' },
      { name: 'Nacho Cheese Tortilla Chips', category: 'Chips', brand: 'pepsico', price: 4.49, salePrice: 3.99, image: 'https://images.unsplash.com/photo-1518047601542-79f18c655718?q=80&w=300', desc: 'Bold nacho cheese seasoned tortilla chips.' },
      { name: 'Salted Pretzel Twists', category: 'Chips', brand: 'lays', price: 3.29, salePrice: 2.79, image: 'https://images.unsplash.com/photo-1530087965147-e68cc6b3e39c?q=80&w=300', desc: 'Crunchy oven-baked salted pretzel twists.' },
      { name: 'Roasted Salted Peanuts 16oz', category: 'Nuts & Seeds', brand: 'lays', price: 3.99, salePrice: null, image: 'https://images.unsplash.com/photo-1567375691347-285e65d8298b?q=80&w=300', desc: 'Dry roasted salted peanuts in a canister.' },
      { name: 'Whole Cashew Nuts 8oz', category: 'Nuts & Seeds', brand: 'lays', price: 5.99, salePrice: 4.99, image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=300', desc: 'Deluxe roasted unsalted whole cashews.' },
      { name: 'Dark Chocolate Bar 72%', category: 'Chocolates & Candy', brand: 'ben-jerrys', price: 2.99, salePrice: 2.49, image: 'https://images.unsplash.com/photo-1548907040-4d42b52125ea?q=80&w=300', desc: '72% cocoa rich Belgian dark chocolate bar.' },
      { name: 'Milk Chocolate Caramel Bar', category: 'Chocolates & Candy', brand: 'ben-jerrys', price: 2.99, salePrice: null, image: 'https://images.unsplash.com/photo-1548907040-4d42b52125ea?q=80&w=300', desc: 'Creamy milk chocolate bar filled with salted caramel.' },
      { name: 'Gummy Bears Bag 14oz', category: 'Chocolates & Candy', brand: 'ben-jerrys', price: 3.49, salePrice: 2.99, image: 'https://images.unsplash.com/photo-1581798459219-318e76ae1dbb?q=80&w=300', desc: 'Classic chewy gummy bears, fruit flavors.' },
      { name: 'Butter Popcorn 3-pack', category: 'Chips', brand: 'lays', price: 3.99, salePrice: null, image: 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?q=80&w=300', desc: 'Microwave butter popcorn bags, pack of three.' },
      { name: 'Roasted Almonds 6oz Bag', category: 'Nuts & Seeds', brand: 'lays', price: 4.99, salePrice: 4.29, image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=300', desc: 'Roasted and lightly salted whole almonds.' },
      { name: 'Peanut Butter Cups', category: 'Chocolates & Candy', brand: 'ben-jerrys', price: 3.79, salePrice: 3.29, image: 'https://images.unsplash.com/photo-1548907040-4d42b52125ea?q=80&w=300', desc: 'Milk chocolate cups filled with creamy peanut butter.' },
      { name: 'Ritz style Crackers 13oz', category: 'Chips', brand: 'lays', price: 3.69, salePrice: null, image: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?q=80&w=300', desc: 'Flaky and buttery classic round crackers.' },
      { name: 'Chocolate Chip Cookies Bag', category: 'Chips', brand: 'sara-lee', price: 3.49, salePrice: 2.99, image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?q=80&w=300', desc: 'Crisp chocolate chip cookies, 12oz bag.' },
      { name: 'Sea Salt Rice Cakes', category: 'Chips', brand: 'lays', price: 2.79, salePrice: null, image: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?q=80&w=300', desc: 'Gluten-free lightly salted brown rice cakes.' },
      { name: 'Fruit Jelly Beans Bag', category: 'Chocolates & Candy', brand: 'ben-jerrys', price: 2.99, salePrice: 2.49, image: 'https://images.unsplash.com/photo-1581798459219-318e76ae1dbb?q=80&w=300', desc: 'Assorted fruit flavored sweet jelly beans.' },
      { name: 'Tortilla Scoops Chips', category: 'Chips', brand: 'pepsico', price: 4.49, salePrice: null, image: 'https://images.unsplash.com/photo-1518047601542-79f18c655718?q=80&w=300', desc: 'Scoop shaped crispy corn tortilla chips.' },
      { name: 'Cheddar Cheese Crackers', category: 'Chips', brand: 'lays', price: 3.29, salePrice: 2.79, image: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?q=80&w=300', desc: 'Baked snack cheese crackers made with real cheddar.' },
      { name: 'Oatmeal Raisin Soft Cookies', category: 'Chips', brand: 'sara-lee', price: 3.99, salePrice: 3.49, image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?q=80&w=300', desc: 'Chewy soft baked oatmeal cookies with sweet raisins.' },
      { name: 'Sour Gummy Worms Bag', category: 'Chocolates & Candy', brand: 'ben-jerrys', price: 3.49, salePrice: null, image: 'https://images.unsplash.com/photo-1581798459219-318e76ae1dbb?q=80&w=300', desc: 'Sour sugar dusted chewy gummy worms.' },

      // Pantry & Groceries (20 products)
      { name: 'Extra Virgin Olive Oil 500ml', category: 'Cooking Oils', brand: 'heinz', price: 8.99, salePrice: 7.99, image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?q=80&w=300', desc: 'Cold pressed extra virgin olive oil, 500ml glass bottle.' },
      { name: 'Pure Canola Oil 1.4L', category: 'Cooking Oils', brand: 'heinz', price: 4.99, salePrice: null, image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?q=80&w=300', desc: 'All-purpose cholesterol-free canola cooking oil.' },
      { name: 'Premium Jasmine Rice 5lb', category: 'Pasta & Rice', brand: 'heinz', price: 6.99, salePrice: 5.99, image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=300', desc: 'Long grain aromatic jasmine white rice.' },
      { name: 'Spaghetti Pasta 16oz', category: 'Pasta & Rice', brand: 'heinz', price: 1.89, salePrice: null, image: 'https://images.unsplash.com/photo-1551462147-ff29053bfc14?q=80&w=300', desc: 'Semolina wheat spaghetti pasta noodles.' },
      { name: 'Penne Rigate Pasta 16oz', category: 'Pasta & Rice', brand: 'heinz', price: 1.89, salePrice: 1.49, image: 'https://images.unsplash.com/photo-1551462147-ff29053bfc14?q=80&w=300', desc: 'Ridged pene pasta tubes, semolina wheat.' },
      { name: 'Tomato Marinara Sauce 24oz', category: 'Sauces & Spices', brand: 'heinz', price: 3.49, salePrice: 2.99, image: 'https://images.unsplash.com/photo-1601314002592-b8730b2683d5?q=80&w=300', desc: 'Tomato pasta sauce cooked with garlic and herbs.' },
      { name: 'Creamy Peanut Butter 16oz', category: 'Sauces & Spices', brand: 'heinz', price: 3.99, salePrice: null, image: 'https://images.unsplash.com/photo-1568644838142-47575304b2a8?q=80&w=300', desc: 'Creamy high protein peanut butter spread.' },
      { name: 'Sweet Strawberry Jam 18oz', category: 'Sauces & Spices', brand: 'heinz', price: 3.49, salePrice: 2.99, image: 'https://images.unsplash.com/photo-1601314002592-b8730b2683d5?q=80&w=300', desc: 'Sweet strawberry fruit preserve spread.' },
      { name: 'Organic Honey 12oz Bottle', category: 'Sauces & Spices', brand: 'organic-valley', price: 5.99, salePrice: null, image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?q=80&w=300', desc: 'Pure USDA organic squeeze honey bottle.' },
      { name: 'Iodized Sea Salt 26oz', category: 'Sauces & Spices', brand: 'heinz', price: 1.49, salePrice: 1.19, image: 'https://images.unsplash.com/photo-1608686207856-001b95cf60ca?q=80&w=300', desc: 'Fine ground iodized sea salt shaker.' },
      { name: 'Black Pepper Ground 4oz', category: 'Sauces & Spices', brand: 'heinz', price: 3.29, salePrice: null, image: 'https://images.unsplash.com/photo-1608686207856-001b95cf60ca?q=80&w=300', desc: 'Aromatic pure ground black pepper.' },
      { name: 'All-Purpose Flour 5lb Bag', category: 'Pasta & Rice', brand: 'heinz', price: 2.99, salePrice: 2.49, image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=300', desc: 'Enriched unbleached all purpose baking flour.' },
      { name: 'Granulated White Sugar 4lb', category: 'Pasta & Rice', brand: 'heinz', price: 3.19, salePrice: null, image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=300', desc: 'Granulated pure cane white sugar bag.' },
      { name: 'Pure Maple Syrup 8oz', category: 'Sauces & Spices', brand: 'organic-valley', price: 6.99, salePrice: 5.99, image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?q=80&w=300', desc: '100% pure organic grade A maple syrup.' },
      { name: 'Heinz Tomato Ketchup 32oz', category: 'Sauces & Spices', brand: 'heinz', price: 3.99, salePrice: 3.49, image: 'https://images.unsplash.com/photo-1607305387299-a3d9611cd46f?q=80&w=300', desc: 'Classic thick sweet Heinz tomato ketchup.' },
      { name: 'Yellow Mustard squeeze 14oz', category: 'Sauces & Spices', brand: 'heinz', price: 1.99, salePrice: null, image: 'https://images.unsplash.com/photo-1607305387299-a3d9611cd46f?q=80&w=300', desc: 'Classic tangy yellow squeeze mustard.' },
      { name: 'Real Mayonnaise 30oz Jar', category: 'Sauces & Spices', brand: 'heinz', price: 4.89, salePrice: 4.19, image: 'https://images.unsplash.com/photo-1607305387299-a3d9611cd46f?q=80&w=300', desc: 'Creamy real egg mayonnaise spread jar.' },
      { name: 'Black Beans Canned 15oz', category: 'Pasta & Rice', brand: 'heinz', price: 1.29, salePrice: null, image: 'https://images.unsplash.com/photo-1608686207856-001b95cf60ca?q=80&w=300', desc: 'Low sodium canned black beans, ready to eat.' },
      { name: 'Canned Sweet Corn 15oz', category: 'Pasta & Rice', brand: 'heinz', price: 1.29, salePrice: 0.99, image: 'https://images.unsplash.com/photo-1608686207856-001b95cf60ca?q=80&w=300', desc: 'Crisp canned golden sweet corn kernels.' },
      { name: 'Brown Rice 2lb Bag', category: 'Pasta & Rice', brand: 'heinz', price: 2.49, salePrice: null, image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=300', desc: 'Long grain fiber-rich brown rice.' },

      // Frozen Foods (20 products)
      { name: 'Frozen Pepperoni Pizza', category: 'Frozen Meals', brand: 'ben-jerrys', price: 6.99, salePrice: 5.99, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=300', desc: 'Thick crust pepperoni pizza, frozen.' },
      { name: 'Frozen Cheese Pizza', category: 'Frozen Meals', brand: 'ben-jerrys', price: 6.49, salePrice: null, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=300', desc: 'Four cheese thick crust frozen pizza.' },
      { name: 'Vanilla Ice Cream 1 Pint', category: 'Ice Creams', brand: 'ben-jerrys', price: 4.99, salePrice: 4.29, image: 'https://images.unsplash.com/photo-1560008511-11c63416e52d?q=80&w=300', desc: 'Creamy vanilla bean ice cream pint.' },
      { name: 'Chocolate Fudge Ice Cream', category: 'Ice Creams', brand: 'ben-jerrys', price: 4.99, salePrice: null, image: 'https://images.unsplash.com/photo-1560008511-11c63416e52d?q=80&w=300', desc: 'Rich chocolate fudge brownie ice cream pint.' },
      { name: 'Frozen Strawberry Tub 16oz', category: 'Frozen Meals', brand: 'dole', price: 3.99, salePrice: 3.49, image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?q=80&w=300', desc: 'Fresh frozen strawberries for smoothies.' },
      { name: 'Frozen Sweet Green Peas', category: 'Frozen Meals', brand: 'dole', price: 1.99, salePrice: null, image: 'https://images.unsplash.com/photo-1584270354949-c26b0d5b4a0c?q=80&w=300', desc: 'Steamable bag of frozen sweet green peas.' },
      { name: 'Frozen Chicken Nuggets 2lb', category: 'Frozen Meals', brand: 'tyson-foods', price: 8.99, salePrice: 7.49, image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?q=80&w=300', desc: 'Fully cooked breaded chicken breast nuggets.' },
      { name: 'Frozen Crinkle Cut Fries', category: 'Frozen Meals', brand: 'tyson-foods', price: 3.49, salePrice: 2.99, image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=300', desc: 'Ore-Ida style crinkle cut frozen potato fries.' },
      { name: 'Frozen Homestyle Waffles 10ct', category: 'Frozen Meals', brand: 'sara-lee', price: 2.99, salePrice: null, image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=300', desc: 'Crispy homestyle frozen waffles, pack of ten.' },
      { name: 'Frozen Fruit Blend 3lb', category: 'Frozen Meals', brand: 'dole', price: 9.99, salePrice: 8.49, image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?q=80&w=300', desc: 'Frozen strawberries, blueberries, and blackberries.' },
      { name: 'Frozen Lasagna Entree', category: 'Frozen Meals', brand: 'ben-jerrys', price: 4.89, salePrice: null, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=300', desc: 'Frozen meat lasagna family size meal.' },
      { name: 'Frozen Broccoli Florets', category: 'Frozen Meals', brand: 'dole', price: 2.19, salePrice: 1.79, image: 'https://images.unsplash.com/photo-1584270354949-c26b0d5b4a0c?q=80&w=300', desc: 'Steam-in-bag frozen organic broccoli florets.' },
      { name: 'Cookie Dough Ice Cream', category: 'Ice Creams', brand: 'ben-jerrys', price: 4.99, salePrice: 4.29, image: 'https://images.unsplash.com/photo-1560008511-11c63416e52d?q=80&w=300', desc: 'Chocolate chip cookie dough ice cream pint.' },
      { name: 'Frozen Mixed Vegetables', category: 'Frozen Meals', brand: 'dole', price: 1.99, salePrice: null, image: 'https://images.unsplash.com/photo-1584270354949-c26b0d5b4a0c?q=80&w=300', desc: 'Frozen corn, peas, carrots, and green beans.' },
      { name: 'Frozen Mozzarella Sticks', category: 'Frozen Meals', brand: 'ben-jerrys', price: 5.49, salePrice: 4.79, image: 'https://images.unsplash.com/photo-1552763484-5d60dd6c17e3?q=80&w=300', desc: 'Breaded mozzarella cheese sticks with marinara.' },
      { name: 'Frozen Waffles Blueberry', category: 'Frozen Meals', brand: 'sara-lee', price: 3.19, salePrice: null, image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=300', desc: 'Blueberry flavored toaster frozen waffles, 10ct.' },
      { name: 'Frozen Beef Burritos 8ct', category: 'Frozen Meals', brand: 'tyson-foods', price: 6.99, salePrice: 5.99, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=300', desc: 'Frozen beef and bean burritos, package of eight.' },
      { name: 'Frozen Whipped Topping 8oz', category: 'Ice Creams', brand: 'sara-lee', price: 2.29, salePrice: null, image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?q=80&w=300', desc: 'Frozen sweet whipped cream topping tub.' },
      { name: 'Frozen Stir Fry Veggies', category: 'Frozen Meals', brand: 'dole', price: 2.89, salePrice: 2.49, image: 'https://images.unsplash.com/photo-1584270354949-c26b0d5b4a0c?q=80&w=300', desc: 'Crisp Asian stir fry frozen vegetable mix.' },
      { name: 'Mango Sorbet Pint', category: 'Ice Creams', brand: 'ben-jerrys', price: 4.99, salePrice: null, image: 'https://images.unsplash.com/photo-1560008511-11c63416e52d?q=80&w=300', desc: 'Dairy-free frozen sweet mango sorbet pint.' },

      // Personal Care (20 products)
      { name: 'Moisturizing Body Wash', category: 'Soaps', brand: 'dove', price: 6.99, salePrice: 5.99, image: 'https://images.unsplash.com/photo-1556229174-5e42a09e45af?q=80&w=300', desc: 'Dove deep moisture nourishing body wash, 22oz.' },
      { name: 'Herbal Shampoo 16oz', category: 'Hair Care', brand: 'dove', price: 4.99, salePrice: null, image: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?q=80&w=300', desc: 'Herbal extracts moisturizing hair shampoo.' },
      { name: 'Herbal Conditioner 16oz', category: 'Hair Care', brand: 'dove', price: 4.99, salePrice: 4.19, image: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?q=80&w=300', desc: 'Smoothing and moisturizing hair conditioner.' },
      { name: 'Fluoride Anticavity Toothpaste', category: 'Dental Care', brand: 'colgate', price: 3.49, salePrice: 2.99, image: 'https://images.unsplash.com/photo-1559591937-e1b937-e1b937-e1b937-e1b937-e1b937-e1b937-e1b937-e1b937-e1b937-e1b937?q=80&w=300', desc: 'Total whitening cavity protection fluoride toothpaste.' },
      { name: 'Colgate Toothbrush 2-pack', category: 'Dental Care', brand: 'colgate', price: 4.29, salePrice: null, image: 'https://images.unsplash.com/photo-1559591937-e1b937-e1b937-e1b937?q=80&w=300', desc: 'Medium bristle manual toothbrushes, pack of two.' },
      { name: 'Liquid Hand Soap 8oz', category: 'Soaps', brand: 'dove', price: 2.49, salePrice: 1.99, image: 'https://images.unsplash.com/photo-1607006342411-91c01c8f3802?q=80&w=300', desc: 'Antibacterial liquid hand wash, squeeze bottle.' },
      { name: 'Antiperspirant Deodorant Stick', category: 'Soaps', brand: 'dove', price: 4.99, salePrice: 4.29, image: 'https://images.unsplash.com/photo-1556229174-5e42a09e45af?q=80&w=300', desc: '48-hour clinical strength antiperspirant deodorant.' },
      { name: 'Antiseptic Mouthwash 1L', category: 'Dental Care', brand: 'colgate', price: 5.99, salePrice: null, image: 'https://images.unsplash.com/photo-1559591937-e1b937-e1b937-e1b937?q=80&w=300', desc: 'Cool mint antiseptic breath freshening mouthwash.' },
      { name: 'Deep Cleansing Face Wash', category: 'Soaps', brand: 'dove', price: 6.49, salePrice: 5.49, image: 'https://images.unsplash.com/photo-1556229174-5e42a09e45af?q=80&w=300', desc: 'Daily foaming facial cleanser for sensitive skin.' },
      { name: 'Daily Moisturizing Body Lotion', category: 'Soaps', brand: 'dove', price: 7.99, salePrice: null, image: 'https://images.unsplash.com/photo-1556229174-5e42a09e45af?q=80&w=300', desc: 'Shea butter enriched non-greasy body lotion.' },
      { name: 'Sensitive Skin Shaving Cream', category: 'Soaps', brand: 'dove', price: 3.29, salePrice: 2.79, image: 'https://images.unsplash.com/photo-1556229174-5e42a09e45af?q=80&w=300', desc: 'Rich aloe shaving cream for clean shaves.' },
      { name: 'Disposable Razors 4ct', category: 'Soaps', brand: 'dove', price: 5.99, salePrice: null, image: 'https://images.unsplash.com/photo-1556229174-5e42a09e45af?q=80&w=300', desc: 'Three-blade disposable shaving razors, pack of four.' },
      { name: 'Aloe Hand Sanitizer 8oz', category: 'Soaps', brand: 'dove', price: 2.99, salePrice: 2.49, image: 'https://images.unsplash.com/photo-1607006342411-91c01c8f3802?q=80&w=300', desc: 'Kills 99.9% germs, soothing aloe hand gel.' },
      { name: 'Bar Soap 4-pack', category: 'Soaps', brand: 'dove', price: 4.89, salePrice: 4.19, image: 'https://images.unsplash.com/photo-1607006342411-91c01c8f3802?q=80&w=300', desc: 'Gentle beauty bar soap with moisturizing cream.' },
      { name: 'Mens 3-in-1 Body Wash', category: 'Soaps', brand: 'dove', price: 6.99, salePrice: null, image: 'https://images.unsplash.com/photo-1556229174-5e42a09e45af?q=80&w=300', desc: 'Mens body, face, and hair clean wash, 22oz.' },
      { name: 'Kids Tear-Free Shampoo', category: 'Hair Care', brand: 'dove', price: 4.49, salePrice: 3.99, image: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?q=80&w=300', desc: 'Hypoallergenic tear-free kids hair shampoo.' },
      { name: 'Dental Floss Mint 50m', category: 'Dental Care', brand: 'colgate', price: 2.49, salePrice: null, image: 'https://images.unsplash.com/photo-1559591937-e1b937-e1b937-e1b937?q=80&w=300', desc: 'Waxed dental floss with refreshing mint flavor.' },
      { name: 'Cotton Swabs 500ct', category: 'Soaps', brand: 'dove', price: 3.19, salePrice: 2.69, image: 'https://images.unsplash.com/photo-1607006342411-91c01c8f3802?q=80&w=300', desc: 'Double-tipped cotton swabs, package of 500.' },
      { name: 'Alcohol Free Styling Gel', category: 'Hair Care', brand: 'dove', price: 3.99, salePrice: null, image: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?q=80&w=300', desc: 'Strong hold alcohol-free hair styling gel.' },
      { name: 'Ultra Dry Body Spray', category: 'Soaps', brand: 'dove', price: 5.49, salePrice: 4.79, image: 'https://images.unsplash.com/photo-1556229174-5e42a09e45af?q=80&w=300', desc: 'Aerosol dry antiperspirant body spray, 4oz.' },

      // Household & Cleaning (20 products)
      { name: 'Liquid Laundry Detergent 100oz', category: 'Laundry', brand: 'tide', price: 12.99, salePrice: 10.99, image: 'https://images.unsplash.com/photo-1610557880182-3d4d3cba35a5?q=80&w=300', desc: 'Original scent liquid laundry detergent, 64 loads.' },
      { name: 'Laundry Pods 42ct', category: 'Laundry', brand: 'tide', price: 11.99, salePrice: null, image: 'https://images.unsplash.com/photo-1610557880182-3d4d3cba35a5?q=80&w=300', desc: '3-in-1 laundry detergent pods, pack of 42.' },
      { name: 'Liquid Fabric Softener', category: 'Laundry', brand: 'tide', price: 6.99, salePrice: 5.99, image: 'https://images.unsplash.com/photo-1610557880182-3d4d3cba35a5?q=80&w=300', desc: 'April fresh liquid fabric softener, 60 loads.' },
      { name: 'Paper Towels 6 Double Rolls', category: 'Paper Products', brand: 'tide', price: 9.99, salePrice: 8.49, image: 'https://images.unsplash.com/photo-1608686207856-001b95cf60ca?q=80&w=300', desc: 'Absorbent double roll paper towels, pack of six.' },
      { name: 'Bath Tissue 12 Mega Rolls', category: 'Paper Products', brand: 'tide', price: 10.99, salePrice: null, image: 'https://images.unsplash.com/photo-1608686207856-001b95cf60ca?q=80&w=300', desc: 'Ultra soft 2-ply toilet paper rolls, pack of twelve.' },
      { name: 'Trash Bags 13 Gallon 50ct', category: 'Paper Products', brand: 'tide', price: 8.99, salePrice: 7.49, image: 'https://images.unsplash.com/photo-1608686207856-001b95cf60ca?q=80&w=300', desc: 'Drawstring tall kitchen white trash bags.' },
      { name: 'Liquid Dish Soap 24oz', category: 'Cleaners', brand: 'tide', price: 2.99, salePrice: 2.49, image: 'https://images.unsplash.com/photo-1607006342411-91c01c8f3802?q=80&w=300', desc: 'Dawn style grease-cutting liquid dish soap.' },
      { name: 'Multi-Surface Cleaner Spray', category: 'Cleaners', brand: 'tide', price: 3.49, salePrice: null, image: 'https://images.unsplash.com/photo-1607006342411-91c01c8f3802?q=80&w=300', desc: 'All-purpose lavender multi-surface cleaning spray.' },
      { name: 'Disinfecting Wipes 75ct', category: 'Cleaners', brand: 'tide', price: 4.99, salePrice: 4.19, image: 'https://images.unsplash.com/photo-1607006342411-91c01c8f3802?q=80&w=300', desc: 'Kills 99.9% viruses and bacteria wipes tub.' },
      { name: 'Glass Cleaner Spray 32oz', category: 'Cleaners', brand: 'tide', price: 3.29, salePrice: null, image: 'https://images.unsplash.com/photo-1607006342411-91c01c8f3802?q=80&w=300', desc: 'Streak-free window and glass cleaner spray.' },
      { name: 'Toilet Bowl Cleaner 24oz', category: 'Cleaners', brand: 'tide', price: 2.79, salePrice: 2.29, image: 'https://images.unsplash.com/photo-1607006342411-91c01c8f3802?q=80&w=300', desc: 'Clinging disinfecting toilet bowl cleaner gel.' },
      { name: 'Heavy Duty Scrub Sponges 3ct', category: 'Cleaners', brand: 'tide', price: 2.99, salePrice: null, image: 'https://images.unsplash.com/photo-1607006342411-91c01c8f3802?q=80&w=300', desc: 'Scrub sponges for kitchen dish cleaning, 3-pack.' },
      { name: 'Dryer Sheets 120ct', category: 'Laundry', brand: 'tide', price: 4.99, salePrice: 4.29, image: 'https://images.unsplash.com/photo-1610557880182-3d4d3cba35a5?q=80&w=300', desc: 'Anti-static fabric softening dryer sheets.' },
      { name: 'Automatic Dishwasher Pacs 20ct', category: 'Cleaners', brand: 'tide', price: 5.99, salePrice: 4.99, image: 'https://images.unsplash.com/photo-1607006342411-91c01c8f3802?q=80&w=300', desc: 'ActionPacs automatic dishwasher detergent pods.' },
      { name: 'Paper Plates 8.5-inch 100ct', category: 'Paper Products', brand: 'tide', price: 4.49, salePrice: null, image: 'https://images.unsplash.com/photo-1608686207856-001b95cf60ca?q=80&w=300', desc: 'Microwave safe soak-proof paper plates.' },
      { name: 'Aluminum Foil 75 sq ft', category: 'Paper Products', brand: 'tide', price: 3.99, salePrice: 3.49, image: 'https://images.unsplash.com/photo-1608686207856-001b95cf60ca?q=80&w=300', desc: 'Standard strength kitchen wrapping aluminum foil.' },
      { name: 'Plastic Wrap 200 sq ft', category: 'Paper Products', brand: 'tide', price: 2.99, salePrice: null, image: 'https://images.unsplash.com/photo-1608686207856-001b95cf60ca?q=80&w=300', desc: 'Cling wrap plastic food stretch film.' },
      { name: 'Fabric Odor Refresher Spray', category: 'Laundry', brand: 'tide', price: 4.29, salePrice: 3.79, image: 'https://images.unsplash.com/photo-1610557880182-3d4d3cba35a5?q=80&w=300', desc: 'Eliminates fabric odors, fresh linen spray.' },
      { name: 'Drain Clog Remover Gel 32oz', category: 'Cleaners', brand: 'tide', price: 5.49, salePrice: null, image: 'https://images.unsplash.com/photo-1607006342411-91c01c8f3802?q=80&w=300', desc: 'Pours through standing water to clear hair drain clogs.' },
      { name: 'Furniture Polish Spray', category: 'Cleaners', brand: 'tide', price: 3.99, salePrice: 3.29, image: 'https://images.unsplash.com/photo-1607006342411-91c01c8f3802?q=80&w=300', desc: 'Lemon oil dust cleaner and wood polish spray.' }
    ];

    console.log(`Starting bulk insert of ${productsTemplates.length} products...`);
    for (let i = 0; i < productsTemplates.length; i++) {
      const template = productsTemplates[i];
      const prodId = crypto.randomUUID();
      const brandId = brandMap[template.brand] || null;
      const catId = categoryMap[template.category] || null;
      
      const slug = template.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + i;
      const sku = `UPC-${String(i).padStart(4, '0')}-${template.category.substring(0, 3).toUpperCase()}`;
      const barcode = `99000${String(i).padStart(7, '0')}`;

      // Insert product
      await connection.execute(`
        INSERT INTO products (id, brand_id, name, slug, description, price, sale_price, sku, barcode, featured, status) VALUES 
        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'PUBLISHED')
      `, [
        prodId, 
        brandId, 
        template.name, 
        slug, 
        template.desc, 
        template.price, 
        template.salePrice, 
        sku, 
        barcode, 
        i % 10 === 0 ? 1 : 0 // Feature every 10th item
      ]);

      // Link to Category
      if (catId) {
        await connection.execute(`
          INSERT INTO product_categories (product_id, category_id) VALUES (?, ?)
        `, [prodId, catId]);
      }

      // Add product image
      await connection.execute(`
        INSERT INTO product_images (id, product_id, url, sort_order) VALUES 
        (?, ?, ?, 0)
      `, [crypto.randomUUID(), prodId, template.image]);

      // Add default variant
      const variantId = crypto.randomUUID();
      await connection.execute(`
        INSERT INTO product_variants (id, product_id, sku, price, sale_price, stock) VALUES 
        (?, ?, ?, ?, ?, ?)
      `, [
        variantId, 
        prodId, 
        `${sku}-VAR`, 
        template.price, 
        template.salePrice, 
        Math.floor(Math.random() * 120) + 15 // random stock between 15 and 135
      ]);

      // Add inventory record in default warehouse
      const invId = crypto.randomUUID();
      const stockQty = Math.floor(Math.random() * 80) + 20;
      await connection.execute(`
        INSERT INTO inventories (id, product_variant_id, warehouse_id, quantity, purchase_price, selling_price, batch_number) VALUES 
        (?, ?, ?, ?, ?, ?, ?)
      `, [
        invId, 
        variantId, 
        warehouseId, 
        stockQty, 
        (template.price * 0.65).toFixed(2), // wholesale cost is 65% of price
        (template.salePrice || template.price).toFixed(2), 
        `B-BATCH-${i}`
      ]);

      // Add stock log
      await connection.execute(`
        INSERT INTO stock_logs (id, inventory_id, type, quantity, reason) VALUES 
        (?, ?, 'IN', ?, 'Initial bulk seed import')
      `, [crypto.randomUUID(), invId, stockQty]);
    }

    console.log('Seeded all products successfully.');

    // 9. Seed Coupons
    console.log('Seeding coupons...');
    const couponWelcome = crypto.randomUUID();
    const couponFifty = crypto.randomUUID();

    await connection.execute(`
      INSERT INTO coupons (id, code, type, value, min_purchase, limit_total, limit_per_user, expires_at) VALUES 
      (?, 'WELCOME10', 'PERCENTAGE', 10.00, 50.00, 500, 1, '2028-12-31 23:59:59'),
      (?, 'SAVE50', 'FIXED', 50.00, 200.00, 100, 1, '2028-12-31 23:59:59')
    `, [couponWelcome, couponFifty]);

    // 10. Seed CMS Content (Banners, static pages, FAQs)
    console.log('Seeding banners, pages, and FAQs...');
    await connection.execute(`
      INSERT INTO banners (id, title, subtitle, image_url, link_url, status) VALUES 
      (?, 'Fresh Organic Supermarket', 'Healthy grocery essentials delivered to your door.', 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1200', '/products', 'ACTIVE')
    `, [crypto.randomUUID()]);

    await connection.execute(`
      INSERT INTO pages (id, title, slug, content) VALUES 
      (?, 'Terms and Conditions', 'terms', '<h1>Terms of Service</h1><p>Welcome to Shopora. By using our site, you agree to these terms.</p>'),
      (?, 'Privacy Policy', 'privacy', '<h1>Privacy Policy</h1><p>Your privacy is important to us. Here is how we safeguard your information.</p>')
    `, [crypto.randomUUID(), crypto.randomUUID()]);

    await connection.execute(`
      INSERT INTO faqs (id, question, answer, sort_order) VALUES 
      (?, 'What is your shipping policy?', 'We ship nationwide using cold chain carriers for fresh food within 24 hours.', 0),
      (?, 'What is the return policy?', 'Due to the fresh nature of groceries, returns must be logged within 24 hours of delivery.', 1)
    `, [crypto.randomUUID(), crypto.randomUUID()]);

    // 11. Seed Blog Posts
    console.log('Seeding blog posts...');
    await connection.execute(`
      INSERT INTO blog_posts (id, title, slug, content, author_name, image_url, read_time, published_at) VALUES 
      (?, 'Eating Clean: Why Organic Fruits & Vegetables Matter', 'organic-fruits-vegetables-clean-eating', '<h2>Benefits of Clean Eating</h2><p>Choosing organic fruits and vegetables reduces exposure to chemical pesticides and preservatives. Organic soil methods often yield food that contains more vitamins and minerals, promoting overall gut health and daily energy.</p>', 'Alex Mercer', 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?q=80&w=800', '4 min read', '2026-07-01 10:00:00'),
      (?, 'The Nutritional Benefits of Dairy & Eggs', 'dairy-eggs-nutritional-guide', '<h2>Rich in Calcium and Protein</h2><p>Dairy products like milk and Greek yogurt are rich sources of dietary calcium and vitamin D, crucial for bone strength. Farm-fresh brown eggs provide essential omega-3 fatty acids and complete proteins for cellular recovery.</p>', 'Sarah Jenkins', 'https://images.unsplash.com/photo-1550583724-b2692b85b150?q=80&w=800', '6 min read', '2026-07-10 14:30:00')
    `, [crypto.randomUUID(), crypto.randomUUID()]);

    // 12. Seed Landing Pages
    console.log('Seeding landing pages...');
    const lpContent1 = JSON.stringify([
      { 
        type: 'hero', 
        tag: 'Fresh Delivery',
        title: 'Weekly Farm-to-Table Grocery Delivery', 
        subtitle: 'Experience organic, fresh, and nutritious groceries delivered to your kitchen within hours of harvest.', 
        buttonText: 'Order Fresh Groceries Now', 
        buttonUrl: '#sales-section',
        imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=600'
      },
      {
        type: 'benefits',
        heading: 'Why Shopora Grocery?',
        subheading: 'Premium logistics, fresh packaging, and organic sourcing designed for healthy, happy families.',
        items: [
          { title: 'Cold-Chain Delivery', desc: 'Milk, meat, and frozen products stay at optimal temperature during transit.' },
          { title: 'Locally Sourced', desc: 'Direct partnerships with family-owned farms and sustainable producers.' },
          { title: '100% Satisfaction', desc: 'If any produce isn\'t fresh, we will instantly credit your account.' }
        ]
      }
    ]);
    await connection.execute(`
      INSERT INTO landing_pages (id, url, title, seo_title, meta_description, keywords, canonical_url, content, status) VALUES 
      (?, 'fresh-groceries-2026', 'Fresh Grocery Subscriptions', 'Fresh Organic Groceries - Shopora', 'Shopora weekly subscription page for organic fruits, vegetables, and dairy.', 'organic groceries, home delivery, fresh produce', 'http://localhost:3001/landing/fresh-groceries-2026', ?, 'PUBLISHED')
    `, [crypto.randomUUID(), lpContent1]);

    // 13. Seed Campaigns
    console.log('Seeding campaigns...');
    await connection.execute(`
      INSERT INTO campaigns (id, title, slug, banner_url, countdown_end, coupon_code, promo_content, status) VALUES 
      (?, 'Healthy Harvest Campaign', 'healthy-harvest', 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1200', '2027-08-31 23:59:59', 'WELCOME10', 'Get an instant 10% discount on fresh fruits, organic milk, and baking essentials.', 'ACTIVE')
    `, [crypto.randomUUID()]);

    await connection.execute('SET FOREIGN_KEY_CHECKS = 1');
    console.log('Database seeded successfully with 200+ super shop products!');

  } catch (err) {
    console.error('Error occurred during seeding:', err);
    await connection.execute('SET FOREIGN_KEY_CHECKS = 1');
    throw err;
  } finally {
    await connection.end();
  }
}

main().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
