-- Create the default database for the app
CREATE DATABASE IF NOT EXISTS ShopWizard;

-- Represents each customer, name and phone must be not null
CREATE TABLE customer (
    name VARCHAR(225) NOT NULL,
    email VARCHAR(225) DEFAULT NULL,
    phone CHAR(10) NOT NULL,
    PRIMARY KEY (phone)
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
CREATE TABLE services (
    id VARCHAR(225) PRIMARY KEY
)