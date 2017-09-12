# Instructions for PostgreSQL installation

# Install postgreSQL using brew
brew install postgresql

# Install postgres module for node.js
npm install -g pg

# To start the DB, run this command:
brew services start postgresql

# Check to see if you have postgres user
In terminal, type psql to enter postgres CLI
Check your users by typing \du to see existing users
[https://stackoverflow.com/questions/15008204/how-to-check-postgres-user-and-password]
If you do not have a user named postgres, follow instructions laid out in article above

# Create the leasetopia database
in psql, run this query:
CREATE DATABASE rentopia;

then type \q

# Create all the tables in the db
From Sublime, get the filepath of the createdb.sql file in the db folder
In terminal now, run the following command:
psql rentopia < [insert file path]
Example: [psql rentopia < /Users/BChilds/Desktop/PropMan/db/createdb.sql]

# Set environment variables, as seen on this page: [https://node-postgres.com/features/connecting]
I ended up putting PGUSER, PGDATABASE and PGPASSWORD in my .bash_profile to always run for every terminal. PGUSER should be postgres, PGPASSWORD is the password you set for that user, and PGDATABASE is rentopia
