var Customers = {
  list: (client, filter, callback) => {
    const customersListQuery = `
      SELECT
      customer.id,
      customers.first_name,
      customers.last_name,
      customers.last_name,
      customers.email,
      customers.state,
      customers.city,
      customers.street,
      customers.zipcode,
      products.name,
      orders.quantity,
      orders.purchase_date 
      FROM orders
      INNER JOIN customers ON orders.customer_id=customers.id
      INNER JOIN products ON orders.product_id=products.id
      WHERE customers.id = '" + req.params.id + "' 
      ORDER BY purchase_date DESC
    `;
    client.query(customersListQuery, (req, data) => {
      console.log(req);
      callback(data.rows);
    });
  }
};
module.exports = Customers;
