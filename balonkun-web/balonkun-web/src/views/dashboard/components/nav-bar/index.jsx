import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { newLogo } from "@assets/images";
import { Drawer, useMediaQuery } from "@mui/material";
import * as actions from "@redux/actions";
import DrawerHeader from "./Components/DrawerHeader";
import ContactInfo from "./Components/ContactInfo";
import NavContent from "./Components/NavContent";
import CartWrapperIcon from "./Components/CartWrapperIcon";
import ProfileSection from "./Components/ProfileSection";
import SearchDialog from "./Components/SearchDialog";

const NavBar = () => {

  const [isOpen, setIsOpen] = useState(false);
  const [isSearchDialogOpen, setIsSearchDialogOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const dispatch = useDispatch();
  const isMobile = useMediaQuery('(max-width:767px)');
  const isLogin = useSelector((state) => state.user.isLogin);

  useEffect(() => {
    if (isLogin) {
      dispatch(actions.getCartProductCount());
    }
  }, [isLogin, dispatch]);

  useEffect(() => {

    const handleScroll = () => {
      setScrolled(window.scrollY > 18);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);

  }, []);

  const onToggle = () => setIsOpen(prev => !prev);
  const onClose = () => setIsOpen(false);

  const handleCloseSearchDialog = () => setIsSearchDialogOpen(false);
  const handleOpenSearchDialog = () => setIsSearchDialogOpen(true);

  return (

    <nav
      className={`fixed top-0 w-full z-50 bg-white/90 backdrop-blur-xl border-b transition-all duration-300 ${scrolled
        ? "border-gray-200 shadow-[0_20px_40px_-30px_rgba(22,31,26,0.5)]"
        : "border-gray-100 shadow-sm"
        }`}
    >

      {/* Accent line */}
      <div
        className="absolute left-0 right-0 bottom-[-1px] h-[1px]"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(255,178,0,0.7) 50%, transparent 100%)"
        }}
      />

      <div className="max-w-[1440px] mx-auto px-4 lg:px-12 py-3">

        <div className="grid grid-cols-2 lg:grid-cols-3 items-center">

          {/* Left */}
          <div className="flex items-center gap-4">

            {isMobile && (
              <button onClick={onToggle}>
                <FontAwesomeIcon icon={faBars} className="text-black text-lg" />
              </button>
            )}

            <Link to="/">
              <img
                src={newLogo}
                alt="Autoform India"
                className="h-10 w-auto"
              />
            </Link>

          </div>

          {/* Center Navigation */}
          {!isMobile && (
            <div className="flex justify-center">

              {/* Inline styling wrapper */}
              <div className="flex gap-6">

                <style>
                  {`
                  .nav-link {
                    position: relative;
                    padding: 4px 0px;
                    font-size: 14px;
                    font-weight: 500;
                    color: #111;
                    transition: all 0.3s ease;
                  }

                  .nav-link:hover {
                    color: #ffb200;
                  }

                  .nav-link::after {
                    content: "";
                    position: absolute;
                    left: 0;
                    bottom: -2px;
                    width: 0%;
                    height: 2px;
                    background: #ffb200;
                    transition: width 0.3s ease;
                  }

                  .nav-link:hover::after {
                    width: 100%;
                  }
                `}
                </style>

                <NavContent onClose={onClose} />

              </div>

            </div>
          )}

          {/* Right Icons */}
          <div className="flex items-center justify-end gap-4 px-2">

            {/* Search */}
            <button onClick={handleOpenSearchDialog}>
              <span className="material-symbols-outlined text-[22px] text-black" style={{ fontFamily: "'Material Symbols Outlined'", fontVariationSettings: "'wght' 400, 'opsz' 24" }}>
                search
              </span>
            </button>

            {/* Phone */}
            {!isMobile && (
              <a href="tel:+919278411411">
                <span className="material-symbols-outlined text-[22px] text-black" style={{ fontFamily: "'Material Symbols Outlined'", fontVariationSettings: "'wght' 400, 'opsz' 24" }}>
                  call
                </span>
              </a>
            )}

            {/* Cart */}
            {isLogin && <CartWrapperIcon />}

            {/* Login/Profile */}
            {isLogin ? (
              <ProfileSection isLogin={isLogin} />
            ) : (
              <Link
                to="/login"
                className="bg-brand-green text-white px-6 py-2.5 rounded-lg text-sm font-semibold tracking-wide shadow-md"
              >
                Login
              </Link>
            )}

          </div>

        </div>

      </div>

      {/* Mobile Drawer */}
      {isMobile && (
        <Drawer
          open={isOpen}
          onClose={onToggle}
          disableScrollLock
          PaperProps={{
            sx: {
              width: '85%',
              maxWidth: '360px',
              backgroundColor: '#fff',
              borderTopRightRadius: '16px',
              borderBottomRightRadius: '16px',
            }
          }}
        >
          <div className="p-4">

            <DrawerHeader onClose={onClose} />

            <NavContent onClose={onClose} />

            <ContactInfo />

          </div>
        </Drawer>
      )}

      <SearchDialog
        open={isSearchDialogOpen}
        setIsSearchDialogOpen={setIsSearchDialogOpen}
        handleClose={handleCloseSearchDialog}
      />

    </nav>
  );
};

export default NavBar;