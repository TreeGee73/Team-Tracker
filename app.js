const db = require("./db");
const inquirer = require("inquirer");
const logo = require("asciiart-logo");
require("console.table");

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
      "View All Trainers & Pokemon",
      "View All Type & Strength Combinations",
      "View All Gyms",
      "Add New Trainer or Pokemon",
      "Add New Type / Strength Combination",
      "Add New Gym",
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
    case "View All Trainers & Pokemon":
      viewMembers();
      break;

    case "View All Type & Strength Combinations":
      viewTypes();
      break;

    case "View All Gyms":
      viewGyms();
      break;

    case "Add New Trainer or Pokemon":
      createMember();
      break;

    case "Add New Type / Strength Combination":
      createType();
      break;

    case "Add New Gym":
      createGym();
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

// A query which returns all data for all members of the database
async function viewMembers() {
  const members = await db.viewAllMembers();
  console.table(members);
  init();
}

// A query which returns all data from the types table
async function viewTypes() {
  const types = await db.viewAllTypes();
  console.table(types);
  init();
}

// A query which returns all data from the gyms table
async function viewGyms() {
  const gyms = await db.viewAllGyms();
  console.table(gyms);
  init();
}

// Function to create a new member
async function createMember() {
  // Get a list of types to list for assignment of member types
  const typeList = db.viewAllTypes();
  const typeData = typeList.map(({ id, title }) => ({
    name: `${title}`,
    value: id
  }));
  const memberList = db.viewAllMembers();
  const memberData = memberList.map(({ id, first_name }) => ({
    name: `${first_name}`,
    value: id
  }));
  memberData.unshift({ name: 'None', value: null });

  // Prompt to user for new member data
  const member = await inquirer.prompt([
    {
      name: "first_name",
      type: "input",
      message: "Please enter the new trainer or Pokemon member's name.",
    },
    {
      name: "badge_name",
      type: "input",
      message: "Please enter this member's badge name, if they have one."
    },
    {
      name: "types_id",
      type: "list",
      message: "Please select this member's type & power combination.",
      choices: typeData,
    },
    {
      name: "trainer_id",
      type: "list",
      message: "Please select this member's trainer, if they have one.",
      choices: memberData,
    },
  ]);
  

  // Inserts new employee into employee table
  await db.addMember(member);
  console.log("New Employee Added!\n");
  init();
}

// Function to create a new role
async function createType() {
  // Request for new role name, salary, and department to be entered by the user
  const type = await inquirer.prompt([
    {
      name: "title",
      type: "input",
      message: "Please enter a new Type name.",
    },
    {
      name: "strength",
      type: "input",
      message: "Please enter the Strength rating for this type if there is one."
    },
  ]);

  // Inserts new role into roles table
  await db.addType(type);
  console.log("New Type/Strength Combo Added!\n");
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
        "Team management that is totally NOT creepy but IS incredibly reliable and secure!"
      )
      .render()
  );
}
