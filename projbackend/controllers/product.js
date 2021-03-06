const Product = require("../models/product");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");

exports.getProductById = (req, res, next, id) => {
    Product.findById(id)
        .populate("category")
        .exec((err, product) => {
            if (err && !product) {
                return res.status(400).json({
                    error: "Product not found"
                })
            }

            req.product = product;
            next();
        })
}

exports.createProduct = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, (err, fields, file) => {
        if (err) {
            return res.status(400).json({
                error: "problem with image"
            })
        }

        // destruct the fields
        const { name, description, price, category, stock } = fields;

        if (!name || !description || !price || !category || !stock) {
            return res.status(400).json({
                error: "please include all fields"
            })
        }

        let product = new Product(fields);

        // handle file here
        if (file.photo) {
            if (file.photo.size > 3000000) {
                return res.status(400).json({
                    error: "image size too large"
                })
            }

            product.photo.data = fs.readFileSync(file.photo.path);
            product.photo.contentType = file.photo.type;
        }

        // save to DB
        product.save((err, product) => {
            if (err) {
                return res.status(400).json({
                    error: "saving tshirt in DB failed"
                })
            }

            res.json(product);
        });
    })
}

exports.getProduct = (req, res) => {
    req.product.photo = undefined;
    return res.json(req.product);
}

// middle ware
exports.photo = (req, res, next) => {
    if (req.product.photo.data) {
        res.set("Content-Type", req.product.photo.contentType);
        return res.send(req.product.photo.data)
    }

    next();
}

// delete controller
exports.deleteProduct = (req, res) => {
    let product = req.product;
    product.remove((err, deletedProduct) => {
        if (err) {
            return res.status(400).json({
                error: "Failed to delete the product"
            })
        }

        res.json({
            message: "Deleted Successfully",
            deletedProduct
        })
    })
}

// update constroller   
exports.updateProduct = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, (err, fields, file) => {
        if (err) {
            return res.status(400).json({
                error: "problem with image"
            })
        }

        // updation code
        let product = req.product;
        product = _.extend(product, fields)

        // handle file here
        if (file.photo) {
            if (file.photo.size > 3000000) {
                return res.status(400).json({
                    error: "image size too large"
                })
            }

            product.photo.data = fs.readFileSync(file.photo.path);
            product.photo.contentType = file.photo.type;
        }

        // save to DB
        product.save((err, product) => {
            if (err) {
                return res.status(400).json({
                    error: "update tshirt in DB failed"
                })
            }

            res.json(product);
        });
    })
}

// listing of all products
exports.getAllProducts = (req, res) => {
    let limit = req.query.limit ? parseInt(req.query.limit) : 8;
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id";

    Product.find()
        .select("-photo")
        .sort([[sortBy, "asc"]])
        .limit(limit)
        .exec((err, products) => {
            if (err) {
                return res.status(400).json({
                    error: "NO product found"
                })
            }

            res.json(products);
        })
}

exports.updateStock = (req, res, next) => {

    let myOperations = req.body.order.products.map(prod => {
        return {
            updateOne: {
                filter: { _id: prod.id },
                update: { $inc: { stock: -prod.count, sold: +prod.count } }
            }
        }
    })

    Product.bulkWrite(myOperations, {}, (err, products) => {
        if (err) {
            return res.status(400).json({
                error: "Bulk operations failed"
            })
        }
        next();
    });
}

exports.getUniqueCategories = (req, res) => {
    Product.distinct("category", {}, (err, category) => {
        if (err) {
            return res.status(400).json({
                error: "No category found"
            })
        }

        res.json(category);
    })
}