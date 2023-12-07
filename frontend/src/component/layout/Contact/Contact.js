import React from "react";
import "./Contact.css";
import { Button } from "@material-ui/core";

const Contact = () => {
  return (
    <div className="contactContainer">
      <a className="mailBtn" href="leeza.mhr@gmail.com">
        <Button>Contact: leeza.mhr@gmail.com</Button>
      </a>
    </div>
  );
};

export default Contact;
