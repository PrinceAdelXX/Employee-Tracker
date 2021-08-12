const mysql = require('mysql2');
const util = require('util');
const inquirer = require('inquirer');
const cTable = require('console.table');


const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  // Your MySQL username
  user: 'root',
  // Your MySQL password
  password: '',
  database: 'department_db'
});

connection.connect(err => {
  if (err) throw err;
  console.log('connected as id ' + connection.threadId + '\n');
  menu();
});

connection.query = util.promisify(connection.query);

// show the questions 
function menu() {
  console.log("\n** Select options **\n");

  inquirer.prompt([
    {
      type: 'list',
      name: 'selectOptions',
      message: 'What would you like to do?',
      choices: [
        'View all the Departments',
        'Add a Department',
        'Delete a Department',
        'View all the Roles',
        'Add a Role',
        'Delete a Role',
        'View all the Employee',
        'Add a Employee',
        'Delete a Employee',
        'Update a Employee role',
        `Update a Employee manager's name`,
        'Show Employee by department',
        'Quit'
      ]

    }
  ]).then(options => {
    switch (options.selectOptions) {
      case 'View all the Departments':
        showDepartments();
        break;
      case 'Add a Department':
        addDepartment();
        break;
      case 'Delete a Department':
        deleteApartment();
        break;
      case 'View all the Roles':
        showRoles();
        break;
      case 'Add a Role':
        addRole();
        break;
      case 'Delete a Role':
        deleteRole();
        break;
      case 'View all the Employee':
        showEmployees();
        break;
      case 'Add a Employee':
        addEmployee();
        break;
      case 'Delete a Employee':
        deleteEmployee();
        break;
      case 'Update a Employee role':
        updateEmployeeRole();
        break;
      case `Update a Employee manager's name`:
        updateEmpManager()
        break;
      case 'Show Employee by department':
        showEmployeebyDepto();
        break;
       
      default:
        connection.end();
    }
  });

}


// show all department
function showDepartments() {
  //sql consult select
  connection.query(`SELECT * FROM department`, (err, res) => {
    if (err) throw err;

    if (res.length > 0) {
      console.log('\n')
      console.log(' ** Departments **')
      console.log('\n')
      console.table(res);
    }
    //call the menu for show a question again
    menu();
  });

}
// show all the role info 
function showRoles() {
  //sql consult select
  connection.query(`SELECT role.title AS job_title,role.id,department.name AS department_name,role.salary  FROM  role LEFT JOIN department ON role.department_id=department.id`,
    (err, res) => {

      if (err) throw err;

      if (res.length > 0) {
        console.log('\n')
        console.log(' ** Roles **')
        console.log('\n')
        console.table(res);
      }
      //call the menu for show a question again
      menu();
    });
}
// show all the employee info
function showEmployees() {
  //query consult select
  connection.query(`SELECT employee.id, employee.first_name,employee.last_name,role.title AS job_title,role.salary,
       CONCAT(manager.first_name ," ", manager.last_name) AS Manager FROM  employee LEFT JOIN role ON employee.role_id=role.id LEFT JOIN employee  manager ON manager.id = employee.manager_id`, (err, res) => {
    // console.log(res);

    if (err) throw err;

    if (res.length > 0) {
      console.log('\n')
      console.log('** Employees **')
      console.log('\n')
      console.table(res);
    }
    //call the menu for show a question again
    menu();
  });

}

//select first name, las name  and  id from employee table and back a object array
async function helperEmpManager() {
  let res = await connection.query(`SELECT  CONCAT(employee.first_name," " ,employee.last_name) AS fullName, employee.id FROM employee`)
  let employeName = [];
  res.forEach(emp => {
    //save on the list a object
    employeName.push({ name: emp.fullName, value: emp.id })
  })

  return employeName;

}

//select all from department table and back a object array (department name and id)
async function helperArray() {
  let res = await connection.query(`SELECT * FROM department `)
  let deptoChoice = [];

  res.forEach(dpto => {
    //save on the list a object
    deptoChoice.push({ name: dpto.name, value: dpto.id });
  })
  
  return deptoChoice;

}

