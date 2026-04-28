import PropTypes from "prop-types";
import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../../api/axios";

// material-ui
import { styled, useTheme } from "@mui/material/styles";
import {
  CardContent,
  Checkbox,
  Fab,
  Grid,
  IconButton,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  TextField,
  Tooltip,
  Typography,
  Dialog,
  Box,
  Drawer,
  Divider,
  Stack,
  Menu,
  MenuItem,
  useMediaQuery,
  Toolbar
} from "@mui/material";

// third-party
import { format } from "date-fns";

// project imports
import MainCard from "ui-component/cards/MainCard";
import Avatar from "ui-component/extended/Avatar";
import Chip from "ui-component/extended/Chip";
import ProductFilter from "./Products/ProductFilter";
import { appDrawerWidth, gridSpacing, getProductPicture } from "store/constant";

// assets
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterListTwoTone";
import PrintIcon from "@mui/icons-material/PrintTwoTone";
import FileCopyIcon from "@mui/icons-material/FileCopyTwoTone";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/AddTwoTone";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
import DeleteModal from "./components/deleteModal";
import AddAndCreateForm from "./components/addAndCreateProduct";
import { errorAlert } from "views/helpers";

// Debounce delay time in milliseconds
const debounceDelay = 1000;
let timeoutId = null;

const removeNullValues = (obj) => {
  const result = { ...obj };
  for (var propName in result) {
    if (result[propName] === "" || (Array.isArray(result[propName]) && result[propName].length === 0)) {
      delete result[propName];
    }
  }
  return result;
};

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

// table header options
const headCells = [
  {
    id: "id",
    numeric: true,
    label: "#",
    align: "center",
  },
  {
    id: "name",
    numeric: false,
    label: "Product Name",
    align: "left",
  },
  {
    id: "created",
    numeric: false,
    label: "Created",
    align: "left",
  },
  {
    id: "price",
    numeric: true,
    label: "Price",
    align: "right",
  },
  {
    id: "sale-price",
    numeric: true,
    label: "Sale Price",
    align: "right",
  },
  {
    id: "status",
    numeric: true,
    label: "Status",
    align: "center",
  },
  {
    id: "is_saleable",
    numeric: false,
    label: "Online Sale",
    align: "center",
  },
];

// ==============================|| TABLE HEADER ||============================== //

function EnhancedTableHead({
  onSelectAllClick,
  order,
  orderBy,
  numSelected,
  rowCount,
  onRequestSort,
  theme,
  selected,
}) {
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox" sx={{ pl: 3 }}>
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
          />
        </TableCell>
        {numSelected > 0 && (
          <TableCell padding="none" colSpan={7}>
            <Toolbar sx={{ p: 0, pl: 2, pr: 1, color: "secondary.main" }}>
              <Typography sx={{ flex: "1 1 100%" }} color="inherit" variant="h4" component="div">
                {numSelected} Selected
              </Typography>
              <Tooltip title="Delete">
                <IconButton size="large">
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Toolbar>
          </TableCell>
        )}
        {numSelected <= 0 &&
          headCells.map((headCell) => (
            <TableCell
              key={headCell.id}
              align={headCell.align}
              sortDirection={orderBy === headCell.id ? order : false}
            >
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : "asc"}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
              </TableSortLabel>
            </TableCell>
          ))}
        {numSelected <= 0 && (
          <TableCell align="center" sx={{ pr: 3 }}>
            <Typography variant="subtitle1" sx={{ color: theme.palette.mode === "dark" ? "grey[600]" : "grey.900" }}>
              Action
            </Typography>
          </TableCell>
        )}
      </TableRow>
    </TableHead>
  );
}

// ==============================|| PRODUCT LIST ||============================== //

