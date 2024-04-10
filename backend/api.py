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

## ---------------- get, add, and remove for CUSTOMER table --------------------
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





## ---------------- get, add, and remove for MECHANIC table --------------------
## example request: http://127.0.0.1:5000/shopWizard/getMechanic?id=105
@app.route('/shopWizard/getMechanic', methods = ['get'])
def getMechanic():
    ## param for input
    id = str(request.args['id'])
    
    ## exeute  SQL
    query = "SELECT * FROM mechanic WHERE mechanic.id = " + id
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
        return jsonify({'error': 'mechanic not found'}), 404

## example request: http://127.0.0.1:5000/shopWizard/addMechanic?name=Kelly%20Amber&email=kellyamber69@gmail.com&phone=1111111111&id=105
## '%20' is the special char for a space, use '&' between params
@app.route('/shopWizard/addMechanic', methods = ['get'])
def addMechanic():
    ## extract mechanic info from data
    name = request.args.get('name')
    email = request.args.get('email')
    phone = request.args.get('phone')
    id = request.args.get('id')

    ## check if all fields are present
    if not all([name, phone, id]):
        return jsonify({'error': 'Missing reqired fields: phone, name, or id'}), 400

    ## execute SQL query to add mechanic
    ## assumes that phone number and email validation is done on client side
    ## phone numbers must have 10 digits (numbers only) 
    ## emails must be valid format i.e. xxxxx@xxx.xxx
    try:
        query = "INSERT INTO mechanic (name, email, phone, id) VALUES (%s, %s, %s, %s)"
        cursor.execute(query, (name, email, phone, id))
    except mysql.connector.Error as e:
        error_message = "Error adding mechanic: " + str(e)
        return jsonify({'error': error_message})

    ## commit changes
    conn.commit()

    ## return success message
    return jsonify({'message': 'Mechanic added successfully'}), 200

## example request: http://127.0.0.1:5000/shopWizard/removeMechanic?id=105
@app.route('/shopWizard/removeMechanic', methods = ['get'])
def removeMechanic():
    ## extract input
    id = request.args.get('id')

    # Check if id number is provided
    if not id:
        return jsonify({'error': 'id number is missing in the request'}), 400
    
    ## execute SQL query to remove mechanic
    try:
        query = "DELETE FROM mechanic WHERE id = " + str(id)
        cursor.execute(query)
    except mysql.connector.Error as e:
        error_message = "Error removing mechanic: " + str(e)
        return jsonify({'error': error_message})

    ## commit changes
    conn.commit()

    ## return success message
    return jsonify({'message': 'Mechanic removed successfully'}), 200





## ---------------- get, add, and remove for VEHICLE table ---------------------
## example request: http://127.0.0.1:5000/shopWizard/getVehicle?vin=2C4RDGCG0ER295952
@app.route('/shopWizard/getVehicle', methods = ['get'])
def getVehicle():
    ## param for input
    vin = str(request.args['vin'])
    
    ## exeute  SQL
    query = "SELECT * FROM vehicle WHERE vehicle.vin = %s"
    cursor.execute(query, (vin,))

    ## Fetch row
    row = cursor.fetchone()
    if row:
        ## convert to dictionary
        result = {}
        for i, col in enumerate(cursor.description):
            result[col[0]] = row[i]
        return jsonify(result), 200
    else:
        return jsonify({'error': 'vehicle not found'}), 404

