import React from 'react'
import { Link } from 'react-router-dom'
import ReactStars from "react-rating-stars-component"

const options={
    edit:false,
    readOnly: true,
    precision: 0.5,
}

function Product({product}) {

    return (
        <Link className="productCard" to={product._id}>
            <img src={product.images[0].url} alt={product.name}/>
            <p>{product.name}</p>
            <p>{product.price}</p>
            <div>
                <ReactStars {...options}/> <span>(256 Reviews)</span>
            </div>
        </Link>
    )
}

export default Product
