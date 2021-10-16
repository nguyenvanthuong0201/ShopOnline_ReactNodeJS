const Product = require("../models/productModel");

// create Product
exports.createProduct = async (req, res, next) => {
    const product = await Product.create(req.body); // Tạo ra 1 product mới 
    res.status(201).json({ success: true, product });
};

// get all product
exports.getAllProduct = async (req, res) => {
    const products = await Product.find(); // tìm tất cả các product
    res.status(200).json({ message: true, products });
};

// update product --only Admin
exports.updateProduct = async(req,res,next)=>{
    let product = Product.findById(req.params.id);
    if(!product){
        return res.status(500).json({success:false,message:"Product not found"})
    }
    product = await Product.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    })
    res.status(200).json({success:true,product})
}
