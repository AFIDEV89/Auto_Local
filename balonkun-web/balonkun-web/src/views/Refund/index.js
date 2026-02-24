import { Helmet } from "react-helmet";

const RefundPage = () => {
  return (
    <div className="aboutUsWrapper">
      <Helmet>
        <title>Refund, Return, and Exchange</title>
        <meta name='description' content="Refund, Return, and Exchange" />
      </Helmet>
      <div className="aboutusInternal">
        <h1>Refund, Return & Exchange</h1>
        <div className="aboutusInternal">
          <p>The refund, return and exchange policies are only valid for products which are purchased from
            Autoform e-commerce website (autoformindia.com) and being used in India.</p>
          <p>The company offers the provision of Exchange in case the customer is not satisfied with the product.</p>
          <p><b>In case the customer experiences one of the following situations:</b></p>
          <ul>
            <li>Manufacturing related defect</li>
            <li>Fitment related defect</li>
            <li>Shipping related defect</li>
            <li>Wrong delivery (with respect to design or colour)**</li>
          </ul>
          <div class='empty'></div>
          <p>The company is liable to exchange their product with the correct one depending on the stock
            availability. In case their product is unavailable, eCash will be deposited to their Autoform account
            with lifetime validity. This eCash can be used only for the products displayed on the website and is not
            valid for retail store shopping.</p>
          <p>The delivery details of the exchanged products will be communicated to the customer through the
            email id, contact number provided by them within 7 days from the receipt of the damaged, wrong or
            defected product.</p>
          <p>All returns that are made for the purpose of exchange or refund will be verified by our Quality
            Assurance (QC) team, who will decide the state and condition of the product.</p>
          <p>The freight charges for returning the product will be borne by the customer, which are non-refundable
            in nature.</p>
          <p><b>In case of the following situations, the company is not liable for any refund, return or
            exchange:</b></p>
          <ul>
            <li>Wrong order placed by the customer</li>
            <li>The product is used or not in the original state as checked by our QC team</li>
            <li>Not sold under Sale items</li>
          </ul>
          <p>In case the product is not found to be in the right condition (as stated in the aforementioned points), it
            will be returned to the customer.</p>
          <p>Our brand Autoform and its promoters and team members shall not be held responsible for any loss
            of any kind to the customer or dealer or distributer due to incorrect application leading from the
            Fitment or Usage of all our seat covers and Accessories or part/component of the product.</p>
          <p>**<i>Images that you see on the Website may vary from the original product delivered</i></p>
        </div>
      </div>
    </div>
  );
};
export default RefundPage;
