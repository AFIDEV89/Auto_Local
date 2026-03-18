import React from "react";
import { howItWorks } from '@assets/images';
import {
  Col,
  Container,
  Row
} from "reactstrap";

const HowItWorks = ({ onToggleSelectVehicleModal }) => {
  return (
    <Container className="how-it-works-wrapper">
      <Row>
        <Col lg={12} xl={12}>
          <h2 className="title">How it Works</h2>
        </Col>
        <img src={howItWorks} className="howitworks" alt="how it works" />
        <Col lg={12} xl={12} className="text-center mt-5">
          <button className="primary-btn fw-800" onClick={() => onToggleSelectVehicleModal(true)}>start now</button>
        </Col>
      </Row>
    </Container>
  );
};

export default HowItWorks;
