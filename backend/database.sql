-- mySQL setup for the backend database of the ShopWizard mechanic shop
-- management web application

-- Represents each customer, name and phone must be not null
CREATE TABLE customer (
    name VARCHAR(225) NOT NULL,
    email VARCHAR(225) DEFAULT NULL,
    phone CHAR(10) PRIMARY KEY
);

-- Represents each mechanic
CREATE TABLE mechanic (
    name VARCHAR(225) NOT NULL,
    email VARCHAR(225) DEFAULT NULL,
    phone CHAR(10) NOT NULL,
    id VARCHAR(20) PRIMARY KEY
);

-- Represents each vehicle, all fields are not null
CREATE TABLE vehicle (
    vin VARCHAR(20) PRIMARY KEY,
    owner CHAR(10) DEFAULT NULL,
    make VARCHAR(225) NOT NULL,
    model VARCHAR(225) NOT NULL,
    color VARCHAR(225) NOT NULL,
    year INT(4) NOT NULL,
    FOREIGN KEY (owner) REFERENCES customer(phone) ON UPDATE CASCADE
);

-- Represents each type of service that can be done
CREATE TABLE serviceType (
    id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(225) NOT NULL,
    cost DECIMAL(10,2) NOT NULL,
    duration VARCHAR(20)
);

-- Represents an individual job
-- A job is a service performed on a vehicle by a mechanic
CREATE TABLE job (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vehicle VARCHAR(20) NOT NULL,
    mechanic VARCHAR(20) DEFAULT NULL,
    serviceType VARCHAR(20) NOT NULL,
    status VARCHAR(225) DEFAULT NULL,
    FOREIGN KEY (vehicle) REFERENCES vehicle(vin) ON UPDATE CASCADE,
    FOREIGN KEY (mechanic) REFERENCES mechanic(id) ON UPDATE CASCADE,
    FOREIGN KEY (serviceType) REFERENCES serviceType(id) ON UPDATE CASCADE
);

-- Represents an individual appointment
CREATE TABLE appointment (
    day DATETIME NOT NULL,
    customer CHAR(10) DEFAULT NULL,
    vehicle VARCHAR(20) NOT NULL,
    serviceType VARCHAR(20) NOT NULL,
    note TEXT DEFAULT NULL,
    FOREIGN KEY (customer) REFERENCES customer(phone) ON UPDATE CASCADE,
    FOREIGN KEY (vehicle) REFERENCES vehicle(vin) ON UPDATE CASCADE,
    FOREIGN KEY (serviceType) REFERENCES serviceType(id) ON UPDATE CASCADE
);



-- DEMO Data: Represents a shop that is set up, has customers, vehicles,
--  mechanics, jobs, appointments, etc


-- Inserting sample customers
INSERT INTO customer (name, email, phone) VALUES
('John Doe', 'john.doe@example.com', '1234567890'),
('Jane Smith', 'jane.smith@example.com', '2345678901'),
('Alice Johnson', 'alice.j@example.com', '9876543210'),
('Bob Williams', 'bob.w@example.com', '8765432109'),
('Carol Taylor', 'carol.t@example.com', '7654321098'),
('David Brown', 'david.b@example.com', '6543210987'),
('Emma Clark', 'emma.c@example.com', '5654321901'),
('Noah Miller', 'noah.m@example.com', '4753210986'),
('Olivia Smith', 'olivia.s@example.com', '3852109875'),
('Liam Johnson', 'liam.j@example.com', '2951098764'),
('Sophia Brown', 'sophia.b@example.com', '2050987653'),
('Mason Davis', 'mason.d@example.com', '1159876542'),
('Isabella Wilson', 'isabella.w@example.com', '0258765431'),
('Jacob Moore', 'jacob.m@example.com', '9357654320'),
('Ava Taylor', 'ava.t@example.com', '8456543219'),
('William Jones', 'will.j@example.com', '7555432108'),
('Mia White', 'mia.w@example.com', '6654321097'),
('James Harris', 'james.h@example.com', '5753210986'),
('Amelia Martin', 'amelia.m@example.com', '4852109875'),
('Alexander Thompson', 'alex.t@example.com', '3951098764'),
('Charlotte Garcia', 'charlotte.g@example.com', '3050987653'),
('Elijah Martinez', 'elijah.m@example.com', '2159876542'),
('Evelyn Robinson', 'evelyn.r@example.com', '1258765431');

