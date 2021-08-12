use department_db;

INSERT INTO department (name)
VALUES
  ('Human Resorce'),
  ( 'Sales'),
  ('Legal'),
  ('IT');


 INSERT INTO role ( title , salary , department_id )
VALUES
 ('Sales Manager',3000,2),
  ( 'Engineer',2500,4),
  ('Lawyer',4000,3),
  ('Project Manager',3500,4),
  ('HR admin',2800,1);

 INSERT INTO employee (  first_name, last_name, role_id ,manager_id) 
VALUES
 ('Pedro','Perez',2,NULL),
 ('Mirta','Rodriguez',2,1),
 ('Abdul','Valdes',1,NULL),
 ('Lorenzo','Ascencion',3,NULL),
 ('Steve','Lee',4,NULL);