//select title and  id from role table and back a object array
async function helperEmployee() {
  let res = await connection.query(`SELECT role.title,role.id FROM role `)
  let roleChoice = [];

  res.forEach(roles => {
    //save on the list a object
    roleChoice.push({ name: roles.title, value: roles.id })
  })
  
  return roleChoice;

}


//add a department to the datebase
function addDepartment() {

  inquirer.prompt([

    {
      type: 'input',
      name: 'nameDpto',
      message: 'What is your department name?',
      validate: name => {           //validation the entry
        if (name) {
          return true;
        } else {
          console.log('\n Please enter a department name!');
          return false;
        }
      }
    }
  ])
    .then(anserw => {
      let nameDepartment = anserw.nameDpto;
      //sql consult insert
      connection.query('INSERT INTO department SET name=? ', [nameDepartment], (err, res) => {
        if (err) throw err;

        //print the info tell the user 1 department was inserted
        console.log(res.affectedRows + ' Department added!\n');

        //call the menu for show a question again
        menu();
      })
    })

}

//Delete department
async function deleteApartment() {
  //return a list department names
  let roleNames = await helperArray();
  inquirer.prompt([

    {
      type: 'list',
      name: 'dptoDelete',
      message: 'Select the department for delete!',
      choices: roleNames

    }
  ])
    .then(anserw => {
      let deleteId = anserw.dptoDelete;
      //sql consult delete
      connection.query('DELETE FROM department WHERE id=? ', [deleteId], (err, res) => {
        if (err) throw err;

        console.log(res.affectedRows + ' Department deleted!\n');
        menu();
      })
    })
}

// add a role info to the date base
async function addRole() {
  //the function back a array with all the departments name
  let deptoChoiceRes = await helperArray();
 
  inquirer.prompt([
    {
      type: 'input',
      name: 'title',
      message: 'What is your rol name?',
      validate: name => {           //validation the entry
        if (name) {
          return true;
        } else {
          console.log('\n Please enter a title rol!');
          return false;
        }
      }
    },
    {
      type: 'input',
      name: 'salary',
      message: 'What is the salary rol?',
      validate: salaryInput => {           //validation the entry
        if (salaryInput) {
          return true;
        } else {
          console.log('\n Please enter a salary rol!');
          return false;
        }
      }
    },
    {
      type: 'list',
      name: 'dptoId',
      message: 'Select the department for that rol?',
      choices: deptoChoiceRes

    }
  ])
    .then(anserw => {
      let title = anserw.title;
      let salary = anserw.salary;
      let id = anserw.dptoId;
     
      //query insert a role
      connection.query('INSERT INTO role SET title=?,salary=?,department_id=? ', [title, salary, id], (err, res) => {
        if (err) throw err;
        console.log(res.affectedRows + 'Role added!\n');
        menu();
      })
    })
}

// delete a role from the table 
async function deleteRole() {
  let rolesName = await helperEmployee();
  inquirer.prompt([

    {
      type: 'list',
      name: 'roleDelete',
      message: 'Select a role for delete!',
      choices: rolesName

    }

  ])
    .then(anserw => {
      let deleteId = anserw.roleDelete;
      //sql consult delete 
      connection.query('DELETE FROM role WHERE id=? ', [deleteId], (err, res) => {
        if (err) throw err;

        console.log(res.affectedRows + 'A role was delete!\n');
        menu();
      })
    })
}

//add a employe to the date base
async function addEmployee() {
  let employeeNames = await helperEmpManager();
  let rolesName = await helperEmployee();
  
  inquirer.prompt([

    {
      type: 'input',
      name: 'name',
      message: 'What is the employee name?',
      validate: name => {           //validation the entry
        if (name) {
          return true;
        } else {
          console.log('\n Please enter the name!');
          return false;
        }
      }
    },
    {
      type: 'input',
      name: 'lastName',
      message: 'What is the employee last name?',
      validate: lastnameInput => {           //validation the entry
        if (lastnameInput) {
          return true;
        } else {
          console.log('\n Please enter the last name!');
          return false;
        }
      }
    },
    {
      type: 'list',
      name: 'selectRole',
      message: 'Select a role for a employee',
      choices: rolesName
    },
    // Table of Contents
    {
      type: 'confirm',
      name: 'confirmManager',
      message: 'Have a manager?',
      default: false,
    },

    {
      type: 'list',
      name: 'magId',
      message: 'Have a manager?',
      choices: employeeNames,
      when: ({ confirmManager }) => confirmManager
    }

  ])
    .then(anserw => {
      //taking the value entry for the prompt
      let name = anserw.name;
      let last = anserw.lastName;
      let roleIdEmp = anserw.selectRole;
      //manager id can be null to
      let managerId = anserw.magId || null;

      //sql consult insert  a employee
      connection.query('INSERT INTO employee SET first_name=?,last_name=?,role_id=?,manager_id=? ', [name, last, roleIdEmp, managerId], (err, res) => {
        if (err) throw err;
        console.log(res.affectedRows + ' Employee added!\n');
        menu();
      })
    })
}

