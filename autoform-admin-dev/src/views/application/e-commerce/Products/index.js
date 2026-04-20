import React, { useCallback, useEffect, useState } from "react";

// material-ui
import { styled, useTheme } from "@mui/material/styles";
import {
  Box,
  TablePagination,
  Button,
  Divider,
  Grid,
  InputAdornment,
  Menu,
  MenuItem,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  Tooltip,
  Fab,
  Drawer
} from "@mui/material";

// project imports
import ProductEmpty from "./ProductEmpty";
import ProductCard from "ui-component/cards/ProductCard";
import SkeletonProductPlaceholder from "ui-component/cards/Skeleton/ProductPlaceholder";
import { useDispatch } from "store";
import ProductAdd from "views/application/customer/Product/ProductAdd";
import { appDrawerWidth, getProductPicture, getProductPrice, gridSpacing } from "store/constant";
import { getProducts } from "store/slices/product";
import API from "api/axios";
import ProductFilter from "./ProductFilter";
import CsvToolbar from "../../../components/CsvToolbar";

import FilterAltIcon from "@mui/icons-material/FilterAlt";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/AddTwoTone";
import { getLimit, crateLimit, updateLimit } from "../CommonLimit";
import usePermission from "hooks/usePermission";
import { errorAlert } from "views/helpers";

// Debounce delay time in milliseconds
const debounceDelay = 1000;

let timeoutId = null;

const removeNullValues = (obj) => {
  for (var propName in obj) {
    if (obj[propName] == '') {
      delete obj[propName];
    }
  }

  return obj;
}

// product list container
const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.shorter,
    }),
    marginRight: -appDrawerWidth,
    [theme.breakpoints.down("xl")]: {
      paddingRight: 0,
      marginRight: 0,
    },
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.shorter,
      }),
      marginRight: 0,
    }),
  })
);

