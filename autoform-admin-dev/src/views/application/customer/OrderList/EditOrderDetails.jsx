import React from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField } from "@mui/material";

const EditOrderDetails = ({
    formValues,
    onClose,
    open,
    setFormValues,
    onSave
}) => {
    return (
        <Dialog
            fullWidth
            onClose={onClose}
            open={open}
        >
            <DialogTitle>
                Order Courier Details
            </DialogTitle>
            <DialogContent dividers>
                <Grid container spacing={3}>
                    <Grid item xs={6}>
                        <TextField
                            onChange={(e) => setFormValues(prev => ({ ...prev, courier_partner: e.target.value || null }))}
                            placeholder="Courier Partner"
                            label="Courier Partner"
                            value={formValues.courier_partner}
                            size="small"
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            onChange={(e) => setFormValues(prev => ({ ...prev, awb_no: e.target.value || null }))}
                            placeholder="AWB Number"
                            label="AWB Number"
                            value={formValues.awb_no}
                            size="small"
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            onChange={(e) => setFormValues(prev => ({ ...prev, comments: e.target.value || null }))}
                            placeholder="Comments"
                            label="Comments"
                            value={formValues.comments}
                            size="small"
                            fullWidth
                            multiline
                            rows={3}
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={onSave} variant="contained">
                    Update
                </Button>
                <Button onClick={onClose}>
                    Close
                </Button>
            </DialogActions>
        </Dialog>)
}

export default EditOrderDetails;