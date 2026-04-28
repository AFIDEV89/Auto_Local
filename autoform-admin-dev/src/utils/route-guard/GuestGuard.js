import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { DEFAULT_PATH } from 'config';
import { getCookie } from 'views/helpers/storageHelpers';


/**
 * Guest guard for routes having no auth required
 * @param {PropTypes.node} children children element/node
 */

const GuestGuard = ({ children }) => {
    const token = getCookie('token');
    const isLoggedIn = token;
    const navigate = useNavigate();

    useEffect(() => {
        if (isLoggedIn) {
            navigate(DEFAULT_PATH, { replace: true });
        }
    }, [isLoggedIn, navigate]);

    return children;
};

GuestGuard.propTypes = {
    children: PropTypes.node
};

export default GuestGuard;
