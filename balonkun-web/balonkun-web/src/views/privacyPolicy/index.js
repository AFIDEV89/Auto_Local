import Challenges from "./components/challenges";
import AutomaticCollection from "./components/automaticallyCollection";
import CookiesUsage from "./components/cookiesUsage";
import DisclaimerToSecurity from "./components/discliamerToSecurity";
import EmailChoice from "./components/emailchoice";
import InfoCollection from "./components/InfoCollection";
import Justification from "./components/justification";
import LinksToOthers from "./components/LinksToOthers";
import Overview from "./components/overview";
import PaymentGateway from "./components/paymentGateway";
import Protection from "./components/protection";
import QuestionsAndComments from "./components/QuestionsAndComments";
import ThirdParty from "./components/Thirdparty";
import ThirdPartyServices from "./components/thirdPartyServices";
import UserRights from "./components/userRights";
import ContactUs from "./contactus";
import UserBehavior from "./userbehavior";
import { Helmet } from "react-helmet";

const TermAndConditions = () => {
  return (
    <div className="static-page-container">
      <Helmet>
        <title>Privacy Policy | Autoform India</title>
        <meta name='description' content="Discover how Autoform India prioritizes your privacy with our transparent and user-friendly Privacy Policy." />
      </Helmet>

      <section className="static-hero">
        <h1>PRIVACY POLICY</h1>
        <p className="hero-subtitle">Your Privacy & Data Security Matter</p>
      </section>

      <div className="max-w-[1200px] mx-auto px-4 md:px-0 pb-20">
        <div className="static-card">
          <Overview />
          <InfoCollection />
          <Justification />
          <Protection />
          <AutomaticCollection />
          <UserBehavior />
          <EmailChoice />
          <CookiesUsage />
          <ThirdParty />
          <PaymentGateway />
          <ThirdPartyServices />
          <Challenges />
          <UserRights />
          <DisclaimerToSecurity />
          <LinksToOthers />
          <QuestionsAndComments />
          <ContactUs />
        </div>
      </div>
    </div>
  );
};
export default TermAndConditions;
