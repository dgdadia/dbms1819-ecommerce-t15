var Categories = {
  list: (client, filter, callback) => {
    const categoryListQuery = `
      SELECT
      products_category.name
   
      FROM products_category
    
      ORDER BY id ASC
    `;
    client.query(categoryListQuery, (req, data) => {
      console.log(req);
      callback(data.rows);
    });
  }
};
module.exports = Categories;
