import React from "react";
import "../../assets/scss/footer-skeleton.scss"; // Add styles for the skeleton loader

const FooterSkeleton = () => {
    return (
        <div className="footer-skeleton">
            <div className="skeleton skeleton-text"></div>
            <div className="skeleton skeleton-text"></div>
            <div className="skeleton skeleton-text"></div>
        </div>
    );
};

export default FooterSkeleton;