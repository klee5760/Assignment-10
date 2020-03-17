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
  executiveQuery();
});

function executiveQuery(){
    inquirer.prompt([{
        name: 'input',
        type: 'list',
        message:'What would you like to do today?',
        choices: ['1) View Sales By Department', '2) Create New Deaprtment']
        
    }]).then(function(answer){
        if(answer.input === '1) View Sales By Department'){
            console.log('');
            connection.query('SELECT * FROM departments',function(err,res){
                console.log('SALES BY DEPARTMENT');
                for(i=0;i<res.length;i++){
                    var profit = res[i].totalSales = res[i].overHeadCost;
                    console.log('Department ID: ' + res[i].departmentId+ 'Department Name' + res[i].department_name);
                    console.log('Overhead Costs: ' + res[i].overHeadCost);
                    console.log('Total Sales: ' + res[i].totalSales);
                    console.log('Total Profit + profit');
                    console.log('*******************************');

                }
                newTranaction();
            })
        }
        else{
            addDepartment();
        }
    })
}

function addDepartment(){
    inquirer.prompt([{
        name: 'department',
        message: 'Enter a department name: '
    },{
        name:'overhead',
        message:'Enter overhead costs'
    }]).then(function(answer){

        var department = answer.department;
        var overhead = answer.overhead;

        connection.query('INSERT INTO separtment SET ?', {
            department_name = department,
            overHeadCost = overhead
        }, function(err,res){});

        newTransaction();
    })};

    function newTransaction(){
        inquirer.prompt([{
            type:'confirm',
            name:'choice',
            message: 'Would you like to perform another transaction?'
        }]).then(function(answer){
            if(answer.choice){
                executiveOptions();
            }
            else{
                console.log('Have a good day!');
                connection.end();
            }
        })
    }

    
