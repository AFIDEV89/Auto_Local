import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";

import { Grid, Typography, Button } from "@mui/material";

import ProductImages from "./ProductImages";
import ProductInfo from "./ProductInfo";
import RelatedProducts from "./RelatedProducts";
import MainCard from "ui-component/cards/MainCard";

import { gridSpacing } from "store/constant";
import { useSelector } from "store";
import API from "api/axios";
import ProductTabs from "./ProductTabs";
import ProductPlaceholder from "ui-component/cards/Skeleton/ProductPlaceholder";
import { errorAlert } from "views/helpers";

const ProductDetails = () => {
  const { id } = useParams();
  const history = useNavigate();

  const [productInfo, setProductInfo] = useState({});
  const [product, setProduct] = useState(null);
  const productState = useSelector((state) => state.product);
  const [relatedProduct, setRelatedProduct] = React.useState([]);

  useEffect(() => {
    setProduct(productState.product);

    if (productState.product && id === "default") {
      history(`/product-details/${productState?.product?.id}`);
    }

  }, [productState, id, history]);

  const getProductDetail = async () => {
    try {
      const response = await API.get(`/product/${id}`);

      if (response && response.data && response.data.data) {
        let resData = response?.data?.data;
        setProductInfo(resData);
        setRelatedProduct(resData?.related_products);
      }
    }
    catch (error) {
      errorAlert("Something went wrong while getting the product List");
    }
  };

  useEffect(() => {
    getProductDetail();
  }, []);

  return (
    <Grid container>

      <Grid item xs={12}>
        <MainCard>
          <Button
            variant="text"
            startIcon={<KeyboardBackspaceIcon />}
            onClick={() => {
              history("/products");
            }}
          >
            Back
          </Button>
          {productInfo && (
            <Grid container spacing={gridSpacing}>
              <Grid item xs={12} md={6}>
                {Object.keys(productInfo).length > 0
                  ? <ProductImages product={product} productInfo={productInfo} />
                  : <ProductPlaceholder />
                }
              </Grid>
              <Grid item xs={12} md={6}>
                <ProductInfo getProductDetail={getProductDetail} product={product} productInfo={productInfo} />
              </Grid>
            </Grid>
          )}
          <ProductTabs getProductDetail={getProductDetail} productInfo={productInfo} />
        </MainCard>
      </Grid>

      {relatedProduct && Object.keys(relatedProduct).length > 0 &&
        <>
          <Grid item xs={12} lg={10} sx={{ mt: 3 }}>
            <Typography variant="h2">Related Products</Typography>
          </Grid>
          <Grid item xs={11} lg={10}>
            <RelatedProducts relatedProduct={relatedProduct} id={id} />
          </Grid>
        </>
      }
    </Grid>
  );
};

export default ProductDetails;
