var mysql = require("mysql");

var inquirer = require("inquirer");
var Table = require('cli-table');

//database parameters
var con = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "",
  database: "bamazon"
});
//database connection
con.connect(function(err) {
    if(err) {
        console.log('Error connecting to Db: ' + err);
        return;
    }
});

// Function select options
function selectOption() {

    // Asks what option the supervisor wants to access
    inquirer.prompt([
        {
            type: "list",
            message: "Do you want to buy another product?",
            choices: ["View Product Sales by Department", "Create New Department", "Exit"],
            name: "option"
        }
    ]).then(function(a) {

        // Switch the answer through the cases
        switch (a.option) {
            case 'View Product Sales by Department':
                console.log('');
                console.log(a.option + ':');
                console.log('');
                viewSales();
                break;

            case 'Create New Department':
                console.log('');
                console.log(a.option + ':');
                console.log('');
                addDepartment();
                break;

            case 'Exit':
                con.end(function(err) {}); // Ends application
                break;
        }
    });
}

// Function show table of departments info
function viewSales() {

    // Selects departments info using alias for the calculation
    con.query('SELECT department_id, department_name, over_head_costs, total_sales, (total_sales - over_head_costs) AS "total_profit" FROM departments', function(err, res) {

        if(err) {
            console.log('Error select: ' + err);
            return;
        }

        //create table: head and column size
        var table = new Table({
            head: ['ID', 'NAME', 'OVER HEAD COSTS', 'PRODUCT SALES', 'TOTAL PROFIT'],
            colWidths: [5, 15, 15, 15, 15]
        });

        for(var i=0;i<res.length;i++) {
            table.push([res[i].department_id,res[i].department_name,res[i].over_head_costs.toFixed(2),res[i].total_sales.toFixed(2),res[i].total_profit.toFixed(2)]); // Add elements to table
        }
        console.log(table.toString());
        console.log('');

        console.log('');
        selectOption(); // Call Function select options
    });
}

// Function add a new department
function addDepartment() {

    // Asks department info
    inquirer.prompt([
        {
            type: "input",
            message: "Type the Department Name:",
            name: "name"
        }, {
            type: "input",
            message: "Type the Department Over Head Costs:",
            name: "ohc"
        }
    ]).then(function(a) {

        // Select the department answered to check if already exists
        con.query('SELECT department_name FROM departments WHERE department_name = ?', [a.name], function(err, res) {
            if(err) {
                console.log('Error select: ' + err);
                return;
            }

            // Check if department already exists
            if(res.length > 0) {
                console.log('');
                console.log('Department already exists!');
                console.log('');
                addDepartment();
            } else {

                // Insert new department
                con.query('INSERT INTO departments SET ?', {
                    department_name: a.name,
                    over_head_costs: parseFloat(a.ohc).toFixed(2)
                }, function(err, res) {
                    if(err) {
                        console.log('Error insert: ' + err);
                        return;
                    }

                    console.log('');
                    console.log('Department ' + a.name + ' added.');
                    console.log('');
                    selectOption(); // Call Function select options
                });
            }
        });
    });
}

selectOption(); // First Function called
