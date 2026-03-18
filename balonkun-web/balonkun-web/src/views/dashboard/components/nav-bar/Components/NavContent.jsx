import React from "react";
import { Link } from "react-router-dom";
import { NAVBAR_LIST } from "../Config";
import { TwoWheeler, FourWheeler } from "@assets/images";
import { useMediaQuery } from "@mui/material";
import { ROUTES } from "../../../../../shared/constants";

// Map each nav item to its route
const NAV_ROUTES = {
  SEAT_COVERS: "/car-seat-covers",
  ACCESSORIES: "/car-accessories",
  MATS: "/products?category=10",
  AUDIO_SECURITY: "/products?category=12",
  STORE_LOCATOR: ROUTES.STORE_LOCATOR,
  E_CATALOGUE: "/e-catalogue",
  CONTACT_US: "/contact-us",
};

const NavContent = ({ onClose }) => {
  const isMobile = useMediaQuery("(max-width:767px)");
  const [expandedItems, setExpandedItems] = React.useState({});
  const [activeSubMenu, setActiveSubMenu] = React.useState(null);

  const toggleExpand = (label) => {
    setExpandedItems(prev => ({
      ...prev,
      [label]: !prev[label]
    }));
  };

  const renderNavItem = (item) => {
    const hasChildren = item.children && item.children.length > 0;
    const path = item.path || NAV_ROUTES[item.key] || "/";
    const isExpanded = expandedItems[item.label];
    
    // Check if any child has its own children (requires split layout)
    const isSplitLayout = hasChildren && item.children.some(child => child.children && child.children.length > 0);

    if (isMobile) {
      return (
        <div key={item.key || item.label} className="w-full">
          {!hasChildren ? (
            <Link
              to={path}
              className="block px-3 py-2.5 text-[15px] font-medium text-slate-700 hover:text-primary transition-colors rounded-lg hover:bg-gray-50"
              onClick={onClose}
            >
              {item.label}
            </Link>
          ) : (
            <div className="">
              <div 
                className="flex items-center justify-between px-3 py-2.5 text-[15px] font-medium text-slate-700 cursor-pointer"
                onClick={() => toggleExpand(item.label)}
              >
                <span>{item.label}</span>
                <span className={`material-symbols-outlined text-[18px] transition-transform ${isExpanded ? 'rotate-180' : ''}`}>expand_more</span>
              </div>
              {isExpanded && (
                <div className="pl-4 border-l-2 border-gray-100 ml-4 flex flex-col gap-1 overflow-hidden transition-all duration-300">
                  {item.children.map(child => (
                    <div key={child.label}>
                      {child.items ? (
                        /* New structure with sections (COLLECTION, FITMENT) */
                        <div className="mb-4 mt-2">
                          <div className="px-3 py-1 text-[11px] font-bold text-slate-400 uppercase letter-spacing-1">{child.label}</div>
                          <div className="flex flex-col gap-1">
                            {child.items.map(subItem => (
                              <Link
                                key={subItem.label}
                                to={subItem.path}
                                className="flex items-center gap-3 px-3 py-2 text-sm text-slate-600 hover:text-primary transition-colors"
                                onClick={onClose}
                              >
                                {subItem.icon && <span className="material-symbols-outlined text-[18px] opacity-70">{subItem.icon}</span>}
                                <span>{subItem.label}</span>
                              </Link>
                            ))}
                          </div>
                        </div>
                      ) : child.children ? (
                        /* Handle deeply nested children if any (legacy or future) */
                        <div className="mb-2">
                          <div className="px-3 py-2 text-sm font-bold text-slate-800 flex items-center gap-2">{child.label}</div>
                          <div className="pl-6 flex flex-col gap-1">
                            {child.children.map(subChild => (
                              <Link
                                key={subChild.label}
                                to={subChild.path || "/"}
                                className="block px-3 py-1.5 text-sm text-slate-600 hover:text-primary"
                                onClick={onClose}
                              >
                                {subChild.label}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ) : (
                        /* Single level child links */
                        <Link
                          to={child.path || "/"}
                          className="block px-3 py-2 text-sm text-slate-600 hover:text-primary"
                          onClick={onClose}
                        >
                          {child.label}
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      );
    }

    // Desktop
    return (
      <div 
        key={item.key || item.label} 
        className="relative nav-dropdown-item"
      >
        {!hasChildren ? (
          <Link
            to={path}
            className="nav-link text-sm whitespace-nowrap"
            onClick={onClose}
          >
            {item.label}
          </Link>
        ) : (
          <>
            <div className="nav-link text-sm whitespace-nowrap cursor-pointer">
              {item.label}
            </div>
            
            <div className="dropdown-container">
              {/* Check if it's the new multi-column minimal layout */}
              {item.children[0].items ? (
                <div className="minimal-dropdown-wrapper">
                  {item.children.map((section, idx) => (
                    <div key={section.label} className="minimal-dropdown-section">
                      <div className="section-header">{section.label}</div>
                      <div className="section-items">
                        {section.items.map(subItem => (
                          <Link
                            key={subItem.label}
                            to={subItem.path}
                            className="minimal-dropdown-link"
                            onClick={onClose}
                          >
                            <span className="material-symbols-outlined section-icon">{subItem.icon}</span>
                            <span className="section-label">{subItem.label}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Simple Single-Panel Layout (e.g., Mats) */
                <div className="dropdown-content-simple">
                  {item.children.map(child => (
                    <Link
                      key={child.label}
                      to={child.path || "/"}
                      className="dropdown-simple-link"
                      onClick={onClose}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className={`${isMobile ? 'flex flex-col gap-1 py-4' : 'flex items-center justify-center gap-8'}`}>
      {NAVBAR_LIST.map(item => renderNavItem(item))}
    </div>
  );
};

export default NavContent;
