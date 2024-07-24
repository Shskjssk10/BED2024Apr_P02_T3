USE master;
IF EXISTS (SELECT * FROM sys.databases WHERE name='BED_database')
DROP DATABASE BED_database;
GO

CREATE DATABASE BED_database;
GO

USE BED_database;
GO

-- Drop existing tables in the correct order (considering foreign key constraints)
IF EXISTS (SELECT * FROM sysobjects WHERE id = object_id('SignUp') AND sysstat & 0xf = 3)
  DROP TABLE SignUp;
GO
IF EXISTS (SELECT * FROM sysobjects WHERE id = object_id('Listing') AND sysstat & 0xf = 3)
  DROP TABLE Listing;
GO
IF EXISTS (SELECT * FROM sysobjects WHERE id = object_id('Likes') AND sysstat & 0xf = 3)
  DROP TABLE Likes;
GO
IF EXISTS (SELECT * FROM sysobjects WHERE id = object_id('Comment') AND sysstat & 0xf = 3)
  DROP TABLE Comment;
GO
IF EXISTS (SELECT * FROM sysobjects WHERE id = object_id('Follower') AND sysstat & 0xf = 3)
  DROP TABLE Follower;
GO
IF EXISTS (SELECT * FROM sysobjects WHERE id = object_id('Post') AND sysstat & 0xf = 3)
  DROP TABLE Post;
GO
IF EXISTS (SELECT * FROM sysobjects WHERE id = object_id('Volunteer') AND sysstat & 0xf = 3)
  DROP TABLE Volunteer;
GO
IF EXISTS (SELECT * FROM sysobjects WHERE id = object_id('Organisation') AND sysstat & 0xf = 3)
  DROP TABLE Organisation;
GO
IF EXISTS (SELECT * FROM sysobjects WHERE id = object_id('Account') AND sysstat & 0xf = 3)
  DROP TABLE Account;
GO

-- Create Account table
CREATE TABLE Account (
    AccID SMALLINT IDENTITY(1, 1), 
	Username VARCHAR(15) UNIQUE,
    PhoneNo VARCHAR(8) UNIQUE, 
    Email VARCHAR(255) UNIQUE,
    Password VARCHAR(255),
    CONSTRAINT PK_Account PRIMARY KEY (AccID)
);

-- Create Volunteer table 
CREATE TABLE Volunteer (
    AccID SMALLINT,
    FName VARCHAR(20) NOT NULL,
    LName VARCHAR(20) NOT NULL,
    Username VARCHAR(15) UNIQUE,
    Gender VARCHAR(20) CHECK (Gender IN ('Male', 'Female', 'Prefer Not To Say')) NOT NULL,
    Bio VARCHAR(150),
    Salt VARCHAR(255),
    HashedPassword VARCHAR(255),
    CONSTRAINT PK_Volunteer PRIMARY KEY (AccID),
    CONSTRAINT FK_Volunteer_AccID FOREIGN KEY (AccID) REFERENCES Account(AccID)
);

-- Create the Organisation table
CREATE TABLE Organisation (
    AccID SMALLINT,
    OrgName VARCHAR(20) NOT NULL,
	Website VARCHAR(255) NOT NULL,
    IssueArea VARCHAR(50) NOT NULL,
    Mission VARCHAR(255) NOT NULL,
    Descr TEXT NOT NULL,
    Addr VARCHAR(255) NOT NULL,
    AptFloorUnit VARCHAR(50) NOT NULL,
    Salt VARCHAR(255),
    HashedPassword VARCHAR(255),
    CONSTRAINT PK_Organisation PRIMARY KEY (AccID),
    CONSTRAINT FK_Organisation_AccID FOREIGN KEY (AccID) REFERENCES Account(AccID)
);

-- Create Post table 
CREATE TABLE Post (
    PostID SMALLINT IDENTITY(1,1),
    PostedBy SMALLINT,
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    MediaPath VARCHAR(255) NOT NULL,
    Caption VARCHAR(255),
    CONSTRAINT PK_Post PRIMARY KEY (PostID),
    CONSTRAINT FK_Post_PostedBy FOREIGN KEY (PostedBy) REFERENCES Account(AccID)
);

