const connection = require("./js/connections.js");
const inquirer = require("inquirer");
const mysql = require("mysql");
const logo = require("asciiart-logo");

// Functions to display the logo and start the application
logoArt();
init();

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

  // Switch case is used to execute the appropriate function based on the users selection
  switch (action) {
    case "View Existing Employees":
      viewEmployees();
      init();
      break;

    case "View Existing Roles":
      viewRoles();
      init();
      break;

    case "View Existing Departments":
      viewDepartments();
      init();
      break;

    case "Add New Employee":
      createEmployee();
      init();
      break;

    case "Add New Role":
      createRole();
      init();
      break;

    case "Add New Department":
      createDepartment();
      init();
      break;

    case "Update Employee Role":
      updateEmployee();
      init();
      break;

    case "Update Role Salary":
      updateRole();
      init();
      break;

    case "Remove Employee":
      removeEmployee();
      init();
      break;

    case "Remove Role":
      removeRole();
      init();
      break;

    case "Remove Department":
      removeDepartment();
      init();
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
  const empQuery =
    "SELECT employees.first_name, employees.last_name, roles.title, roles.salary, departments.name, IFNULL(CONCAT(manager.first_name, ' ', manager.last_name),'N/A') AS 'Manager' FROM employees LEFT JOIN employees manager ON manager.id = employees.manager_id INNER JOIN roles ON employees.role_id = roles.id INNER JOIN departments ON roles.department_id = departments.id;";
  const empData = await connection.query(empQuery);
  console.table(empData);
}

// A query which returns all data for all roles
async function viewRoles() {
  const roleQuery =
    "SELECT title AS Title, salary AS Salary, name AS Department FROM roles, INNER JOIN departments, ON roles.department_id = departments.id";
  const roleData = await connection.query(roleQuery);
  console.table(roleData);
}

// A query which returns all data for all departments
async function viewDepartments() {
  const departmentQuery = "SELECT name AS Name FROM departments";
  const departmentData = await connection.query(departmentQuery);
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
      choices: roleData,
      // choices: rolesData.map(function (role) {
      //   return {
      //     name: role.title,
      //     value: role.id,
      //   };
      // }),
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
      choices: employeeData,
      // choices: employeeData.map((emp) => ({
      //   name: emp.name,
      //   value: emp.id,
      // })),
      when: (answers) => answers.manager === "Yes",
    },
  ]);

  // Inserts new employee into employee table
  const addEmployeeData = await connection.query(
    "INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)",
    [employee.first_name, employee.last_name, employee.role, employee.manager]
  );
  console.log("New Employee Added!\n");

  // init();
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
      choices: deptData,
      // choices: deptData.map((department) => ({
      //   name: department.name,
      //   value: department.id,
      // })),
    },
  ]);

  // Inserts new role into roles table
  const addRoleData = await connection.query(
    "INSERT INTO roles (title, salary, department_id) VALUES (?,?,?)",
    [role.title, role.salary, role.department]
  );
  console.log("New Role Added!\n");

  // init();
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
  console.log("New Department Added!\n");

  // init();
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
      choices: getEmployees,
      // choices: getEmployees.map((employee) => ({
      //   name: employee.name,
      //   value: employee.id,
      // })),
    },
    {
      name: "empRole",
      type: "list",
      message: "What is this employee's new role?",
      choices: getRoles,
      // choices: getRoles.map((role) => ({
      //   name: role.title,
      //   value: role.id,
      // })),
    },
  ]);

  // Updates employee's new role
  const updateEmployeeData = await connection.query(
    "UPDATE employees SET role_id = ? WHERE id = ?",
    [empUpdate.empRole, empUpdate.empName]
  );
  console.log("Employee has been Updated!\n");

  // init();
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
      choices: existingRoles,
      // choices: existingRoles.map((role) => ({
      //   name: role.title,
      //   value: role.id,
      // })),
    },
    {
      name: "roleSalary",
      type: "input",
      message: "What is this role's new salary?",
    },
  ]);

  // Updates role's salary
  const updateRoleData = await connection.query(
    "UPDATE roles SET salary = ? WHERE id = ?",
    [roleUpdate.roleSalary]
  );
  console.log("Salary has been Updated!\n");

  // init();
}

// Function to remove an Employee
async function removeEmployee() {
  // Query to pull list of all employees on the employee table
  const employeeList = await connection.query(
    "SELECT CONCAT(first_name, ' ', last_name) AS name, id FROM employees"
  );

  // Prompt to user to select which employee to remove
  const empRemove = await inquirer.prompt([
    {
      name: "empToRemove",
      type: "list",
      message: "Which employee would you like to remove?",
      choices: employeeList,
      // choices: employeeList.map((employee) => ({
      //   name: employee.name,
      //   value: employee.id,
      // })),
    },
  ]);

  // Removes selected employee
  const removeEmployeeData = await connection.query(
    "DELETE FROM employees WHERE id = ?"
  );
  console.log("Employee has been Deleted!\n");

  // init();
}

// Function to remove an Role
async function removeRole() {
  // Query to pull list of all roles on the role table
  const roleList = await connection.query("SELECT title, id FROM roles");

  // Prompt to user to select which role to remove
  const roleRemove = await inquirer.prompt([
    {
      name: "roleToRemove",
      type: "list",
      message: "Which role would you like to remove?",
      choices: roleList,
      // choices: roleList.map((role) => ({
      //   name: role.title,
      //   value: role.id,
      // })),
    },
  ]);

  // Removes selected role
  const removeRoleData = await connection.query(
    "DELETE FROM roles WHERE id = ?"
  );
  console.log("Role has been Deleted!\n");

  // init();
}

// Function to remove an Department
async function removeDepartment() {
  // Query to pull list of all departments on the departments table
  const departmentsList = await connection.query(
    "SELECT name, id FROM departments"
  );

  // Prompt to user to select which role to remove
  const departmentRemove = await inquirer.prompt([
    {
      name: "deptToRemove",
      type: "list",
      message: "Which department would you like to remove?",
      choices: departmentsList,
      // choices: departmentsList.map((dept) => ({
      //   name: dept.name,
      //   value: dept.id,
      // })),
    },
  ]);

  // Removes selected department
  const removeDepartmentData = await connection.query(
    "DELETE FROM departments WHERE id = ?"
  );
  console.log("Department has been Deleted!\n");

  // init();
}

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
      .center(
        "Employee management that is totally NOT creepy but IS incredibly reliable and secure!"
      )
      .render()
  );
}
