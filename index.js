const inquirer = require('inquirer');
const path = require('path')
const fs = require('fs')
const Manager = require('./lib/Manager')
const Engineer = require('./lib/Engineer')
const Intern = require('./lib/Intern')
const render = require('./lib/htmlRender')

const OUTPUT_DIR = path.resolve(__dirname,"dist");

 
const employeeArray = []

function addEmployee (){
    inquirer
        .prompt([
            {
                "type":"input",
                message:"What is the name of the team member?",
                name:"name"
            },

            {
                "type":"input",
                message:"What is the team member Id?",
                name:"id"
            },

            {
                "type":"input",
                message:"What is the team member's email?",
                name:"email"
            },

            {
                "type":"list",
                message:"What is the team members role?",
                name:"role",
                choices:[
                    'Manager','Engineer','Intern'
                ]

            },

            {
                "type":"input",
                message:"What is the github username?",
                name:"github",
                when:function(answers){
                    if(answers.role == 'Engineer'){
                        return true
                    }else{
                        return false
                    }
                }
            },

            {
                "type":"input",
                message:"What is the your school name",
                name:"school",
                when:function(answers){
                    if(answers.role == 'Intern'){
                        return true
                    }else{
                        return false
                    }
                }
            },

            {
                "type":"input",
                message:"What is your office number?",
                name:"officeNumber",
                when:function(answers){
                    if(answers.role == 'Manager'){
                        return true
                    }else{
                        return false
                    }
                }
            }
        ])
        .then(answers => {
            console.log(answers)
            switch (answers.role){
                case 'Manager':
                    let manager = new Manager(answers.name,answers.id,answers.email,answers.officeNumber)
                    employeeArray.push(manager)
                    restart();
                    break;
                 case 'Intern':
                    let intern = new Intern(answers.name,answers.id,answers.email,answers.school)
                    employeeArray.push(intern)
                    restart();
                    break;
                 case 'Engineer':
                    let engineer = new Engineer(answers.name,answers.id,answers.email,answers.github)
                    employeeArray.push(engineer)
                    restart();
                    break;
                default:
                    restart();
            }
        })
}

function restart() {
    inquirer.prompt([{
        type: 'confirm',
        name: 'addMember',
        message: 'Would you like to add another team member?'
    }])
        .then(function (response) {
            if (response.addMember == true) {
                addEmployee()
            }
            else {
                console.log("Finished!!")
                console.log(employeeArray);
                let team = render(employeeArray)
                console.log('team',team);
                createTeamHtml(team)
            }
        })
}

function createTeamHtml(team){
    try {
        if(!fs.existsSync(path.resolve(__dirname,'./dist'))){
            fs.mkdirSync(__dirname,'./dist')
        }else{
            console.log('directory already exist')
        }
    } catch(err){
        console.log(err)
    }
    fs.writeFile(path.resolve(__dirname,'./dist/team.html'), team, function(err){
        if(err)throw err;
        console.log('Saved')
    })
}


addEmployee();