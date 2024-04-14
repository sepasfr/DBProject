## script to automate the creation of a local mysql database for use
## by the ShopWizzard application.
## On running, this program  will delete any existing, 'shopwizard' db and 
## create a new databased according to the database.sql file

## remember to update the conn parameters with info for your local mysql setup

import mysql.connector

## .sql file to run commands from
sql_file_location = "backend/database.sql"

## connect to mysql database -- change to fit your local setup
conn = mysql.connector.connect(
    host="localhost",
    user="root",
    password="St@llions123"
)

## create cursor object to execute SQL queries
cursor = conn.cursor()

## delete current 'shopwizard' database (if exists)
try:
    cursor.execute("DROP DATABASE IF EXISTS shopwizard")
    print("Database 'shopwizard' deleted (if existed)")
except mysql.connector.Error as e:
    print("Error deleting 'shopwizard' databse (if existed)", e)

## create new 'shopwizard' database
try:
    cursor.execute("CREATE DATABASE shopwizard")
except mysql.connector.Error as e:
    print("Error creating database", e)

## connect to 'shopwizard' database
conn.database = "shopwizard"

## execute database.sql
try:
    ## read SQL script from file
    with open(sql_file_location, "r") as script_file:
        sql_script = script_file.read()
    
    ## execute SQL script
    for result in cursor.execute(sql_script, multi = True):
        if result.with_rows:
            print("Rows produced by statement '{}':".format(result.statement))
            print(result.fetchall())
        else:
            print("Number of rows affected by statement '{}': {}".format(result.statement, result.rowcount))

    conn.commit() ## commit changes to database
    print("SQL script executed successfully.")
except mysql.connector.Error as e:
    print("Error executing SQL script:", e)
finally:
    ##close cursor and connection
    cursor.close()
    conn.close()