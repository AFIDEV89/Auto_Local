import React from "react";
import {
  Card,
  CardBody,
  CardImg,
  CardText,
  CardTitle,
  Col,
  Container,
  Row,
} from "reactstrap";
import { Swiper, SwiperSlide } from "swiper/react";
import { Link, useNavigate } from 'react-router-dom';

import { penIcon, calenderIcon, placeholder } from "@assets/images";
import { LATEST_BLOG_VIEW_ID } from "@shared/constants";
import { dateFormatter } from "@utils/date";

const Blogs = ({
  blogs = []
}) => {
  const navigate = useNavigate();

  return (
    <section id={LATEST_BLOG_VIEW_ID} className="blogs">
      <Container className="text-center">
        <h2 className="title">
          Latest Blog
        </h2>
        <Row>
          <Col md={12} lg={12} xl={12}>
            <Swiper
              slidesPerView='auto'
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
              {blogs.map((blog, index) => (
                <SwiperSlide key={`blog_${index}`}>
                  <Card onClick={() => {
                    navigate(`blog/${blog.id}`);
                  }}>
                    <CardImg loading="lazy" src={blog.image} alt={blog.title} onError={({ currentTarget }) => {
                      currentTarget.onerror = null; // prevents looping
                      currentTarget.src = placeholder;
                    }} />
                    <CardBody>
                      <div className="author-details">
                        <img src={penIcon} alt="" />
                        <h6 className="name">{blog.creator_name}</h6>
                        <img src={calenderIcon} alt="" />
                        <span className="publish-date">
                          {dateFormatter(blog.createdAt)}
                        </span>
                      </div>
                      <CardTitle className={`${blog.isHighlight ? "card-title-pink" : ""}`}>
                        {blog.title}
                      </CardTitle>
                      <CardText style={{ height: "48px", overflow: "hidden" }}>
                        {blog.description}
                      </CardText>
                      <Link to={`/blog/${blog.id}`} className={`read-more ${blog.isHighlight ? "read-more-pink" : ""}`}>
                        Read More
                      </Link>
                    </CardBody>
                  </Card>
                </SwiperSlide>
              ))}
            </Swiper>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Blogs;
