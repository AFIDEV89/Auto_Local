import React, { useState } from "react";
import Routes from 'routes';
import Locales from 'ui-component/Locales';
import NavigationScroll from 'layout/NavigationScroll';
import Snackbar from 'ui-component/extended/Snackbar';
import ThemeCustomization from 'themes';

import { AppContext } from './views/helpers/context';
import 'react-datepicker/dist/react-datepicker.css'

const App = () => {

    const [users, setUsers] = useState([]);

    const dispatchUserEvent = (actionType, payload) => {
        switch (actionType) {
            case 'ADD_USER':
                setUsers([...users, payload.newUser]);
                return;
            case 'REMOVE_USER':
                setUsers(users.filter(user => user.token !== payload.userId));
                return;
            default:
                return;
        }
    };

    return (
        <ThemeCustomization>
            <Locales>
                <NavigationScroll>
                    <AppContext.Provider value={{ users, dispatchUserEvent }}>
                        <>
                            <Routes />
                            <Snackbar />
                        </>
                    </AppContext.Provider>
                </NavigationScroll>
            </Locales>
        </ThemeCustomization>
    );
};

export default App;
