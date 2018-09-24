var Product = {
  getById: (client, productId, callback) => {
    const productQuery = `SELECT 
    products.id
    products.name as name,
    products.image as image,
    products.description as description,
    products.price as price,
    brands.brand_name as brand_name,
    products_category.name as category_name
    FROM products products
    INNER JOIN brands brand on products.brand_id = brand.id
    INNER JOIN products_category category on products.category_id = category.id
    WHERE products.id = ${productId}
    `;
    client.query(productQuery, (req, data) => {
      console.log(req);
      var productData = {
        product_id: data.rows[0].id,
        product_name: data.rows[0].name,
        product_image: data.rows[0].image,
        product_price: data.rows[0].price,
        product_description: data.rows[0].description,
        product_brand: data.rows[0].brand_name,
        product_category: data.rows[0].category_name
      };
      callback(productData);
    });
  },

  list: (client, filter, callback) => {
    const productlistQuery = `SELECT
    products.id as id,
    products.name as name,
    products.image as image,
    products.price as price,
    brands.brand_name as brand_name,
    products_category.name as category_name
    FROM products p
    INNER JOIN brands brand on products.brand_id = brand.id
    INNER JOIN products_category category on products.category_id = category.id
    `;
    client.query(productlistQuery, (req, data) => {
      console.log(data.rows);
      callback(data.rows);
    });
  }
};
module.exports = Product;
