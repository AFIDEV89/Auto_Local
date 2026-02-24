import React from "react";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const CartWrapperIcon = () => {
    const count = useSelector((state) => state.cart.count);
    const navigate = useNavigate();

    return (
        <div className="cart-wrapper" onClick={() => navigate('/my-cart')}>
            <FontAwesomeIcon icon={faCartShopping} className="cart-mobile" />
            {!!count &&
                <div className="cart-item">
                    <span className="cart-value">{count}</span>
                </div>
            }
        </div>
    )
}

export default CartWrapperIcon