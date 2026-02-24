import React from "react";
import {
  Col,
  Container,
  Row,
} from "reactstrap";
import { Swiper, SwiperSlide } from "swiper/react";

import ClientList from './MockData';

const TestimonialSlider = () => {

  return (
    <section className="testimonial-slider">
      <Container>
        <div className="testimonial-text">
          <h2 className="title">Our Clients Speak</h2>
          <p className="desc">
            We have been working with clients around the world
          </p>
        </div>
        <Row>
          <Col md={12} lg={12} xl={12}>
            <Swiper
              slidesPerView={3}
              spaceBetween={20}
              slidesPerGroup={3}
              loop={true}
              navigation={true}
              className="mySwiper"
              breakpoints={{
                0: {
                  width: 0,
                  slidesPerView: 1,
                },
                576: {
                  width: 576,
                  slidesPerView: 1,
                },
                768: {
                  width: 768,
                  slidesPerView: 2,
                },
              }}
            >
              {ClientList.map((client, index) =>
                <SwiperSlide key={index}>
                  <div className="client-review">
                    <p className="para">
                      {client.description}
                    </p>
                  </div>
                  <div className="client-info">
                    <h4 className="client-name">{client.clientName}</h4>
                  </div>
                  <img className="client-image" src={client.image} width={70} height={70} loading="lazy" alt={client.clientName}/>
                </SwiperSlide>
              )}
            </Swiper>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default TestimonialSlider;
