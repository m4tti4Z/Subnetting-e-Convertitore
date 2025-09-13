CREATE DATABASE subnetting_converter;
USE subnetting_converter;

CREATE TABLE logs(
    id INT AUTO_INCREMENT PRIMARY KEY,
    ip VARCHAR(20),
    cidr INT,
    subnet VARCHAR(20),
    network VARCHAR(20),
    broadcast VARCHAR(20)

);

CREATE TABLE numbers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    numero_binario VARCHAR(32),
    numero_decimale INT,
    numero_ottale VARCHAR(12),
    numero_esadecimale VARCHAR(8)
);
