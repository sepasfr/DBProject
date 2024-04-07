## using flask to create API in python

## import/create insstance of flask object
from flask import Flask, request, jsonify
## allows for interaction with mysql server through python
import mysql.connector

## connect to MySql databsae (change fields to fit your machine setup)
conn = mysql.connector.connect(
    host="localhost",
    user="root",
    password="Hello2002",
    database="shopWizard"
)

## creator cursor object to parse .sql file and execute queries
cursor = conn.cursor()

app = Flask(__name__)

## get, add, and remove for customer table
@app.route('/shopWizard/getCustomer', methods =['get'])
def getCustomer():
    ## param for input
    input = str(request.args['id'])
    
    ## exeute  SQL
    query = "SELECT * FROM customer WHERE customer.id = " + input
    cursor.execute(query)

    ## Fetch row
    row = cursor.fetchone()
    if row:
        ## convert to dictionary
        result = {}
        for i, col in enumerate(cursor.description):
            result[col[0]] = row[i]
        return jsonify(result)
    else:
        return jsonify({'error': 'customer not found'}), 404