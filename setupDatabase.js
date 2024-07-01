const { Client } = require('pg');
const { DB } = require('./config');

(async () => {

  const usersTableStmt = `
    CREATE TABLE IF NOT EXISTS users (
      id              INT               PRIMARY KEY GENERATED ALWAYS AS IDENTITY NOT NULL,
      email           VARCHAR(50),      
      password        TEXT,
      firstName       VARCHAR(50),
      lastName        VARCHAR(50),
      google          JSON,
      facebook        JSON
    );
  `

  const productsTableStmt = `
    CREATE TABLE IF NOT EXISTS products (
      id              INT             PRIMARY KEY GENERATED ALWAYS AS IDENTITY NOT NULL,
      name            VARCHAR(50)     NOT NULL,
      price           BIGINT          NOT NULL,
      description     VARCHAR(50)     NOT NULL,
      image_urls      TEXT[]
    );
  `

  const ordersTableStmt = `
    CREATE TABLE IF NOT EXISTS orders (
      id              INT             PRIMARY KEY GENERATED ALWAYS AS IDENTITY NOT NULL,
      total           INT             NOT NULL,
      status          VARCHAR(50)     NOT NULL,
      userId          INT             NOT NULL,
      created         DATE            NOT NULL,
      modified        DATE            NOT NULL,
      FOREIGN KEY (userId) REFERENCES users(id)
    );
  `

  const orderItemsTableStmt = `
    CREATE TABLE IF NOT EXISTS orderItems (
      id              INT             PRIMARY KEY GENERATED ALWAYS AS IDENTITY NOT NULL,
      created         DATE            NOT NULL,
      orderId         INT             NOT NULL,
      qty             INT             NOT NULL,
      price           INT             NOT NULL,
      productId       INT             NOT NULL,
      name            VARCHAR(50)     NOT NULL,
      description     VARCHAR(200)    NOT NULL,
      FOREIGN KEY (orderId) REFERENCES orders(id)
    );
  `

  const cartsTableStmt = `
    CREATE TABLE IF NOT EXISTS carts (
      id              INT             PRIMARY KEY GENERATED ALWAYS AS IDENTITY NOT NULL,
      userId          INT             NOT NULL,
      modified        DATE            NOT NULL,
      created         DATE            NOT NULL,
      FOREIGN KEY (userId) REFERENCES users(id)
    );
  `

  const cartItemsTableStmt = `
    CREATE TABLE IF NOT EXISTS cartItems (
      id              INT             PRIMARY KEY GENERATED ALWAYS AS IDENTITY NOT NULL,
      cartId          INT             NOT NULL,
      productId       INT             NOT NULL,
      qty             INT             NOT NULL,
      FOREIGN KEY (cartId) REFERENCES carts(id),
      FOREIGN KEY (productId) REFERENCES products(id)
    );
  `

  try {
    const db = new Client({
      user: DB.PGUSER,
      host: DB.PGHOST,
      database: DB.PGDATABASE,
      password: DB.PGPASSWORD,
      port: DB.PGPORT
    });

    await db.connect();

    // Create tables on database
    await db.query(usersTableStmt);
    await db.query(productsTableStmt);
    await db.query(ordersTableStmt);
    await db.query(orderItemsTableStmt);
    await db.query(cartsTableStmt);
    await db.query(cartItemsTableStmt);

    // Insert products to the database
    const insertProductStmt = `
      INSERT INTO products (name, price, description, image_urls)
      VALUES ($1, $2, $3, $4)
    `;

    // Insert multiple products to database
    const products = [
      { 
        name: '"happy." White t-Shirt',
        price: 12.50, 
        description: 'White t-shirt with happy definition in the front and with a happy face in the back', 
        image_urls: ['https://i.imgur.com/HYwXQxP.png', 'https://i.imgur.com/x6KCl5E.png']
      },
      { 
        name: '"love." Red t-Shirt', 
        price: 12.50, 
        description: 'Red t-shirt with love definition in the front and with a heart in the back', 
        image_urls: ['https://i.imgur.com/j4N4UYz.png', 'https://i.imgur.com/TyzqVdk.png']
      },
      { 
        name: '"sad." Black t-Shirt', 
        price: 12.50, 
        description: 'Black t-shirt with sad definition in the front and with a sad face in the back', 
        image_urls: ['https://i.imgur.com/40SLrQz.png', 'https://i.imgur.com/hTgCKvN.png']
      },
      { 
        name: '"not happy." Black t-Shirt', 
        price: 12.50, 
        description: 'Black t-shirt with chinese letter with not happy meaning in the front and with a sad face and "not happy.· letters in the back',
        image_urls: ['https://i.imgur.com/ipMcAEL.png', 'https://i.imgur.com/LBCabFA.png']
      },
      { 
        name: '"not in love." Red t-Shirt', 
        price: 12.50, 
        description: 'Red t-shirt with chinese letter with not in love meaning in the front and with a broken heart and "not in love.· letters in the back',
        image_urls: ['https://i.imgur.com/jG85tJi.png', 'https://i.imgur.com/jikyEcL.png']
      },
      { 
        name: '"not sad." White t-Shirt', 
        price: 12.50, 
        description: 'White t-shirt with chinese letter with not sad meaning in the front and with a happy face and "not sad.· letters in the back',
        image_urls: ['https://i.imgur.com/AGdvyKD.png', 'https://i.imgur.com/YXRnqOf.png']
      },
    ];

    for (const product of products) {
      await db.query(insertProductStmt, [product.name, product.price, product.description, product.image_urls]);
    }

    // Disconnect database
    await db.end();

  } catch(err) {
    console.log("ERROR CREATING ONE OR MORE TABLES: ", err);
  }

})();