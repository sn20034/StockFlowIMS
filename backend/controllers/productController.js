import Product from '../models/Product.js';
import { sendResponse, sendError } from '../utils/response.js';

const buildQuery = (req) => {
  const { search, category, supplier, stockStatus, minPrice, maxPrice } = req.query;
  const q = {};
  if (search) {
    q.$or = [
      { name: { $regex: search, $options: 'i' } },
      { sku: { $regex: search, $options: 'i' } },
    ];
  }
  if (category) q.category = category;
  if (supplier) q.supplier = supplier;
  if (minPrice || maxPrice) {
    q.unitPrice = {};
    if (minPrice) q.unitPrice.$gte = Number(minPrice);
    if (maxPrice) q.unitPrice.$lte = Number(maxPrice);
  }
  return q;
};

const applyStockStatusFilter = (query, stockStatus) => {
  if (!stockStatus) return query;
  if (stockStatus === 'out') query.where('quantity').lte(0);
  else if (stockStatus === 'low') query.where('quantity').gt(0).lt('$reorderThreshold');
  else if (stockStatus === 'in') query.where('quantity').gte('$reorderThreshold');
  return query;
};

export const getProducts = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, parseInt(req.query.limit) || 10);
    const sort = req.query.sort || 'createdAt';
    const order = req.query.order === 'desc' ? -1 : 1;
    const baseQuery = buildQuery(req);

    if (req.query.stockStatus) {
      const s = req.query.stockStatus;
      if (s === 'out') {
        baseQuery.quantity = { $lte: 0 };
      } else if (s === 'low') {
        baseQuery.$and = [
          { quantity: { $gt: 0 } },
          { $expr: { $lt: ['$quantity', '$reorderThreshold'] } },
        ];
      } else if (s === 'in') {
        baseQuery.$expr = { $gte: ['$quantity', '$reorderThreshold'] };
      }
    }

    const query = Product.find(baseQuery)
      .populate('category', 'name')
      .populate('supplier', 'name')
      .sort({ [sort]: order })
      .skip((page - 1) * limit)
      .limit(limit);

    const products = await query.exec();
    const total = await Product.countDocuments(baseQuery);

    return sendResponse(res, {
      data: {
        items: products,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit) || 1,
        },
      },
      message: 'Products fetched',
    });
  } catch (err) {
    next(err);
  }
};

export const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name').populate('supplier', 'name');
    if (!product) return sendError(res, 'Product not found', 404);
    return sendResponse(res, { data: product, message: 'Product fetched' });
  } catch (err) {
    next(err);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    await product.populate('category', 'name');
    await product.populate('supplier', 'name');
    return sendResponse(res, { statusCode: 201, data: product, message: 'Product created' });
  } catch (err) {
    next(err);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('category', 'name').populate('supplier', 'name');
    if (!product) return sendError(res, 'Product not found', 404);
    return sendResponse(res, { data: product, message: 'Product updated' });
  } catch (err) {
    next(err);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return sendError(res, 'Product not found', 404);
    return sendResponse(res, { message: 'Product deleted' });
  } catch (err) {
    next(err);
  }
};

export const getLowStock = async (req, res, next) => {
  try {
    const products = await Product.find({ $expr: { $lt: ['$quantity', '$reorderThreshold'] } })
      .populate('category', 'name')
      .populate('supplier', 'name')
      .sort({ quantity: 1 });
    return sendResponse(res, { data: products, message: 'Low stock products' });
  } catch (err) {
    next(err);
  }
};
