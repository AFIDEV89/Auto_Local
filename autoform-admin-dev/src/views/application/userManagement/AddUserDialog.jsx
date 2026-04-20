import React from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, MenuItem, TextField } from "@mui/material";
import { USER_TYPE } from "constants/User";

const AddUserDialog = ({
    formValue = {},
    open,
    handleClose,
    handleSubmit,
    handleChange,
    mode = "ADD"
}) => {
    const isValid = formValue && 
        formValue.first_name && 
        formValue.status && 
        formValue.last_name && 
        formValue.mobile_no && 
        formValue.type && 
        formValue.email &&
        formValue.mobile_no.length === 10

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            disableEnforceFocus
            fullWidth
        >
            <DialogTitle>
                {mode === "ADD" ? "Add New User" : "Edit User"}
            </DialogTitle>
            <Divider />
            <DialogContent>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <TextField
                            id="fname"
                            value={formValue.first_name}
                            name="first_name"
                            label="First Name"
                            fullWidth
                            required
                            onChange={(event) => handleChange("first_name", event.target.value)}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            id="lname"
                            value={formValue.last_name}
                            name="last_name"
                            label="Last Name"
                            fullWidth
                            required
                            onChange={(event) => handleChange("last_name", event.target.value)}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            id="password"
                            value={formValue.password}
                            name="password"
                            label="Password"
                            type="password"
                            fullWidth
                            onChange={(event) => handleChange("password", event.target.value)}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            id="email"
                            value={formValue.email}
                            name="email"
                            label="Email"
                            type="email"
                            fullWidth
                            required
                            onChange={(event) => handleChange("email", event.target.value)}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            id="mobile_no"
                            value={formValue.mobile_no}
                            name="mobile_no"
                            label="Mobile Number"
                            fullWidth
                            required
                            inputProps={{
                                maxLength: 10,
                                minLength: 10
                            }}
                            onChange={(event) => handleChange("mobile_no", event.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            id="status"
                            value={formValue.status}
                            name="status"
                            label="Status"
                            fullWidth
                            select
                            required
                            onChange={(event) => handleChange("status", event.target.value)}
                        >
                            <MenuItem value="active">Active</MenuItem>
                            <MenuItem value="inactive">Inactive</MenuItem>
                        </TextField>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            id="type"
                            value={formValue.type}
                            name="type"
                            label="Type"
                            fullWidth
                            select
                            required
                            onChange={(event) => handleChange("type", event.target.value)}
                        >
                            <MenuItem value={USER_TYPE.admin}>Admin</MenuItem>
                            <MenuItem value={USER_TYPE.user}>User/Customer</MenuItem>
                            <MenuItem value={USER_TYPE.editor}>Editor</MenuItem>
                            <MenuItem value={USER_TYPE.moderator}>Moderator</MenuItem>
                        </TextField>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>
                    Cancel
                </Button>
                <Button
                    onClick={() => handleSubmit(formValue)}
                    autoFocus
                    variant="contained"
                    disabled={!isValid}
                >
                    {mode === "ADD" ? "Add" : "Update"}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default AddUserDialog;