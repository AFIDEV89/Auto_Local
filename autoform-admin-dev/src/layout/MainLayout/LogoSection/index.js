import { Link as RouterLink } from 'react-router-dom';
import { Link } from '@mui/material';

const LogoSection = () => (
    <Link component={RouterLink} to={'/category'}>
        <img
            style={{
                height: '57px',
                width: '100px'
            }} 
            src="https://www.autoformindia.com/image/catalog/autoform_logo.jpg" alt="logo" 
            />
    </Link>
);

export default LogoSection;
