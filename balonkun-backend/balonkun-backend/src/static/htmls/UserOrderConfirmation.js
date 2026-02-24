export const UserOrderConfirmation = (order) => {
  return `<html>
    <h2>Order details:</h2>
    <strong>Order ID: </strong>${order.id}<br />
    <strong>Order Amount: </strong>INR ${order.total_amount}<br />

    <ul>
      ${order.order_products.map((data, index) => {
    return `<li key=${index}>
      <strong>Product: </strong>${data.product.name}<br />
      <strong>Price: </strong>INR ${data.amount_per_product}<br />
      <strong>Quantity: </strong>${data.quantity}<br />
      <strong>Total Amount: </strong>INR ${data.total_amount}<br />
    </li>`;
  })}
    </ul>
    <h3>Store details:</h3>
    <strong>Name: </strong>${order.store.name}<br />
    <strong>Email: </strong>${order.store.email || '-'}<br />
    <strong>Contact no: </strong>${order.store.contact_no || '-'}<br />
    <strong>Address: </strong>${order.store.address.street_address}<br />
  </html>`;
};


export const UserOrderConfirmation_New = (order) => {
    return `<html>
<strong>Dear </strong>${order?.user?.first_name}<br />
<p>Thank you for reaching out to us regarding your query. We are pleased to inform you that we have received your message and would like to confirm that it is being processed.</p>

<p>If you have any additional information or details to share, please feel free to include them in your reply. This will help us expedite the resolution of your query.</p>

 <h2>Order details:</h2>
    <strong>Order ID: </strong>${order.id}<br />
    <strong>Order Amount: </strong>INR ${order.total_amount}<br />

    <ul>
      ${order.order_products.map((data, index) => {
        return `<li key=${index}>
      <strong>Product: </strong>${data.product.name}<br />
      <strong>Price: </strong>INR ${data.amount_per_product}<br />
      <strong>Quantity: </strong>${data.quantity}<br />
      <strong>Total Amount: </strong>INR ${data.total_amount}<br />
    </li>`;
    })}
    </ul>
    <h3>Store details:</h3>
    <strong>Name: </strong>${order.store.name}<br />
    <strong>Email: </strong>${order.store.email || '-'}<br />
    <strong>Contact no: </strong>${order.store.contact_no || '-'}<br />
    <strong>Address: </strong>${order.store.address.street_address}<br />
    
<p>In the meantime, if you have any urgent concerns or require immediate assistance, please do not hesitate to contact us at 092784 11411 or marketing@autoformindia.com. Our dedicated customer support team is available to help you.</p>

    
<p>Best regards,</p>

<p>Support Team </p>
<p>AutoFormIndia</p>

  </html>`;
};