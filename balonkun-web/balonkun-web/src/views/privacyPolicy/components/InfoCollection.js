const InfoCollection = () => {
  return (
    <div className="ppInternal">
      <h3>Information that Compnay may collect</h3>
      <p><b>Personal Inforamtion</b></p>

      <ul>
        <li>
          Personal information that the users voluntarily provide when using our website or services,
          including contact information (e.g. email address, name, telephone number, home or work
          address) and financial information as well (e.g., bank account number).
        </li>
        <li>
          Personal Information that the users voluntarily transmit while using our services, which is
          collected, used and processed by the company, solely for the purpose of delivering better
          services to the users.
        </li>
        <li>
          Information about general usage of our website collected by using a cookie file which is
          typically stored on the hard drive of the user’s computer. Please see the “How does the
          Company use cookies” section below for further explanations.
        </li>
      </ul>
      <div className="empty"></div>
    </div>
  );
};

export default InfoCollection;
