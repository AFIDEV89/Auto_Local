import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import { faEyeSlash } from "@fortawesome/free-solid-svg-icons/faEyeSlash";
import { faCartPlus } from '@fortawesome/free-solid-svg-icons/faCartPlus';
import { faFilter } from "@fortawesome/free-solid-svg-icons/faFilter";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Breadcrumb,
  BreadcrumbItem,
  Card,
  CardBody,
  CardFooter,
  CardImg,
  Col,
  Container,
  Row
} from "reactstrap";
import { BottomNavigation, BottomNavigationAction, Dialog, Paper, useMediaQuery, Button, Box, Tooltip, Rating } from "@mui/material";
import { faArrowDownAZ } from "@fortawesome/free-solid-svg-icons/faArrowDownAZ"

import { imageNotAvailable } from "@assets/images";
import * as actions from "@redux/actions";
import { ROUTES } from "@shared/constants";

import {
  InfiniteScrollPagination,
  ReactSelect,
  ProductCard
} from "@views/components";

import { MODULES } from "@shared/constants";
import { getProductPicture, formatNumberToIndian } from "@utils";
import { useHandleCalls } from "@views/components/custom-hooks";
import { Colors, Filters, NoItemFound } from "./components";
import { sortByFilter } from "./mockData";
import SkeletonCard from '@components/SkeletonCard';
import { getDataApi } from "@services/ApiCaller";
import { faCircleInfo, faHeart } from "@fortawesome/free-solid-svg-icons";
import { addToWishList } from "../../../services";
import { ShopNowModal } from "@views/components";
let page = 1;
const sortByStyle = {
  menu: provided => ({ ...provided, zIndex: 4 }),
  control: (baseStyles) => ({
    ...baseStyles,
    fontSize: 14
  }),
  menuList: (listCss) => ({
    ...listCss,
    fontSize: 14
  })
}

