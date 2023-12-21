import React, { Fragment } from "react";
import CheckoutSteps from "../Cart/CheckoutSteps";
import { useSelector } from "react-redux";
import MetaData from "../layout/MetaData";
import "./ConfirmOrder.css";
import { Link } from "react-router-dom";
import { Typography } from "@material-ui/core";
import CryptoJS from 'crypto-js';
import axios from 'axios';

const ConfirmOrder = ({ history }) => {
  const { shippingInfo, cartItems } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );
  console.log(subtotal, "subtotal")

  const shippingCharges = subtotal > 1000 ? 0 : 200;

  const tax = subtotal * 0.12;

  const totalPrice = subtotal + tax + shippingCharges;

  const address = `${shippingInfo.address}, ${shippingInfo.city}`;

  const formData = {
    amount : subtotal,
    tax_amount :tax,
    total_amount : totalPrice,
    transaction_uuid:"", 
    product_code:"EPAYTEST",
    product_service_charge:0,
    product_delivery_charge:shippingCharges,
    success_url:"https://localhost:3000",
    failure_url:"https://developer.esewa.com.np/failure",
    signed_field_names:"total_amount,transaction_uuid,product_code",
    signature:"",
    secret:"8gBm/:&EnhH.1/q" 
  }

  const proceedToPayment = () => {
    const data = {
      subtotal,
      shippingCharges,
      tax,
      totalPrice,
    };

    sessionStorage.setItem("orderInfo", JSON.stringify(data));
    axios.post("http://localhost:4000/api/v1/order/new",data)
      .then((response) => {
        console.log("Success");
      }).catch((e) => console.log(e));

    var form = document.createElement("form")
    form.setAttribute("method","POST")
    form.setAttribute("action","https://rc-epay.esewa.com.np/api/epay/main/v2/form")
    form.setAttribute("onSubmit",generateHashandTransactionUUID(form))
  };

  const generateHashandTransactionUUID = (form) =>{

        // Function to auto-generate signature

          var currentTime = new Date();
          var formattedTime = currentTime.toISOString().slice(2, 10).replace(/-/g, '') + '-' + currentTime.getHours() +
              currentTime.getMinutes() + currentTime.getSeconds();
          formData["transaction_uuid"] = formattedTime

          var hash = CryptoJS.HmacSHA256(
              `total_amount=${formData["total_amount"]},transaction_uuid=${formData["transaction_uuid"]},product_code=${formData["product_code"]}`,
              `${formData["secret"]}`);
          var hashInBase64 = CryptoJS.enc.Base64.stringify(hash);
          formData["signature"] = hashInBase64
          // formData["signed_field_names"] = `${formData["total_amount"]},${formData["transaction_uuid"]},${formData["product_code"]}`
          
          for (var key in formData){
            var hiddenField = document.createElement("input");
            hiddenField.setAttribute("type","hidden")
            hiddenField.setAttribute("name",key)
            hiddenField.setAttribute("value",formData[key])
            form.appendChild(hiddenField)
          }
      
          document.body.appendChild(form);
          form.submit();
  }

  return (
    <Fragment>
      <MetaData title="Confirm Order" />
      <CheckoutSteps activeStep={1} />
      <div classNme="confirmOrderPage">
        <div>
          <div className="confirmshippingArea">
            <Typography>Shipping Info</Typography>
            <div className="confirmshippingAreaBox">
              <div>
                <p>Name:</p>
                <span>{user.name}</span>
              </div>
              <div>
                <p>Phone:</p>
                <span>{shippingInfo.phoneNo}</span>
              </div>
              <div>
                <p>Address:</p>
                <span>{address}</span>
              </div>
            </div>
          </div>
          <div className="confirmCartItems">
            <Typography>Your Cart Items:</Typography>
            <div className="confirmCartItemsContainer">
              {cartItems &&
                cartItems.map((item) => (
                  <div key={item.product}>
                    <img src={item.image} alt="Product" />
                    <Link to={`/product/${item.product}`}>
                      {item.name}
                    </Link>{" "}
                    <span>
                      {item.quantity} X Rs.{item.price} ={" "}
                      <b>Rs.{item.price * item.quantity}</b>
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
        {/*  */}
        <div>
          <div className="orderSummary">
            <Typography>Order Summary</Typography>
            <div>
              <div>
                <p>Subtotal:</p>
                <span>Rs.{subtotal}</span>
              </div>
              <div>
                <p>Shipping Charges:</p>
                <span>Rs.{shippingCharges}</span>
              </div>
              <div>
                <p>Tax:</p>
                <span>Rs.{tax}</span>
              </div>
            </div>

            <div className="orderSummaryTotal">
              <p>
                <b>Total:</b>
              </p>
              <span>Rs.{totalPrice}</span>
            </div>

            <button onClick={proceedToPayment}>Proceed To Payment</button>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default ConfirmOrder;
