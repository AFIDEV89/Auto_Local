import { Box, Modal, Typography, Divider, Stack } from "@mui/material";
import React, { useEffect } from "react";
import Api from "api/axios";
import { errorAlert } from "views/helpers";

const ViewLeads = ({ showModal, toggleModal, viewLeadId }) => {
  const [leadDetail, setLeadDetail] = React.useState({});

  const getLeadDetails = async () => {
    try {
      const response = await Api.get(`lead/admin/${viewLeadId}`);
      if (response && response.data) {
        setLeadDetail(response.data.data);
      }
    } catch (e) {
      errorAlert("Failed to fetch lead details");
    }
  };

  useEffect(() => {
    if (showModal && viewLeadId) {
      getLeadDetails();
    }
  }, [showModal, viewLeadId]);

  const parseCartSnapshot = (snapshot) => {
    if (!snapshot) return {};
    if (typeof snapshot === 'object') return snapshot;
    try {
      return JSON.parse(snapshot);
    } catch (e) {
      console.error("Failed to parse cart_snapshot", e);
      return {};
    }
  };

  const cart = parseCartSnapshot(leadDetail?.cart_snapshot);
  const currentProduct = cart.current_product || null;
  const cartItems = cart.cart_items || [];

  return (
    <Modal
      open={showModal}
      onClose={toggleModal}
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        p: 2,
      }}
    >
      <Box
        sx={{
          width: '500px',
          maxHeight: '80vh',
          backgroundColor: '#fff',
          borderRadius: '16px',
          boxShadow: 24,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box sx={{ p: 3, bgcolor: '#ffb200', color: '#fff' }}>
          <Typography variant="h3" sx={{ color: '#fff', fontWeight: 800 }}>Enquiry Details</Typography>
          <Typography variant="caption" sx={{ opacity: 0.9 }}>Lead ID: #{viewLeadId}</Typography>
        </Box>

        <Box sx={{ p: 3, overflowY: 'auto' }}>
          {leadDetail.id ? (
            <Stack spacing={3}>
              {currentProduct && (
                <Box>
                    <Typography variant="h5" color="secondary" sx={{ mb: 1.5, fontWeight: 700 }}>Primary Product Interest</Typography>
                    <Box sx={{ p: 2, bgcolor: '#fff9ea', borderRadius: '8px', border: '1px solid #ffe4a0' }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{currentProduct.name}</Typography>
                        <Typography variant="body2" color="textSecondary">ID: {currentProduct.id}</Typography>
                    </Box>
                </Box>
              )}

              {cartItems.length > 0 && (
                <Box>
                    <Typography variant="h5" sx={{ mb: 1.5, fontWeight: 700 }}>Also in Cart ({cartItems.length})</Typography>
                    <Stack spacing={1}>
                        {cartItems.map((item, i) => (
                            <Box key={i} sx={{ p: 1.5, bgcolor: '#f8f9fa', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Box>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{item.name}</Typography>
                                    <Typography variant="caption" color="textSecondary">Qty: {item.quantity}</Typography>
                                </Box>
                                <Typography variant="subtitle2" color="primary">₹{item.price}</Typography>
                            </Box>
                        ))}
                    </Stack>
                </Box>
              )}

              {!currentProduct && cartItems.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 4, opacity: 0.5 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '48px' }}>info</span>
                    <Typography>No specific product details captured.</Typography>
                </Box>
              )}
            </Stack>
          ) : (
            <Typography align="center" sx={{ py: 4 }}>Loading Lead Data...</Typography>
          )}
        </Box>
        
        <Box sx={{ p: 2, borderTop: '1px solid #eee', textAlign: 'center' }}>
           <Typography variant="caption" color="textSecondary">
               User Contact: {leadDetail.contact_no}
           </Typography>
        </Box>
      </Box>
    </Modal>
  );
};

export default ViewLeads;
