import React from "react";
import { Helmet } from "react-helmet";
import { useMediaQuery } from "@mui/material";

const Aboutus = () => {

  const videoSrc = require("../../assets/videos/About-Us.mp4");
  const keyPeopleImgSrc = require("../../assets/images/Key-People.jpg");
  const ourMilestoneImgSrc = require("../../assets/images/OurMilestone.jpg");
  const ourBrandImgSrc = require("../../assets/images/OurBrands.jpg");
  const isMobile = useMediaQuery('(max-width:576px)');

  return (
    <div className="aboutUsWrapper">
      <Helmet>
        <title>About Autoformindia.com</title>
        <meta name='description' content="Discover the story of Autoform India - a leading automotive accessories provider. Learn about our passion for quality, innovation, and customer satisfaction." />
      </Helmet>
      <div className="video-background">
        <video className="video" autoPlay loop muted>
          <source src={videoSrc} type="video/mp4" width={"100%"} height={"30%"} />
          Your browser does not support the video tag.
        </video>
        <div className="overlay">
          <div className="text-container">
            <h1 className={isMobile ? 'mobile' : ''} >ABOUT US</h1>
            <p className={isMobile ? 'mobile' : ''} >
              As an ISO/TS 16949 certified company, we adhere to rigorous quality
              management systems that are recognized internationally. Autoform India
              Is a renowned leader in the automotive accessories industry, specializing in the production
              of premium quality car seat covers in India. With a legacy spanning over 35 years, our company
              has been dedicated to providing top-tier products and services that meet the highest standards
              of quality and durability. Our state-of-the-art manufacturing plant is located in Dehradun,
              Uttarakhand, covering an expansive area of 600,000 square feet. Equipped with advanced technology,
              including German CNC Auto Cutters and Japanese Automatic Stitching Machines, our facilities are designed
              to ensure precision and efficiency in every step of the production process.
            </p>
          </div>
        </div>
      </div>
      <div className="images-section">
        <div className="heading">
          <h1 className={isMobile ? 'mobile' : ''} >KEY PEOPLE</h1>
        </div>
        <img src={keyPeopleImgSrc} alt="Key People" />
        <div className="heading">
          <h1 className={isMobile ? 'mobile' : ''} >OUR MILESTONE</h1>
        </div>
        <img src={ourMilestoneImgSrc} alt="Our Milestone" />
        <div className="heading">
          <h1 className={isMobile ? 'mobile' : ''} >OUR BRANDS</h1>
        </div>
        <img src={ourBrandImgSrc} alt="Our Brand" />
      </div>
    </div>
  );
};

export default Aboutus;
