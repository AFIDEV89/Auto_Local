import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

const ConfirmationDialog = ({
    open,
    handleClose,
    handleConfirmation
}) => {
    return (
        <Dialog
            open={open}
            onClose={handleClose}
        >
            <DialogTitle>
                Are you sure?
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Marking this blog as Header blog will make all other blogs as non header.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>
                    Cancel
                </Button>
                <Button onClick={handleConfirmation} autoFocus>
                    Agree
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default ConfirmationDialog;