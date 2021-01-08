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
      "Update Employee Role",
      "Update Role Salary",
      "Remove Employee",
      "Remove Role",
      "Remove Department",
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
    case "Update Employee Role":
      updateEmployee();
      break;
    case "Update Role Salary":
      updateRole();
      break;
    case "Remove Employee":
      removeEmployee();
      break;
    case "Remove Role":
      removeRole();
      break;
    case "Remove Department":
      removeDepartment();
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
  const empData = await connection.query("SELECT * FROM employees");
  console.table(empData);
}

// A query which returns all data for all roles
async function viewRoles() {
  const roleData = await connection.query("SELECT * FROM roles");
  console.table(roleData);
}

// A query which returns all data for all departments
async function viewDepartments() {
  const departmentData = await connection.query("SELECT * FROM departments");
  console.table(departmentData);
}

// Function to create a new employee
async function createEmployee() {
  // Get a list of roles to list for assignment of employee role
  const roleData = connection.query("SELECT title, id FROM roles");
  const employeeData = connection.query(
    "SELECT id, CONCAT(first_name, ' ', last_name) AS name, id FROM employees"
  );

  // Prompt to user for new employee data
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
  const addEmployeeData = await connection.query(
    "INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)",
    [employee.first_name, employee.last_name, employee.role, employee.manager]
  );
  console.log("New Employee Added!");

  init();
}

// Function to create a new role
async function createRole() {
  // Get list of departments to list for assignment of role to department
  const deptData = connection.query("SELECT name, id FROM departments");

  // Request for new role name, salary, and department to be entered by the user
  const role = await inquirer.prompt([
    {
      name: "role",
      type: "input",
      message: "Please enter a new role name.",
    },
    {
      name: "salary",
      type: "input",
      message: "Please enter the salary for this role.",
    },
    {
      name: "dept",
      type: "list",
      message: "Please select a department to assign this role.",
      choices: deptData.map(function (department) {
        return {
          name: department.name,
          value: department.id,
        };
      }),
    },
  ]);

  // Inserts new role into roles table
  const addRoleData = await connection.query(
    "INSERT INTO roles (title, salary, department_id) VALUES (?,?,?)",
    [role.title, role.salary, role.department]
  );
  console.log("New Role Added!");

  init();
}

// Function to create a new department
async function createDepartment() {
  // Request for new department name to be entered by user
  const department = await inquirer.prompt([
    {
      name: "department",
      type: "input",
      message: "Please enter a new department name.",
    },
  ]);

  // Inserts new department into departments table
  const addRoleData = await connection.query("INSERT INTO departments SET ?", [
    department.name,
  ]);
  console.log("New Department Added!");

  init();
}

// function to update an employee
async function updateEmployee() {
  // Queries to pull in role and employee table data
  const getRoles = await connection.query("SELECT title, id FROM roles");
  const getEmployees = await connection.query(
    "SELECT CONCAT(first_name, ' ', last_name) AS name, id FROM employees"
  );

  // Prompts for employee to update
  const empUpdate = await inquirer.prompt([
    {
      name: "empName",
      type: "list",
      message: "Which employee would you like to modify?",
      choices: getEmployees.map(function (employee) {
          return ({
            name: employee.name,
            value: employee.id,
          });
        }),
    },
    {
      name: "empRole",
      type: "list",
      message: "What is this employee's new role?",
      choices: getRoles.map(function (role) {
          return ({
            name: role.title,
            value: role.id,
          });
        }),
    },
  ])

  // Updates employee's new role
  const updateEmployeeData = await connection.query(
    "UPDATE employees SET role_id = ? WHERE id = ?",
    [empUpdate.empRole, empUpdate.empName]
  );
  console.log("Employee has been Updated!");

  init();
}

// function to update an role
async function updateRole() {
  // Queries to pull in role and employee table data
  const existingRoles = await connection.query("SELECT title, id FROM roles");

  // Prompts for role to update
  const roleUpdate = await inquirer.prompt([
    {
      name: "roleName",
      type: "list",
      message: "Which role would you like to modify?",
      choices: existingRoles.map(function (role) {
          return ({
            name: role.title,
            value: role.id,
          });
        }),
    },
    {
      name: "roleSalary",
      type: "input",
      message: "What is this role's new salary?",
    },
  ])

  // Updates role's salary
  const updateRoleData = await connection.query(
    "UPDATE roles SET salary = ? WHERE id = ?",
    [roleUpdate.roleSalary]
  );
  console.log("Salary has been Updated!");

  init();
}
