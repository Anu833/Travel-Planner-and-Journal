CREATE DATABASE IF NOT EXISTS travel_journal;

USE travel_journal;

CREATE TABLE entries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    date DATE,
    title VARCHAR(255),
    image1 VARCHAR(255),
    image2 VARCHAR(255),
    image3 VARCHAR(255),
    content1 TEXT,
    heading1 VARCHAR(255),
    content2 TEXT,
    quote VARCHAR(255),
    heading2 VARCHAR(255),
    content3 TEXT,
    content4 TEXT
);

