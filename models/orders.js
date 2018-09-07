var Orders = {
  list: (client, filter, callback) => {
    const orderListQuery = `
      SELECT
        customers.first_name,
        customers.middle_name,
        customers.last_name,
        customers.email,
        products.name,
        orders.purchase_date,
        orders.quantity 
      FROM orders
      INNER JOIN products ON orders.product_id=products.id
      INNER JOIN customers ON orders.customer_id=customers.id
      ORDER BY purchase_date DESC;
    `;
    client.query(orderListQuery, (req, data) => {
      console.log(req);
      callback(data.rows);
    });
  }
};
module.exports = Orders;
