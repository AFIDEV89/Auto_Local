import { USER_TYPE } from 'constants/User';
import { createContext } from 'react';
import { Navigate } from 'react-router-dom';
import { errorAlert } from 'views/helpers';
import { getCookie } from 'views/helpers/storageHelpers';

const PermissionContext = createContext({
    role: USER_TYPE.moderator
})

const PermissionProvider = ({ children }) => {
    const role = getCookie('role') || USER_TYPE.moderator;

    if (![...Object.keys(USER_TYPE)].includes(role)) {
        errorAlert("Incorrect user role");

        return <Navigate to="/login" />
    }

    return (
        <PermissionContext.Provider value={{
            role
        }}>
            {children}
        </PermissionContext.Provider>
    )
}

export {PermissionContext, PermissionProvider }