import * as React from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

const OrderStatusConfirmationDialog = ({ 
  open,
  setChangeStatus, 
  handleChangeYes 
}) => {

  const onClose = () => {
    setChangeStatus(false);
  }

  return (
    <Dialog
      className={'modalWidth'}
      open={open}
      fullWidth
      onClose={onClose}
    >
      <DialogTitle>
        Change Status
      </DialogTitle>
      <DialogContent>
        <Typography>Are you sure want to change status?</Typography>
      </DialogContent>
      <DialogActions>
        <Button
          type="button"
          variant="outlined"
          onClick={handleChangeYes}
        >
          Yes
        </Button>
        <Button
          type="button"
          variant="outlined"
          onClick={onClose}
        >
          No
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default OrderStatusConfirmationDialog;