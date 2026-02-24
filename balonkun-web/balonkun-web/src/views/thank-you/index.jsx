import React from 'react';
import { Link, useLocation, Navigate } from 'react-router-dom';
import { Container, Row, Col, Breadcrumb, BreadcrumbItem } from 'reactstrap';
import Support from '../my-cart/components/support';
import CustomerDetail from './CustomerDetails';
import OrderDetail from './OrderDetails';

const ThankYou = () => {
  const { state } = useLocation();
  const orderData = { ...state };

  if (!orderData || !Object.keys(orderData).length) return <Navigate to='/' />;

  return (
    <>
      <Container className="thank-order-wrapper">

        <Breadcrumb className="my-1">
          <BreadcrumbItem>
            <Link to="/">Home</Link>
          </BreadcrumbItem>
          <BreadcrumbItem active>Thank You</BreadcrumbItem>
        </Breadcrumb>

        <Row>
          <h2 className="title mb-2">
            Thank you for your order
          </h2>
          <p className="desc">
            An email confirmation has been sent to &nbsp;
            <a href={`mailto:${orderData.user?.email}`} className="mail">
              {orderData.user?.email}
            </a>
          </p>
        </Row>
        
        <Row>
          <Col lg={7} xl={7}>
            <CustomerDetail orderData={orderData} />
          </Col>
          <Col lg={5} xl={5}>
            <OrderDetail orderData={orderData} />
          </Col>
        </Row>
      </Container>
      <Support />
    </>
  );
};

export default ThankYou;