-- Inserting sample mechanics
INSERT INTO mechanic (name, email, phone, id) VALUES
('Mike Johnson', 'mike.j@example.com', '3456789012', 'MECH001'),
('Sarah Connor', 'sarah.c@example.com', '4567890123', 'MECH002'),
('Eve Charles', 'eve.c@example.com', '5432109876', 'MECH003'),
('Frank Davis', 'frank.d@example.com', '4321098765', 'MECH004'),
('Grace Evans', 'grace.e@example.com', '3210987654', 'MECH005'),
('Henry Ford', 'henry.f@example.com', '2109876543', 'MECH006'),
('Logan Walker', 'logan.w@example.com', '1349876543', 'MECH007'),
('Aiden Wright', 'aiden.w@example.com', '2448765432', 'MECH008'),
('Lucas Scott', 'lucas.s@example.com', '3547654321', 'MECH009'),
('Abigail King', 'abigail.k@example.com', '4646543210', 'MECH010'),
('Benjamin Lee', 'benjamin.l@example.com', '5745432109', 'MECH011'),
('Madison Young', 'madison.y@example.com', '6844321098', 'MECH012'),
('Mason Perez', 'mason.p@example.com', '7943210987', 'MECH013'),
('Elizabeth Hall', 'elizabeth.h@example.com', '9042109876', 'MECH014');

-- Inserting sample vehicles
INSERT INTO vehicle (vin, owner, make, model, color, year) VALUES
('1HGCM82633A004352', '1234567890', 'Honda', 'Civic', 'Blue', '2009'),
('1N4AL11D75C109151', '2345678901', 'Nissan', 'Altima', 'Red', '2015'),
('WVWZZZ3CZ8E105784', '9876543210', 'Volkswagen', 'Passat', 'White', '2018'),
('JM1GL1VM5J1313568', '8765432109', 'Mazda', '6', 'Gray', '2019'),
('2HKRM3H78HH521689', '7654321098', 'Honda', 'CR-V', 'Black', '2020'),
('1FA6P8CF0F5390882', '6543210987', 'Ford', 'Mustang', 'Yellow', '2021'),
('3CZRM3H53GG722462', '5654321901', 'Honda', 'CR-V', 'Silver', '2016'),
('5XYKT3A69EG463761', '5654321901', 'Kia', 'Sorento', 'Black', '2014'),
('JN8AS5MT8CW290164', '4753210986', 'Nissan', 'Rogue', 'Blue', '2012'),
('1C4RJFAG0FC678299', '3852109875', 'Jeep', 'Grand Cherokee', 'Red', '2015'),
('4T1BF1FK5HU305782', '2951098764', 'Toyota', 'Camry', 'White', '2017'),
('1G1ZE5ST6GF279630', '2050987653', 'Chevrolet', 'Malibu', 'Gray', '2016'),
('3FA6P0LU8JR137742', '1159876542', 'Ford', 'Fusion', 'Blue', '2018'),
('19UDE2F32GA001401', '0258765431', 'Acura', 'ILX', 'Black', '2016'),
('2T1BURHEXHC835432', '9357654320', 'Toyota', 'Corolla', 'Green', '2017'),
('KL7CJKSB5FB267542', '8456543219', 'Chevrolet', 'Trax', 'Red', '2015'),
('1G1FB1RS5H0120344', '7555432108', 'Chevrolet', 'Camaro', 'Yellow', '2017'),
('2C3CDZAG9GH136582', '6654321097', 'Dodge', 'Challenger', 'Black', '2016'),
('3N1AB7AP2FY312345', '5753210986', 'Nissan', 'Sentra', 'Red', '2015'),
('1FMCU0F78HUC35678', '4852109875', 'Ford', 'Escape', 'Blue', '2017'),
('WAUAFAFL1GN014589', '3951098764', 'Audi', 'A4', 'Black', '2016'),
('ZACCJABT5FPB47765', '3050987653', 'Jeep', 'Renegade', 'Orange', '2015'),
('1GNSKBE08ER158899', '2159876542', 'Chevrolet', 'Suburban', 'White', '2014'),
('3KPFK4A75JE183456', '1258765431', 'Kia', 'Forte', 'Silver', '2018'),
('WBA3B9C50DF585321', '9876543210', 'BMW', '335i', 'Blue', '2013'),
('3C6UR5DL0GG172432', '8765432109', 'Ram', '1500', 'Black', '2016'),
('1G1BE5SM0J7148765', '7654321098', 'Chevrolet', 'Cruze', 'Red', '2018'),
('2T1BURHE5JC943210', '6543210987', 'Toyota', 'Corolla', 'White', '2018'),
('1HGCR2F59HA304567', '2345678901', 'Honda', 'Accord', 'Silver', '2017'),
('1GKKNSLS9HZ314987', '1234567890', 'GMC', 'Acadia', 'Black', '2017'),
('2FMGK5C85EBD43210', '1234567890', 'Ford', 'Flex', 'Red', '2014');

