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

var prod_arr = []; // Array to hold products info

// Function show manager options
function selectOption() {

    // Asks to select an option
    inquirer.prompt([
        {
            type: "list",
            message: "Choose an option:",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit"],
            name: "option"
        }
    ]).then(function(a) {

        // Switch the answer through the cases
        switch (a.option) {
            case 'View Products for Sale':
                console.log('');
                console.log(a.option + ':');
                console.log('');
                showProducts('item_id, product_name, price, stock_quantity','');
                break;

            case 'View Low Inventory':
                console.log('');
                console.log(a.option + ':');
                console.log('');
                showProducts('item_id, product_name, price, stock_quantity','WHERE stock_quantity <= 5');
                break;

            case 'Add to Inventory':
                console.log('');
                console.log(a.option + ':');
                console.log('');
                addProduct();
                break;

            case 'Add New Product':
                console.log('');
                console.log(a.option + ':');
                console.log('');
                addNewProduct();
                break;

            case 'Exit':
                con.end(function(err) {}); // Ends application
                break;
        }
    });
}

// Function to show products info
function showProducts(search, where) {

    // Get the info based on call arguments
    con.query('SELECT ' + search + ' FROM products ' + where, function(err, res) {
        if(err) {
            console.log('Error select: ' + err);
            return;
        }

        //create table: head and column size
        var table = new Table({
            head: ['ID', 'NAME', 'U$', 'Q#'],
            colWidths: [5, 20, 12, 5]
        });

        for(var i=0;i<res.length;i++) {
            table.push([res[i].item_id,res[i].product_name,res[i].price.toFixed(2),res[i].stock_quantity]); // Add elements to table
            prod_arr.push([res[i].item_id,res[i].product_name,res[i].price,res[i].stock_quantity]); // Add elements to array
        }
        console.log(table.toString()); // Show table
        console.log('');

        console.log('');
        selectOption(); // Call Function select options
    });
}

// Function add stock to a product
function addProduct() {
    inquirer.prompt([
        {
            type: "input",
            message: "Type the Product ID you want to re-stock:",
            name: "product_id"
        }, {
            type: "input",
            message: "Type the quantity you want to add:",
            name: "quantity"
        }
    ]).then(function(a) {
        var id = parseInt(a.product_id); // Get product ID and turn it into an int

        // If product's ID does not exists, call function again
        if(id < 1 || id >= prod_arr.length) {
            console.log('');
            console.log('Product not found, please try again!');
            console.log('');
            addProduct();
        }

        var quantity = parseInt(a.quantity); // Get the quantity and turn it into an int
        var q =  parseInt(prod_arr[id-1][3]);
        quantity += q;

        // Updates product stock
        con.query('UPDATE products SET ? WHERE ?', [
            {stock_quantity: quantity},
            {item_id: id}
        ], function(err, res) {
            if(err) {
                console.log('Error update: ' + err);
                return;
            }

            console.log('');
            console.log('Product (' + prod_arr[id-1][1] + ') stock increased from ' + prod_arr[id-1][3] + ' to ' + quantity);
            console.log('');
            selectOption(); // Call Function select options
        });
    });
}

// Function create a new product
function addNewProduct() {

    // Get all departments from database
    con.query('SELECT department_name FROM departments ORDER BY department_name', function(err, res) {
        if(err) {
            console.log('Error select: ' + err);
            return;
        }

        var dep = []; // Add all departments to an array
        for(var i=0;i<res.length;i++) {
            dep.push(res[i].department_name);
        }

        // Asks product info to insert on database
        inquirer.prompt([
            {
                type: "input",
                message: "Type the Product Name:",
                name: "name"
            }, {
                type: "list",
                message: "Select the Product Department:",
                choices: dep,
                name: "department"
            }, {
                type: "input",
                message: "Type the Product Price:",
                name: "price"
            }, {
                type: "input",
                message: "Type the Product Quantity:",
                name: "stock_quantity"
            }
        ]).then(function(a) {

            // Insert new product
            con.query('INSERT INTO products SET ?', {
                product_name: a.name,
                department_name: a.department,
                price: parseFloat(a.price).toFixed(2),
                stock_quantity: parseInt(a.stock_quantity)
            }, function(err, res) {
                if(err) {
                    console.log('Error insert: ' + err);
                    return;
                }

                console.log('');
                console.log('Product ' + a.name + ' added.');
                console.log('');
                selectOption(); // Call Function select options
            });
        });
    });
}

selectOption(); // First Function called
