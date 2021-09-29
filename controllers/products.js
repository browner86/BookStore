// const products = [];
const Product = require('../models/product')
exports.getAddProduct = (req, res, next) => {
    res.render('add-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        formsCSS: true,
        productCSS: true,
        activeAddProduct: true
    });
};

exports.postAddProduct = (req, res, next) => {
    // products.push({ title: 
    //                 ,price: req.body.price
    //                 ,description: req.body.description
    //                 ,ratings: req.body.ratings  });
    const product = new Product(req.body.title
        , req.body.price
        , req.body.description
        , req.body.ratings);
    product.save();

    res.redirect('/');
};

exports.getProducts = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render('shop', {
            prods: products,
            pageTitle: 'Shop',
            path: '/',
            hasProducts: products.length > 0,
            activeShop: true,
            productCSS: true
        });
    });
};