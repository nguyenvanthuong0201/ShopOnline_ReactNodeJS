import "./App.css";
import { Header } from "./component/layout/Header/Header";
import { Footer } from "./component/layout/Footer/Footer";
import { BrowserRouter as Router, Route } from "react-router-dom";
import WebFont from "webfontloader";
import React, { useEffect } from "react";
import Home from "./component/Home/Home";
import ProductDetails from "./component/Product/ProductDetails";
import Products from "./component/Product/Products";
import Search from "./component/Product/Search";
import LoginSignUp from "./component/User/LoginSignUp";
import store from "./store"
import { loadUser } from "./actions/userAction";
import UserOptions from "./component/layout/Header/UserOptions";
import { useSelector } from "react-redux";

function App() {
  const { isAuthenticated, user } = useSelector((state) => state.user);
  useEffect(() => {
        store.dispatch(loadUser());
  }, [])

  React.useEffect(() => {
    WebFont.load({
      google: {
        families: ["Roboto", "Droid Sans", "Chilanka"],
      },
    });
  });
  return (
    <Router>
      <Header />
      {isAuthenticated && <UserOptions user={user}/> }
      <Route exact path="/" component={Home} />
      <Route exact path="/product/:id" component={ProductDetails} />
      <Route exact path="/products" component={Products} />
      <Route path="/products/:keyword" component={Products} />
      <Route exact path="/search" component={Search} />
      <Route exact path="/login" component={LoginSignUp} />
      <Footer />
    </Router>
  );
}

export default App;
