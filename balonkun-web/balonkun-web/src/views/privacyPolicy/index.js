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
    <div className="ppwrapper">
      <Helmet>
        <title>Privacy Policy</title>
        <meta name='description' content="Discover how Autoform India prioritizes your privacy with our transparent and user-friendly Privacy Policy." />
      </Helmet>
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
  );
};
export default TermAndConditions;
