//require mysql and inquirer
var inquirer = require("inquirer");
var mysql = require("mysql");
​
//create connection to db
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "root",
  database: "bamazon"
});
​
//connect method to accept callback function or display an error
connection.connect(function (err) {
  if (err) throw err;
  console.log("Connection ID: " + connection.threadId);
});
​
//display inventory
function displayInventory() {
  //print the items for sale and their details
  connection.query("SELECT * From Products", function (err, res) {
    if (err) throw err;
​
    console.log("*******************");
    console.log("WELCOME TO BAMAZON!");
    console.log("**VIEW OUR ITEMS!**");
    console.log("*******************");
​
    for (i = 0; i < res.length; i++) {
      //console logging the items and and a seperator bar; note that the resopnse requests
      //match the table column in my schema
​
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
​
      console.log("*******************");
    }
    placeOrder();
  });
}
​
// //place order
// //promts users to enter the ID of the product
function placeOrder() {
  console.log('Inside place order');
  inquirer.prompt([
    {
      type: "input",
      name: "id",
      message: "What is the ID of the product?",
​
      validate: function (value) {
        var valid = value.match(/^[0-9]+$/)
        if (valid) {
          return true;
        }
        return 'Enter a valid Product ID';
      }
    },
    {
      type: "input",
      name: "quantity",
      message: "How much do you want to purchase?",
​
      validate: function (value) {
        var valid = value.match(/^[0-9]+$/)
        if (valid) {
          return true;
        }
        return 'Enter a valid quantity';
      }
​
    }
  ])
    .then(function (answer) {
      console.log(answer);
      connection.query('SELECT * FROM products WHERE item_id= ?;', 
      [answer.id],
      function (err, res) {
        console.log(typeof answer.quantity);
        if (answer.quantity > res[0].stock_quantity) {
          console.log("Insufficient Quantity");
          console.log("This order has been canceled");

              console.log("");

              newOrder();
            } else {
              amountOwed = res[0].price * answer.Quantity;
              currentDepartment = res[0].departmentname;
              console.log("Your total is $ " + amountOwed);
              console.log("");

              connection.query('Update products set ? where?',[{
                //Here the stock_quantity is reduced by the quantity requested
                    stockquantity: res[0].stockquantity - answer.selectQuantity
                  },{

                    id:answer.selectId
                    
                  }],function(err, res) {});


//Updates the department sales table used by managers and execs
              logSalesToDepartment();

              //New order is now called to allow users to continue shop or quit

              newOrder();
            }
          }
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
