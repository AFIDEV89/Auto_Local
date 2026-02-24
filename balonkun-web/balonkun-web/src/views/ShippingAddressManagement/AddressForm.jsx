import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";

const INITAL_ADDRESS_FORM = {
    street_address: "",
    city: "",
    state: "",
    postal_code: "",
    country: "INDIA"
}

const AddressForm = ({
    formData = {},
    title,
    onCancel,
    onSubmit
}) => {
    const [form, setForm] = useState(INITAL_ADDRESS_FORM);

    useEffect(() => {
        if (formData && Object.keys(formData).length) {
            setForm(prev => ({ ...prev, ...formData }));
        }
    }, [formData])

    const isFormValid = (
        form.street_address &&
        form.city &&
        form.state &&
        form.postal_code &&
        form.postal_code.length === 6
    )

    return (
        <Box sx={{
            background: "#f5faff",
            padding: 2
        }}>
            <Typography fontSize={12} mb={2} fontWeight="bold">{title}</Typography>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField
                        id="street_address"
                        placeholder="Address (Area and Street)"
                        label="Address (Area and Street)"
                        required
                        multiline
                        fullWidth
                        rows={4}
                        value={form.street_address}
                        onChange={(e) => setForm(prev => ({ ...prev, street_address: e.target.value }))}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        id="city"
                        placeholder="City/District/Town"
                        required
                        label="City/District/Town"
                        fullWidth
                        value={form.city}
                        onChange={(e) => setForm(prev => ({ ...prev, city: e.target.value }))}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        id="state"
                        placeholder="State"
                        label="State"
                        required
                        fullWidth
                        value={form.state}
                        onChange={(e) => setForm(prev => ({ ...prev, state: e.target.value }))}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        id="postal_code"
                        placeholder="Pincode"
                        label="Pincode"
                        required
                        fullWidth
                        value={form.postal_code}
                        onChange={(e) => setForm(prev => ({ ...prev, postal_code: e.target.value }))}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        id="country"
                        placeholder="Country"
                        label="Country"
                        required
                        fullWidth
                        disabled
                        value="INDIA"
                    />
                </Grid>
            </Grid>

            <Box my={2} gap={4} display="flex">
                <Button
                    variant="contained"
                    disabled={!isFormValid}
                    onClick={() => {
                        onSubmit(form)
                    }}>
                    Save
                </Button>

                <Button onClick={onCancel}>
                    Cancel
                </Button>
            </Box>
        </Box>

    )
}

export default AddressForm;