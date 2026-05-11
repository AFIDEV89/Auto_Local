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
  MATS: "/autoform-car-mats",
  AUDIO_SECURITY: "/products?category=13",
  STORE_LOCATOR: ROUTES.STORE_LOCATOR,
  FRANCHISE: "/retail-franchise",
  CONTACT_US: "/contact-us",
};

const NavContent = ({ onClose }) => {
  const isMobile = useMediaQuery("(max-width:767px)");
  const [expandedItems, setExpandedItems] = React.useState({});
  const [activeSubMenu, setActiveSubMenu] = React.useState(null);

  const toggleExpand = (label, subLabel = null) => {
    const key = subLabel ? `${label}:${subLabel}` : label;
    setExpandedItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const renderNavItem = (item) => {
    const hasChildren = item.children && item.children.length > 0;
    const path = item.path || NAV_ROUTES[item.key] || "/";
    const isExpanded = expandedItems[item.label];
    
    if (isMobile) {
      return (
        <div key={item.key || item.label} className="w-full border-b border-gray-50 last:border-0">
          {!hasChildren ? (
            <Link
              to={path}
              className="block px-4 py-3 text-[15px] font-semibold text-slate-800 hover:text-primary transition-colors flex items-center justify-between"
              onClick={onClose}
            >
              <span>{item.label}</span>
              <span className="material-symbols-outlined text-[18px] opacity-40">chevron_right</span>
            </Link>
          ) : (
            <div className="">
              <div 
                className={`flex items-center justify-between px-4 py-3 text-[15px] font-semibold transition-colors ${isExpanded ? 'text-primary' : 'text-slate-800'} cursor-pointer`}
                onClick={() => toggleExpand(item.label)}
              >
                <span>{item.label}</span>
                <span className={`material-symbols-outlined text-[20px] transition-transform duration-300 ${isExpanded ? 'rotate-180 opacity-100' : 'opacity-40'}`}>expand_more</span>
              </div>
              
              {isExpanded && (
                <div className="bg-gray-50/50 pb-2 flex flex-col gap-1 overflow-hidden transition-all duration-300 animate-in fade-in slide-in-from-top-2">
                  {item.children.map(child => {
                    const subKey = `${item.label}:${child.label}`;
                    const isSubExpanded = expandedItems[subKey];
                    const hasItems = child.items && child.items.length > 0;

                    return (
                      <div key={child.label} className="px-2">
                        {hasItems ? (
                          /* Hierarchy: Child (e.g., 4W ACCESSORIES) */
                          <div className="mb-1">
                            <div 
                              className={`flex items-center justify-between px-3 py-2 text-[12px] font-black uppercase tracking-wider cursor-pointer rounded-lg transition-all ${isSubExpanded ? 'text-primary bg-white shadow-sm' : 'text-slate-400'}`}
                              onClick={() => toggleExpand(item.label, child.label)}
                            >
                              <span>{child.label}</span>
                              <span className={`material-symbols-outlined text-[16px] transition-transform ${isSubExpanded ? 'rotate-180' : ''}`}>expand_more</span>
                            </div>
                            
                            {isSubExpanded && (
                              <div className="flex flex-col gap-0.5 mt-1 border-l-2 border-gray-100 ml-4 animate-in fade-in slide-in-from-left-1">
                                {child.items.map(subItem => (
                                  <Link
                                    key={subItem.label}
                                    to={subItem.path}
                                    className="flex items-center gap-3 px-4 py-2 text-[14px] text-slate-600 hover:text-primary transition-colors rounded-r-lg hover:bg-white"
                                    onClick={onClose}
                                  >
                                    {subItem.icon && <span className="material-symbols-outlined text-[18px] opacity-60">{subItem.icon}</span>}
                                    <span>{subItem.label}</span>
                                  </Link>
                                ))}
                              </div>
                            )}
                          </div>
                        ) : child.children ? (
                          /* Mats / Other structured lists */
                          <div className="mb-1">
                            <div 
                              className={`flex items-center justify-between px-3 py-2 text-[14px] font-bold cursor-pointer rounded-lg transition-all ${isSubExpanded ? 'text-primary bg-white shadow-sm' : 'text-slate-700'}`}
                              onClick={() => toggleExpand(item.label, child.label)}
                            >
                              <span>{child.label}</span>
                              <span className={`material-symbols-outlined text-[16px] transition-transform ${isSubExpanded ? 'rotate-180' : ''}`}>expand_more</span>
                            </div>
                            {isSubExpanded && (
                              <div className="flex flex-col gap-1 mt-1 border-l-2 border-gray-100 ml-4 animate-in fade-in slide-in-from-left-1">
                                {child.children.map(subChild => (
                                  <Link
                                    key={subChild.label}
                                    to={subChild.path || "/"}
                                    className="block px-4 py-2 text-[13px] text-slate-600 hover:text-primary rounded-r-lg hover:bg-white"
                                    onClick={onClose}
                                  >
                                    {subChild.label}
                                  </Link>
                                ))}
                              </div>
                            )}
                          </div>
                        ) : (
                          /* Flat links */
                          <Link
                            to={child.path || "/"}
                            className="block px-3 py-2 text-[14px] text-slate-600 hover:text-primary font-medium hover:bg-white rounded-lg transition-all"
                            onClick={onClose}
                          >
                            {child.label}
                          </Link>
                        )}
                      </div>
                    );
                  })}
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
