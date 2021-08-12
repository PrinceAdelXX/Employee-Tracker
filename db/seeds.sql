INSERT INTO department (department_name)
VALUES
  ('HR'),
  ('Tech'),
  ('Marketing'),
  ('Finance'),
  ('Sales'),
  ('Engineering'),
  ('Legal');
  
INSERT INTO roles (title, salary, department_id)
VALUES
  ('Recruiter ', 40000, 1),
  ('Marketer', 30000, 3),
  ('Software Engineer', 70000, 2),
  ('Attorney', 500000, 7),
  ('Salesperson', 130000, 5),
  ('Engineer', 150000, 6),
  ('Accountant', 120000, 7),
  ('Sales Lead', 190000, 5),
  ('CEO', 400000, 5);

INSERT INTO employee (first_name, last_name, roles_id, manager_id)
VALUES
  ('Raghav', 'Ramanan', 1, 1),
  ('Calpurnia', 'Everhart', 2, 2),
  ('Jim', 'Boghossian', 3, 1),
  ('Octavia', 'VonSeckendorff', 4, 3),
  ('John', 'Smith', 5, 1),
  ('Rasika', 'Ramanan', 6, 3);
