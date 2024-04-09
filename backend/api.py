## using flask to create API in python for shopwizard web program
## remember to update the conn parameters with info for your local mysql setup

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

## ---------------- get, add, and remove for customer table --------------------
## example request: http://127.0.0.1:5000/shopWizard/getCustomer?phone=1234567890
@app.route('/shopWizard/getCustomer', methods = ['get'])
def getCustomer():
    ## param for input
    phone = str(request.args['phone'])
    
    ## exeute  SQL
    query = "SELECT * FROM customer WHERE customer.phone = " + phone
    cursor.execute(query)

    ## Fetch row
    row = cursor.fetchone()
    if row:
        ## convert to dictionary
        result = {}
        for i, col in enumerate(cursor.description):
            result[col[0]] = row[i]
        return jsonify(result), 200
    else:
        return jsonify({'error': 'customer not found'}), 404

## example request: http://127.0.0.1:5000/shopWizard/addCustomer?name=John%20Doe&email=johndoe123@gmail.com&phone=1234567890
## '%20' is the special char for a space, use '&' between params
@app.route('/shopWizard/addCustomer', methods = ['get'])
def addCustomer():
    ## extract customer info from data
    name = request.args.get('name')
    email = request.args.get('email')
    phone = request.args.get('phone')

    ## check if all fields are present
    if not all([name, phone]):
        return jsonify({'error': 'Missing reqired fields: phone or name'}), 400

    ## execute SQL query to add customer
    ## assumes that phone number and email validation is done on client side
    ## phone numbers must have 10 digits (numbers only) 
    ## emails must be valid format i.e. xxxxx@xxx.xxx
    try:
        query = "INSERT INTO customer (name, email, phone) VALUES (%s, %s, %s)"
        cursor.execute(query, (name, email, phone))
    except mysql.connector.Error as e:
        error_message = "Error adding customer: " + str(e)
        return jsonify({'error': error_message})

    ## commit changes
    conn.commit()

    ## return success message
    return jsonify({'message': 'Customer added successfully'}), 200

## example request: http://127.0.0.1:5000/shopWizard/removeCustomer?phone=1234567890
@app.route('/shopWizard/removeCustomer', methods = ['get'])
def removeCustomer():
    ## extract input
    phone = request.args.get('phone')

    # Check if phone number is provided
    if not phone:
        return jsonify({'error': 'Phone number is missing in the request'}), 400
    
    ## execute SQL query to remove customer
    try:
        query = "DELETE FROM customer WHERE phone = " + str(phone)
        cursor.execute(query)
    except mysql.connector.Error as e:
        error_message = "Error removing customer: " + str(e)
        return jsonify({'error': error_message})

    ## commit changes
    conn.commit()

    ## return success message
    return jsonify({'message': 'Customer removed successfully'}), 200



if __name__ == '__main__':
    app.run()