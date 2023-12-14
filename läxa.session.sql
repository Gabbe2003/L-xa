-- Drop existing tables if they exist
DROP TABLE IF EXISTS OrderRows;
DROP TABLE IF EXISTS Orders;
DROP TABLE IF EXISTS ProductCategories;
DROP TABLE IF EXISTS Products;

-- Create Products table
CREATE TABLE Products (
    id INT PRIMARY KEY,
    name VARCHAR(255),
    description TEXT,
    price INT,
    imageUrl VARCHAR(255),
    year INT,
    added DATETIME
);

-- Create ProductCategories table
CREATE TABLE ProductCategories (
    productId INT,
    categoryId INT,
    FOREIGN KEY (productId) REFERENCES Products(id)
);

-- Create Orders table
CREATE TABLE Orders (
    id INT PRIMARY KEY,
    companyId INT,
    created DATETIME,
    createdBy VARCHAR(255),
    paymentMethod VARCHAR(255),
    totalPrice INT,
    status INT
);

-- Create OrderRows table
CREATE TABLE OrderRows (
    id INT PRIMARY KEY,
    productId INT,
    amount INT,
    orderId INT,
    FOREIGN KEY (productId) REFERENCES Products(id),
    FOREIGN KEY (orderId) REFERENCES Orders(id)
);

-- Sample queries
SELECT * FROM Products;
SELECT id, name FROM Products;
SELECT * FROM Products WHERE price > 100;
SELECT COUNT(*) FROM Products WHERE price > 100;
SELECT * FROM Orders WHERE created > NOW() - INTERVAL 1 YEAR;
SELECT * FROM Orders ORDER BY created DESC;
SELECT orderId, COUNT(*) AS productCount FROM OrderRows GROUP BY orderId;
SELECT o.id, p.name, p.description FROM Orders o
JOIN OrderRows orr ON o.id = orr.orderId
JOIN Products p ON orr.productId = p.id;
SELECT o.id, SUM(p.price * orr.amount) AS totalValue FROM Orders o
JOIN OrderRows orr ON o.id = orr.orderId
JOIN Products p ON orr.productId = p.id
GROUP BY o.id;
