import React from "react";
import { Navigate } from "react-router-dom";
import PropTypes from 'prop-types';
import usePermission from "hooks/usePermission";

const PermissionGuard = ({ children, allowedRole = [] }) => {
    const { role } = usePermission();

    if(allowedRole.length === 0) {
        console.error("allowedRole is a required prop");
    }

    if(!allowedRole.includes(role)) {
        return <Navigate to="/category" />
    }

    return children
}

PermissionGuard.propTypes = {
    allowedRole: PropTypes.arrayOf(PropTypes.string).isRequired
}

export default PermissionGuard