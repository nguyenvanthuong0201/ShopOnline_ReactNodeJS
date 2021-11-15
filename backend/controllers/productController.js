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
    const resultPerPage = 8;
    const productsCount = await Product.countDocuments(); // đém bao nhiêu product

    const apiFeature = new ApiFeatures(Product.find(), req.query)
        .search() // search product
        .filter() // filter các fields của product
        // .pagination(resultPerPage) // phân trang product
    // const products = await Product.find(); // tìm tất cả các product

    let products = await apiFeature.query;

    let filteredProductsCount = products.length;
  
    apiFeature.pagination(resultPerPage);
  
    products = await apiFeature.query.clone();

    res.status(200).json({ message: true, products, productsCount, resultPerPage, filteredProductsCount });
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

// create new review or update the review
exports.createProductReview = catchAsyncError(async (req, res, next) => {
    const { rating, comment, productId } = req.body;
    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating), // Ép kiểu về number
        comment,
    }
    const product = await Product.findById(productId);

    const isReviewed = product.reviews.find(rev => rev.user.toString() === req.user._id.toString())
    // nếu đã review thì sẽ ko review thêm nữa
    if (isReviewed) {
        product.reviews.forEach(rev => {
            if (rev.user.toString() === req.user._id.toString())
                (rev.rating = rating), (rev.comment = comment)
        });
    } else {
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;
    }

    // add ratings --- tổng số ratings chia cho số lần review = 
    let avg = 0;
    product.reviews.forEach(rev => {
        avg += rev.rating;
    })
    product.ratings = avg / product.reviews.length;

    await product.save({ validateBeforeSave: false });
    res.status(200).json({
        success: true
    })
})

// get all review of 1 product 
exports.getProductReview = catchAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.query.id);

    if (!product) {
        return next(new ErrorHandler("Product not found", 404))
    }
    res.status(200).json({
        success: true,
        reviews: product.reviews,
    });
})

// delete review  --- không xóa hẳng mà chỉ update trong 1 array
exports.DeleteProductReview = catchAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.query.productId);

    if (!product) {
        return next(new ErrorHandler("Product not found", 404))
    }
    // filter lấy những object nào không trùng với _id(review)
    const reviews = product.reviews.filter(rev => rev._id.toString() !== req.query.id.toString())

    let avg = 0;

    reviews.forEach(rev => {
        avg += rev.rating;
    })
    const ratings = avg / reviews.length;

    const numOfReviews = reviews.length;

    await Product.findByIdAndUpdate(req.query.productId, {
        reviews,
        ratings,
        numOfReviews,
    }, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    res.status(200).json({
        success: true,
    });
})