-- Inserting example service types
INSERT INTO serviceType (id, name, cost, duration) VALUES
('SERV001', 'Oil Change', '29.99', '30'),
('SERV002', 'Tire Rotation', '19.99', '20'),
('SERV003', 'Brake Inspection', '39.99', '30'),
('SERV004', 'Engine Diagnostic', '89.99', '60'),
('SERV005', 'Wheel Alignment', '59.99', '60'),
('SERV006', 'Air Conditioning Repair', '99.99', '120'),
('SERV007', 'Battery Replacement', '129.99', '30'),
('SERV008', 'Transmission Repair', '499.99', '240'),
('SERV009', 'Suspension Repair', '299.99', '120'),
('SERV010', 'Full Vehicle Inspection', '199.99', '120'),
('SERV011', 'Exhaust System Repair', '150.00', '120'),
('SERV012', 'Spark Plug Replacement', '110.00', '60'),
('SERV013', 'Coolant Flush', '99.99', '70'),
('SERV014', 'Transmission Fluid Change', '120.00', '90'),
('SERV015', 'Headlight Restoration', '80.00', '60'),
('SERV016', 'Car Detailing - Full', '250.00', '180'),
('SERV017', 'Windshield Replacement', '300.00', '120'),
('SERV018', 'Power Steering Service', '99.99', '60'),
('SERV019', 'Fuel System Cleaning', '89.99', '60'),
('SERV020', 'Shock Absorber Replacement', '180.00', '120'),
('SERV021', 'Clutch Replacement', '500.00', '240'),
('SERV022', 'Timing Belt Replacement', '450.00', '180'),
('SERV023', 'Tire Installation', '20.00', '15 per tire'),  -- Per tire duration
('SERV024', 'Emissions Testing', '75.00', '30'),
('SERV025', 'Paint Touch-up', '150.00', '90'),
('SERV026', 'Battery Testing and Replacement', '70.00', '30'),
('SERV027', 'CV Joint and Boot Replacement', '250.00', '120'),
('SERV028', 'Differential Service', '200.00', '120'),
('SERV029', 'Driveline Repair', '300.00', '180'),
('SERV030', 'Hybrid Battery Replacement', '1200.00', '240'),
('SERV031', 'Electric Vehicle Motor Service', '800.00', '300'),
('SERV032', 'Turbocharger Repair', '700.00', '240'),
('SERV033', 'Sunroof Repair', '250.00', '120'),
('SERV034', 'Rust Proofing and Undercoating', '150.00', '60'),
('SERV035', 'Steering Rack Replacement', '400.00', '180'),
('SERV036', 'Water Pump Replacement', '220.00', '120'),
('SERV037', 'Wheel Bearing Replacement', '240.00', '120'),
('SERV038', 'Window Tinting', '180.00', '180'),
('SERV039', 'Car Alarm and Security Installation', '200.00', '120'),
('SERV040', 'Automotive AC Recharge', '100.00', '60');


