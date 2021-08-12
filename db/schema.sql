DROP DATABASE IF EXISTS department_db;
    CREATE DATABASE department_db;  
    USE department_db;



CREATE TABLE department(
 id INTEGER PRIMARY KEY AUTO_INCREMENT,
 name VARCHAR(30) NOT NULL
);


CREATE TABLE role(
 id INTEGER PRIMARY KEY AUTO_INCREMENT,
 title VARCHAR(30) NOT NULL,
 salary DECIMAL (6,2) NOT NULL,
 department_id INTEGER NOT  NULL,
 INDEX dep_ind (department_id), 
 CONSTRAINT fk_department  FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE CASCADE
); 

 
CREATE TABLE employee (
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id    INTEGER NOT NULL,
  INDEX role_ind (role_id),
 CONSTRAINT fk_role FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE CASCADE,
  manager_id INTEGER, 
   INDEX manager_ind (manager_id),
 CONSTRAINT fk_manager FOREIGN KEY (manager_id) REFERENCES employee(id) ON DELETE SET NULL
);