## example request: http://127.0.0.1:5000/shopWizard/addVehicle?vin=2C4RDGCG0ER295952&owner=1234567890&make=Dodge&model=Grand%20Caravan&color=blue&year=2014
## '%20' is the special char for a space, use '&' between params
@app.route('/shopWizard/addVehicle', methods = ['get'])
def addVehicle():
    ## extract vehicle info from data
    vin = request.args.get('vin')
    owner = request.args.get('owner')
    make = request.args.get('make')
    model = request.args.get('model')
    color = request.args.get('color')
    year = request.args.get('year')

    ## check if all fields are present
    if not all([vin, owner, make, model, color, year]):
        return jsonify({'error': 'Missing reqired fields: vin, owner, make, model, color, or year'}), 400

    ## execute SQL query to add vehicle
    ## owner is represented by a 10 digit phone number
    ## phone numbers must have 10 digits (numbers only)
    try:
        query = "INSERT INTO vehicle (vin, owner, make, model, color, year) VALUES (%s, %s, %s, %s, %s, %s)"
        cursor.execute(query, (vin, owner, make, model, color, year))
    except mysql.connector.Error as e:
        error_message = "Error adding vehicle: " + str(e)
        return jsonify({'error': error_message})

    ## commit changes
    conn.commit()

    ## return success message
    return jsonify({'message': 'vehicle added successfully'}), 200

## example request: http://127.0.0.1:5000/shopWizard/removeVehicle?vin=2C4RDGCG0ER295952
@app.route('/shopWizard/removeVehicle', methods = ['get'])
def removeVehicle():
    ## extract input
    vin = request.args.get('vin')

    # Check if id number is provided
    if not vin:
        return jsonify({'error': 'vin is missing in the request'}), 400
    
    ## execute SQL query to remove mechanic
    try:
        query = "DELETE FROM vehicle WHERE vin = %s"
        cursor.execute(query, (vin,))
    except mysql.connector.Error as e:
        error_message = "Error removing vehicle: " + str(e)
        return jsonify({'error': error_message})

    ## commit changes
    conn.commit()

    ## return success message
    return jsonify({'message': 'vehicle removed successfully'}), 200





## --------------- get, add, and remove for SERVICETYPE table ------------------
## example request: http://127.0.0.1:5000/shopWizard/getServiceType?id=101
@app.route('/shopWizard/getServiceType', methods = ['get'])
def getServiceType():
    ## param for input
    id = str(request.args['id'])
    
    ## exeute  SQL
    query = "SELECT * FROM serviceType WHERE serviceType.id = %s"
    cursor.execute(query, (id,))

    ## Fetch row
    row = cursor.fetchone()
    if row:
        ## convert to dictionary
        result = {}
        for i, col in enumerate(cursor.description):
            result[col[0]] = row[i]
        return jsonify(result), 200
    else:
        return jsonify({'error': 'service type not found'}), 404

## example request: http://127.0.0.1:5000/shopWizard/addServiceType?id=101&name=Oil%20Change&cost=50&duration=0.5
## '%20' is the special char for a space, use '&' between params
@app.route('/shopWizard/addServiceType', methods = ['get'])
def addServiceType():
    ## extract service type info from data
    id = request.args.get('id')
    name = request.args.get('name')
    cost = request.args.get('cost')
    duration = request.args.get('duration')

    ## check if all fields are present
    if not all([id, name, cost, duration]):
        return jsonify({'error': 'Missing reqired fields: id, name, cost, or duration'}), 400

    ## execute SQL query to add service type
    try:
        query = "INSERT INTO serviceType (id, name, cost, duration) VALUES (%s, %s, %s, %s)"
        cursor.execute(query, (id, name, cost, duration))
    except mysql.connector.Error as e:
        error_message = "Error adding service type: " + str(e)
        return jsonify({'error': error_message})

    ## commit changes
    conn.commit()

    ## return success message
    return jsonify({'message': 'service type added successfully'}), 200

## example request: http://127.0.0.1:5000/shopWizard/removeServiceType?id=101
@app.route('/shopWizard/removeServiceType', methods = ['get'])
def removeServiceType():
    ## extract input
    id = request.args.get('id')

    # Check if id number is provided
    if not id:
        return jsonify({'error': 'id is missing in the request'}), 400
    
    ## execute SQL query to remove service type
    try:
        query = "DELETE FROM serviceType WHERE id = %s"
        cursor.execute(query, (id,))
    except mysql.connector.Error as e:
        error_message = "Error removing service type: " + str(e)
        return jsonify({'error': error_message})

    ## commit changes
    conn.commit()

    ## return success message
    return jsonify({'message': 'service type removed successfully'}), 200



## run app
if __name__ == '__main__':
    app.run()