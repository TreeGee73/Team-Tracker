const connection = require("./js/connections.js");
const inquirer = require("inquirer");
const mysql = require("mysql");
const logo = require("asciiart-logo");

// Variables
const longText =
"Employee management that is totally NOT creepy but IS incredibly reliable and secure!";

// Functions to display the logo and start the application
logoArt();
init();

// Function to create opening logo
function logoArt() {
  console.log(
    logo({
      name: "Gotta Track'Em All!",
      font: "Stampatello",
      lineChars: 20,
      padding: 5,
      margin: 5,
      borderColor: "grey",
      logoColor: "bold-red",
      textColor: "grey",
    })
      .emptyLine()
      .right("version 1.0.0")
      .emptyLine()
      .center(longText)
      .render()
  );
}

// Function to start tracking.
// Prompts user to select an action and then executes the appropriate function for that action.
async function init() {
  const { action } = await inquirer.prompt({
    name: "action",
    type: "list",
    message: "Welcome! What do you need to do today?",
    choices: [
      "View Existing Employees",
      "View Existing Roles",
      "View Existing Departments",
      "Add New Employee",
      "Add New Role",
      "Add New Department",
      "Modify Existing Employee",
      "Modify Existing Role",
      "Remove Existing Employee",
      "Remove Existing Role",
      "Exit",
    ],
  });

  switch (action) {
    case "View Existing Employees":
      viewEmployees();
      break;
    case "View Existing Roles":
      viewRoles();
      break;
    case "View Existing Departments":
      viewDepartments();
      break;
    case "Add New Employee":
      createEmployee();
      break;
    case "Add New Role":
      createRole();
      break;
    case "Add New Department":
      createDepartment();
      break;
    case "Modify Existing Employee":
      updateEmployee();
      break;
    case "Modify Existing Role":
      updateRole();
      break;
    case "Remove Existing Employee":
      removeEmployee();
      break;
    case "Remove Existing Role":
      removeRole();
      break;
    case "Exit":
      process.exit(0);
      break;
    default:
      break;
  }
}

// A query which returns all data for all employees
async function viewEmployees() {
  const empQuery = "SELECT * FROM employees";
  const empData = await connection.query(empQuery);
  console.table(empData);
}

// A query which returns all data for all roles
async function viewRoles() {
  const query = "SELECT * FROM roles";
  const data = await connection.query(query);
  console.table(data);
}

// A query which returns all data for all departments
async function viewDepartments() {
  const query = "SELECT * FROM departments";
  const data = await connection.query(query);
  console.table(data);
}

// Function to create a new employee
async function createEmployee() {
  // Get a list of roles to list for assignment of employee role
  let roleQuery = "SELECT title, id FROM roles";
  const roleData = connection.query(roleQuery);

  let employeeOptions =
    "SELECT id, CONCAT(first_name, ' ', last_name) AS name, id FROM employees";
  const employeeData = connection.query(employeeOptions);

  const employee = await inquirer.prompt([
    {
      name: "first_name",
      type: "input",
      message: "Please enter the new employee's first name.",
    },
    {
      name: "last_name",
      type: "input",
      message: "Please enter the new employee's last name.",
    },
    {
      name: "role",
      type: "list",
      message: "Please select the new employee's role.",
      choices: rolesData.map(function (role) {
        return {
          name: role.title,
          value: role.id,
        };
      }),
    },
    {
      name: "manager",
      type: "list",
      message: "Does this employee have a manager?",
      choices: ["Yes", "No"],
    },
    {
      name: "reports",
      type: "list",
      message: "Please select the new employee's manager.",
      choices: rolesData.map(function (emp) {
        return {
          name: emp.name,
          value: emp.id,
        };
      }),
      when: (answers) => answers.manager === "Yes",
    },
  ]);

  // Inserts new employee into employee table
  const addEmployeeQuery =
    "INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)";
  const addEmployeeData = await connection.query(addEmployeeQuery, [
    employee.first_name,
    employee.last_name,
    employee.role,
    employee.manager,
  ]);
  console.log("New Employee Added!");

  init();
}