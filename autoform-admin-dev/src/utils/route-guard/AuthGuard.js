import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { getCookie } from 'views/helpers/storageHelpers';

// ==============================|| AUTH GUARD ||============================== //

/**
 * Authentication guard for routes
 * @param {PropTypes.node} children children element/node
 */
const AuthGuard = ({ children }) => {
    const token = getCookie('token');
    const isLoggedIn = token;
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoggedIn) {
            navigate('login', { replace: true });
        }
    }, [isLoggedIn, navigate]);

    return children;
};

AuthGuard.propTypes = {
    children: PropTypes.node
};

export default AuthGuard;
