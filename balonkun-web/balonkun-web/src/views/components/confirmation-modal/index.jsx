import { faClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Dialog, DialogTitle, DialogContent, Typography } from '@mui/material';

function ConfirmationModal({ 
	isOpen = false, 
	title, 
	onClose = () => { }, 
	children 
}) {
	return (
		<Dialog open={isOpen} onClose={onClose}>
			<DialogTitle sx={{ m: 0, p: 2 }}>
				<Typography variant='body1' fontWeight="500">{title}</Typography>
			</DialogTitle>
			<FontAwesomeIcon icon={faClose} onClick={onClose} style={{
				 position: 'absolute',
				 right: 8,
				 top: 8,
				 padding: 8,
				 fontSize: 18,
				 color: "rgb(158, 158, 158)",
				 cursor: "pointer"
			}} />
			<DialogContent dividers>
				{children}
			</DialogContent>
		</Dialog>
	);
}

export default ConfirmationModal;
