import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

const AddSEODialog = ({
    title = "",
    open,
    handleClose,
    handleSubmit,
    formValue,
    isAddButtonDisabled = true,
    children
}) => {

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            disableEnforceFocus
        >
            <DialogTitle>
                {title}
            </DialogTitle>
            <DialogContent dividers>
                {children}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>
                    Cancel
                </Button>
                <Button
                    onClick={() => handleSubmit(formValue)}
                    autoFocus
                    disabled={isAddButtonDisabled}
                >
                    Add
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default AddSEODialog;