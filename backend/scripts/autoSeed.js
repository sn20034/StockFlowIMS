import User from '../models/User.js';
import Category from '../models/Category.js';
import Supplier from '../models/Supplier.js';
import Product from '../models/Product.js';
import Transaction from '../models/Transaction.js';

export const autoSeed = async () => {
  const count = await User.countDocuments();
  if (count > 0) return false;

  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@stockflow.com',
    password: 'password123',
    role: 'admin',
  });
  const staff = await User.create({
    name: 'Staff User',
    email: 'staff@stockflow.com',
    password: 'password123',
    role: 'staff',
  });

  const categories = await Category.insertMany([
    { name: 'Electronics', description: 'Electronic devices and accessories' },
    { name: 'Office Supplies', description: 'General office consumables' },
    { name: 'Furniture', description: 'Office and warehouse furniture' },
    { name: 'Packaging', description: 'Boxes, wraps and packing materials' },
    { name: 'Tools', description: 'Hand and power tools' },
  ]);

  const suppliers = await Supplier.insertMany([
    { name: 'TechSource Inc.', contactPerson: 'Alice Johnson', email: 'alice@techsource.com', phone: '+1-555-0101', address: '120 Innovation Dr, San Jose, CA' },
    { name: 'Global Supplies Co.', contactPerson: 'Bob Smith', email: 'bob@globalsupplies.com', phone: '+1-555-0102', address: '45 Commerce St, Chicago, IL' },
    { name: 'Premier Furnishings', contactPerson: 'Carol White', email: 'carol@premierfurn.com', phone: '+1-555-0103', address: '78 Oak Ave, Austin, TX' },
    { name: 'BoxMart Packaging', contactPerson: 'Dan Lee', email: 'dan@boxmart.com', phone: '+1-555-0104', address: '9 Industrial Rd, Newark, NJ' },
  ]);

  const productData = [
    { name: 'Wireless Mouse', sku: 'ELEC-001', category: 0, supplier: 0, quantity: 45, unitPrice: 25.99, reorderThreshold: 15, description: 'Ergonomic wireless mouse' },
    { name: 'Mechanical Keyboard', sku: 'ELEC-002', category: 0, supplier: 0, quantity: 8, unitPrice: 89.99, reorderThreshold: 10, description: 'RGB mechanical keyboard' },
    { name: 'USB-C Hub', sku: 'ELEC-003', category: 0, supplier: 0, quantity: 0, unitPrice: 39.99, reorderThreshold: 12, description: '7-in-1 USB-C hub' },
    { name: 'A4 Paper Ream', sku: 'OFF-001', category: 1, supplier: 1, quantity: 120, unitPrice: 5.5, reorderThreshold: 30, description: '500-sheet A4 paper ream' },
    { name: 'Ballpoint Pens (50pk)', sku: 'OFF-002', category: 1, supplier: 1, quantity: 18, unitPrice: 12.0, reorderThreshold: 20, description: 'Blue ballpoint pens, pack of 50' },
    { name: 'Stapler Heavy Duty', sku: 'OFF-003', category: 1, supplier: 1, quantity: 35, unitPrice: 18.5, reorderThreshold: 10, description: 'Heavy-duty desktop stapler' },
    { name: 'Office Chair', sku: 'FUR-001', category: 2, supplier: 2, quantity: 22, unitPrice: 149.0, reorderThreshold: 8, description: 'Ergonomic mesh office chair' },
    { name: 'Standing Desk', sku: 'FUR-002', category: 2, supplier: 2, quantity: 5, unitPrice: 399.0, reorderThreshold: 6, description: 'Adjustable height standing desk' },
    { name: 'Filing Cabinet', sku: 'FUR-003', category: 2, supplier: 2, quantity: 14, unitPrice: 129.0, reorderThreshold: 5, description: '4-drawer filing cabinet' },
    { name: 'Cardboard Box (M)', sku: 'PKG-001', category: 3, supplier: 3, quantity: 300, unitPrice: 1.2, reorderThreshold: 100, description: 'Medium cardboard shipping box' },
    { name: 'Bubble Wrap Roll', sku: 'PKG-002', category: 3, supplier: 3, quantity: 40, unitPrice: 15.0, reorderThreshold: 25, description: '100ft bubble wrap roll' },
    { name: 'Cordless Drill', sku: 'TOL-001', category: 4, supplier: 0, quantity: 12, unitPrice: 79.99, reorderThreshold: 5, description: '20V cordless drill kit' },
    { name: 'Screwdriver Set', sku: 'TOL-002', category: 4, supplier: 1, quantity: 3, unitPrice: 24.99, reorderThreshold: 8, description: '32-piece screwdriver set' },
    { name: 'LED Monitor 24"', sku: 'ELEC-004', category: 0, supplier: 0, quantity: 28, unitPrice: 199.0, reorderThreshold: 10, description: '24-inch Full HD monitor' },
    { name: 'Webcam HD', sku: 'ELEC-005', category: 0, supplier: 0, quantity: 9, unitPrice: 59.99, reorderThreshold: 12, description: '1080p HD webcam' },
  ];

  const products = await Product.insertMany(
    productData.map((p) => ({
      ...p,
      category: categories[p.category]._id,
      supplier: suppliers[p.supplier]._id,
    }))
  );

  const txData = [
    { productIdx: 0, type: 'in', quantity: 50, user: admin, daysAgo: 25, notes: 'Initial stock' },
    { productIdx: 0, type: 'out', quantity: 5, user: staff, daysAgo: 20, notes: 'Sales order #1001' },
    { productIdx: 1, type: 'in', quantity: 20, user: admin, daysAgo: 18, notes: 'Restock' },
    { productIdx: 1, type: 'out', quantity: 12, user: staff, daysAgo: 10, notes: 'Sales order #1002' },
    { productIdx: 3, type: 'in', quantity: 150, user: admin, daysAgo: 15, notes: 'Bulk purchase' },
    { productIdx: 3, type: 'out', quantity: 30, user: staff, daysAgo: 5, notes: 'Office use' },
    { productIdx: 6, type: 'in', quantity: 25, user: admin, daysAgo: 12, notes: 'Furniture order' },
    { productIdx: 6, type: 'out', quantity: 3, user: staff, daysAgo: 3, notes: 'New workstation setup' },
    { productIdx: 9, type: 'in', quantity: 400, user: admin, daysAgo: 8, notes: 'Packaging restock' },
    { productIdx: 11, type: 'in', quantity: 15, user: admin, daysAgo: 6, notes: 'Tool inventory' },
    { productIdx: 11, type: 'out', quantity: 3, user: staff, daysAgo: 2, notes: 'Maintenance use' },
    { productIdx: 13, type: 'in', quantity: 30, user: admin, daysAgo: 4, notes: 'Monitor restock' },
    { productIdx: 14, type: 'in', quantity: 15, user: admin, daysAgo: 3, notes: 'Webcam stock' },
    { productIdx: 14, type: 'out', quantity: 6, user: staff, daysAgo: 1, notes: 'Sales order #1003' },
  ];

  await Transaction.insertMany(
    txData.map((t) => ({
      product: products[t.productIdx]._id,
      type: t.type,
      quantity: t.quantity,
      user: t.user._id,
      notes: t.notes,
      createdAt: new Date(Date.now() - t.daysAgo * 24 * 60 * 60 * 1000),
    }))
  );

  console.log('Auto-seed complete. Admin: admin@stockflow.com / Staff: staff@stockflow.com (password: password123)');
  return true;
};
