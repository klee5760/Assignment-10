DROP DATABASE IF EXISTS bamazon;

CREATE database bamazon;

USE bamazon;

CREATE TABLE products(
	item_id INT(4) NOT NULL,
	product_name VARCHAR(100) NOT NULL,
	department_name VARCHAR(100) NOT NULL,
	price DECIMAL(10,2) NOT NULL,
	stock_quantity INT(20) NOT NULL,
	PRIMARY KEY (item_id)
);


Select * FROM products;

INSERT INTO products (item_id, product_name, department_name, price, stock_quantity) 

VALUES (101, "1000 casino chips", "casino", 149.99, 20),
(104, "Craps Table", "craps", 1599.99, 5),
(108, "Roulette Table", "roulette", 1599.99, 5),
(105, "50 inch Craps Dice Stick ", "craps", 19.99, 20),
(106, "Five 20mm Craps Dice", "craps", 11.99, 20),
(109, "3/4 roulette ball", "roulette", 8.99, 20),
(111, "Two deck casino cards", "cards", 15.99, 20),
(501, "The beginning of Linux", "books", 24.99, 15),
(502, "The beginning of Python", "books", 24.99, 15)