import React from "react";
import { Button } from "reactstrap";
import { useNavigate } from 'react-router-dom';

function NewCustomer({ login }) {
  const navigate = useNavigate();

  const handleLoginSignup = () => {
    if (login === "login") {
      navigate('/signup');
    }
    else {
      navigate('/login');
    }
  };

  return (
    <>
      <div className="new-customer">
        <h2 className="title">{login === "login" ? "New Customer?" : "Already have an account"}</h2>
        <p className="desc">Creating an account has many benefits</p>
        <ul>
          <li>Check out faster</li>
          <li>Keep more than one address</li>
          <li>Track orders and more</li>
        </ul>
        <Button className="create-btn" onClick={handleLoginSignup}>
          {login === "login" ? "Create an Account" : "Login"}
        </Button>
      </div>
    </>
  );
}

export default NewCustomer;