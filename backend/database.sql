-- Create the default database for the app
CREATE DATABASE IF NOT EXISTS ShopWizard;

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
    owner CHAR(10) NOT NULL,
    make VARCHAR(225) NOT NULL,
    model VARCHAR(225) NOT NULL,
    color VARCHAR(225) NOT NULL,
    year CHAR(4) NOT NULL,
    FOREIGN KEY (owner) REFERENCES customer(phone)
);

-- Represents each type of service that can be done
CREATE TABLE serviceType (
    id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(225) NOT NULL,
    cost VARCHAR(10),
    duration VARCHAR(10)
)

-- Represents an individual job
-- A job is a service performed on a vehicle by a mechanic
CREATE TABLE job (
    id VARCHAR(20) PRIMARY KEY,
    vehicle VARCHAR(20) NOT NULL,
    mechanic VARCHAR(20) DEFAULT NULL,
    serviceType VARCHAR(20) NOT NULL,
    status VARCHAR(225) DEFAULT NULL,
    FOREIGN KEY (vehicle) REFERENCES vehicle(vin),
    FOREIGN KEY (mechanic) REFERENCES mechanic(id),
    FOREIGN KEY (serviceType) REFERENCES serviceType(id)
)