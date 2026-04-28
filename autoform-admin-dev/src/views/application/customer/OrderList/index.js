import React, { useEffect, useState } from "react";
import API from "api/axios";
import { format } from "date-fns";

import {
  Box,
  CardContent,
  Button,
  Grid,
  IconButton,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableHead,
  TableRow,
  TextField,
  Typography,
  MenuItem,
  InputLabel,
  FormControl
} from "@mui/material";
import Select from "@mui/material/Select";

import MainCard from "ui-component/cards/MainCard";
import { useDispatch } from "store";

import SearchIcon from "@mui/icons-material/Search";
import VisibilityTwoToneIcon from "@mui/icons-material/VisibilityTwoTone";
import EditIcon from '@mui/icons-material/Edit';
import ViewOrder from "./ViewOrder";
import OrderStatusConfirmationDialog from "./OrderStatusConfirmationDialog";
import { successAlert, errorAlert } from "../../../helpers";
import usePermission from "hooks/usePermission";
import EditOrderDetails from "./EditOrderDetails";

const headCells = [
  {
    id: "id",
    numeric: true,
    label: "ID",
    align: "left",
  },
  {
    id: "name",
    numeric: false,
    label: "Customer Name",
    align: "left",
  },
  {
    id: "Email",
    numeric: false,
    label: "Email",
    align: "left",
  },
  {
    id: "store",
    numeric: true,
    label: "Store",
    align: "left",
  },

  {
    id: "Payment",
    numeric: true,
    label: "Payment Type",
    align: "left",
  },
  {
    id: "amount",
    numeric: true,
    label: "Total Amount",
    align: "left",
  },
  {
    id: "date",
    numeric: true,
    label: "Order Created",
    align: "center",
  },
  {
    id: "status",
    numeric: false,
    label: "Status",
    align: "center",
  }
];

