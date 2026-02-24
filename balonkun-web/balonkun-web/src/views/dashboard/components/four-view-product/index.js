import React, { useCallback, useEffect, useState } from "react";
import { addThreeDots, getProductPicture, formatNumberToIndian } from '@utils';
import { Link } from 'react-router-dom';
import { useSelector } from "react-redux";
import { faCircleInfo, faEyeSlash, faHeart, faCartPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, Rating, Tooltip } from '@mui/material';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardImg,
  Col,
  Container,
  Row,
} from 'reactstrap';
import SwiperCore, {
  Autoplay,
  Navigation,
  Pagination,
  Virtual,
} from 'swiper/core';
import { Swiper, SwiperSlide } from 'swiper/react';
import { ROUTES } from '@shared/constants';
import CategoryTabs from './CategoryTabs';
import SkeletonCard from '@components/SkeletonCard';
import { addToWishList } from "../../../../services";
import { getDataApi } from "@services/ApiCaller";
import { ShopNowModal } from '@views/components';
SwiperCore.use([Navigation, Pagination, Autoplay, Virtual]);

const swiperConfig = {
  spaceBetween: 20,
  updateOnWindowResize: true,
  navigation: true,
  rewind: true,
  className: 'acc-swiper-wrap',
  slidesPerView: 'auto',
};

const TRENDING_URLS = {
  "2W": {
    "Seat Covers": "two-wheeler-seat-covers",
    "Accessories": "car-accessories",
  },
  "4W": {
    "Accessories": "car-accessories",
    "Mats": "autoform-car-mats",
    "Seat Covers": "car-seat-covers"
  }
}

const getTrendingUrl = (vehicleType, categoryType) => {
  return vehicleType && categoryType ? TRENDING_URLS[vehicleType][categoryType] : ""
}

const ProductSlider = ({
  title = "",
  categoryList = [],
  vehicleTypeList = [],
  onClickProduct = () => { },
  onCreateCartProduct = () => { }
}) => {
  const { isLogin } = useSelector(state => state.user);

  const [productList, setProductList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [categoryType, setCategoryType] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);

    try {
      const response = await getDataApi({ path: `user/dashboard/get-product-list?category=${categoryType}&vehicle_type=${vehicleType}` });

      if (response?.data?.data) {
        setProductList(response?.data?.data);
        setIsLoading(false);
      } else {
        setProductList([])
        setIsLoading(false);
      }
    } catch (error) {
      setProductList([])
      setIsLoading(false);
    }
  }, [vehicleType, categoryType]);

  const getFilteredCategoryList = () => {
    if (vehicleType === "2W") {
      return categoryList.filter(category => category.id !== 3)
    }

    return categoryList;
  }

  useEffect(() => {
    if (vehicleType && categoryType) {
      fetchData();
    }
  }, [vehicleType, categoryType, fetchData])

  useEffect(() => {
    if (!!(categoryList.length)) {
      setCategoryType(categoryList[0].name)
    }

    if (!!(vehicleTypeList.length)) {
      setVehicleType(vehicleTypeList[0].name)
    }
  }, [categoryList, vehicleTypeList]);

  useEffect(() => {
    const categoryList = getFilteredCategoryList();

    if (categoryList && categoryList?.length) {
      setCategoryType(getFilteredCategoryList()?.[0]?.name)
    }
  }, [vehicleType])

  const showShopNowModal = (product) => {
    setSelectedProduct(product);
    setModalVisible(true);
  };

  const toggleModal = () => {
    setModalVisible(false);
    setSelectedProduct(null); // Reset the product after closing the modal
  };

  return (
    <section>
      <Container className='product-slider-wrapper'>
        <Row className="justify-content-center">
          <Col md={12} lg={12} xl={12}>
            <h1 className="my-4 title">
              {title}
            </h1>
            <CategoryTabs
              list={vehicleTypeList}
              onHandleCategoryType={(type) => setVehicleType(type)}
              categoryType={vehicleType}
              showLowerCase
            />
            <CategoryTabs
              list={getFilteredCategoryList()}
              onHandleCategoryType={(type) => setCategoryType(type)}
              categoryType={categoryType}
            />
          </Col>
          <Col
            md={12}
            lg={12}
            xl={12}
            style={{ paddingTop: '10px' }}
          >
            {!isLoading && (
              <Swiper
                {...swiperConfig}
                id={title}
                key={Math.random()}
                style={{ paddingLeft: '20px', paddingRight: '20px' }}
                autoplay
              >
                {
                  productList.map((product, index) => {
                    const productName = addThreeDots(product.name);
                    const picture = getProductPicture(product);

                    return (
                      <SwiperSlide
                        key={`slide-${index}`}
                        onClick={() => {
                          onClickProduct(product);
                        }}
                      >
                        <Card>
                          <Box className="thumbnail-wrapper">
                            <CardImg src={picture} alt={productName} loading='lazy' />

                            <Box className="overlay-wrapper">
                              <Box className="overlap-box">
                                <Box className="btn-area">
                                  <button onClick={(e) => {
                                    e.stopPropagation();
                                    onClickProduct(product)
                                  }}>
                                    <FontAwesomeIcon icon={faEyeSlash} />
                                  </button>
                                  <button onClick={(e) => {
                                    e.stopPropagation();
                                    onCreateCartProduct(product.id);
                                  }}>
                                    <FontAwesomeIcon icon={faCartPlus} />
                                  </button>
                                  {isLogin && <button onClick={(e) => {
                                    e.stopPropagation();
                                    addToWishList(product.id);
                                  }}>
                                    <FontAwesomeIcon icon={faHeart} />
                                  </button>}
                                </Box>
                              </Box>
                            </Box>
                          </Box>

                          <CardBody className="d-flex flex-column justify-content-around">
                            <Link className='card-title' to={`${ROUTES.PRODUCT}/${product.seo_canonical || product.id}`}>
                              {productName}
                            </Link>
                            <div onClick={(event) => event.stopPropagation()} className="align-self-end">
                              <Button style={{ backgroundColor: '#F5B100', borderColor: '#F5B100' }} onClick={() => showShopNowModal(product)} >Shop Now</Button>
                            </div>
                          </CardBody>
                          <CardFooter>
                            <Box>
                              <Rating value={product.ratings} size="small" precision={0.1} readOnly />
                              {product.reviews && Object.keys(product.reviews).length > 0 ? <span>{`(${Object.keys(product.reviews).length} reviews)`}</span> : ""}
                            </Box>
                            <Box>
                              <p className="price">
                                &#8377;{formatNumberToIndian(product.original_price)}
                              </p>
                              <Tooltip title="(incl. of all taxes)" arrow>
                                <Box>
                                  <FontAwesomeIcon icon={faCircleInfo} />
                                </Box>
                              </Tooltip>
                            </Box>
                          </CardFooter>

                        </Card>
                      </SwiperSlide>
                    );
                  })
                }
                {selectedProduct &&
                  <ShopNowModal isOpen={isModalVisible} toggleModal={toggleModal} product={selectedProduct} />}
                <SwiperSlide key={`slide-${productList.length}`}>
                  <Card>
                    <CardBody className="bike-acc-body view-all-wrap">
                      <Link
                        to={`/${getTrendingUrl(vehicleType, categoryType)}?search=trending`}
                        className="view-all-btn"
                      >
                        View All
                      </Link>
                    </CardBody>
                  </Card>
                </SwiperSlide>
              </Swiper>
            )}
            {isLoading && (
              <Box className="shimmer-cards">
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
              </Box>
            )}
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default ProductSlider;