-- Inserting example jobs
INSERT INTO job (vehicle, mechanic, serviceType, status) VALUES
('1HGCM82633A004352', 'MECH001', 'SERV001', 'Scheduled'),
('1N4AL11D75C109151', 'MECH002', 'SERV003', 'Completed'),
('WVWZZZ3CZ8E105784', 'MECH003', 'SERV020', 'In Progress'),
('JM1GL1VM5J1313568', 'MECH004', 'SERV006', 'Scheduled'),
('2HKRM3H78HH521689', 'MECH005', 'SERV024', 'Completed'),
('1FA6P8CF0F5390882', 'MECH006', 'SERV007', 'Scheduled'),
('3CZRM3H53GG722462', 'MECH007', 'SERV005', 'Scheduled'),
('5XYKT3A69EG463761', 'MECH008', 'SERV016', 'Completed'),
('JN8AS5MT8CW290164', 'MECH009', 'SERV010', 'In Progress'),
('1C4RJFAG0FC678299', 'MECH010', 'SERV011', 'Scheduled'),
('4T1BF1FK5HU305782', 'MECH011', 'SERV012', 'Completed'),
('1G1ZE5ST6GF279630', 'MECH012', 'SERV014', 'Scheduled'),
('3FA6P0LU8JR137742', 'MECH013', 'SERV015', 'Scheduled'),
('19UDE2F32GA001401', 'MECH014', 'SERV018', 'Completed'),
('2T1BURHEXHC835432', 'MECH001', 'SERV022', 'In Progress'),
('KL7CJKSB5FB267542', 'MECH002', 'SERV023', 'Scheduled'),
('1G1FB1RS5H0120344', 'MECH003', 'SERV025', 'Completed'),
('2C3CDZAG9GH136582', 'MECH004', 'SERV026', 'Scheduled'),
('3N1AB7AP2FY312345', 'MECH005', 'SERV027', 'Scheduled'),
('1FMCU0F78HUC35678', 'MECH006', 'SERV030', 'In Progress');


-- Inserting example appointments
INSERT INTO appointment (day, customer, vehicle, serviceType, note) VALUES
('2024-04-20 09:00:00', '1234567890', '1HGCM82633A004352', 'SERV001', 'Routine oil change'),
('2024-04-20 11:00:00', '2345678901', '1N4AL11D75C109151', 'SERV003', 'Brake system inspection'),
('2024-04-21 08:30:00', '9876543210', 'WVWZZZ3CZ8E105784', 'SERV020', 'Suspension problem diagnostics'),
('2024-04-21 10:30:00', '8765432109', 'JM1GL1VM5J1313568', 'SERV006', 'AC repair'),
('2024-04-21 13:00:00', '7654321098', '2HKRM3H78HH521689', 'SERV024', 'Emissions test'),
('2024-04-22 08:00:00', '6543210987', '1FA6P8CF0F5390882', 'SERV007', 'Battery replacement needed'),
('2024-04-22 10:00:00', '5654321901', '3CZRM3H53GG722462', 'SERV005', 'Routine wheel alignment'),
('2024-04-22 12:00:00', '4753210986', '5XYKT3A69EG463761', 'SERV016', 'Full car detailing'),
('2024-04-23 09:30:00', '3852109875', 'JN8AS5MT8CW290164', 'SERV010', 'Complete vehicle inspection'),
('2024-04-23 11:30:00', '2951098764', '1C4RJFAG0FC678299', 'SERV011', 'Exhaust system repair'),
('2024-04-23 14:00:00', '2050987653', '4T1BF1FK5HU305782', 'SERV012', 'Spark plug replacement'),
('2024-04-24 08:15:00', '1159876542', '1G1ZE5ST6GF279630', 'SERV014', 'Transmission fluid change'),
('2024-04-24 10:45:00', '0258765431', '3FA6P0LU8JR137742', 'SERV015', 'Headlight restoration'),
('2024-04-24 13:30:00', '9357654320', '19UDE2F32GA001401', 'SERV018', 'Power steering service'),
('2024-04-25 09:00:00', '8456543219', '2T1BURHEXHC835432', 'SERV022', 'Timing belt replacement'),
('2024-04-25 11:00:00', '7555432108', 'KL7CJKSB5FB267542', 'SERV023', 'Tire installation'),
('2024-04-25 14:00:00', '6654321097', '1G1FB1RS5H0120344', 'SERV025', 'Paint touch-up needed'),
('2024-04-26 08:30:00', '5753210986', '2C3CDZAG9GH136582', 'SERV026', 'Battery testing and replacement'),
('2024-04-26 10:30:00', '4852109875', '3N1AB7AP2FY312345', 'SERV027', 'CV joint and boot replacement'),
('2024-04-26 13:00:00', '3951098764', '1FMCU0F78HUC35678', 'SERV030', 'Hybrid battery replacement');