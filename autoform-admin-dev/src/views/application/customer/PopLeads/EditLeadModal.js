import { FormControl, InputLabel, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, MenuItem, Select, TextField } from "@mui/material";
import { useState } from "react";
import API from "api/axios";
import { errorAlert, successAlert } from "views/helpers";

function removeEmptyValues(obj) {
    return Object.fromEntries(
        Object.entries(obj).filter(([_, v]) => v !== null && v !== undefined && v !== "")
    );
}
const EditLeadModal = ({
    onClose,
    open,
    initialValues,
    closeModal,
    isEditing,
    id
}) => {

    let [formValues, setFormValues] = useState({
        customer_name: initialValues?.customer_name || "",
        email: initialValues?.email || "",
        contact_no: initialValues?.contact_no || "",
        feedback: initialValues?.feedback || "",
        status: initialValues?.status || "",
    })

    const handleSave = async () => {
        if (!formValues.contact_no) {
            errorAlert("Please enter customer number");
            return;
        }
        try {
            formValues = removeEmptyValues(formValues)
            if (isEditing) {
                const response = await API.put("/pop-lead/admin/" + id, { ...formValues, id });
                if (response.status >= 200 && response.status < 300)  {
                    successAlert("Pop Lead Edited Successfully");
                    closeModal();
                }
            } else {
                const response = await API.post("/pop-lead", formValues);
                    if (response.status >= 200 && response.status < 300) {
                    successAlert("Pop Lead Added Successfully");
                    closeModal();
                }
            }
        }
        catch (error) {
            console.log(error)
            errorAlert("Something went wrong while saving pop lead");
            closeModal();
        }
    }
    return (
        <Dialog
            fullWidth
            onClose={onClose}
            open={open}
        >
            <DialogTitle sx={{ color: '#ffb100' }}>
                {isEditing ? "Edit" : "Add"} Pop Lead Details
            </DialogTitle>
            <DialogContent dividers>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <TextField
                            onChange={(e) => setFormValues(prev => ({ ...prev, customer_name: e.target.value || null }))}
                            placeholder="Customer Name"
                            label="Customer Name"
                            value={formValues.customer_name}
                            size="small"
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            onChange={(e) => setFormValues(prev => ({ ...prev, email: e.target.value || null }))}
                            placeholder="Email Address"
                            label="Email Address"
                            value={formValues.email}
                            size="small"
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            onChange={(e) => setFormValues(prev => ({ ...prev, contact_no: e.target.value || null }))}
                            placeholder="Customer Number*"
                            label="Customer Number*"
                            value={formValues.contact_no}
                            size="small"
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <FormControl fullWidth size="small">
                            <InputLabel id={'a-demo-simple-select-label'}>Select Status</InputLabel>
                            <Select
                                size="small"
                                fullWidth
                                label="Select Status"
                                labelId="a-demo-simple-select-label"
                                id="demo-simple-selectStatus"
                                value={formValues.status || ""}
                                onChange={(e) => setFormValues(prev => ({ ...prev, status: e.target.value || "" }))}
                            >
                                <MenuItem value="new_lead">New Lead</MenuItem>
                                <MenuItem value="callback">Call Back</MenuItem>
                                <MenuItem value="calldone">Call Done</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            onChange={(e) => setFormValues(prev => ({ ...prev, feedback: e.target.value || null }))}
                            placeholder="Feedback"
                            label="Feedback"
                            value={formValues.feedback}
                            fullWidth
                            rows={3}
                            multiline
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleSave} variant="contained" sx={{ backgroundColor: '#ffb100', '&:hover': { backgroundColor: '#e69f00' } }}>
                    {isEditing ? "Save Changes" : "Create Pop Lead"}
                </Button>
                <Button onClick={onClose} color="inherit">
                    Cancel
                </Button>
            </DialogActions>
        </Dialog >
    );
}

export default EditLeadModal;
