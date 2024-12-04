// Function to generate email template for the user
function generateUserEmailTemplate(orders) {
  const orderRows = orders
    .map(
      (order) => `
      <tr>
        <td>${order.orderId}</td>
        <td>${order.orderedProduct.productName}</td>
        <td>${order.quantity}</td>
      </tr>`
    )
    .join("");

  return `
      <h2>Order Confirmation</h2>
      <p>Thank you for your order! Here are the details:</p>
      <table border="1" cellpadding="10">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Product Item</th>
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody>
          ${orderRows}
        </tbody>
      </table>
    `;
}

function generateUserOrderEmailTemplate(orders) {
  return `
      <h2>Order Completion</h2>
      <p>Your order has been successfully completed!</p>
      <p>Thank you for choosing our service!</p>
    `;
}

// Function to generate email template for the Admin
function generateAdminEmailTemplate(orders) {
  const orderRows = orders
    .map(
      (order) => `
      <tr>
        <td>${order.orderId}</td>
        <td>${order.orderedProduct.productName}</td>
        <td>${order.quantity}</td>
        <td>${order.orderedBy.name}</td>
      </tr>`
    )
    .join("");

  return `
      <h2>New Order Received</h2>
      <p>You have received a new order. Here are the details:</p>
      <table border="1" cellpadding="10">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Menu Item</th>
            <th>Quantity</th>
            <th>Ordered By</th>
          </tr>
        </thead>
        <tbody>
          ${orderRows}
        </tbody>
      </table>
    `;
}

module.exports = {
  generateUserEmailTemplate,
  generateUserOrderEmailTemplate,
  generateAdminEmailTemplate,
};