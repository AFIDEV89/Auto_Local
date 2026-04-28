import { useContext } from 'react';
import { PermissionContext } from 'contexts/PermissionContext';
import { USER_TYPE } from 'constants/User';

const usePermission = () => {
    const { role } = useContext(PermissionContext);

    return {
        role,
        isUserModerator: role === USER_TYPE.moderator,
        isUserAdmin: role === USER_TYPE.admin,
        isUserEditor: role === USER_TYPE.editor
    };
}

export default usePermission