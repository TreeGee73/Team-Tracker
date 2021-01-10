const db = require("./db");
const inquirer = require("inquirer");
const logo = require("asciiart-logo");
const { connection } = require("./db");
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
      "Update Trainer or Pokemon",
      "Update Type / Strength",
      "Remove Trainer or Pokemon",
      "Remove Type / Strength Combination",
      "Remove Gym",
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

    case "Update Trainer or Pokemon":
      updateMember();
      break;

    case "Update Type / Strength":
      updateType();
      break;

    case "Remove Trainer or Pokemon":
      removeMember();
      break;

    case "Remove Type / Strength Combination":
      removeType();
      break;

    case "Remove Gym":
      removeGym();
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
  // A query which returns the types from the types table for user selection
  const typeList = await connection.query('SELECT title, id FROM types');
  const typeData = typeList.map(({ id, title }) => ({
    name: `${title}`,
    value: id
  }));
  // A query which returns the gyms from the gym table for user selection
  const gymList = await connection.query('SELECT gym_name, id FROM gym');
  const gymData = gymList.map(({ id, gym_name }) => ({
    name: `${gym_name}`,
    value: id
  }));
  gymData.unshift({ name: 'None', value: null });
  // A query which returns the trainer names from the member table for user selection
  const memberList = await connection.query('SELECT first_name, id FROM members');
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
      message: "Please enter this member's badge name, if they have one.",
      default: null
    },
    {
      name: "types_id",
      type: "list",
      message: "Please select this member's type & power combination.",
      choices: typeData,
    },
    {
      name: "gym_id",
      type: "list",
      message: "Please select this member's Gym.",
      choices: gymData,
    },
    {
      name: "trainer_id",
      type: "list",
      message: "Please select this member's trainer, if they have one.",
      choices: memberData,
    },
  ]);
  

  // Inserts new member into the member table
  await db.addMember(member);
  console.log("New Member Added!\n");
  init();
}

// Function to create a new type
async function createType() {
  // Request for new type data to be entered by the user
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

  // Inserts new type into types table
  await db.addType(type);
  console.log("New Type/Strength Combo Added!\n");
  init();
}

// Function to create a new gym
async function createGym() {
  // Request for new gym name to be entered by user
  const gym = await inquirer.prompt([
    {
      name: "gym_name",
      type: "input",
      message: "Please enter a new City Gym name.",
    },
  ]);

  // Inserts new gym into gym table
  await db.addGym(gym);
  console.log("New City Gym Added!\n");
  init();
}

// function to update an member
async function updateMember() {
  // A query which returns the trainer names from the member table for user selection
  const memberList = await connection.query('SELECT first_name, id FROM members');
  // const memberList = await db.viewAllMembers();
  const memberData = memberList.map(({ id, first_name }) => ({
    name: `${first_name}`,
    value: id
  }));
  
  // Prompts for member to update
  const { memberId } = await inquirer.prompt([
    {
      name: "first_name",
      type: "list",
      message: "Which Trainer or Pokemon would you like to modify?",
      choices: memberData,
    }
  ]);

  // A query which returns the types from the types table for user selection
  const typeList = await connection.query('SELECT title, id FROM types');
  // const typeList = await db.viewAllTypes();
  const typeData = typeList.map(({ id, title }) => ({
    name: `${title}`,
    value: id
  }));
    const { typeId } = await inquirer.prompt([
    {
      name: "types_id",
      type: "list",
      message: "Please select this member's type & power combination.",
      choices: typeData,
    },
  ]);

  // Updates members's new information
  await db.updateMembers(memberId, typeId);
  console.log("Trainer/Pokemon has been Updated!\n");
  init();
}

// function to update an Type
async function updateType() {
  // Queries to pull in role and employee table data
  const typeList = await connection.query('SELECT title, id FROM types');
  // const typeList = await db.viewAllTypes();
  const typeData = typeList.map(({ id, title }) => ({
    name: `${title}`,
    value: id
  }));

  // Prompts for type to update
  const { typeUpdate } = await inquirer.prompt([
    {
      name: "title",
      type: "list",
      message: "Which role would you like to modify?",
      choices: typeData,
      
    },
    {
      name: "strength",
      type: "input",
      message: "What is this type's new Strength?",
    },
  ]);

  // Updates role's salary
  await db.updateTypes(typeUpdate);
  console.log("Strength has been Updated!\n");
  init();
}

// Function to remove a Trainer or Pokemon
async function removeMember() {
  // A query which returns the trainer and Pokemon names from the member table for user selection
  const memberList = await connection.query('SELECT first_name, id FROM members');
  // const memberList = await db.viewAllMembers();
  const memberData = memberList.map(({ id, first_name }) => ({
    name: `${first_name}`,
    value: id
  }));

  // Prompt to user to select which trainer or Pokemon to remove
  const memberName = await inquirer.prompt([
    {
      name: "first_name",
      type: "list",
      message: "Which employee would you like to remove?",
      choices: memberData,
    },
  ]);

  // Removes selected Trainer or Pokemon
  await db.removeMembers(memberName);
  console.log("Trainer or Pokemon has been Deleted!\n");
  init();
}

// Function to remove an Type
async function removeType() {
  // A query which returns the types from the types table for user selection
  const typeList = await connection.query('SELECT title, id FROM types');
  const typeData = typeList.map(({ id, title }) => ({
    name: `${title}`,
    value: id
  }));

  // Prompt to user to select which type to remove
  const typeName = await inquirer.prompt([
    {
      name: "title",
      type: "list",
      message: "Which Type/Strength Combo would you like to remove?",
      choices: typeData,
    },
  ]);

  // Removes selected Type/Strength Combo
await db.removeTypes(typeName);
  console.log("Type/Strength Combo has been Deleted!\n");
  init();
}

// Function to remove an Department
async function removeGym() {
  // A query which returns the City Gyms from the Gym table for user selection
  const gymList = await connection.query('SELECT gym_name, id FROM gym');
  const gymData = gymList.map(({ id, gym_name }) => ({
    name: `${gym_name}`,
    value: id
  }));

  // Prompt to user to select which City Gym to remove
  const gymName = await inquirer.prompt([
    {
      name: "gym_name",
      type: "list",
      message: "Which City Gym would you like to remove?",
      choices: gymData,
    },
  ]);

  // Removes selected City Gym
  await db.removeGyms(gymName);
  console.log("City Gym has been Deleted!\n");

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
