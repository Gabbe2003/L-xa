const axios = require('axios');
const knex = require('knex')({
  client: 'mysql',
  connection: {
    host: '127.0.0.1',
    user: 'root',
    password: 'root',
    database: 'läxa'
  }
});

const readDataDB = async () => {
    try {
      const result = await axios.get('https://medieinstitutet-wie-products.azurewebsites.net/api/products');
  
      const productDataInsert = result.data.map(column => ({
        id: column.id,
        name: column.name,
        description: column.description,
        price: column.price,
        imageUrl: column.imageUrl,
        year: column.year,
        added: column.added,
      }));
  
      await knex('Products').insert(productDataInsert)
        .onConflict('id')
        .merge();
  
      const productCategoryDataInsert = result.data.flatMap(column =>
        column.productCategory.map(category => ({
          productId: column.id,
          categoryId: category.categoryId,
        }))
      );
  
      await knex('ProductCategories').insert(productCategoryDataInsert);
  
      console.log("Product and category data successfully inserted into the database.");
    } catch (error) {
      console.error("Error occurred while inserting product and category data:", error);
      throw error; 
    }
  };
  

const readDataDB2 = async () => {
  try {
    const result = await axios.get('https://medieinstitutet-wie-products.azurewebsites.net/api/orders?companyId=77');

    const orderDataInsert = result.data.map(order => ({
      id: order.id,
      companyId: order.companyId,
      created: order.created,
      createdBy: order.createdBy,
      paymentMethod: order.paymentMethod,
      totalPrice: order.totalPrice,
      status: order.status,
    }));

    await knex('Orders').insert(orderDataInsert)
      .onConflict('id')
      .merge();

    const orderRowsDataInsert = result.data.flatMap(order =>
      order.orderRows.map(orderRow => ({
        id: orderRow.id,
        productId: orderRow.productId,
        product: orderRow.product,
        amount: orderRow.amount,
        orderId: order.orderId,
      }))
    );

    await knex('OrderRows').insert(orderRowsDataInsert)
      .onConflict('id')
      .merge();

    console.log("Order data successfully inserted into the database.");
  } catch (error) {
    console.error("Error occurred while inserting order data:", error);
    throw error;
  }
};

const insertData = async () => {
  try {
    await readDataDB(); 
    await readDataDB2();
    console.log("All data successfully inserted into the database.");
  } catch (error) {
    console.error("An error occurred during database update:", error);
  } finally {
    knex.destroy(); 
  }
};

insertData();
