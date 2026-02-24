import { Button, Paper } from "@mui/material";
import React, { useState } from "react";
import AddressForm from "./AddressForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

const AddNewAddress = ({
    addNewAddressHandler
}) => {
    const [showAddressForm, setShowAddressForm] = useState(false);

    return (
        <Paper variant="outlined" sx={{ padding: showAddressForm ? 0 : 1.2 }}>
            {!showAddressForm && <Button size="small" onClick={() => setShowAddressForm(true)} startIcon={<FontAwesomeIcon icon={faPlus} />}>
                ADD A NEW ADDRESS
            </Button>}

            {showAddressForm && (
                <AddressForm
                    title="ADD A NEW ADDRESS"
                    onSubmit={(address) => {
                        addNewAddressHandler(address);
                        setShowAddressForm(false);
                    }}
                    onCancel={() => setShowAddressForm(false)}
                />)
            }
        </Paper>
    )
}

export default AddNewAddress;