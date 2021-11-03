import React, { Fragment, useEffect } from "react";
import { CgMouse } from "react-icons/all";
import "./Home.css";
import Product from "./Product";
import MetaData from "../layout/MetaData";
import { getProduct } from "../../actions/productAction";
import { useSelector, useDispatch } from "react-redux";

const product = {
  name: "Blue T-shirt",
  images: [
    {
      url: "https://scontent.fsgn2-6.fna.fbcdn.net/v/t39.30808-6/249008519_4510968752318524_3453264428469357926_n.jpg?_nc_cat=110&ccb=1-5&_nc_sid=730e14&_nc_ohc=Wn-s4DwAjF0AX8sEMMD&_nc_ht=scontent.fsgn2-6.fna&oh=2043914eea2aeeecd7d219d7e70a6d29&oe=61871C31",
    },
  ],
  price: "200K",
  _id: "aadsad",
};

function Home() {
  const dispatch = useDispatch();

  useEffect(() => {
    console.log(`hello`);
    dispatch(getProduct());
  }, [dispatch]);

  return (
    <Fragment>
      <MetaData title="Home" />
      <div className="banner">
        <p>Welcome to Ecommerce</p>
        <h1>FIND AMAZING PRODUCT BELOW</h1>
        <a href="#container">
          <button>
            Scroll
            <CgMouse />
          </button>
        </a>
      </div>
      <h2 className="homeHeading">Featured product</h2>
      <div className="container" id="container">
        <Product product={product} />
        <Product product={product} />
        <Product product={product} />
        <Product product={product} />
      </div>
    </Fragment>
  );
}

export default Home;
