const Category = require("../models/category");

exports.getCategoryById = (req, res, next, id) => {
  Category.findById(id).exec((err, category) => {
    if (err || !category) {
      return res.status(400).json({
        error: "Category not found in DB",
      });
    }

    req.category = category;
    next();
  });
};

exports.createCategory = (req, res) => {
  const category = new Category(req.body);
  if (category.name.length < 3) {
    return res.status(400).json({
      error: "Category name should be atleast 3 characters long",
    });
  }

  category.save((err, category) => {
    if (err || !category) {
      return res.status(400).json({
        error: "Not able to save category in DB",
      });
    }

    res.json({ category });
  });
};

exports.getCategory = (req, res) => {
  return res.json(req.category);
};

exports.getAllCategory = (req, res) => {
  Category.find().exec((err, categories) => {
    if (err || !categories) {
      return res.status(400).json({
        error: "No category found",
      });
    }

    res.json(categories);
  });
};

exports.updateCategory = (req, res) => {
  const category = req.category;
  category.name = req.body.name;
  category.save((err, updatedCategory) => {
    if (err || !updatedCategory) {
      return res.status(400).json({
        error: "Not able to update category in DB",
      });
    }

    res.json(updatedCategory);
  });
};

exports.removeCategory = (req, res) => {
  const category = req.category;
  category.remove((err, category) => {
    if (err || !category) {
      return res.status(400).json({
        error: "Not able to delete category in DB",
      });
    }

    res.json({
      message: `Successfully deleted this ${category.name}`,
    });
  });
};
