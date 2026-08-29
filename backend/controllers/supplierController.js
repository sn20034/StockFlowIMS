import Supplier from '../models/Supplier.js';
import Product from '../models/Product.js';
import { sendResponse, sendError } from '../utils/response.js';

export const getSuppliers = async (req, res, next) => {
  try {
    const suppliers = await Supplier.find().sort({ name: 1 });
    const withCounts = await Promise.all(
      suppliers.map(async (s) => {
        const count = await Product.countDocuments({ supplier: s._id });
        return { ...s.toObject(), productCount: count };
      })
    );
    return sendResponse(res, { data: withCounts, message: 'Suppliers fetched' });
  } catch (err) {
    next(err);
  }
};

export const getSupplier = async (req, res, next) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) return sendError(res, 'Supplier not found', 404);
    return sendResponse(res, { data: supplier, message: 'Supplier fetched' });
  } catch (err) {
    next(err);
  }
};

export const createSupplier = async (req, res, next) => {
  try {
    const supplier = await Supplier.create(req.body);
    return sendResponse(res, { statusCode: 201, data: supplier, message: 'Supplier created' });
  } catch (err) {
    next(err);
  }
};

export const updateSupplier = async (req, res, next) => {
  try {
    const supplier = await Supplier.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!supplier) return sendError(res, 'Supplier not found', 404);
    return sendResponse(res, { data: supplier, message: 'Supplier updated' });
  } catch (err) {
    next(err);
  }
};

export const deleteSupplier = async (req, res, next) => {
  try {
    const productCount = await Product.countDocuments({ supplier: req.params.id });
    if (productCount > 0) {
      return sendError(res, `Cannot delete: ${productCount} product(s) use this supplier`, 400);
    }
    const supplier = await Supplier.findByIdAndDelete(req.params.id);
    if (!supplier) return sendError(res, 'Supplier not found', 404);
    return sendResponse(res, { message: 'Supplier deleted' });
  } catch (err) {
    next(err);
  }
};