const ProductListing = ({
  categoryList
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const { id: seoURL } = useParams();
  const { isLogin } = useSelector((state) => state.user);
  const [seoData, setSeoData] = useState(null);
  const [sortBy, setSortBy] = useState("");
  const [products, setProducts] = useState(MODULES.PAGINATION.INITIAL_DATA);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [isAppliedFilters, setIsAppliedFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeBottomNavTab, setActiveBottomNavTab] = useState();
  const [hasMore, setHasMore] = useState(true)
  const matchesMobile = useMediaQuery('(max-width:767px)');

  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const activeTab = useMemo(() => {
    const pcid = searchParams.get("pcid");
    return (
      categoryList.find((category) => category.id == pcid)?.name ||
      searchParams.get("search") ||
      "All Products"
    );
  }, [categoryList, searchParams]);

  const handleClearFilters = useCallback(() => {
    setSelectedFilters({});
    setSearchParams({});
  }, [setSearchParams]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);

    const category = params.get("category");
    const subcategory = params.get("subcategory");
  
    const searchFilters = {};
  
    if (category) {
      searchFilters["Product Categories"] = [parseInt(category)];
    }
    if (subcategory) {
      searchFilters["Product Subcategories"] = [parseInt(subcategory)];
    }
  
    if (Object.keys(searchFilters).length) {
      setSelectedFilters(searchFilters);
    }
  }, [location.search]);

  const handleSelectedFilters = useCallback((key, value) => {
    const temp = {
      ...selectedFilters,
      [key]: value
    };

    if (value.length === 0 && temp[key]) {
      delete temp[key]
    }

    setSelectedFilters(temp);
  },
    [selectedFilters]
  );

  const handleProductOnClick = (product) => {
    const navSubPath = product.seo_canonical || product.id;

    navigate(`${ROUTES.PRODUCT}/${navSubPath}`);
  };

  const createCartProduct = (pid) => {
    if (isLogin) {
      dispatch(actions.cartProductCreate(pid, () => { }));
    } else {
      navigate("/login");
    }
  };

  const handleFetchProductList = useCallback(() => {
    const query = {
      page,
      limit: MODULES.PAGINATION.ROWS_PER_PAGE,
      ...(sortBy.metaData || {}),
    };
    const search = searchParams.get("search");
    if (search) {
      query.search = search;
    }

    const isApplyingFilters = selectedFilters && !!Object.keys(selectedFilters).length;

    if (isApplyingFilters) {
      const filters = {};
      Object.keys(selectedFilters).forEach((key) => {
        filters[key.replace(/\s+/g, "_").toLowerCase()] = selectedFilters[
          key
        ]?.filter((val) => !!val);
      });
      if (!isAppliedFilters) {
        page = 1;
        query.page = 1;
      }
      query.filters = filters;
    }

    if (query.page === 1) {
      setIsLoading(true);
    }

    dispatch(
      actions.getProductListRequest(query, (res) => {
        setIsLoading(false);

        if (res) {
          if (res.list.length === 0) {
            setHasMore(false);
          } else {
            setProducts(prevProducts => ({
              list: query.page === 1 ? res.list : [...prevProducts.list, ...res.list],
              total_count: res.total_count,
            }));
            page = page + 1;
            if (isApplyingFilters) {
              setIsAppliedFilters(true);
            }
          }
        }
      })
    );

  }, [
    dispatch,
    isAppliedFilters,
    products.list,
    searchParams,
    selectedFilters,
    sortBy,
    page
  ]);

  const fetchData = useCallback(async () => {
    const result = await getDataApi({ path: `seo/filter/${seoURL}` });

    if (result?.data?.data) {
      const response = result.data.data;

      const searchFilters = {};

      if (response.vehicle_category_id) {
        searchFilters["Vehicle Types"] = [parseInt(response.vehicle_category_id)];
      }
      if (response.product_category_id) {
        searchFilters["Product Categories"] = [parseInt(response.product_category_id)];
      }
      if (response.product_subcategory_id) {
        searchFilters["Product Subcategories"] = [parseInt(response.product_subcategory_id)];
      }
      if (response.vehicle_brand_id) {
        searchFilters["Vehicle Brands"] = [parseInt(response.vehicle_brand_id)];
      }
      if (response.vehicle_model_id) {
        searchFilters["Vehicle Models"] = [parseInt(response.vehicle_model_id)];
      }

      if (Object.keys(searchFilters).length) {
        setSelectedFilters(searchFilters);
      }
    } else {
      navigate("/not-found")
    }
  }, [seoURL, navigate])

  useEffect(() => {
    if (seoURL) {
      fetchData()
    }
  }, [seoURL, fetchData])

  useEffect(() => {
    const vehicle_type_id = searchParams.get("vid");
    const brand_id = searchParams.get("bid");
    const model_id = searchParams.get("mid");
    const product_category_id = searchParams.get("pcid");

    const searchFilters = {};

    if (vehicle_type_id) {
      searchFilters["Vehicle Types"] = [parseInt(vehicle_type_id)];
    }
    if (product_category_id) {
      searchFilters["Product Categories"] = [parseInt(product_category_id)];
    }
    if (brand_id) {
      searchFilters["Vehicle Brands"] = [parseInt(brand_id)];
    }
    if (model_id) {
      searchFilters["Vehicle Models"] = [parseInt(model_id)];
    }
    if (Object.keys(searchFilters).length) {
      setSelectedFilters(searchFilters);
    }
  }, [searchParams]);

  const fetchSEOData = () => {
    if (selectedFilters && selectedFilters["Product Categories"]?.length === 1) {
      dispatch(actions.getSEOData({
        selectedFilters
      }, (res) => {
        setSeoData({
          ...(res?.banner_path && { banner_path: res?.banner_path }),
          ...(res?.category_text && { category_text: res?.category_text }),
          seo_page_title: res.seo_page_title,
          seo_page_description: res.seo_page_description,
          canonical_url: res.canonical_url
        });
      }))
    } else {
      setSeoData(null);
    }
  };

  useHandleCalls(() => {
    setProducts(MODULES.PAGINATION.INITIAL_DATA);
    page = 1;
    handleFetchProductList();
  },
    [JSON.stringify(selectedFilters), JSON.stringify(sortBy)],
    "fetchingProducts"
  );

  useHandleCalls(() => {
    fetchSEOData();
  },
    [selectedFilters],
    "fetchingSEOData"
  );

  const handleSortByFilter = useCallback((e) => {
    setSortBy(e);
  }, []);

  const isFiltersApplied = useMemo(() => {
    const filters = Object.values(selectedFilters);

    return filters.length ? filters.every((filter) => !!filter.length) : false;
  }, [selectedFilters]);

  const renderFilters = () => {
    return (
      <>
        <Filters
          selectedFilters={selectedFilters}
          onClearFilters={handleClearFilters}
          onSelectedFilters={handleSelectedFilters}
          setSelectedFilters={setSelectedFilters}
        />
      </>)
  }

  const renderSortBy = () => {
    return <div className="sort-by-wraper">
      <ReactSelect
        options={sortByFilter}
        onSelect={handleSortByFilter}
        placeholder="Sort By"
        value={sortBy}
        style={sortByStyle}
        isOpen
      />
    </div>
  }

  const renderBtnControls = ({
    showClearBtn
  }) => {
    return (
      <div style={{ display: "flex", justifyContent: "space-around", marginTop: "1rem" }}>
        {showClearBtn && <Button
          variant="outlined"
          className="clear-btn"
          disabled={!isFiltersApplied}
          onClick={handleClearFilters}
        >
          Clear
        </Button>}

        {matchesMobile && <Button onClick={() => setActiveBottomNavTab(null)} variant="contained" className="ok-btn"
        >
          Go
        </Button>}
      </div>
    )
  }
  const showShopNowModal = (product) => {
    setSelectedProduct(product);
    setModalVisible(true);
  };

  const toggleModal = () => {
    setModalVisible(false);
    setSelectedProduct(null); // Reset the product after closing the modal
  };
  return (
    <>
      <Helmet>
        {seoData?.seo_page_title && <title>{seoData.seo_page_title}</title>}
        {seoData?.seo_page_description && <meta name='description' content={seoData.seo_page_description} />}
        {seoData?.canonical_url && <link rel="canonical" href={"/" + seoData.canonical_url} />}
        <script type="application/ld+json">{`
        {
            "@context": "http://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "item": {
                  "name": "Home",
                  "@id": "https://www.autoformindia.com"
                }
              },
              {
                "@type": "ListItem",
                "position": 2,
                "item": {
                  "name": "${activeTab}",
                  "@id": "https://wwww.autoformindia.com${pathname}"
                }
              }
            ]
        }
        `}</script>
      </Helmet>

      {seoData && seoData.banner_path && <Box className="seoBanner">
        {seoData.banner_path && <img src={seoData.banner_path} className="bannerImage" alt={""} width="1440" />}
      </Box>}

      <Container fluid>
        {activeTab && (
          <Breadcrumb>
            <BreadcrumbItem>
              <Link to="/">Home</Link>
            </BreadcrumbItem>
            <BreadcrumbItem active>{activeTab}</BreadcrumbItem>
          </Breadcrumb>
        )}
      </Container>

      <Container fluid className="product-list-wrapper">
        <Row>
          {
            !matchesMobile && <Col md={3} xxl={2}>
              {renderFilters()}
              {renderBtnControls({ showClearBtn: true })}
            </Col>
          }

          <Col md={9} xxl={10}>
            {!matchesMobile && <>
              <Box className="sorting-buttons">
                <Box className="left">
                  {renderSortBy()}
                </Box>
              </Box>
            </>}

            {seoData && seoData.category_text && <Box className="seoBanner">
              <Box dangerouslySetInnerHTML={{ __html: seoData.category_text }} className="bannerConent" />
            </Box>}

            {isLoading ?
              (<Box className="shimmer-cards">
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
              </Box>) : (
                <>
                  {!!products.list.length ? (
                    <InfiniteScrollPagination
                      items={products}
                      fetchData={handleFetchProductList}
                      hasMore={hasMore}
                    >
                      <Row className="gap-y-8">
                        {!!products.list.length &&
                          products.list.map((product, i) => {
                            return (
                              <Col
                                key={product.id}
                                xs={12}
                                sm={12}
                                md={6}
                                lg={4}
                                xl={4}
                                xxl={4}
                                className="mb-6"
                              >
                                <ProductCard 
                                   product={product} 
                                   onClickProduct={handleProductOnClick} 
                                   showShopNowModal={showShopNowModal} 
                                   showColors={true} 
                                />
                              </Col>
                            );
                          })}

                        {selectedProduct &&
                          <ShopNowModal isOpen={isModalVisible} toggleModal={toggleModal} product={selectedProduct} />}
                      </Row>
                    </InfiniteScrollPagination>
                  ) : (
                    <>
                      {products.list.length === 0 && <NoItemFound />}
                    </>
                  )}
                </>
              )
            }

          </Col>
        </Row>
      </Container>

      {
        matchesMobile && <>
          <Dialog
            fullScreen
            open={activeBottomNavTab === 0 || activeBottomNavTab === 1}
            style={{
              bottom: 56
            }}
          >

            <Box style={{ marginBottom: 70 }}>
              {
                activeBottomNavTab === 0 && (renderFilters())
              }

              {
                activeBottomNavTab === 1 && (renderSortBy())
              }

              {renderBtnControls({ showClearBtn: activeBottomNavTab === 0 })}

            </Box>


          </Dialog>

          <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1400 }} elevation={5}>
            <BottomNavigation
              showLabels
              value={activeBottomNavTab}
              style={{
                boxShadow: "0 2px 14px 2px rgba(0,0,0,0.19)"
              }}
              onChange={(event, newValue) => {
                setActiveBottomNavTab(prev => {
                  if (prev !== newValue) {
                    return newValue
                  }

                  return null
                });
              }}>
              <BottomNavigationAction label="Filters" icon={<FontAwesomeIcon icon={faFilter} />} />
              <BottomNavigationAction label="Sort By" icon={<FontAwesomeIcon icon={faArrowDownAZ} />} />
            </BottomNavigation>
          </Paper>
        </>
      }

    </>
  );
}

export default ProductListing;
