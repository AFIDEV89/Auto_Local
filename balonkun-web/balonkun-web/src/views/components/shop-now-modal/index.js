import React from "react";
import { Button, Modal, ModalBody, ModalHeader } from "reactstrap";
import { postDataApi } from "../../../services/ApiCaller";
import { errorAlert, successAlert } from "../../../utils";
import { shopNow } from "@assets/images";
import "@assets/scss/shop-now-modal.scss";

const ShopNowModal = React.memo(({ isOpen, toggleModal, product }) => {
  const [number, setNumber] = React.useState("");
  const [error, setError] = React.useState("");
  
  const handleSubmit = async () => {
    //integrate api here
    if (!validatePhoneNumber(number)) {
      return;
    }
    try {
      const response = await postDataApi({
        path: "/lead",
        data: {
          contact_no: number,
        },
      });
      if (response) {
        successAlert("We will call you back shortly!");
        toggleModal();
      }
    } catch (e) {
      errorAlert(e.message);
    }
  };

  const validatePhoneNumber = (number) => {
    const cleanedNumber = number.replace(/\D/g, "");
    if (cleanedNumber.length !== 10) {
      setError("Please enter a valid phone number");
      return false;
    }
    setError("");
    return true;
  }

  function handleChangeNumber(number) {
    setNumber(number);
  }

  return (
    <Modal
      className="custom-modal"
      isOpen={isOpen}
      toggle={toggleModal}
      backdrop="static"
      centered
      style={{width:'auto'}}
    >
      <ModalHeader
        toggle={toggleModal}
        className="border-0"
      ></ModalHeader>
      <ModalBody className="modal-content">
        <div className="modal-body-content">
          <div className="left-section">
            <img src={shopNow} alt="Shop Now" style={{backgroundColor:'transparent', width:'100%', height:'100%', objectFit:'cover', transform: 'scale(1.2)'}} ></img>
          </div>
          <div className="right-section">
            <p className="callback-title">
              Request a callback
            </p>
            <input
              type="number"
              className="phone-input"
              placeholder="Phone"
              onChange={(e) => {
                handleChangeNumber(e.target.value);
              }}
              style={{borderColor: error ? "red" : "#F5B100", borderWidth: error ? "2px" : "0px"}}
            />
            {error && <p className="error-msg">{error}</p>}
            <Button
              className="send-request-button"
              onClick={() => handleSubmit(product)}
            >
              Send Request
            </Button>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
});

export default ShopNowModal;
