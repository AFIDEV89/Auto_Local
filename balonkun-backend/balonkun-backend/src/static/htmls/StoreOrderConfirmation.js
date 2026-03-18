export const StoreOrderConfirmation = (order) => {
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
    <h3>User details:</h3>
    <strong>Name: </strong>${order.user.first_name + ' ' + order.user.last_name}<br />
    <strong>Email: </strong>${order.user.email}<br />
  </html>`;
};