//delete a employee info from a table used a id
async function deleteEmployee() {

  let employees = await helperEmpManager();
  inquirer.prompt([

    {
      type: 'list',
      name: 'empDelete',
      message: 'Select a role for delete!',
      choices: employees

    }

  ])
    .then(anserw => {
      let deleteId = anserw.empDelete;
      //sql consult delete employee
      connection.query('DELETE FROM employee WHERE id=? ', [deleteId], (err, res) => {
        if (err) throw err;

        console.log(res.affectedRows + ' Employee deleted!\n');
        menu();
      })
    })
}

//update employee role
async function updateEmployeeRole() {
  //call the functions back a employee names,id and roles names,id
  let employeeNames = await helperEmpManager();
  let rolesName = await helperEmployee();
 
  inquirer.prompt([

    {   //show a list with array employee names   
      type: 'list',
      name: 'employeeName',
      message: 'Select a employee for update his role',
      choices: employeeNames

    },
    { //show a list with the roles names
      type: 'list',
      name: 'selectRole',
      message: 'Select a new role for a employee',
      choices: rolesName
    }

  ])
    .then(anserw => {
      let empName = anserw.employeeName;
      let newrole = anserw.selectRole;
      //query consult update role for a employee
      connection.query('UPDATE employee SET employee.role_id= ? WHERE employee.id=?', [newrole, empName], (err, res) => {
        if (err) throw err;


        console.log(res.affectedRows + ' Employee updated role changed!\n');

        //call the menu for show a question again
        menu();
      })
    })

};


async function updateEmpManager() {
  let namesEmpManager = await helperEmpManager();
 
  inquirer.prompt([

    {   //show a list with array employee names   
      type: 'list',
      name: 'employee',
      message: 'Select a employee for update his manager',
      choices: namesEmpManager

    },
    { //show a list with the roles names
      type: 'list',
      name: 'manager',
      message: 'Select a manager name',
      choices: namesEmpManager
    }

  ])
    .then(anserw => {
      let empName = anserw.employee;
      let newManager = anserw.manager;
      //query consult update role for a employee
      connection.query('UPDATE employee SET employee.manager_id= ? WHERE employee.id=?', [newManager, empName], (err, res) => {
        if (err) throw err;


        console.log(res.affectedRows + ' Employee updated manager changed!\n');

        //call the menu for show a question again
        menu();
      })
    })
}

//show employees by department
async function showEmployeebyDepto() {
  //return a list department names
  let deptonames = await helperArray();

  inquirer.prompt([

    {
      type: 'list',
      name: 'ShowED',
      message: 'Select the department for show employees!',
      choices: deptonames

    }
  ])
    .then(anserw => {
      let deptoID = anserw.ShowED;
      //query for select from all tables info    
      connection.query('SELECT employee.id, employee.first_name, employee.last_name,role.title FROM employee LEFT JOIN role ON employee.role_id=role.id  LEFT JOIN department department on role.department_id = department.id  WHERE department.id=? ', [deptoID], (err, res) => {
        if (err) throw err;
      if(res.length>0){

        console.log('\n')
        console.log('** Employees by Department **')
        console.log('\n')
        console.table(res);
      }
      else
      {
        //if no employees for show
        console.log('\n')
        console.log('** Employees by Department **')
        console.log('\n')
        console.log('No employees to show for that department now')
      }
      
        menu();
      })
    })
}