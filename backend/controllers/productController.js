const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler"); // customer lại báo lỗi
const catchAsyncError = require("../middleware/catchAsyncError"); // Báo lỗi nhưng chương trình vẫn tiếp tục run
const ApiFeatures = require("../utils/apiFeature");

// create Product --Admin
exports.createProduct = catchAsyncError(async (req, res, next) => {
    //req.user.id nhận từ cookie sau khi đăng nhập
    req.body.user = req.user.id

    const product = await Product.create(req.body); // Tạo ra 1 product mới 
    res.status(201).json({ success: true, product });
});

// get all product
exports.getAllProduct = catchAsyncError(async (req, res) => {
    const resultPerPage = 5;
    const productCount = await Product.countDocuments(); // đém bao nhiêu product

    const apiFeature = new ApiFeatures(Product.find(), req.query)
        .search() // search product
        .filter() // filter các fields của product
        .pagination(resultPerPage) // phân trang product
    // const products = await Product.find(); // tìm tất cả các product
    const products = await apiFeature.query;
    res.status(200).json({ message: true, products ,productCount});
});

// update product --only Admin
exports.updateProduct = catchAsyncError(async (req, res, next) => {
    let product = await Product.findById(req.params.id);
    if (!product) {
        return next(new ErrorHandler("Product not found", 404))
    }
    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })
    res.status(200).json({ success: true, product })
})

// get  product details 
exports.getProductDetails = catchAsyncError(async (req, res, next) => {
    let product = await Product.findById(req.params.id);
    if (!product) {
        return next(new ErrorHandler("Product not found", 404))
    }
    res.status(200).json({ success: true, product })
})

// delete product 
exports.deleteProduct = catchAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        return next(new ErrorHandler("Product not found", 404))
    }
    await product.remove();
    res.status(200).json({ success: true, message: "product delete successfully" });
})
