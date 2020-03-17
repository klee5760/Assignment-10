//require mysql and inquirer
var inquirer = require("inquirer");
var mysql = require("mysql");

//create connection to db
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "root",
  database: "bamazon"
});

//connect method to accept callback function or display an error
connection.connect(function(err) {
  if (err) throw err;
  console.log("Connection ID: " + connection.threadId);
  managerQuery();
});

function managerQuery() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "input",
        message: "Welcome to the Bamaon Management Database.Enter an option.",
        choices: [
          "1) View inventory",
          "2) View low inventory",
          "3) Add to inventory",
          "4) Add a product"
        ]
      }
    ])
    .then(function(answer) {
      if (answer.input === "1) View inventory") {
        viewInventory();
      } else if (answer.input === "2) View low inventory") {
        viewLowInventory();
      } else if (answer.input === "3) Add to inventory") {
        addInventoryPrompt();
      } else if (answer, input === "4) Add a product") {
        addProductPrompt();
      }
    });
}

function viewInventory() {
  connection.query("SELECT * From products", function(err, res) {
    if (err) throw err;
    console.log("");

    console.log("*************INVENTORY ITEMS*************");
    for (i = 0; i < res.length; i++) {
      console.log("Item ID: " + res[i].item_id);
      console.log("Product: " + res[i].product_name);
      console.log("Department: " + res[i].department_name);
      console.log("Item Price: " + res[i].price);
      console.log("Quantity in stock: " + res[i].stock_quantity);
      console.log("*******************************************");
    }

    console.log("");

    newQuery();
  });
}

function viewLowInventory() {
  connection.query("SELECT * FROM products WHERE stock_quantity < 10", function(
    err,
    res
  ) {
    if (err) throw err;

    console.log("");
    console.log("************LOW INVENTORY ITEMS************");
    for (i = 0; i < res.length; i++) {
      console.log("Item ID: " + res[i].item_id);
      console.log("Product: " + res[i].product_name);
      console.log("Quantity in Stock: " + res[i].stock_quantity);
      console.log("*********************************");
    }

    newQuery();
  });
}

function addInventoryPrompt() {
  connection.query("SELECT * From products", function(err, res) {
    if (err) throw err;

    var choices = [];
    for (var i = 0; i < res.length; i++) {
      var choice = {
        name: res[i].product_name,
        value: res[i].item_id
      };
      choices.push(choice);
    }

    inquirer
      .prompt([
        {
          name: "item",
          message: " Enter the ID of the inventory item to update",
          type: "list",
          choices: choices
        },
        {
          name: "number",
          message: "Enter the number of items to add to the product inventory",
          validate: function(value) {
            var valid = value.match(/^[0-9]+$/);
            if (valid) {
              return true;
            }
            return "Please enter a valid quantity";
          }
        }
      ])
      .then(function(answer) {
        addInventorySQL(answer);
      });
  });
}

function addInventorySQL(answer) {
  connection.query(
    "UPDATE products SET stock_quantity = stock_quantity + ? Where item_id = ?",
    [answer.number, answer.item],
    function(err, res) {
      if (err) throw err;

      if (res.changedRows > 0) {
        console.log("Inventory updated");
      }

      newQuery();
    }
  );
}

function addProductPrompt() {
  
  inquirer
    .prompt([
      {
        name: "product",
        message: " Enter product name: "
      },
      {
        name: "department",
        message: "Enter the product department: "
      },
      {
        name: "price",
        message: "Enter the item price",
        validate: function(value) {
          var valid = value.match(/^[0-9]+$/);
          if (valid) {
            return true;
          } else

          return "Enter a valid value";
        }
      },
      {
        name: " stock",
        message: "Enter the stock quantity",
        validate: function(value) {
          var valid = value.match(/^[0-9]+$/);
          if (valid) {
            return true;
          }
          else

          return "Please enter a valid value";
        }
      }
    ])
    .then(function(answer) {
      addProductSQL(answer);
    });
  }
  

function addProductSQL(answer) {
  connection.query("INSERT into products SET  = stock_quantity ?"),
    {
      product_name: answer.product,
      department_name: answer.department,
      price: answer.price,
      stock_quantity: answer.stock
    },
   
  console.log("Product added");
  newQuery();
}

function newQuery() {
  inquirer
    .prompt([
      {
        type: "confirm",
        name: "choice",
        message: "Would you like to perform another tranaction?"
      }
    ])
    .then(function(answer) {
      if (answer.choice) {
        managerQuery();
      } else {
        console.log("Thank You! Have a nice day!");
        connection.end();
      }
    });
}
