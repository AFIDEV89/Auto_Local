import PropTypes from 'prop-types';
import React from 'react';

// material-ui
import { CardContent, Divider, Grid, IconButton, Modal, Typography, Button, CardActions } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';

// assets
import CloseIcon from '@mui/icons-material/Close';

// generate random
function rand() {
    return Math.round(Math.random() * 20) - 10;
}

// modal position
function getModalStyle() {
    const top = 50 + rand();
    const left = 50 + rand();

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`
    };
}

const Body = React.forwardRef(({ modalStyle, handleClose, title, type, onDelete }, ref) => (
    <div ref={ref} tabIndex={-1}>
        <MainCard
            style={modalStyle}
            sx={{
                position: 'absolute',
                width: { xs: 280, lg: 450 },
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)'
            }}
            title={title}
            content={false}
            secondary={
                <IconButton onClick={handleClose} size="large">
                    <CloseIcon fontSize="small" />
                </IconButton>
            }
        >
            <CardContent>
                <Typography variant="body1">Are you sure you want to delete this {type}</Typography>
            </CardContent>
            <Divider />
            <CardActions style={{ justifyContent: 'flex-end' }}>
                <Button variant="contained" type="button" onClick={onDelete} >
                    Delete
                </Button>
                <Button variant="outlined" onClick={handleClose} type="button" >
                    Close
                </Button>
            </CardActions>

        </MainCard>
    </div>
));

Body.propTypes = {
    modalStyle: PropTypes.object,
    handleClose: PropTypes.func
};

// ==============================|| SIMPLE MODAL ||============================== //

export default function DeleteModal(props) {
    // getModalStyle is not a pure function, we roll the style only on the first render
    const [modalStyle] = React.useState(getModalStyle);
    const { open, setOpen, title, type, handleDelete } = props;

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Grid container justifyContent="flex-end">
            <Modal open={open} onClose={handleClose} aria-labelledby="simple-modal-title" aria-describedby="simple-modal-description">
                <Body modalStyle={modalStyle} handleClose={handleClose} title={title} type={type} onDelete={handleDelete} />
            </Modal>
        </Grid>
    );
}