const ProductsList = () => {
  const productsListLoading = [1, 2, 3, 4, 5, 6, 6, 7, 7, 7];

  const theme = useTheme();
  const dispatch = useDispatch();
  const { isUserModerator } = usePermission()

  const [categoryList, setCategoryList] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [colorList, setColorList] = useState([]);
  const [productLImit, setProductLimit] = React.useState();
  const [productLimitData, setProductLimitData] = React.useState({});
  const matchDownSM = useMediaQuery(theme.breakpoints.down("md"));
  const matchDownMD = useMediaQuery(theme.breakpoints.down("lg"));
  const matchDownLG = useMediaQuery(theme.breakpoints.down("xl"));
  const [isLoading, setLoading] = useState(true);
  
  // drawer
  const [open, setOpen] = useState(!matchDownLG);
  const handleDrawerOpen = () => {
    setOpen(!open);
  };

  const [productsList, setProductsList] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [totalData, setTotalData] = React.useState(0);
  // filter
  const initialState = {
    search: "",
    filter_type: '', 
    filter_id: '',
    vehicle_brands: [],
    product_categories: [],
    colors: [],
    price: '',
    rating: 0
  };
  const [filter, setFilter] = useState(initialState);
  const [filterBtn, setFilterBtn] = useState('All');

  // search filter
  const handleSearch = async (event) => {
    const newString = event?.target.value;
    setFilter({ ...filter, search: newString });
  };

  // sort options
  const [anchorElFilter, setAnchorElFilter] = useState(null);
  const [addOpen, setAddOpen] = useState(false);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event?.target.value, 10));
    setPage(0);
  };

  const openSortFilter = Boolean(anchorElFilter);

  const handleClickFliter = (event) => {
    setAnchorElFilter(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorElFilter(null);
  };

  useEffect(() => {
    setLoading(true);
    handleProductList(page + 1);
  }, [page, rowsPerPage, filter]);

  useEffect(() => {
    setOpen(!matchDownLG);
  }, [matchDownLG]);

  useEffect(() => {
    getproductLImit();
    dispatch(getProducts());
  }, []);

  const handleFilter = (type, value, ratingValue) => {
      setPage(0); // Reset to first page on any filter change to see new results
      if (type === 'reset') {
          setFilter(initialState);
          setFilterBtn('All');
      } else if (type === 'rating') {
          setFilter({ ...filter, rating: ratingValue });
      } else if (type === 'price') {
          setFilter({ ...filter, price: value });
      } else {
          const newArray = filter[type] ? [...filter[type]] : [];
          const index = newArray.indexOf(value);
          if (index > -1) {
              newArray.splice(index, 1);
          } else {
              newArray.push(value);
          }
          setFilter({ ...filter, [type]: newArray });
          setFilterBtn('Filtered');
      }
  };

  const handleHideShowProduct = useCallback(async (productId) => {
    const response = await API.put(`/product/hide-show/${productId}`);
    if (response.data.statusCode === 200) {
      const temp = productsList.slice();
      const index = temp.findIndex(prod => prod.id === productId);
      if (index > -1) {
        temp[index].is_hide = !temp[index].is_hide;
        setProductsList(temp);
      }
    }
  }, [productsList]);

  const ProductList = () => {
    if (productsList && productsList.length > 0) {
      return (<>
        {
          productsList.map((product, index) => (
            <Grid
              key={index}
              item
              xs={12}
              sm={6}
              md={4}
              lg={3}
            >
              <ProductCard
                id={product.id}
                image={getProductPicture(product) ? getProductPicture(product) : null}
                name={product.name}
                description={product.detail}
                offerPrice={product?.discounted_price > 0 ? product?.discounted_price : product.original_price}
                salePrice={getProductPrice(product)}
                isShowOrignalPrice={product?.discounted_price > 0}
                rating={product.ratings}
                color={product.colors ? "black" : undefined}
                isHide={product.is_hide}
                onHideShowProduct={handleHideShowProduct}
              />
            </Grid>
          ))
        }
      </>
      )
    }

    return (
      <Grid item xs={12} sx={{ mt: 3 }}>
        <ProductEmpty />
      </Grid>
    )
  }

  const spacingMD = matchDownMD ? 1 : 1.5;

  const handleProductList = async (pageNumber) => {
    try {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      // Use setTimeout to delay API call
      timeoutId = setTimeout(async () => {
        const params = {
          page: pageNumber || 1,
          limit: rowsPerPage,
          ...removeNullValues(filter)
        };

        const response = await API.get(`/product/get-list`, {
          params
        });

        if (response && response?.data && response?.data?.data && response?.data?.data?.list) {
          setProductsList(response?.data?.data?.list);
          setTotalData(response?.data?.data?.total_count || 0);
          setLoading(false);
        }
      }, debounceDelay);

    } catch (error) {
      setLoading(false);
      errorAlert("Something went wrong while getting the product List");
    }
  };

  const handleClickOpenDialog = () => {
    setAddOpen(true);
  };

  const handleCloseDialog = () => {
    setAddOpen(false);
    handleProductList(page + 1);
  };

  const handleKeyPress = (event) => {
    if (event?.key === "-" || event?.key === "+") {
      event.preventDefault();
    }
  };

  const updateField = (e) => {
    const val = e.target.value;
    var numbers = /^[0-9]+$/;
    if (val.match(numbers)) {
      setProductLimit(e.target.value);
    }
    if (val == 0) {
      setProductLimit(1);
    }
  };

  const getproductLImit = async () => {
    let currentLimit = await getLimit();
    if (currentLimit) {
      setProductLimit(currentLimit?.data?.dashboard_products_limit);
      setProductLimitData(currentLimit?.data);
    }
  };

  const updateproductLImit = async (e) => {
    if (Object.keys(productLimitData).length > 0) {
      let payload = {
        dashboard_products_limit: productLImit,
        id: productLimitData?.id
      };
      let createLimit = await updateLimit(payload);
    } else {
      let payload = {
        dashboard_products_limit: productLImit
      };
      let createLimit = await crateLimit(payload);

      setProductLimit(createLimit?.data?.dashboard_products_limit);
      setProductLimitData(createLimit?.data);
    }
  };

  const dataFilter = [
    {
      id: 0, name: 'All',
    },
    ...vehicles,
    ...categoryList
  ];

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Grid
          container
          alignItems="center"
          justifyContent="space-between"
          spacing={matchDownMD ? 0.5 : 2}
        >
          <Grid item>
            <Typography variant="h4">Products</Typography>
          </Grid>

          <Grid item>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="center"
              spacing={matchDownSM ? 0.5 : spacingMD}
            >
              {!isUserModerator && <>
                <TextField
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        Dashboard Products Limit
                      </InputAdornment>
                    ),
                  }}
                  type="number"
                  onChange={updateField}
                  placeholder="Update Limit"
                  value={productLImit}
                  size="small"
                  onKeyPress={(event) => {
                    handleKeyPress(event);
                  }}
                />
                <Button
                  type="button"
                  variant="outlined"
                  onClick={updateproductLImit}
                >
                  Update
                </Button>
              </>}
              <TextField
                sx={{ width: { xs: 140, md: "auto" } }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
                value={filter.search}
                placeholder="Search Product"
                size="small"
                onKeyUp={handleSearch}
                onChange={handleSearch}
              />
              <Typography
                sx={{
                  pl: 1.5,
                  fontSize: "1rem",
                  color: "grey.500",
                  fontWeight: 400,
                }}
              >
                |
              </Typography>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="center"
                sx={{ display: { xs: "none", sm: "flex" } }}
              >
                <Button
                  disableRipple
                  onClick={handleDrawerOpen}
                  color="secondary"
                  startIcon={
                    <FilterAltIcon
                      sx={{ fontWeight: 500, color: "secondary.200" }}
                    />
                  }
                >
                  Filter
                </Button>
              </Stack>

              {!isUserModerator && (
                <>
                  <CsvToolbar entityName="products" onImportComplete={() => handleProductList(page + 1)} />
                  <Tooltip title="Add Product">
                    <Fab
                      color="primary"
                      size="small"
                      onClick={handleClickOpenDialog}
                      sx={{
                        boxShadow: "none",
                        ml: 1,
                        width: 32,
                        height: 32,
                        minHeight: 32,
                      }}
                    >
                      <AddIcon fontSize="small" />
                    </Fab>
                  </Tooltip>
                </>
              )}
              <ProductAdd
                setCategoryList={setCategoryList}
                setVehicles={setVehicles}
                setColorList={setColorList}
                open={addOpen}
                handleCloseDialog={handleCloseDialog}
              />
            </Stack>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Divider sx={{ borderColor: "grey.400" }} />
      </Grid>
      <Grid item xs={12}>
        <Box sx={{ display: "flex" }}>
          <Main open={open}>
            <Grid container spacing={gridSpacing}>
              {isLoading
                ? productsListLoading.map((item, index) => (
                  <Grid key={index} item xs={12} sm={6} md={4} lg={3}>
                    <SkeletonProductPlaceholder />
                  </Grid>
                ))
                : <ProductList />}
            </Grid>
          </Main>
          <Drawer
              sx={{
                  ml: open ? 3 : 0,
                  height: matchDownLG ? '100vh' : 'auto',
                  flexShrink: 0,
                  zIndex: { xs: 1200, lg: 'unset' },
                  '& .MuiDrawer-paper': {
                      height: matchDownLG ? '100vh' : 'auto',
                      width: appDrawerWidth,
                      boxSizing: 'border-box',
                      position: 'relative',
                      border: 'none',
                      borderRadius: matchDownLG ? 0 : `${gridSpacing}px`
                  }
              }}
              variant={matchDownLG ? 'temporary' : 'persistent'}
              anchor="right"
              open={open}
              onClose={handleDrawerOpen}
              ModalProps={{ keepMounted: true }}
          >
              {open && <ProductFilter filter={filter} handelFilter={handleFilter} categories={categoryList} vehicles={vehicles} colorOptions={colorList} />}
          </Drawer>
        </Box>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50, 100]}
          component="div"
          count={totalData}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Grid>
    </Grid>
  );
};

export default ProductsList;
