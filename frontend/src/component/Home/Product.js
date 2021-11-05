import React from "react";
import { Link } from "react-router-dom";
import ReactStars from "react-rating-stars-component";

function Product({ product }) {
  const options = {
    edit: false,
    readOnly: true,
    precision: 0.5,
    color: "rgba(20,20,20,0.1)",
    size: window.innerWidth < 600 ? 20 : 25,
    value: product.ratings,
    isHalf: true,
  };

  return (
    <Link className="productCard" to={`/product/${product._id}`}>
      <img src={product.images[0].url} alt={product.name} />
      <p>{product.name}</p>
      <p>{`${product.price} VNĐ`}</p>
      <div>
        <ReactStars {...options} /> <span>{product.numOfReviews}</span>
      </div>
    </Link>
  );
}

export default Product;
