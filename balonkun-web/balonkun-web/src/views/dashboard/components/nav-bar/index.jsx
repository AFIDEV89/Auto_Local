import { faMagnifyingGlass, faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Navbar } from "reactstrap";
import { newLogo } from "@assets/images";
import { Divider, Drawer, useMediaQuery } from "@mui/material";
import * as actions from '@redux/actions';
import DrawerHeader from "./Components/DrawerHeader";
import ContactInfo from "./Components/ContactInfo";
import NavContent from "./Components/NavContent"
import CartWrapperIcon from "./Components/CartWrapperIcon";
import ProfileSection from "./Components/ProfileSection";
import SearchDialog from "./Components/SearchDialog";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchDialogOpen, setIsSearchDialogOpen] = useState(false)
  const dispatch = useDispatch();
  const isMobile = useMediaQuery('(max-width:767px)');

  const isLogin = useSelector((state) => state.user.isLogin);

  useEffect(() => {
    if (isLogin) {
      dispatch(actions.getCartProductCount());
    }
  }, [isLogin, dispatch]);

  const onToggle = () => setIsOpen(prevState => !prevState);

  const onClose = () => setIsOpen(false);

  const handleCloseSearchDialog = () => {
    setIsSearchDialogOpen(false);
  }

  const handleOpenSearchDialog = () => {
    setIsSearchDialogOpen(true);
  }

  return (
    <Navbar className="my-navbar">
      <div style={{ display: "flex", alignItems: "center" }}>
        {isMobile && <FontAwesomeIcon icon={faBars} onClick={onToggle} className="hamburger" />}
        <Link to="/">
          <img src={newLogo} className="autoform-logo" />
        </Link>
      </div>

      {
        isMobile && <div className="mobile-nav">
          <FontAwesomeIcon icon={faMagnifyingGlass} className="searchIcon" onClick={handleOpenSearchDialog} />
          {isLogin && <CartWrapperIcon />}
          <ProfileSection isLogin={isLogin} />
          <Drawer
            open={isOpen}
            onClose={onToggle}
            onKeyDown={onClose}
            className="drawer"
            disableScrollLock
          >
            <div className="linksWrapperMobile">
              <DrawerHeader onClose={onClose} />
              <NavContent onClose={onClose} />
              <ContactInfo />
            </div>
          </Drawer>
        </div>
      }

      {
        !isMobile && <div>
          <div className="linksWrapper">
            <div style={{ display: "flex", alignItems: "center" }}>
              <NavContent onClose={onClose} />
              <Divider orientation="vertical" flexItem />
              <FontAwesomeIcon icon={faMagnifyingGlass} className="searchIcon" onClick={handleOpenSearchDialog} />
              {isLogin && <CartWrapperIcon />}
              <ProfileSection isLogin={isLogin} />
            </div>
          </div>
        </div>
      }

      <SearchDialog 
        open={isSearchDialogOpen}
        setIsSearchDialogOpen={setIsSearchDialogOpen}
        handleClose={handleCloseSearchDialog}
      />
    </Navbar>
  );
};

export default NavBar;
