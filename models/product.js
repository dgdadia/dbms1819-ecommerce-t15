// var Product = {
//   getById: (client, productId, callback) => {
//     const productQuery = `SELECT  
//     products.id
//     products.name as name,
//     products.image as image,
//     products.description as description,
//     products.price as price,
//     brands.brand_name as brand_name,
//     products_category.name as category_name
//     FROM products products
//     INNER JOIN brands brand on products.brand_id = brand.id
//     INNER JOIN products_category category on products.category_id = category.id
//     WHERE products.id = ${productId}
//     `;
//     client.query(productQuery, (req, data) => {
//       console.log(req);
//       var productData = {
//         product_id: data.rows[0].id,
//         product_name: data.rows[0].name,
//         product_image: data.rows[0].image,
//         product_price: data.rows[0].price,
//         product_description: data.rows[0].description,
//         product_brand: data.rows[0].brand_name,
//         product_category: data.rows[0].category_name
//       };
//       callback(productData);
//     });
//   },

//   list: (client, filter, callback) => {
//     const productlistQuery = `SELECT
//     products.id as id,
//     products.name as name,
//     products.image as image,
//     products.price as price,
//     brands.brand_name as brand_name,
//     products_category.name as category_name
//     FROM products p
//     INNER JOIN brands brand on products.brand_id = brand.id
//     INNER JOIN products_category category on products.category_id = category.id
//     `;
//     client.query(productlistQuery, (req, data) => {
//       console.log(data.rows);
//       callback(data.rows);
//     });
//   }
// };
// module.exports = Product;


var Product = {
  getById: (client, productData, callback) => {
    const productQuery = `SELECT  products.id
     products.name as name,
     products.image as image,
     products.description as description,
     products.price as price,
     brands.brand_name as brand_name,
     products_category.name as category_name
     INNER JOIN brands brand on products.brand_id = brand.id
     INNER JOIN products_category category on products.category_id = category.id
     WHERE products.id = ${productId}
    `;
    client.query(productsQuery, (req, data) => {
      console.log(req);
      console.log(data.rows[0]);
      var productData = {
        product_id: data.rows[0].id,
        product_name: data.rows[0].name,
        product_image: data.rows[0].image,
        product_price: data.rows[0].price,
        product_description: data.rows[0].description,
        product_brand: data.rows[0].brand_name,
        product_category: data.rows[0].category_name
      };
      callback(productsData);
    });
  },

  list: (client, filter, callback) => {
    const productListQuery = 'SELECT * FROM products';
    client.query(productListQuery, (req, data) => {
      console.log(data.rows);
      callback(data.rows);
    });
  },

  mostOrderedProduct: (client, filter, callback) => {
    const query = `
      SELECT products.name AS products_name,
      ROW_NUMBER() OVER (ORDER BY SUM(orders.quantity) DESC) AS ROW,
      SUM(orders.quantity) AS TOTAL
      FROM orders
      INNER JOIN products ON orders.product_id = products.id
      GROUP BY products_name
      ORDER BY SUM(orders.quantity) DESC
      LIMIT 10;
    `;
    client.query(query, (req,result) => {
      // console.log(result.rows);
      callback(result.rows)
    });
  },

  leastOrderedProduct: (client, filter, callback) => {
    const query = `
      SELECT products.name AS products_name,
      ROW_NUMBER() OVER (ORDER BY SUM(orders.quantity) ASC) AS ROW,
      SUM(orders.quantity) AS TOTAL
      FROM orders
      INNER JOIN products ON orders.product_id = products.id
      GROUP BY products_name
      ORDER BY SUM(orders.quantity) ASC
      LIMIT 10;
    `;
    client.query(query, (req,result) => {
      // console.log(result.rows);
      callback(result.rows)
    });
  }
};

module.exports = Product;