import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Nav,
  NavItem,
} from "reactstrap";
import { NAVBAR_LIST } from "../Config";
import { TwoWheeler, FourWheeler } from "@assets/images";
import { useMediaQuery } from "@mui/material";
import { getDataApi } from "../../../../../services/ApiCaller";
import { errorAlert } from "../../../../../utils";

const NavContent = ({ onClose }) => {
  const isMobile = useMediaQuery("(max-width:767px)");
  const [categories, setCategories] = React.useState([]);
  const [subCategories, setSubCategories] = React.useState([]);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [submenuOpen, setSubmenuOpen] = React.useState(false);
  const [dropdownTwoOpen, setDropdownTwoOpen] = React.useState(false);
  const [submenuTwoOpen, setSubmenuTwoOpen] = React.useState(false);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const toggleSubmenu = () => setSubmenuOpen(!submenuOpen);
  const toggleDropdownTwo= () => setDropdownTwoOpen(!dropdownTwoOpen);
  const toggleSubmenuTwo = () => setSubmenuTwoOpen(!submenuTwoOpen);
  useEffect(() => {
    getCategories();
    getSubCategories();
  }, []);

  const getCategories = async () => {
    const result = await getDataApi({ path: `user/category/get-list` });
    if (result?.data?.data) {
      setCategories(result.data.data);
    } else {
      setCategories([]);
      errorAlert("Something went wrong. Please try again.");
    }
  };
  const getSubCategories = async () => {
    const result = await getDataApi({ path: `/subcategory/get-list` });
    if (result?.data?.data) {
      setSubCategories(result.data.data);
    } else {
      setSubCategories([]);
      errorAlert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="navContent">
      <Nav navbar>
        {categories.map((cat, index) => {
            // Check if the category is "Seat Covers" and skip it
            if (cat.name === "Seat Covers") {
              return (
                <NavItem>
                  <Dropdown toggle={() => {}}>
                    <DropdownToggle
                      data-toggle="dropdown"
                      tag={Link}
                      to="/products"
                      className="nav-link-drop"
                      nav
                    >
                      Seat Covers
                    </DropdownToggle>
                    <DropdownMenu>
                      <DropdownItem
                        onClick={onClose}
                        tag={Link}
                        to="/car-seat-covers"
                        style={isMobile ? { width: 100 } : null}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-around",
                            alignItems: "center",
                          }}
                        >
                          <img
                            src={FourWheeler}
                            alt="four-wheeler"
                            height={20}
                            width={20}
                          />{" "}
                          4W
                        </div>
                      </DropdownItem>
                      <DropdownItem
                        divider
                        className="divider"
                        style={isMobile ? { width: 100 } : null}
                      />
                      <DropdownItem
                        onClick={onClose}
                        tag={Link}
                        to="/two-wheeler-seat-covers"
                        style={isMobile ? { width: 100 } : null}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-around",
                            alignItems: "center",
                          }}
                        >
                          <img
                            src={TwoWheeler}
                            alt="two-wheeler"
                            height={20}
                            width={20}
                          />{" "}
                          2W
                        </div>
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </NavItem>
              );
            }
          const filteredSubCategories = subCategories.filter(
            (subCat) => subCat.category_id === cat.id
          );
          if (cat.name === "Accessories") {
            return (
              <NavItem key={index} style={index === categories.length - 1 ? { padding: 0 } : {}} >
                <Dropdown toggle={() => {}}>
                  {cat.id && cat.id != 11 && <DropdownToggle
                    data-toggle="dropdown"
                    tag={Link}
                    to={{
                      pathname: "/products",
                      search: `?category=${cat.id}`,
                    }}
                    className="nav-link-drop"
                    nav
                  >
                    {cat.name}
                  </DropdownToggle>}
                  {cat.id && cat.id == 11 && <DropdownToggle
                    data-toggle="dropdown"
                    tag={Link}
                    to={{
                      pathname: "/car-accessories"
                    }}
                    className="nav-link-drop"
                    nav
                  >
                    {cat.name}
                  </DropdownToggle>}
                  
                  <DropdownMenu>
                       <div
                        className="submenu-wrapper"
                         {...(isMobile
                          ? {
                              onClick: () => setSubmenuTwoOpen(prev => !prev),
                            }
                          : {
                              onMouseEnter: () => setSubmenuTwoOpen(true),
                              onMouseLeave: () => setSubmenuTwoOpen(false),
                            })
                          }
                      >
                        <DropdownItem className="submenu-toggle"   style={{
                            display: "flex",
                            justifyContent: "space-around",
                            alignItems: "center",
                          }}>
                          <img
                            src={FourWheeler}
                            alt="four-wheeler"
                            height={20}
                            width={20}
                            style={{marginRight: "8px"}}
                          />{" "}
                          4W Accessories ▸
                        </DropdownItem>
                        {submenuTwoOpen && (
                          <div className="submenu">
                              <DropdownItem 
                                onClick={onClose}
                                tag={Link}
                                to={{pathname: "/car-care"}}
                                style={isMobile ? { width: 100 } : null}
                              >Car Care</DropdownItem>
                              <DropdownItem 
                                onClick={onClose}
                                tag={Link}
                                to={{pathname: "/comfort-accessories"}}
                                style={isMobile ? { width: 100 } : null}
                              >Comfort Accessories</DropdownItem>
                              <DropdownItem 
                                onClick={onClose}
                                tag={Link}
                                to={{pathname: "/mobile-accessories"}}
                                style={isMobile ? { width: 100 } : null}
                              >Mobile Accessories</DropdownItem>
                              <DropdownItem 
                                onClick={onClose}
                                tag={Link}
                                to={{pathname: "/organisers"}}
                                style={isMobile ? { width: 100 } : null}
                              >Organisers</DropdownItem>
                              <DropdownItem 
                                onClick={onClose}
                                tag={Link}
                                to={{pathname: "/padded-seat-cover"}}
                                style={isMobile ? { width: 100 } : null}
                              >Padded Seat Cover</DropdownItem>
                              <DropdownItem 
                                onClick={onClose}
                                tag={Link}
                                to={{pathname: "/steering-covers"}}
                                style={isMobile ? { width: 100 } : null}
                              >Steering Covers</DropdownItem>
                              <DropdownItem 
                                onClick={onClose}
                                tag={Link}
                                to={{pathname: "/tissue-boxes"}}
                                style={isMobile ? { width: 100 } : null}
                              >Tissue Boxes</DropdownItem>
                                <DropdownItem 
                                onClick={onClose}
                                tag={Link}
                                to={{pathname: "/utilities"}}
                                style={isMobile ? { width: 100 } : null}
                              >Utilities</DropdownItem>
                                <DropdownItem 
                                onClick={onClose}
                                tag={Link}
                                to={{pathname: "/ev-accessories"}}
                                style={isMobile ? { width: 100 } : null}
                              >EV Accessories</DropdownItem>
                              
                          </div>
                        )}
                      </div>

                     <div
                        className="submenu-wrapper"
                         {...(isMobile
                          ? {
                              onClick: () => setSubmenuOpen(prev => !prev),
                            }
                          : {
                              onMouseEnter: () => setSubmenuOpen(true),
                              onMouseLeave: () => setSubmenuOpen(false),
                            })
                          }
                      >
                        <DropdownItem className="submenu-toggle" style={{
                            display: "flex",
                            justifyContent: "space-around",
                            alignItems: "center",
                          }}>
                            <img
                            src={TwoWheeler}
                            alt="two-wheeler"
                            height={20}
                            width={20}
                            style={{marginRight: "8px"}}
                          />
                          2W Accessories ▸
                        </DropdownItem>
                        {submenuOpen && (
                          <div className="submenu">
                              <DropdownItem 
                                onClick={onClose}
                                tag={Link}
                                to={{pathname: "/bike-body-covers"}}
                                style={isMobile ? { width: 100 } : null}
                              >Bike Body Covers</DropdownItem>
                              <DropdownItem 
                                onClick={onClose}
                                tag={Link}
                                to={{pathname: "/scooty-body-covers"}}
                                style={isMobile ? { width: 100 } : null}
                              >Scooty Body Covers</DropdownItem>
                              <DropdownItem 
                                onClick={onClose}
                                tag={Link}
                                to={{pathname: "/tank-covers"}}
                                style={isMobile ? { width: 100 } : null}
                              >Tank Covers</DropdownItem>
                              <DropdownItem 
                                onClick={onClose}
                                tag={Link}
                                to={{pathname: "/mobile-holders"}}
                                style={isMobile ? { width: 100 } : null}
                              >Mobile Holders</DropdownItem>
                              <DropdownItem 
                                onClick={onClose}
                                tag={Link}
                                to={{pathname: "/bags"}}
                                style={isMobile ? { width: 100 } : null}
                              >Bags</DropdownItem>
                              <DropdownItem 
                                onClick={onClose}
                                tag={Link}
                                to={{pathname: "/microfibre-cleaning-cloth"}}
                                style={isMobile ? { width: 100 } : null}
                              >Microfibre Cleaning Cloth</DropdownItem>
                              <DropdownItem 
                                onClick={onClose}
                                tag={Link}
                                to={{pathname: "/bungee-ropes"}}
                                style={isMobile ? { width: 100 } : null}
                              >Bungee Ropes</DropdownItem>
                              
                          </div>
                        )}
                     </div>
                  </DropdownMenu>
                </Dropdown>
              </NavItem>
            );
          }else{
            return (
              <NavItem key={index} style={index === categories.length - 1 ? { padding: 0 } : {}} >
                <Dropdown toggle={() => {}}>
                  {cat.id && cat.id != 11 && <DropdownToggle
                    data-toggle="dropdown"
                    tag={Link}
                    to={{
                      pathname: "/products",
                      search: `?category=${cat.id}`,
                    }}
                    className="nav-link-drop"
                    nav
                  >
                    {cat.name}
                  </DropdownToggle>}
                  {cat.id && cat.id == 11 && <DropdownToggle
                    data-toggle="dropdown"
                    tag={Link}
                    to={{
                      pathname: "/car-accessories"
                    }}
                    className="nav-link-drop"
                    nav
                  >
                    {cat.name}
                  </DropdownToggle>}
                  
                  <DropdownMenu style={{ minWidth: "200px" }}>
                    {filteredSubCategories.map((subCat, subIndex) => (
                      <DropdownItem
                        key={subIndex}
                        onClick={onClose}
                        tag={Link}
                        to={{
                          pathname: "/"+subCat.canonical,
                          search: ``,
                        }}
                        style={isMobile ? { width: 100 } : null}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center"
                          }}
                        >
                          {subCat.name}
                        </div>
                      </DropdownItem>
                    ))}
                  </DropdownMenu>
                </Dropdown>
              </NavItem>
            );
          }
        })}
        {Object.values(NAVBAR_LIST).map((nav, index) => {
          return (
            <NavItem key={index}>
              {nav === NAVBAR_LIST.WHY_AUTOFORM && (
                <Link className="nav-link" to="/about-us" onClick={onClose}>
                  {nav}
                </Link>
              )}
              {nav === NAVBAR_LIST.BLOGS && (
                <Link className="nav-link" to="/blogs" onClick={onClose}>
                  {nav}
                </Link>
              )}
            </NavItem>
          );
        })}
      </Nav>
    </div>
  );
};

export default NavContent;
