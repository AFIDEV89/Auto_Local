import { Button, Card, CardActions, CardContent, Typography } from "@mui/material";
import React, { useState } from "react";
import AddressForm from "./AddressForm";

const AddressCard = ({
    address = {},
    deleteAddress,
    saveEditedAddress
}) => {
    const [showAddressForm, setShowAddressForm] = useState(false);
    
    if (showAddressForm) {
        return (
            <AddressForm
                formData={{
                    ...address
                }}
                title="Edit ADDRESS"
                onSubmit={(address) => {
                    setShowAddressForm(false);
                    saveEditedAddress(address);
                }}
                onCancel={() => setShowAddressForm(false)}
            />
        )
    }

    return (
        <Card variant="outlined">
            <CardContent>
                <Typography fontSize={13} variant="subtitle2">{address.street_address}</Typography>
                <Typography fontSize={13} variant="subtitle2">{address.city}, {address.state} {address.postal_code}</Typography>
                <Typography fontSize={13} variant="subtitle2">{address.country}</Typography>
            </CardContent>
            <CardActions sx={{ alignItems: "center" }}>
                <Button onClick={() => setShowAddressForm(true)} size="small">Edit</Button>
                <Button onClick={() => deleteAddress(address)} size="small">Delete</Button>
            </CardActions>
        </Card>
    )
}

export default AddressCard;