const ProductList = () => {
  const theme = useTheme();
  const matchDownLG = useMediaQuery(theme.breakpoints.down("xl"));

  // table state
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("updatedAt");
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isLoading, setLoading] = useState(true);

  // data state
  const [productList, setProductList] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [deleteModal, setDeleteModal] = useState(false);
  const [id, setID] = useState(null);
  const [addAndCreateProduct, setAddAndCreateProduct] = useState(false);

  // filter & drawer
  const [open, setOpen] = useState(!matchDownLG);
  const initialState = {
    search: "",
    vehicle_brands: [],
    product_categories: [],
    colors: [],
    price: '',
    rating: 0
  };
  const [filter, setFilter] = useState(initialState);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleDrawerOpen = () => {
    setOpen(!open);
  };

  const handleProductList = async (pageNumber) => {
    try {
      if (timeoutId) clearTimeout(timeoutId);
      
      timeoutId = setTimeout(async () => {
        setLoading(true);
        const params = {
          page: pageNumber || 1,
          limit: rowsPerPage,
          sort_by: orderBy,
          sort_order: order.toUpperCase(),
          ...removeNullValues(filter)
        };

        const response = await API.get("/product/get-list", { params });
        if (response?.data?.data?.list) {
          setProductList(response.data.data.list);
          setTotalData(response.data.data.total_count || 0);
          setLoading(false);
        }
      }, debounceDelay);
    } catch (error) {
      setLoading(false);
      errorAlert("Something went wrong while getting the Product List");
    }
  };

  useEffect(() => {
    handleProductList(page + 1);
  }, [page, rowsPerPage, filter, order, orderBy]);

  useEffect(() => {
    setOpen(!matchDownLG);
  }, [matchDownLG]);

  const handleSearch = (event) => {
    const newString = event?.target.value;
    setFilter({ ...filter, search: newString || "" });
    setPage(0);
  };

  const handleFilter = (type, value, ratingValue) => {
    setPage(0);
    if (type === 'reset') {
        setFilter(initialState);
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
    }
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelectedId = productList?.map((n) => n.id);
      setSelected(newSelectedId);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event?.target.value, 10));
    setPage(0);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  const handleDelete = () => {
    setDeleteModal(false);
    API.delete(`/product/delete/${id}`)
      .then(() => {
        setID(null);
        handleProductList(page + 1);
      })
      .catch(() => {
        setID(null);
        errorAlert("Something went wrong while deleting this Product.");
      });
  };

  const handleEcommerceToggle = (productId, isSaleable) => {
    API.post("/product/toggle-ecommerce", { product_id: productId, is_saleable: !isSaleable })
      .then(() => {
        handleProductList(page + 1);
      })
      .catch(() => {
        errorAlert("Something went wrong while updating Online Sale status.");
      });
  };

  return (
    <MainCard title="Inventory Management" content={false}>
      <CardContent sx={{ pb: 0 }}>
        <Grid container justifyContent="space-between" alignItems="center" spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              sx={{ width: { xs: '100%', sm: 300 } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
              onChange={handleSearch}
              placeholder="Search Automotive Inventory"
              value={filter.search}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6} sx={{ textAlign: "right" }}>
            <Stack direction="row" spacing={1} justifyContent="flex-end" alignItems="center">
              <Tooltip title="Filter Sidebar">
                <IconButton size="large" onClick={handleDrawerOpen} color="secondary">
                  <FilterListIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Add Product">
                <Fab
                  color="primary"
                  size="small"
                  onClick={() => setAddAndCreateProduct(true)}
                  sx={{ boxShadow: "none", width: 32, height: 32, minHeight: 32 }}
                >
                  <AddIcon fontSize="small" />
                </Fab>
              </Tooltip>
            </Stack>
          </Grid>
        </Grid>
      </CardContent>

      <Box sx={{ display: "flex", mt: 2 }}>
        <Main open={open}>
          <TableContainer>
            <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
              <EnhancedTableHead
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={productList.length}
                theme={theme}
                selected={selected}
              />
              <TableBody>
                {productList.map((row, index) => {
                  const isItemSelected = isSelected(row.id);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.id}
                      selected={isItemSelected}
                    >
                      <TableCell padding="checkbox" sx={{ pl: 3 }} onClick={(event) => handleClick(event, row.id)}>
                        <Checkbox color="primary" checked={isItemSelected} />
                      </TableCell>
                      <TableCell align="center">
                        <Avatar src={getProductPicture(row)} size="md" variant="rounded" />
                      </TableCell>
                      <TableCell>
                        <Typography
                          component={Link}
                          to={`/product-details/${row.id}`}
                          variant="subtitle1"
                          sx={{ color: "grey.900", textDecoration: "none", fontWeight: 500 }}
                        >
                          {row.name}
                        </Typography>
                        <Typography variant="caption" color="textSecondary" sx={{ display: 'block' }}>
                           {row.product_category?.name} | {row.brand?.name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {format(new Date(row.createdAt), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell align="right">₹{row.original_price}</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600, color: 'success.dark' }}>
                        ₹{row.discounted_price || row.original_price}
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          size="small"
                          label={row.availability ? "In Stock" : "Out of Stock"}
                          chipcolor={row.availability ? "success" : "error"}
                          sx={{ borderRadius: "4px" }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Checkbox 
                          color="secondary" 
                          checked={!!row.ecommerce} 
                          onChange={() => handleEcommerceToggle(row.id, !!row.ecommerce)} 
                        />
                      </TableCell>
                      <TableCell align="center" sx={{ pr: 3 }}>
                        <IconButton onClick={(e) => { setAnchorEl(e.currentTarget); setID(row.id); }} size="large">
                          <MoreHorizOutlinedIcon fontSize="small" sx={{ color: "grey.500" }} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50, 100]}
            component="div"
            count={totalData}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Main>
        
        <Drawer
            sx={{
                ml: open ? 3 : 0,
                flexShrink: 0,
                zIndex: { xs: 1200, lg: 'unset' },
                '& .MuiDrawer-paper': {
                    height: 'auto',
                    width: appDrawerWidth,
                    boxSizing: 'border-box',
                    position: 'relative',
                    border: 'none',
                    borderRadius: matchDownLG ? 0 : `${gridSpacing}px`,
                    p: 2
                }
            }}
            variant={matchDownLG ? 'temporary' : 'persistent'}
            anchor="right"
            open={open}
            onClose={handleDrawerOpen}
            ModalProps={{ keepMounted: true }}
        >
            {open && <ProductFilter filter={filter} handelFilter={handleFilter} />}
        </Drawer>
      </Box>

      <Menu
        id="action-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        variant="selectedMenu"
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem onClick={() => setAnchorEl(null)}>Edit</MenuItem>
        <MenuItem onClick={() => { setDeleteModal(true); setAnchorEl(null); }}>Delete</MenuItem>
      </Menu>

      {deleteModal && (
        <DeleteModal
          title="Delete Product"
          open={deleteModal}
          type="Product"
          setOpen={setDeleteModal}
          handleDelete={handleDelete}
        />
      )}
      {addAndCreateProduct && (
        <Dialog
          maxWidth="sm"
          fullWidth
          onClose={() => setAddAndCreateProduct(false)}
          open={addAndCreateProduct}
          sx={{ "& .MuiDialog-paper": { p: 0 } }}
        >
          <AddAndCreateForm />
        </Dialog>
      )}
    </MainCard>
  );
};

export default ProductList;
