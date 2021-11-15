import React, { Fragment, useEffect, useState } from 'react'
import { clearErrors, getProduct } from "../../actions/productAction";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../layout/Loader/Loader";
import { useAlert } from "react-alert";
import ProductCard from "../Home/ProductCard"
import './Products.css';
import Pagination from 'react-js-pagination';
import Slider from '@material-ui/core/Slider';
import Typography from '@material-ui/core/Typography';
import MetaData from '../layout/MetaData';

const categories = [
    "QUAN",
    "AO",
    "GIAY",
    "PHUKIEN",
    "BLABLA",
]


const Products = ({ match }) => {
    const dispatch = useDispatch();
    const alert = useAlert()
    const [currentPage, setCurrentPage] = useState(1)
    const [price, setPrice] = useState([0, 250000])
    const [category, setCategory] = useState("")
    const [ratings, setRatings] = useState(0);

    const { products, loading, error, productsCount, resultPerPage, filteredProductsCount } = useSelector(state => state.products)
    const keyword = match.params.keyword;

    useEffect(() => {
        if (error) {
            alert.error(error)
            dispatch(clearErrors())
        }
        dispatch(getProduct(keyword, currentPage, price, category, ratings))
    }, [dispatch, error, alert, keyword, currentPage, price, category, ratings])

    const setCurrentPageNo = (e) => {
        setCurrentPage(e)
    }

    const priceHandler = (e, newPrice) => {
        setPrice(newPrice)
    }
    let count = filteredProductsCount
    return (
        <Fragment>
            {loading ? <Loader /> : (
                <Fragment>
                    <MetaData title="Products" />
                    <h2 className="productsHeading">Products</h2>
                    <div className="products">
                        {products && products.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                    <div className="filterBox">
                        <Typography>
                            Price
                            <Slider
                                value={price}
                                onChange={priceHandler}
                                valueLabelDisplay="auto"
                                getAriaLabel={() => 'range-slider'}
                                min={0}
                                max={250000}
                                step={10000}
                            />

                            <Typography>Categories</Typography>
                            <ul className="categoryBox">
                                <li
                                    className="category-link"
                                    onClick={() => setCategory(null)}
                                >
                                    All
                                </li>
                                {categories.map((category) => (
                                    <li
                                        className="category-link"
                                        key={category}
                                        onClick={() => setCategory(category)}
                                    >
                                        {category}
                                    </li>
                                ))}
                            </ul>
                            <fieldset>
                                <Typography component="legend" >Ratings above</Typography>
                                <Slider
                                    value={ratings}
                                    onChange={(e, newRatings) => {
                                        setRatings(newRatings)
                                    }}
                                    getAriaLabel={() => "continuous-slider"}
                                    valueLabelDisplay="auto"
                                    min={0}
                                    max={5}
                                />
                            </fieldset>

                        </Typography>
                    </div>
                    {resultPerPage < count && (
                        <div className="paginationBox">
                            <Pagination
                                activePage={currentPage}
                                itemsCountPerPage={resultPerPage}
                                totalItemsCount={productsCount}
                                onChange={setCurrentPageNo}
                                nextPageText="Next"
                                prevPageText="Prev"
                                firstPageText="1st"
                                lastPageText="Last"
                                itemClass="page-item"
                                linkClass="page-link"
                                activeClass="pageItemActive"
                                activeLinkClass="pageLinkActive"
                            />
                        </div>
                    )}
                </Fragment>
            )}
        </Fragment>
    )
}

export default Products
