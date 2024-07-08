USE master;
IF EXISTS (SELECT * FROM sys.databases WHERE name='BED_practical')
DROP DATABASE BED_practical;
GO

CREATE DATABASE BED_practical;
GO

USE BED_practical;
GO

-- Drop existing tables in the correct order (considering foreign key constraints)
IF EXISTS (SELECT * FROM sysobjects WHERE id = object_id('Users') AND sysstat & 0xf = 3)
  DROP TABLE Users;
GO
IF EXISTS (SELECT * FROM sysobjects WHERE id = object_id('Books') AND sysstat & 0xf = 3)
  DROP TABLE Books;
GO

CREATE TABLE Users (
  user_id INT IDENTITY(1,1) PRIMARY KEY,
  username VARCHAR(255) UNIQUE,
  passwordHash VARCHAR(255) NOT NULL,
  role VARCHAR(20) CHECK (role IN ('member', 'librarian')) NOT NULL
);

CREATE TABLE Books (
  book_id INT IDENTITY(1,1) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255) NOT NULL,
  availability CHAR(1) CHECK (availability IN ('Y', 'N')) NOT NULL
);


INSERT INTO Books (title, author, availability) 
VALUES
('To Kill a Mockingbird', 'Harper Lee', 'Y'),
('1984', 'George Orwell', 'N'),
('Pride and Prejudice', 'Jane Austen', 'Y'),
('The Great Gatsby', 'F. Scott Fitzgerald', 'Y'),
('Moby-Dick', 'Herman Melville', 'N'),
('War and Peace', 'Leo Tolstoy', 'Y'),
('The Catcher in the Rye', 'J.D. Salinger', 'N'),
('The Hobbit', 'J.R.R. Tolkien', 'Y'),
('Crime and Punishment', 'Fyodor Dostoevsky', 'Y'),
('Brave New World', 'Aldous Huxley', 'N');


SELECT * FROM Users
SELECT * FROM Books