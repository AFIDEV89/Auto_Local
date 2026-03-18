import { Helmet } from "react-helmet";

const RefundPage = () => {
  return (
    <div className="static-page-container">
      <Helmet>
        <title>Refund, Return, and Exchange | Autoform India</title>
        <meta name='description' content="Learn about Autoform India's transparent Refund, Return, and Exchange policies for a worry-free shopping experience." />
      </Helmet>

      <section className="static-hero">
        <h1>REFUND & RETURN</h1>
        <p className="hero-subtitle">Exchange & Cancellation Policies</p>
      </section>

      <div className="max-w-[1200px] mx-auto px-4 md:px-0">
        <div className="static-card">
          <p>
            The refund, return and exchange policies are only valid for products which are purchased from
            Autoform e-commerce website (autoformindia.com) and being used in India.
          </p>
          <p>The company offers the provision of Exchange in case the customer is not satisfied with the product.</p>

          <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 my-8">
            <p className="font-bold text-slate-900 mb-2">Valid situations for Exchange/Return:</p>
            <ul>
              <li>Manufacturing related defect</li>
              <li>Fitment related defect</li>
              <li>Shipping related defect</li>
              <li>Wrong delivery (with respect to design or colour)**</li>
            </ul>
          </div>

          <p>
            The company is liable to exchange their product with the correct one depending on the stock
            availability. In case their product is unavailable, eCash will be deposited to their Autoform account
            with lifetime validity. This eCash can be used only for the products displayed on the website and is not
            valid for retail store shopping.
          </p>
          
          <p>
            The delivery details of the exchanged products will be communicated to the customer through the
            email id, contact number provided by them within 7 days from the receipt of the damaged, wrong or
            defected product.
          </p>

          <p>
            All returns that are made for the purpose of exchange or refund will be verified by our Quality
            Assurance (QC) team, who will decide the state and condition of the product.
          </p>

          <p className="bg-amber-50 text-amber-900 p-4 rounded-lg border border-amber-100 italic">
            <strong>Note:</strong> The freight charges for returning the product will be borne by the customer, which are non-refundable in nature.
          </p>

          <div className="section-divider"></div>

          <h3>Non-Exchangable Situations</h3>
          <p>In case of the following situations, the company is not liable for any refund, return or exchange:</p>
          <ul>
            <li>Wrong order placed by the customer</li>
            <li>The product is used or not in the original state as checked by our QC team</li>
            <li>Items sold under clearance/sale events</li>
          </ul>

          <p>In case the product is not found to be in the right condition (as stated in the aforementioned points), it will be returned to the customer.</p>

          <p className="mt-8 pt-8 border-t border-slate-100 text-slate-500 text-sm">
            Our brand Autoform and its promoters and team members shall not be held responsible for any loss
            of any kind to the customer or dealer or distributer due to incorrect application leading from the
            Fitment or Usage of all our seat covers and Accessories.
          </p>

          <p className="text-slate-400 text-xs italic mt-4">
            **Images that you see on the Website may vary from the original product delivered.
          </p>
        </div>
      </div>
    </div>
  );
};
export default RefundPage;
