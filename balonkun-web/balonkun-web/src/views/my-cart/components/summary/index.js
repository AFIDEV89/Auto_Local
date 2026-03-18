import React from 'react';
import { Button } from 'reactstrap';
import { formatNumberToIndian } from '@utils';

const Summary = ({
  billDetails,
  onHandleOrderPlaced,
  isPlaceOrderBtnDisabled = true
}) => {
  return (
    <div className="cart-summary">
      <h3 className="title">Summary</h3>
      <div className="est-tax">
        <p>Estimate Shipping and Tax</p>
      </div>
      <hr />
      <div className="charges">
        <p className="txt mb-0">Subtotal</p>
        <p>₹ {formatNumberToIndian(billDetails.subTotal)}</p>
      </div>
      <div className="shipping">
        <p className="txt mb-0">Shipping</p>
        <p>₹ {formatNumberToIndian(billDetails.shipping)}</p>
      </div>
      <p className="rate">
        (Standard Rate - Price may vary depending on the item/destination.
        TECS Staff will contact you.)
      </p>
      <div className="charges">
        <p className="txt mb-0">Tax</p>
        <p>₹ {formatNumberToIndian(billDetails.tax)}</p>
      </div>
      <div className="charges">
        <p className="txt mb-0">GST({formatNumberToIndian(billDetails.gstRate)}%)</p>
        <p>₹ {formatNumberToIndian(billDetails.gst)}</p>
      </div>
      <div className="charges">
        <p className="txt mb-0">Order Total</p>
        <p>₹ {formatNumberToIndian(billDetails.total.toFixed(2))}</p>
      </div>
      <div className="text-center">
        <Button onClick={onHandleOrderPlaced} className="proceed-btn" disabled={isPlaceOrderBtnDisabled}>
          Place Order
        </Button>
      </div>
    </div>
  );
};

export default Summary;
