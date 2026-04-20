import React, { useState, useEffect } from "react";
import {
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Typography,
  Divider,
  CircularProgress
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import API from "api/axios";
import { successAlert, apiErrorHandler } from "views/helpers";

const StoreRatingsDialog = ({ store, onClose }) => {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (store?.StoreID) {
      fetchRatings();
    }
  }, [store]);

  const fetchRatings = async () => {
    setLoading(true);
    try {
      const response = await API.get(`/store-locator-isolated/get-detailed-ratings/${store.StoreID}`);
      setRatings(response.data.data || []);
    } catch (error) {
      apiErrorHandler(error, "Failed to fetch ratings.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (email) => {
    if (window.confirm("Are you sure you want to delete this rating?")) {
      try {
        await API.delete("/store-locator-isolated/delete-rating", {
          data: { storeid: store.StoreID, email }
        });
        successAlert("Rating deleted successfully.");
        fetchRatings();
      } catch (error) {
        apiErrorHandler(error, "Failed to delete rating.");
      }
    }
  };

  return (
    <>
      <DialogTitle>
        <Typography variant="h4">Ratings for {store?.StoreName}</Typography>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ p: 2, minHeight: '300px' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
            <CircularProgress color="secondary" />
          </div>
        ) : ratings.length === 0 ? (
          <Typography align="center" sx={{ py: 5 }}>No ratings found for this store.</Typography>
        ) : (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Email / Mobile</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>Rating</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>Date</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {ratings.map((row) => (
                  <TableRow key={row.email}>
                    <TableCell>{row.name || "N/A"}</TableCell>
                    <TableCell>
                      <Typography variant="body2">{row.email}</Typography>
                      <Typography variant="caption" color="textSecondary">{row.mobile}</Typography>
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold', color: '#efb810' }}>
                      {row.rating} ★
                    </TableCell>
                    <TableCell align="center">
                      {new Date(row.submitted_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton color="error" onClick={() => handleDelete(row.email)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DialogContent>
      <Divider />
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} color="primary" variant="outlined">Close</Button>
      </DialogActions>
    </>
  );
};

export default StoreRatingsDialog;
