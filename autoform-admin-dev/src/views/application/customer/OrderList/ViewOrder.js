import React, { useState, useEffect } from 'react';
import API from "api/axios";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';

const headCells = [
  {
    id: 'id',
    label: 'ID',
    align: 'left'
  },
  {
    id: 'name',
    label: 'Product',
    align: 'left'
  },
  {
    id: 'detail',
    label: 'Detail',
    align: 'left'
  },
  {
    id: 'Qty',
    label: 'Quantity',
    align: 'center'
  },
  {
    id: 'Price',
    label: 'Price',
    align: 'left'
  },
  {
    id: 'amount',
    label: 'Amount',
    align: 'left'
  }
];

const ViewOrder = ({
  viewOrderId,
  open,
  onClose
}) => {
  const [viewOrderData, setViewOrderData] = useState([]);

  const handleOrderList = async (id) => {
    try {
      const response = await API.get(`/order/${id}`);

      if (response && response.data && response.data.data) {
        const orderListData = response.data.data;
        setViewOrderData(orderListData);
      }
    } catch (error) {
      alert("Something went wrong while getting the Store List");
    }
  };

  useEffect(() => {
    if (viewOrderId) {
      handleOrderList(viewOrderId);
    }
  }, [viewOrderId]);

  return (
    <Dialog
      maxWidth="md"
      fullWidth
      onClose={onClose}
      open={open}
    >
      <DialogTitle>
        Orders
      </DialogTitle>
      <DialogContent dividers>
        <Box display="flex" justifyContent="space-between" gap={2}>
          <Paper variant="outlined" sx={{ padding: 2, marginBottom: 2, flex: 1 }}>
            <Typography variant='body2' mb={2}>Customer Email:</Typography>
            <Typography variant='subtitle2' mb={1}>{viewOrderData?.user?.email}</Typography>
          </Paper>
          <Paper variant="outlined" sx={{ padding: 2, marginBottom: 2, flex: 1 }}>
            <Typography variant='body2' mb={2}>Customer Mobile:</Typography>
            <Typography variant='subtitle2'>{viewOrderData?.user?.mobile_no}</Typography>
          </Paper>
          <Paper variant="outlined" sx={{ padding: 2, marginBottom: 2, flex: 1 }}>
              <Typography variant='body2'>Shipment Address:</Typography>

            {viewOrderData.user_address && (<Box>
              <Typography variant='subtitle2'>{viewOrderData.user_address.street_address}</Typography>
              <Typography variant='subtitle2'>{viewOrderData.user_address.city}, {viewOrderData.user_address.state}, {viewOrderData.user_address.country}</Typography>
              <Typography variant='subtitle2'>Postal code: {viewOrderData.user_address.postal_code}</Typography>
            </Box>)}

          </Paper>
        </Box>

        <TableContainer>
          <Table size='small'>
            <TableHead>
              <TableRow>
                {headCells.map((headCell) => (
                  <TableCell key={headCell.id}>
                    {headCell.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {
                viewOrderData?.order_products?.map((row, index) => {
                  return (
                    <TableRow hover key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell>{row.product_id}</TableCell>
                      <TableCell>{row?.product?.name}</TableCell>
                      <TableCell>{row?.product?.detail}</TableCell>
                      <TableCell>{row?.quantity}</TableCell>
                      <TableCell>{row?.amount_per_product}</TableCell>
                      <TableCell>{row?.total_amount}</TableCell>
                    </TableRow>
                  )
                })
              }
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};


export default ViewOrder;
