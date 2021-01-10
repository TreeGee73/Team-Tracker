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
      "Update Trainer or Pokemon Type/Strength Combination",
      "Update Trainer or Pokemon City Gym",
      "Update Trainer or Pokemon Badge",
      "Update Type Strength Rating",
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

    case "Update Trainer or Pokemon Type/Strength Combination":
      updateMember1();
      break;

    case "Update Trainer or Pokemon City Gym":
      updateMember2();
      break;

    case "Update Trainer or Pokemon Badge":
      updateMember3();
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

// function to update a Trainer or Pokemon's Type Info
async function updateMember1() {
  // A query which returns the trainer names from the member table for user selection
  const memberList = await connection.query('SELECT first_name, id FROM members');
  // const memberList = await db.viewAllMembers();
  const memberData = memberList.map(({ id, first_name }) => ({
    name: `${first_name}`,
    value: id
  }));
  
    // A query which returns the types from the types table for user selection
    const typeList = await connection.query('SELECT title, id FROM types');
    // const typeList = await db.viewAllTypes();
    const typeData = typeList.map(({ id, title }) => ({
      name: `${title}`,
      value: id
    }));
  
  // Prompts for member to update
  const memberName = await inquirer.prompt([
    {
      name: "first_name",
      type: "list",
      message: "Which Trainer or Pokemon's Type/Strength Combo would you like to modify?",
      choices: memberData,
    },
    {
      name: "types_id",
      type: "list",
      message: "Please select this member's new type & power combination.",
      choices: typeData,
    },
  ]);

  // Updates members's new information
  // await db.updateMembers(memberName);
  const memberUpdate = "UPDATE members SET types_id = ? WHERE id = ?";
  await connection.query(memberUpdate, [memberName.types_id, memberName.first_name]);
  console.log("Trainer/Pokemon Type/Strength Combo has been Updated!\n");
  init();
}

// function to update a Trainer or Pokemon's Gym Info
async function updateMember2() {
  // A query which returns the trainer names from the member table for user selection
  const memberList = await connection.query('SELECT first_name, id FROM members');
  // const memberList = await db.viewAllMembers();
  const memberData = memberList.map(({ id, first_name }) => ({
    name: `${first_name}`,
    value: id
  }));
  
  // A query which returns the City Gyms from the gym table for user selection
  const gymList = await connection.query('SELECT gym_name, id FROM gym');
  // const typeList = await db.viewAllTypes();
  const gymData = gymList.map(({ id, gym_name }) => ({
    name: `${gym_name}`,
    value: id
  }));
  
  // Prompts for member to update
  const memberGym = await inquirer.prompt([
    {
      name: "first_name",
      type: "list",
      message: "Which Trainer or Pokemon' City Gym would you like to modify?",
      choices: memberData,
    },
    {
      name: "gym_id",
      type: "list",
      message: "Please select this member's new gym.",
      choices: gymData,
    },
  ]);

  // Updates members's new information
  // await db.updateMembers(memberName);
  const memberUpdate = "UPDATE members SET gym_id = ? WHERE id = ?";
  await connection.query(memberUpdate, [memberGym.gym_id, memberGym.first_name]);
  console.log("Trainer/Pokemon City Gym has been Updated!\n");
  init();
}

// function to update a Trainer or Pokemon's Gym Info
async function updateMember3() {
  // A query which returns the trainer names from the member table for user selection
  const memberList = await connection.query('SELECT first_name, id FROM members');
  // const memberList = await db.viewAllMembers();
  const memberData = memberList.map(({ id, first_name }) => ({
    name: `${first_name}`,
    value: id
  }));
  
  // Prompts for member to update
  const memberGym = await inquirer.prompt([
    {
      name: "first_name",
      type: "list",
      message: "Which Trainer or Pokemon's Badge would you like to modify?",
      choices: memberData,
    },
    {
      name: "badge_name",
      type: "input",
      message: "Please enter this member's new Badge.",
    },
  ]);

  // Updates members's new information
  // await db.updateMembers(memberName);
  const memberUpdate = "UPDATE members SET badge_name = ? WHERE id = ?";
  await connection.query(memberUpdate, [memberGym.badge_name, memberGym.first_name]);
  console.log("Trainer/Pokemon Badge has been Updated!\n");
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
  const typeName= await inquirer.prompt([
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

  // Updates type's strength
  // await db.updateTypes(typeUpdate);
  const typeUpdate = "UPDATE types SET strength = ? WHERE id =?";
  await connection.query(typeUpdate, [typeName.strength, typeName.title]);
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
  // await db.removeMembers(memberName);
  const memberRemoved = "DELETE FROM members WHERE id = ?";
  await connection.query(memberRemoved, [memberName.first_name]);
  console.log("That Trainer or Pokemon has been Deleted!\n");
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
// await db.removeTypes(typeName);
  const typeRemoved = "DELETE FROM types WHERE id = ?";
  await connection.query(typeRemoved, [typeName.title]);
  console.log("That Type/Strength Combo has been Deleted!\n");
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
  // await db.removeGyms(gymName);
  const gymRemoved = "DELETE FROM gym WHERE id = ?";
  await connection.query(gymRemoved, [gymName.gym_name]);
  console.log("City Gym has been Deleted!\n");
  init();
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
