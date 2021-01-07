const logo = require("asciiart-logo");


const longText = "Employee management that is totally NOT creepy but IS incredibly reliable and secure!";

// Functions to initiate tracker
  logoArt();


// Function to create opening logo
function logoArt() {
  console.log(
    logo({
      name: "Gotta Track'Em All!",
      font: "Stampatello",
      lineChars: 20,
      padding: 2,
      margin: 3,
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