const OrderList = () => {
  const dispatch = useDispatch();
  const { isUserModerator } = usePermission();

  const [search, setSearch] = useState("");
  const [orderList, setOrderList] = useState([]);
  const [openViewOrder, setOpenViewOrder] = useState(false);
  const [openEditOrder, setOpenEditOrder] = useState(false);

  const [viewOrderId, setViewOrderId] = useState(null);
  const [storeId, setStoreId] = useState("");
  const [orderStatus, setOrderStatus] = useState("");
  const [storeInfo, setStoreInfo] = useState([]);
  const [filterCall, setFilterCall] = useState(false);
  const [changeStatus, setChangeStatus] = useState("");
  const [changeStatusData, setChangeStatusData] = useState({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalData, setTotalData] = useState(0);
  const [formValues, setFormValues] = useState({
    courier_partner: null,
    awb_no: null,
    comments: null
  })

  const handleOrderList = async (p, param) => {
    let page = p ? p : 1;
    try {
      const response = await API.get(`/order/get-list?page=${page}&limit=${rowsPerPage}`,
        {
          params: !!param ? param : "",
        }
      );

      if (
        response &&
        response?.data &&
        response?.data?.data &&
        response?.data?.data?.list
      ) {
        setTotalData(response?.data?.data?.total_count || 0);
        setOrderList(response?.data?.data?.list);
      }
    }
    catch (error) {
      alert("Something went wrong while getting the Store List");
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event?.target.value, 10));
    setPage(0);
  };

  const updateStatus = async () => {
    try {
      const response = await API.patch(`/order/change-status/${changeStatusData?.orderId}`, { status: changeStatusData?.orderStatus });

      if (response && response.data && response.data.statusCode === 204) {
        setTimeout(() => {
          setChangeStatus(false);
          successAlert(response.data.message);
        }, 200);
      } else {
        setChangeStatus(false);
        errorAlert(response.data.message);
      }
      handleOrderList(page + 1);
    } catch (error) {
      errorAlert("Something went wrong while getting the Store List");
    }
  };

  const handlestoreInfo = async () => {
    try {
      const response = await API.get("/store/get-list");
      if (response && response.data && response.data.data) {
        const storeData = response.data.data;
        setStoreInfo(storeData);
      }
    } catch (error) {
      alert("Something went wrong while getting the Store List");
    }
  };

  const handleSearch = (event) => {
    const newString = event?.target?.value;

    setSearch(newString || "");

    if (newString) {
      let stringVal = newString?.toString()?.toLowerCase();

      const newRows =
        orderList &&
        orderList.length > 0 &&
        orderList?.filter((row) => {
          let matches = true;
          let containsQuery = false;

          const fullName = `${row?.user?.first_name} ${row?.user?.last_name}`
          if (
            row &&
            row?.user &&
            (row?.user?.first_name
              ?.toString()
              ?.toLowerCase()
              ?.includes(stringVal) ||
              row?.user?.last_name
                ?.toString()
                ?.toLowerCase()
                ?.includes(stringVal) ||
              fullName?.toString()
                ?.toLowerCase()
                ?.includes(stringVal) ||

              row?.user?.email?.toString().toLowerCase().includes(stringVal) ||
              row?.user?.type?.toString().toLowerCase().includes(stringVal) ||
              row?.user?.status?.toString().toLowerCase().includes(stringVal) ||
              row?.store?.name?.toString().toLowerCase().includes(stringVal) ||
              row?.total_amount?.toString().toLowerCase().includes(stringVal) ||
              row?.payment_type?.toString().toLowerCase().includes(stringVal))
          ) {
            containsQuery = true;
          }

          if (!containsQuery) {
            matches = false;
          }
          return matches;
        });
      setOrderList(newRows);
    } else {
      handleOrderList(page + 1);
    }
  };


  const handleViewOrderClose = () => {
    setOpenViewOrder(false);
    setViewOrderId();
  };

  const handleEditOrderClose = () => {
    setOpenEditOrder(false);
  }

  const resetFilter = () => {
    setStoreId("");
    setPage(0);
    setOrderStatus("");
  };

  const handleChangeStatus = (status, id) => {
    setChangeStatusData({ orderStatus: status, orderId: id });
  };

  const handleChangeYes = () => {
    updateStatus();
  };

  const updateOrderCourierDetails = async () => {
    try {
      const response = await API.patch(`/order/courier_detail/${viewOrderId}`, { ...formValues });

      if (response && response.data && response.data.statusCode === 204) {
        successAlert(response.data.message);
        handleOrderList(page + 1);
        handleEditOrderClose();
      } else {
        errorAlert(response.data.message);
        handleEditOrderClose();
      }
    }
    catch (error) {
      errorAlert("Something went wrong while updating Courier details");
    }
  }

  useEffect(() => {
    handlestoreInfo();
    handleOrderList(page + 1);
  }, [dispatch]);

  useEffect(() => {
    const parma = {
      ...(storeId && { store_id: storeId }),
      ...(orderStatus && { status: orderStatus })
    };

    if (filterCall) {
      setSearch("");
      handleOrderList(page + 1, parma);
    }
    else {
      handleOrderList(page + 1);
    }
  }, [storeId, orderStatus, filterCall, page, rowsPerPage]);

  return (
    <MainCard title="Order List" content={false}>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={3}>
            <TextField
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
              onChange={handleSearch}
              placeholder="Search Order"
              value={search}
              size="small"
            />
          </Grid>

          <Grid item xs={12} sm={3}>
            <Box sx={{ minWidth: 120 }}>
              <FormControl fullWidth size="small">
                <InputLabel id="demo-simple-select-label">
                  Select Store
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={storeId}
                  label="Select Store"
                  placeholder="Select Store"
                  onChange={(e) => {
                    setFilterCall(true);
                    setPage(0);
                    setStoreId(e.target.value);
                  }}
                >
                  {storeInfo &&
                    storeInfo.length > 0 &&
                    storeInfo.map((row, index) => {
                      return (
                        <MenuItem key={index} value={row?.id}>
                          {row?.name}
                        </MenuItem>
                      );
                    })}
                </Select>
              </FormControl>
            </Box>
          </Grid>

          <Grid item xs={12} sm={3}>
            <Box sx={{ minWidth: 120 }}>
              <FormControl fullWidth size="small">
                <InputLabel id="demo-simple-select-labelStatus">
                  Select Status
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-selectStatus"
                  value={orderStatus}
                  label="Select Status"
                  placeholder="Select Status"
                  onChange={(e) => {
                    setFilterCall(true);
                    setPage(0);
                    setOrderStatus(e.target.value);
                  }}
                >
                  <MenuItem value={"new_order"}>New Order</MenuItem>
                  <MenuItem value={"completed"}>Completed</MenuItem>
                  <MenuItem value={"processing"}>Processing</MenuItem>
                  <MenuItem value={"pending"}>Pending</MenuItem>
                  <MenuItem value={"failed"}>Failed</MenuItem>
                  <MenuItem value={"cancelled"}>Cancelled</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Grid>

          <Grid item xs={12} sm={3}>
            <Button type="button" variant="outlined" onClick={resetFilter}>
              Reset
            </Button>
          </Grid>
        </Grid>
      </CardContent>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {
                headCells.map((headCell) => (
                  <TableCell key={headCell.id}>
                    {headCell.label}
                  </TableCell>
                ))
              }
              {!isUserModerator && (
                <TableCell align="center" sx={{ pr: 3 }}>
                  <Typography variant="subtitle1">
                    Action
                  </Typography>
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {
              orderList.map((row, index) => {
                return (
                  <TableRow hover key={index}>
                    <TableCell>{row.id}</TableCell>
                    <TableCell>{row?.user?.first_name} {row?.user?.last_name}</TableCell>
                    <TableCell>{row?.user?.email}</TableCell>
                    <TableCell size={"medium"}>{row?.store?.name}</TableCell>
                    <TableCell>{row?.payment_type}</TableCell>
                    <TableCell>{row?.total_amount}</TableCell>
                    <TableCell align="center">{format(new Date(row?.createdAt), "E, MMM d yyyy")}</TableCell>

                    <TableCell align="center">
                      <FormControl fullWidth size="small">
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-selectStatus"
                          value={row?.status}
                          label="Select Status"
                          placeholder="Select Status"
                          disabled={isUserModerator}
                          onChange={(e) => {
                            setChangeStatus(true);
                            handleChangeStatus(e.target.value, row.id);
                          }}
                        >
                          <MenuItem value="new_order">New Order</MenuItem>
                          <MenuItem value="completed">Completed</MenuItem>
                          <MenuItem value="processing">Processing</MenuItem>
                          <MenuItem value="pending">Pending</MenuItem>
                          <MenuItem value="failed">Failed</MenuItem>
                          <MenuItem value="cancelled">Cancelled</MenuItem>
                        </Select>
                      </FormControl>
                    </TableCell>

                    {!isUserModerator && <TableCell align="center" sx={{ pr: 3, display: "flex" }}>
                      <IconButton
                        onClick={(e) => {
                          setViewOrderId(row?.id);
                          setOpenViewOrder(true);
                        }}
                        color="primary"
                        size="medium"
                      >
                        <VisibilityTwoToneIcon sx={{ fontSize: "1.3rem" }} />
                      </IconButton>
                      <IconButton
                        onClick={(e) => {
                          setViewOrderId(row?.id);
                          setFormValues({
                            awb_no: row.awb_no,
                            comments: row.comments,
                            courier_partner: row.courier_partner
                          })
                          setOpenEditOrder(true);
                        }}
                        color="primary"
                        size="medium"
                      >
                        <EditIcon sx={{ fontSize: "1.3rem" }} />
                      </IconButton>
                    </TableCell>}
                  </TableRow>
                );
              })
            }
            {
              orderList.length === 0 && (
                <TableRow
                  style={{
                    height: 53,
                    textAlign: "center",
                  }}
                >
                  <TableCell align="center" colSpan={10}>
                    Record not found!
                  </TableCell>
                </TableRow>
              )
            }
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

      <ViewOrder
        open={openViewOrder}
        onClose={handleViewOrderClose}
        viewOrderId={viewOrderId}
      />

      <EditOrderDetails
        open={openEditOrder}
        onClose={handleEditOrderClose}
        setFormValues={setFormValues}
        formValues={formValues}
        onSave={updateOrderCourierDetails}
      />

      <OrderStatusConfirmationDialog
        open={changeStatus}
        setChangeStatus={setChangeStatus}
        handleChangeYes={handleChangeYes}
      />
    </MainCard>
  );
};

export default OrderList;
