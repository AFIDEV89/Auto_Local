import { Col, Container, Row } from "reactstrap";

import WhatWeOfferList from "./MockData";
import webmVideo from '../../../../assets/images/What we offer GIF.webm'; // Import your video

const WhatWeOffer = () => {

  return (
      <>
          <div>
              <section className="what-we-offer">
                  <video
                      autoPlay
                      loop
                      muted
                      className="background-video"
                  >
                      <source src={webmVideo} type="video/webm"/>
                      Your browser does not support the video tag.
                  </video>
                  <h2 className="title">What We Offer!</h2>
                  <Container className="offer-wrapper">
                      <Row>
                          {WhatWeOfferList.map((offer) => {
                              const { id, img, title, desc, width, height } = offer;
                              return (
                                  <Col lg={3} xl={3} key={id}>
                                      <div className="offer-box">
                                          <img src={img} loading="lazy" className="offer-img" alt="shipping" />
                                          <h3 className="offer-title">{title}</h3>
                                          <p className="offer-desc">{desc}</p>
                                      </div>
                                  </Col>
                              )
                          })}
                      </Row>
                  </Container>
              </section>
          </div>
      </>
  );
}

export default WhatWeOffer;
