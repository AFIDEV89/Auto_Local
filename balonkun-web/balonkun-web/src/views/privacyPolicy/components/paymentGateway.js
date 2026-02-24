const PaymentGateway = () => {
  return (
    <div className="ppInternal">
      <h3>Payment Gateway</h3>
      <p>Razorpay is our payment partner. We know it is very important to know about the process of
        payments, here at Autoform, we assure the users that our payment partner will not use any
        information illegally and the users personal information is in the safe hands of our partners. Also,
        Razorpay does not store your card data on their servers. The data is encrypted through the Payment
        Card Industry Data Security Standard (PCI-DSS) during the processing of the payments. The users
        purchase transaction data is only used as long as is necessary to complete the purchase transaction
        itself. After that is complete, the purchase transaction information is not saved.</p>
      <div className="empty"></div>
    </div>
  );
};

export default PaymentGateway;
