import React, { Fragment, useEffect } from "react";
import { CgMouse } from "react-icons/all";
import "./Home.css";
import ProductCard from "./ProductCard.js";
import MetaData from "../layout/MetaData";
import { clearErrors, getProduct } from "../../actions/productAction";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../layout/Loader/Loader";
import { useAlert } from "react-alert";
import { Link } from 'react-router-dom';

const Home = () => {
  const alert = useAlert();
  const dispatch = useDispatch();
  const { loading, error, products } = useSelector((state) => state.products);
  const { isAuthenticated } = useSelector((state) => state.user);

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    dispatch(getProduct());
  }, [dispatch, error, alert]);


  // let button;
  // if (isAuthenticated){
  //   button =  <button>Logout</button>
  // }
  // else{
  //   button = <button onClick={handleLogin}>Login</button>
    
  // }
  const handleAuthenticated = () => {
    if (!isAuthenticated) {
      return (
             <Link to="/login">
               <button>Login</button>
             </Link>
           );
    //    return (
    //      <Link to="/">
    //        <button>Logout</button>
    //      </Link>
    //    );
    // } else {
    //    return (
    //      <Link to="/login">
    //        <button>Login</button>
    //      </Link>
    //    );
    }
   };

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title="Li^2" />

          <div className="banner">
          <div className="lg" style={{float:"right"}}>
          {handleAuthenticated()}
          </div>
            <p>Welcome to Li^2</p>
            <h1>FIND AMAZING PRODUCTS BELOW</h1>

            <a href="#container">
              <button>
                Scroll <CgMouse />
              </button>
            </a>
          </div>

          <h2 className="homeHeading">Featured Products</h2>

          <div className="container" id="container">
            {products &&
              products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default Home;
