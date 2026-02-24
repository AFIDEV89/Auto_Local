import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import * as actions from '@redux/actions';
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";

const ProfileSection = ({
    isLogin
}) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const handleToggleDropdown = () => setDropdownOpen((prevState) => !prevState);

    const handleLogout = () => {
        dispatch(actions.getLogoutRequest());
        navigate("/")
    };

    return (
        <div className="profile-wrapper">
            {!isLogin && <p className="login" onClick={() => navigate('/login')}>LOGIN</p>}

            {isLogin && (
                <Dropdown isOpen={dropdownOpen} toggle={handleToggleDropdown} className="profileDropdown">
                    <DropdownToggle className="toggle">
                        <FontAwesomeIcon icon={faCircleUser} />
                    </DropdownToggle>
                    <DropdownMenu>
                        <NavLink to="/my-profile">
                            <DropdownItem>
                                My Profile
                            </DropdownItem>
                        </NavLink>
                        <NavLink to='/edit-profile'>
                            <DropdownItem>Edit Profile</DropdownItem>
                        </NavLink>
                        <NavLink to='/orders'>
                            <DropdownItem>Orders</DropdownItem>
                        </NavLink>
                        <NavLink to='/addresses'>
                            <DropdownItem>Manage Addresses</DropdownItem>
                        </NavLink>
                        <NavLink to='/wishlist'>
                            <DropdownItem>My Wishlist</DropdownItem>
                        </NavLink>
                        <NavLink to='/change-password'>
                            <DropdownItem>Change Password</DropdownItem>
                        </NavLink>
                        <div onClick={handleLogout}>
                            <DropdownItem>Logout</DropdownItem>
                        </div>
                    </DropdownMenu>
                </Dropdown>
            )}
        </div>
    )
}

export default ProfileSection