-- Create Listing table
CREATE TABLE Listing (
    ListingID SMALLINT IDENTITY(1,1),
    PostedBy SMALLINT,
    ListingName VARCHAR(255) NOT NULL,
    Addr VARCHAR(255) NOT NULL,
    StartDate DATE CHECK (StartDate >= GETDATE()) NOT NULL,
    EndDate DATE,
    CauseArea TEXT NOT NULL,
    Skill TEXT,
    Requirements TEXT,
    About TEXT NOT NULL, 
    MediaPath VARCHAR(255),
    CONSTRAINT PK_Listing PRIMARY KEY (ListingID),
    CONSTRAINT FK_Listing_PostedBy FOREIGN KEY (PostedBy) REFERENCES Organisation(AccID)
);

-- Create Likes table 
CREATE TABLE Likes (
    AccID SMALLINT, 
    PostID SMALLINT,
    CONSTRAINT PK_Likes PRIMARY KEY (AccID, PostID),
    CONSTRAINT FK_Likes_AccID FOREIGN KEY (AccID) REFERENCES Account(AccID),
    CONSTRAINT FK_Likes_PostID FOREIGN KEY (PostID) REFERENCES Post(PostID)
);

-- Create Comments table 
CREATE TABLE Comment (
    CommentID SMALLINT IDENTITY(1, 1),
    AccID SMALLINT,
    PostID SMALLINT,
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    Comment VARCHAR(255),
    CONSTRAINT PK_Comment PRIMARY KEY (CommentID, PostID),
    CONSTRAINT FK_Comment_AccID FOREIGN KEY (AccID) REFERENCES Account(AccID),
    CONSTRAINT FK_Comment_PostID FOREIGN KEY (PostID) REFERENCES Post(PostID)
);

-- Create Follower table 
CREATE TABLE Follower (
    Follower SMALLINT,
    FollowedBy SMALLINT,
    CONSTRAINT PK_Follower PRIMARY KEY (Follower, FollowedBy),
    CONSTRAINT FK_Follower_Follower FOREIGN KEY (Follower) REFERENCES Account(AccID),
    CONSTRAINT FK_Follower_FollowedBy FOREIGN KEY (FollowedBy) REFERENCES Account(AccID)
);

-- Create SignUp Table 
CREATE TABLE SignUp (
    AccID SMALLINT,
    ListingID SMALLINT,
    CONSTRAINT PK_SignUp PRIMARY KEY (AccID, ListingID),
    CONSTRAINT FK_SignUp_AccID FOREIGN KEY (AccID) REFERENCES Account(AccID),
    CONSTRAINT FK_SignUp_ListingID FOREIGN KEY (ListingID) REFERENCES Listing(ListingID)
);

-- Create Saved Listing Tables
CREATE TABLE SavedListing (
	AccID SMALLINT,
    ListingID SMALLINT,
    CONSTRAINT PK_SavedListing PRIMARY KEY (AccID, ListingID),
    CONSTRAINT FK_SavedListing_AccID FOREIGN KEY (AccID) REFERENCES Account(AccID),
    CONSTRAINT FK_SavedListing_ListingID FOREIGN KEY (ListingID) REFERENCES Listing(ListingID)
);

-- Insert data into Account table
INSERT INTO Account (Username, PhoneNo, Email, Password)
VALUES 
    ('johndoe', '82345678', 'volunteer1@example.com', 'password1'),
    ('Helping Hands', '85678901', 'org1@example.com', 'password4'),
    ('janesmith', '93456789', 'volunteer2@example.com', 'password2'),
    ('Green Earth','96789012', 'org2@example.com', 'password5'),
    ('sambrown','84567890', 'volunteer3@example.com', 'password3');

-- Insert data into Volunteer table
INSERT INTO Volunteer (AccID, FName, LName, Username, Gender, Bio, Salt, HashedPassword)
VALUES 
    (1, 'John', 'Doe', 'johndoe', 'Male', 'Volunteer bio for John Doe', 'salt1', 'hashedpassword1'),
    (3, 'Jane', 'Smith', 'janesmith', 'Female', 'Volunteer bio for Jane Smith', 'salt2', 'hashedpassword2'),
    (5, 'Sam', 'Brown', 'sambrown', 'Prefer Not To Say', 'Volunteer bio for Sam Brown', 'salt3', 'hashedpassword3');

