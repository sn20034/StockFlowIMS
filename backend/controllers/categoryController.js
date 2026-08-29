import Category from '../models/Category.js';
import Product from '../models/Product.js';
import { sendResponse, sendError } from '../utils/response.js';

export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    const withCounts = await Promise.all(
      categories.map(async (c) => {
        const count = await Product.countDocuments({ category: c._id });
        return { ...c.toObject(), productCount: count };
      })
    );
    return sendResponse(res, { data: withCounts, message: 'Categories fetched' });
  } catch (err) {
    next(err);
  }
};

export const getCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return sendError(res, 'Category not found', 404);
    return sendResponse(res, { data: category, message: 'Category fetched' });
  } catch (err) {
    next(err);
  }
};

export const createCategory = async (req, res, next) => {
  try {
    const category = await Category.create(req.body);
    return sendResponse(res, { statusCode: 201, data: category, message: 'Category created' });
  } catch (err) {
    next(err);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!category) return sendError(res, 'Category not found', 404);
    return sendResponse(res, { data: category, message: 'Category updated' });
  } catch (err) {
    next(err);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const productCount = await Product.countDocuments({ category: req.params.id });
    if (productCount > 0) {
      return sendError(res, `Cannot delete: ${productCount} product(s) use this category`, 400);
    }
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return sendError(res, 'Category not found', 404);
    return sendResponse(res, { message: 'Category deleted' });
  } catch (err) {
    next(err);
  }
};
