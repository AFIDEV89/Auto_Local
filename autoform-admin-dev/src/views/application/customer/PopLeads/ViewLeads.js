import { Box, Modal, Typography, Grid } from "@mui/material";
import React, { useEffect } from "react";
import Api from "api/axios";
import { errorAlert } from "views/helpers";

const ViewLeads = ({ showModal, toggleModal, viewLeadId }) => {
  const [leadDetail, setLeadDetail] = React.useState({});

  const getPopLeadDetails = async () => {
    const response = await Api.get(`pop-lead/admin/${viewLeadId}`);
    if (response && response.data) {
      setLeadDetail(response.data.data);
    } else {
      setLeadDetail({});
      errorAlert("Failed to fetch lead details");
    }
  };

  useEffect(() => {
    if (showModal && viewLeadId) {
        getPopLeadDetails();
    }
  }, [showModal, viewLeadId]);

  return (
    <Modal
      open={showModal}
      onClose={toggleModal}
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '16px',
      }}
    >
      <Box
        style={{
          width: '500px',
          backgroundColor: '#ffffff',
          padding: '24px',
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
        }}
      >
        <Typography variant="h3" gutterBottom sx={{ color: '#ffb100', borderBottom: '2px solid #ffb100', pb: 1, mb: 3 }}>
            Pop Lead Details
        </Typography>
        
        {Object.keys(leadDetail).length !== 0 ? (
          <Grid container spacing={2}>
            <Grid item xs={12}>
                <Typography variant="subtitle2" color="textSecondary">Customer Name</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>{leadDetail.customer_name || "N/A"}</Typography>
            </Grid>
            <Grid item xs={12}>
                <Typography variant="subtitle2" color="textSecondary">Email Address</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>{leadDetail.email || "N/A"}</Typography>
            </Grid>
            <Grid item xs={12}>
                <Typography variant="subtitle2" color="textSecondary">Contact Number</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>{leadDetail.contact_no || "N/A"}</Typography>
            </Grid>
            <Grid item xs={12}>
                <Typography variant="subtitle2" color="textSecondary">Feedback / Message</Typography>
                <Typography variant="body1" sx={{ fontStyle: 'italic' }}>{leadDetail.feedback || "No feedback provided."}</Typography>
            </Grid>
            <Grid item xs={12}>
                <Typography variant="subtitle2" color="textSecondary">Current Status</Typography>
                <Typography variant="body1" sx={{ 
                    color: '#ffb100', 
                    fontWeight: 700, 
                    textTransform: 'uppercase',
                    fontSize: '0.8rem'
                }}>
                    {leadDetail.status || "NEW_LEAD"}
                </Typography>
            </Grid>
          </Grid>
        ) : (
          <Typography>Data Loading...</Typography>
        )}
      </Box>
    </Modal>
  );
};

export default ViewLeads;