-- Insert data into Organisation table
INSERT INTO Organisation (AccID, OrgName, Website, IssueArea, Mission, Descr, Addr, AptFloorUnit, Salt, HashedPassword)
VALUES 
    (2, 'Helping Hands', 'helpinghands.com', 'Community Service', 'Our mission is to help the community.', 'Description of Helping Hands', '123 Main St', 'Suite 100', 'salt4', 'hashedpassword4'),
    (4, 'Green Earth', 'greenearth.com', 'Environmental Protection', 'Our mission is to protect the environment.', 'Description of Green Earth', '456 Elm St', 'Suite 200', 'salt5', 'hashedpassword5');

-- Insert data into Post table
INSERT INTO Post (PostedBy, MediaPath, Caption)
VALUES 
    (1, '/images/post1.jpg', 'Volunteering at the local shelter'),
    (2, '/images/post2.jpg', 'Organizing a community cleanup'),
    (3, '/images/post3.jpg', 'Helping at the food bank'),
    (4, '/images/post4.jpg', 'Tree planting event'),
    (5, '/images/post5.jpg', 'Volunteering at the animal rescue');

-- Insert data into Listing table
INSERT INTO Listing (PostedBy, ListingName, Addr, StartDate, EndDate, CauseArea, Skill, Requirements, About, MediaPath)
VALUES 
    (2, 'Community Cleanup', '123 Main St', '2024-09-03', '2024-09-04', 'Community Service', 'Coordination', 'Must be able to lift heavy weights', 'Join us for a community cleanup event', '/images/listing1.jpg'),
    (2, 'Food Bank Assistance', '456 Elm St', '2024-09-10', '2024-09-15', 'Hunger Relief', 'Organization', 'Must be punctual and reliable', 'Help organize and distribute food at our local food bank', '/images/listing2.jpg'),
    (4, 'Tree Planting', '789 Oak St', '2024-10-05', '2024-10-05', 'Environmental Protection', 'Gardening', 'Must bring own gloves', 'Participate in a tree planting event to help the environment', '/images/listing3.jpg'),
    (4, 'Beach Cleanup', '101 Beach Ave', '2024-10-01', '2024-10-01', 'Environmental Protection', 'Cleanup', 'Comfortable working outdoors', 'Join us for a beach cleanup to protect marine life', '/images/listing4.jpg'),
    (2, 'Community Outreach', '202 Maple St', '2024-10-20', '2024-10-25', 'Community Service', 'Communication', 'Friendly and approachable', 'Help us reach out to community members about our services', '/images/listing5.jpg');

-- Insert data into Likes table
INSERT INTO Likes (AccID, PostID)
VALUES 
    (1, 1),
    (2, 1),
    (3, 2),
    (4, 3),
    (5, 4);

-- Insert data into Comment table
INSERT INTO Comment (AccID, PostID, Comment)
VALUES 
    (1, 1, 'Great post!'),
    (2, 1, 'Nice work!'),
    (3, 2, 'This is awesome.'),
    (4, 3, 'Love this event!'),
    (5, 4, 'Keep up the good work.');

-- Insert data into Follower table
INSERT INTO Follower (Follower, FollowedBy)
VALUES 
    (1, 2),
    (2, 3),
    (3, 4),
    (4, 5),
    (5, 1);

-- Insert data into SignUp table
INSERT INTO SignUp (AccID, ListingID)
VALUES 
    (1, 1),
    (2, 2),
    (3, 3),
    (4, 4),
    (5, 5);

-- Insert data into SavedListing table
INSERT INTO SavedListing (AccID, ListingID)
VALUES
	(3, 1),
	(3, 2), 
	(3, 4),
	(1, 2),
	(1, 3)

-- Select data from tables
SELECT * FROM Account;
SELECT * FROM Volunteer;
SELECT * FROM Organisation;
SELECT * FROM Post;    
SELECT * FROM Listing;
SELECT * FROM Likes;
SELECT * FROM Comment;
SELECT * FROM Follower;
SELECT * FROM SignUp;
SELECT * FROM SavedListing




