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
});

//display inventory
function displayInventory() {
  //print the items for sale and their details
  connection.query("SELECT * From Products", function(err, res) {
    if (err) throw err;

    console.log("*******************");
    console.log("WELCOME TO BAMAZON!");
    console.log("**VIEW OUR ITEMS!**");
    console.log("*******************");

    for (i = 0; i < res.length; i++) {
      //console logging the items and and a seperator bar; note that the resopnse requests
      //match the table column in my schema

      console.log(
        "Item ID: " +
          res[i].item_id +
          "Product Name: " +
          res[i].product_name +
          "Department Name: " +
          res[i].department_name +
          "Price: " +
          res[i].price +
          "Stock Quantity: " +
          res[i].stock_quantity
      );

      console.log("*******************");
    }
    placeOrder();
  });
}

//place order
//promts users to enter the ID of the product
function placeOrder() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "id",
        message: "What is the ID of the product?",

        validate: function(value) {
          if (
            isNaN(value) == false &&
           // parseInt(value) <= res.length &&
            parseInt(value) > 0
          ) {
            return true;
          } else {
            return false;
          }
        },
    },{
        type: "input",
        name: "quantity",
        message: "How much do you want to purchase?",

        validate: function(value) {
          if (isNaN(value)) {
            return false;
          } else {
            return true;
          }
        }
      }
    ])
    .then(
      function(ans) {
        connection.query("Select * from products where id= ?"),
          [answer.selectId],
          function(err, res) {
            if (answer.selectQuantity.res[0].stockquantity) {
              console.log("Insufficient Quantity");
              console.log("This order has benn canceled");
              console.log("");

              newOrder();
            } else {
              amountOwed = res[0].price * answer.selectQuantity;
              currentDepartment = res[0].departmentname;
              console.log("Your total is $" + amountOwed);
              console.log("");

              connection.query(
                "Update products set ? where?",
                [
                  {
                    stockquantity: res[0].stockquantity - answer.selectQuantity
                  },
                  {
                    id: answer.selectId
                  }
                ],
                function(err, res) {}
              );

              logSalesToDepartment();

              newOrder();
            }
          };
      },
      function(err, res) {}
    );
}

function newOrder() {
  inquirer
    .prompt([
      {
        type: "confirm",
        name: "choice",
        message: "Would you like to place another order?"
      }
    ])
    .then(function(ans) {
      if (ans.choice) {
        placeOrder();
      } else {
        console.log("Thank you for shopping with us!");
        connection.end();
      }
    });
}

function logSalesToDepartment() {
  connection.query(
    "Select * From departments where department name = ?",
    [currentDepartment],
    function(err, res) {
      updateSales = res[0].totalsales + amountOwed;
      updateDepartmentTable();
    }
  );
}

function updateDepartmentTable() {
  connection.query(
    "Update departments set ? Where ?",
    [
      {
        totalsales: updateSales
      },
      {
        departmentname: currentDepartment
      }
    ],
    function(err, res) {}
  );
}

displayInventory();
