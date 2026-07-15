const mysql = require('mysql2/promise');
const crypto = require('crypto');

async function main() {
  const connectionString = process.env.DATABASE_URL || 'mysql://shopora:shopora_password@127.0.0.1:3306/shopora';
  console.log('Seeding database with URL:', connectionString.replace(/:[^:@/]+@/, ':***@'));
  const connection = await mysql.createConnection(connectionString);

  try {
    console.log('Clearing existing data...');
    // Disable foreign key checks for clearing and seeding
    await connection.execute('SET FOREIGN_KEY_CHECKS = 0');
    
    const tables = [
      'activity_logs', 'coupon_usages', 'coupons', 'payment_transactions', 'payments', 
      'order_status_logs', 'order_items', 'orders', 'addresses', 'wishlists', 
      'cart_items', 'carts', 'stock_logs', 'inventories', 'warehouses', 
      'variant_attribute_values', 'product_variants', 'attribute_values', 'product_attributes', 
      'product_tags', 'product_images', 'product_categories', 'products', 
      'brands', 'categories', 'sessions', 'oauth_accounts', 'users', 
      'role_permissions', 'permissions', 'roles', 'banners', 'pages', 'faqs', 'notifications', 'settings'
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
    // Admin gets all permissions
    for (const perm of permissionsList) {
      await connection.execute(
        'INSERT INTO role_permissions (role_id, permission_id) VALUES (?, ?)',
        [adminRoleId, perm.id]
      );
    }
    // Manager gets catalog, orders, inventory, coupons
    const managerPerms = ['manage_catalog', 'manage_orders', 'manage_inventory', 'manage_coupons', 'view_analytics'];
    for (const perm of permissionsList) {
      if (managerPerms.includes(perm.name)) {
        await connection.execute(
          'INSERT INTO role_permissions (role_id, permission_id) VALUES (?, ?)',
          [managerRoleId, perm.id]
        );
      }
    }

    // 3. Seed Users
    console.log('Seeding users...');
    const adminUserId = crypto.randomUUID();
    const customerUserId = crypto.randomUUID();
    
    // Passwords are simple mock hashes (e.g. bcrypt mock or plain hashes)
    const adminPasswordHash = '$2b$10$EPY9LjgJiOR5hFw/gDcf8u49yvQ6x2fI1qP.i/d1t866d9/zRz3Nq'; // admin123
    const customerPasswordHash = '$2b$10$EPY9LjgJiOR5hFw/gDcf8u49yvQ6x2fI1qP.i/d1t866d9/zRz3Nq'; // customer123

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

    // 5. Seed Categories
    console.log('Seeding categories...');
    const catElectronics = crypto.randomUUID();
    const catApparel = crypto.randomUUID();
    const catFootwear = crypto.randomUUID();
    const catAccessories = crypto.randomUUID();

    await connection.execute(`
      INSERT INTO categories (id, parent_id, name, slug, featured, visible) VALUES 
      (?, NULL, 'Electronics', 'electronics', 1, 1),
      (?, NULL, 'Apparel', 'apparel', 1, 1),
      (?, ?, 'Footwear', 'footwear', 1, 1),
      (?, NULL, 'Accessories', 'accessories', 0, 1)
    `, [catElectronics, catApparel, catApparel, catFootwear, catAccessories]);

    // 6. Seed Brands
    console.log('Seeding brands...');
    const brandApple = crypto.randomUUID();
    const brandNike = crypto.randomUUID();
    const brandSony = crypto.randomUUID();

    await connection.execute(`
      INSERT INTO brands (id, name, slug, logo_url, featured, status) VALUES 
      (?, 'Apple Inc.', 'apple', 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=256', 1, 'ACTIVE'),
      (?, 'Nike', 'nike', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=256', 1, 'ACTIVE'),
      (?, 'Sony', 'sony', 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=256', 0, 'ACTIVE')
    `, [brandApple, brandNike, brandSony]);

    // 7. Seed Products
    console.log('Seeding products...');
    const prodiPhone = crypto.randomUUID();
    const prodNikeShoe = crypto.randomUUID();
    const prodSonyHeadphone = crypto.randomUUID();

    await connection.execute(`
      INSERT INTO products (id, brand_id, name, slug, description, price, sale_price, sku, barcode, featured, status) VALUES 
      (?, ?, 'iPhone 15 Pro Max', 'iphone-15-pro-max', 'Experience the titanium design, spatial video capture, and the powerful A17 Pro chip.', 1199.00, 1099.00, 'IPHONE15PM-001', '190199000123', 1, 'PUBLISHED'),
      (?, ?, 'Nike Air Max Running Shoes', 'nike-air-max-running', 'Engineered mesh upper, revolutionary dual-pressure Air unit, and max comfort cushioning.', 180.00, 149.99, 'NIKE-AM-002', '887223000456', 1, 'PUBLISHED'),
      (?, ?, 'Sony WH-1000XM5 Wireless Headphones', 'sony-wh1000xm5', 'Industry leading noise cancellation, crystal clear hands-free calling, and 30-hour battery life.', 398.00, 348.00, 'SONY-XM5-003', '454873613000', 0, 'PUBLISHED')
    `, [prodiPhone, brandApple, prodNikeShoe, brandNike, prodSonyHeadphone, brandSony]);

    // Link Products to Categories
    await connection.execute(`
      INSERT INTO product_categories (product_id, category_id) VALUES 
      (?, ?),
      (?, ?),
      (?, ?)
    `, [prodiPhone, catElectronics, prodNikeShoe, catFootwear, prodSonyHeadphone, catElectronics]);

    // Seed Product Images
    console.log('Seeding product images...');
    await connection.execute(`
      INSERT INTO product_images (id, product_id, url, sort_order) VALUES 
      (?, ?, 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?q=80&w=600', 0),
      (?, ?, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600', 0),
      (?, ?, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600', 0)
    `, [crypto.randomUUID(), prodiPhone, crypto.randomUUID(), prodNikeShoe, crypto.randomUUID(), prodSonyHeadphone]);

    // Seed Product Attributes and Values
    console.log('Seeding attributes...');
    const attrColorId = crypto.randomUUID();
    const attrSizeId = crypto.randomUUID();

    await connection.execute(`
      INSERT INTO product_attributes (id, product_id, name) VALUES 
      (?, ?, 'Color'),
      (?, ?, 'Size')
    `, [attrColorId, prodNikeShoe, attrSizeId, prodNikeShoe]);

    const valBlack = crypto.randomUUID();
    const valWhite = crypto.randomUUID();
    const valSize10 = crypto.randomUUID();

    await connection.execute(`
      INSERT INTO attribute_values (id, attribute_id, value) VALUES 
      (?, ?, 'Space Black'),
      (?, ?, 'Titanium White'),
      (?, ?, 'US 10')
    `, [valBlack, attrColorId, valWhite, attrColorId, valSize10, attrSizeId]);

    // Seed Product Variants
    console.log('Seeding variants...');
    const varIPhoneBlack = crypto.randomUUID();
    const varIPhoneWhite = crypto.randomUUID();
    const varNikeShoe10 = crypto.randomUUID();
    const varSonyXM5 = crypto.randomUUID();

    await connection.execute(`
      INSERT INTO product_variants (id, product_id, sku, price, sale_price, stock) VALUES 
      (?, ?, 'IPHONE15PM-BLK', 1199.00, 1099.00, 50),
      (?, ?, 'IPHONE15PM-WHT', 1199.00, 1099.00, 30),
      (?, ?, 'NIKE-AM-BLK-10', 180.00, 149.99, 100),
      (?, ?, 'SONY-XM5-SLV', 398.00, 348.00, 75)
    `, [varIPhoneBlack, prodiPhone, varIPhoneWhite, prodiPhone, varNikeShoe10, prodNikeShoe, varSonyXM5, prodSonyHeadphone]);

    // Map Variant Attribute Values
    await connection.execute(`
      INSERT INTO variant_attribute_values (variant_id, attribute_value_id) VALUES 
      (?, ?),
      (?, ?)
    `, [varNikeShoe10, valBlack, varNikeShoe10, valSize10]);

    // 8. Seed Warehouses & Inventory
    console.log('Seeding warehouses and inventory logs...');
    const warehouseSF = crypto.randomUUID();
    await connection.execute(`
      INSERT INTO warehouses (id, name, location) VALUES 
      (?, 'San Francisco Main Depot', 'Pier 39, San Francisco, CA')
    `, [warehouseSF]);

    const inviPhoneBlack = crypto.randomUUID();
    const inviPhoneWhite = crypto.randomUUID();
    const invNikeShoe = crypto.randomUUID();
    const invSonyXM5 = crypto.randomUUID();

    await connection.execute(`
      INSERT INTO inventories (id, product_variant_id, warehouse_id, quantity, purchase_price, selling_price, batch_number) VALUES 
      (?, ?, ?, 50, 750.00, 1099.00, 'B-IPHONE-001'),
      (?, ?, ?, 30, 750.00, 1099.00, 'B-IPHONE-002'),
      (?, ?, ?, 100, 90.00, 149.99, 'B-NIKE-043'),
      (?, ?, ?, 75, 210.00, 348.00, 'B-SONY-998')
    `, [inviPhoneBlack, varIPhoneBlack, warehouseSF, inviPhoneWhite, varIPhoneWhite, warehouseSF, invNikeShoe, varNikeShoe10, warehouseSF, invSonyXM5, varSonyXM5, warehouseSF]);

    // Seed Stock Logs
    await connection.execute(`
      INSERT INTO stock_logs (id, inventory_id, type, quantity, reason) VALUES 
      (?, ?, 'IN', 50, 'Initial procurement import'),
      (?, ?, 'IN', 30, 'Initial procurement import'),
      (?, ?, 'IN', 100, 'Initial procurement import'),
      (?, ?, 'IN', 75, 'Initial procurement import')
    `, [crypto.randomUUID(), inviPhoneBlack, crypto.randomUUID(), inviPhoneWhite, crypto.randomUUID(), invNikeShoe, crypto.randomUUID(), invSonyXM5]);

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
      (?, 'Introducing iPhone 15 Pro', 'Titanium design, ultimate A17 Pro chip.', 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?q=80&w=1200', '/products/iphone-15-pro-max', 'ACTIVE')
    `, [crypto.randomUUID()]);

    await connection.execute(`
      INSERT INTO pages (id, title, slug, content) VALUES 
      (?, 'Terms and Conditions', 'terms', '<h1>Terms of Service</h1><p>Welcome to Shopora. By using our site, you agree to these terms.</p>'),
      (?, 'Privacy Policy', 'privacy', '<h1>Privacy Policy</h1><p>Your privacy is important to us. Here is how we safeguard your information.</p>')
    `, [crypto.randomUUID(), crypto.randomUUID()]);

    await connection.execute(`
      INSERT INTO faqs (id, question, answer, sort_order) VALUES 
      (?, 'What is your shipping policy?', 'We ship worldwide with transit times of 3-5 business days.', 0),
      (?, 'What is the return policy?', 'You can return any unused items within 30 days of purchase.', 1)
    `, [crypto.randomUUID(), crypto.randomUUID()]);

    // Re-enable foreign key checks
    await connection.execute('SET FOREIGN_KEY_CHECKS = 1');
    console.log('Database seeded successfully with all modules!');

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
