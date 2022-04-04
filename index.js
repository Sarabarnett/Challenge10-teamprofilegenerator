const inquirer = require('inquirer');
const fs = require('fs');
const path = require("path");

// positions
const Engineer = require('./lib/Engineer');
const Manager = require('./lib/Manager');
const Intern = require('./lib/Intern');


//create employee array
const employees = [];

//start app
function startApp() {
  createHtml();
  addTeamMember();
}

//employee questions
function addTeamMember() {
  
  inquirer.prompt([
   {
    type: 'input',
    name: 'name',
    message: "What is team member's name?"
  },
  {
    type: 'list',
    name: 'jobRole',
    message: "Select team member's job role.",
    choices: ['Engineer', 'Manager', 'Intern']
  },
  {
    type: 'input',
    name: 'id',
    message: "What is team member's ID number?"
  },
  {
    type: 'input',
    name: 'email',
    message: "What is team member's email address?"
  },
])
.then(function ({ name, jobRole, id, email }) {
  let roleInfo = '';
  if ( jobRole === 'Engineer') {
    roleInfo = 'GitHub username';
  } else if (jobRole === 'Manager') {
    roleInfo = 'Office number';
  } else {
    roleInfo = 'School name';
  }
  inquirer.prompt([
    {
      message: `Enter team member's ${roleInfo}`,
      name: 'roleInfo',
    },
    {
      type: 'list',
      name: 'addNew',
      message: 'Would you like to add another team member?',
      choices: ['yes', 'no'],
  },
  ])
  .then(function ({ roleInfo, addNew}) {
    let newMember;
    if ( jobRole === 'Engineer') {
      newMember = new Engineer(name, id, email, roleInfo);
    } else if (jobRole === 'Manager') {
      newMember = new Manager(name, id, email, roleInfo);
    } else {
      newMember = new Intern(name, id, email, roleInfo);
    }
    employees.push(newMember);
    addHtml(newMember).then(function () {
      if (addNew === 'yes') {
        addTeamMember();
      } else {
        completeHtml();
      }
    });
  });
});
}


//create HTML template
function createHtml() {
  const html = `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Team Profile Generator</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
    <script src="https://kit.fontawesome.com/4a4ad294af.js" crossorigin="anonymous"></script>
    <link rel="stylesheet" href="./style.css">
  </head>
  <body>
    <header class="bg-danger container-fluid text-center text-white">
      <h1>The Team</h1>
    </header>
    <div class="container">
      <div class="row">`;
    
  fs.writeFile('./dist/index.html', html, function(err) {
    if (err) {
      console.log(err);
      alert("Enter team members");
    }
  });
}


//create HTML cards depending on job role
function addHtml(member) {
  return new Promise(function(resolve, reject) {
    const name = member.getName();
    const role = member.getRole();
    const id = member.getId();
    const email = member.getEmail();
    let data = '';
    if (role === 'Engineer') {
      const gitHub = member.getGithub();
      data = `<div class="col-4">
                <div class="card m-5 shadow">
                  <h5 class="card-header mb-3 bg-primary text-white">${name}<br /><br /><i class="fas fa-glasses"></i> Engineer</h5>
                    <ul class="list-group list-group-flush p-3">
                      <li class="list-group-item">ID: ${id}</li>
                      <li class="list-group-item">Email:<a href="mailto:${email}" target="_blank"> ${email}</a></li>
                      <li class="list-group-item">GitHub:<a href="https://github.com/${gitHub}" target="_blank"> ${gitHub}</a></li>
                    </ul>
                </div>
              </div>`;
    } else if (role === 'Intern') {
      const school = member.getSchool();
      data = `<div class="col-4">
      <div class="card m-5 shadow">
        <h5 class="card-header mb-3 bg-primary text-white">${name}<br /><br /><i class="fas fa-user-graduate"></i> Intern</h5>
          <ul class="list-group list-group-flush p-3">
            <li class="list-group-item">ID: ${id}</li>
            <li class="list-group-item">Email:<a href="mailto:${email}" target="_blank"> ${email}</a></li>
            <li class="list-group-item">School: ${school}</li>
          </ul>
      </div>
    </div>`;
    } else {
      const officeNumber = member.getOfficeNumber();
      data = `<div class="col-4">
      <div class="card m-5 shadow">
        <h5 class="card-header mb-3 bg-primary text-white">${name}<br /><br /><i class="fas fa-mug-hot"></i> Manager</h5>
          <ul class="list-group list-group-flush p-3">
            <li class="list-group-item">ID: ${id}</li>
            <li class="list-group-item">Email:<a href="mailto:${email}" target="_blank"> ${email}</a></li>
            <li class="list-group-item">Office Number: ${officeNumber}</li>
          </ul>
      </div>
    </div>`;
    }
    fs.appendFile('./dist/index.html', data, function (err) {
      if (err) {
        return reject(err);
      }
      return resolve();
    });
  });
}

//completeHtml syntax
function completeHtml() {
  const html = `
          </div>
        </div>
      </body>
    </html>`;

    fs.appendFile('./dist/index.html', html, function (err) {
      if (err) {
        console.log(err);
      }
    });
}


startApp();