## using flask to create API in python for shopwizard web program
## remember to update the conn parameters with info for your local mysql setup

## import/create insstance of flask object
from flask import Flask, request, jsonify
from flask_cors import CORS
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

# Configuring CORS for all routes and origins
CORS(app)

## ---------------- get, getAll, add, and remove for CUSTOMER table --------------------
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

## example request: http://127.0.0.1:5000/shopWizard/getAllCustomers
@app.route('/shopWizard/getAllCustomers', methods=['GET'])
def getAllCustomers():
        query = "SELECT * FROM customer"
        cursor.execute(query)
        rows = cursor.fetchall()
        customers = []

        # Check if any customers were found
        if rows:
            columns = [column[0] for column in cursor.description]
            for row in rows:
                customers.append(dict(zip(columns, row)))
            return jsonify(customers), 200
        else:
            return jsonify({'message': 'No customers found'}), 404

## example request: http://127.0.0.1:5000/shopWizard/addCustomer?name=John%20Doe&email=johndoe123@gmail.com&phone=1234567890
## '%20' is the special char for a space, use '&' between params
@app.route('/shopWizard/addCustomer', methods = ['post'])
def addCustomer():
    ## extract customer info from data
    name = request.json.get('name')
    email = request.json.get('email')
    phone = request.json.get('phone')

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
@app.route('/shopWizard/removeCustomer', methods = ['delete'])
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

# Update customer details
@app.route('/shopWizard/updateCustomer', methods=['PUT'])
def updateCustomer():
    old_phone = request.json.get('old_phone')  # Assuming you provide the old phone number
    new_phone = request.json.get('new_phone')
    name = request.json.get('name')
    email = request.json.get('email')

    if not all([old_phone, new_phone, name]):
        return jsonify({'error': 'Missing required fields: old_phone, new_phone, or name'}), 400

    try:
        # Check if the new phone number already exists
        cursor.execute("SELECT * FROM customer WHERE phone = %s", (new_phone,))
        existing_customer = cursor.fetchone()
        if existing_customer:
            return jsonify({'error': 'A customer with the new phone number already exists'}), 400

        # Update customer record
        query = "UPDATE customer SET phone = %s, name = %s, email = %s WHERE phone = %s"
        cursor.execute(query, (new_phone, name, email, old_phone))
        conn.commit()
        return jsonify({'message': 'Customer updated successfully'}), 200

    except mysql.connector.Error as e:
        error_message = "Error updating customer: " + str(e)
        return jsonify({'error': error_message}), 500



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
    
## example request: http://127.0.0.1:5000/shopWizard/getAllMechanics
@app.route('/shopWizard/getAllMechanics', methods=['GET'])
def getAllMechanics():
        query = "SELECT * FROM Mechanic"
        cursor.execute(query)
        rows = cursor.fetchall()
        mechanics = []

        # Check if any customers were found
        if rows:
            columns = [column[0] for column in cursor.description]
            for row in rows:
                mechanics.append(dict(zip(columns, row)))
            return jsonify(mechanics), 200
        else:
            return jsonify({'message': 'No mechanics found'}), 404

## example request: http://127.0.0.1:5000/shopWizard/addMechanic?name=Kelly%20Amber&email=kellyamber69@gmail.com&phone=1111111111&id=105
## '%20' is the special char for a space, use '&' between params
@app.route('/shopWizard/addMechanic', methods = ['post'])
def addMechanic():
    ## extract mechanic info from data
    name = request.json.get('name')
    email = request.json.get('email')
    phone = request.json.get('phone')
    id = request.json.get('id')

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
@app.route('/shopWizard/removeMechanic', methods = ['delete'])
def removeMechanic():
    ## extract input
    id = request.args.get('id')

    # Check if id number is provided
    if not id:
        return jsonify({'error': 'id number is missing in the request'}), 400
    
    ## execute SQL query to remove mechanic
    try:
        query = "DELETE FROM mechanic WHERE id = %s"
        cursor.execute(query, (id,))
    except mysql.connector.Error as e:
        error_message = "Error removing mechanic: " + str(e)
        return jsonify({'error': error_message})

    ## commit changes
    conn.commit()

    ## return success message
    return jsonify({'message': 'Mechanic removed successfully'}), 200

# Update mechanic details
@app.route('/shopWizard/updateMechanic', methods=['PUT'])
def updateMechanic():
    old_id = request.json.get('old_id')
    new_id = request.json.get('new_id')
    name = request.json.get('name')
    email = request.json.get('email')
    phone = request.json.get('phone')

    if not all([old_id, new_id, name, email, phone]):
        return jsonify({'error': 'Missing required fields'}), 400

    try:
        # Check if the new ID already exists and is not the old ID
        cursor.execute("SELECT * FROM mechanic WHERE id = %s AND id != %s", (new_id, old_id))
        if cursor.fetchone():
            return jsonify({'error': 'A mechanic with the new ID already exists'}), 400

        # Update mechanic record
        query = "UPDATE mechanic SET id = %s, name = %s, email = %s, phone = %s WHERE id = %s"
        cursor.execute(query, (new_id, name, email, phone, old_id))
        conn.commit()
        return jsonify({'message': 'Mechanic updated successfully'}), 200

    except mysql.connector.Error as e:
        return jsonify({'error': "Error updating mechanic: {str(e)}"}), 500


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
    
## example request: http://127.0.0.1:5000/shopWizard/getAllVehicles
@app.route('/shopWizard/getAllVehicles', methods=['GET'])
def getAllVehicles():
        query = "SELECT * FROM Vehicle"
        cursor.execute(query)
        rows = cursor.fetchall()
        vehicles = []

        # Check if any customers were found
        if rows:
            columns = [column[0] for column in cursor.description]
            for row in rows:
                vehicles.append(dict(zip(columns, row)))
            return jsonify(vehicles), 200
        else:
            return jsonify({'message': 'No Vehicles found'}), 404

## example request: http://127.0.0.1:5000/shopWizard/addVehicle?vin=2C4RDGCG0ER295952&owner=1234567890&make=Dodge&model=Grand%20Caravan&color=blue&year=2014
## '%20' is the special char for a space, use '&' between params
@app.route('/shopWizard/addVehicle', methods = ['post'])
def addVehicle():
    ## extract vehicle info from data
    vin = request.json.get('vin')
    owner = request.json.get('owner')
    make = request.json.get('make')
    model = request.json.get('model')
    color = request.json.get('color')
    year = request.json.get('year')

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
@app.route('/shopWizard/removeVehicle', methods = ['delete'])
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

# Update vehicle details
@app.route('/shopWizard/updateVehicle', methods=['PUT'])
def updateVehicle():
    new_vin = request.json.get('new_vin')
    old_vin = request.json.get('old_vin')
    owner = request.json.get('owner')
    make = request.json.get('make')
    model = request.json.get('model')
    color = request.json.get('color')
    year = request.json.get('year')

    if not all([old_vin, new_vin, owner, make, model, color, year]):
        return jsonify({'error': 'Missing required fields: vin, owner, make, model, color, or year'}), 400

    try:
         # Check if the new vin already exists and is not the old vin
        cursor.execute("SELECT * FROM vehicle WHERE vin = %s AND vin != %s", (new_vin, old_vin))
        if cursor.fetchone():
            return jsonify({'error': 'A vehicle with the new vin already exists'}), 400
        
        query = "UPDATE vehicle SET vin = %s, owner = %s, make = %s, model = %s, color = %s, year = %s WHERE vin = %s"
        cursor.execute(query, (new_vin, owner, make, model, color, year, old_vin))
        conn.commit()
        return jsonify({'message': 'Vehicle updated successfully'}), 200

    except mysql.connector.Error as e:
        return jsonify({'error': f"Error updating vehicle: {str(e)}"}), 500





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
    
## example request: http://127.0.0.1:5000/shopWizard/getAllServiceTypes
@app.route('/shopWizard/getAllServiceTypes', methods=['GET'])
def getAllServiceTypes():
        query = "SELECT * FROM serviceType"
        cursor.execute(query)
        rows = cursor.fetchall()
        ServiceTypes = []

        # Check if any customers were found
        if rows:
            columns = [column[0] for column in cursor.description]
            for row in rows:
                ServiceTypes.append(dict(zip(columns, row)))
            return jsonify(ServiceTypes), 200
        else:
            return jsonify({'message': 'No service types found'}), 404

## example request: http://127.0.0.1:5000/shopWizard/addServiceType?id=101&name=Oil%20Change&cost=50&duration=0.5
## '%20' is the special char for a space, use '&' between params
@app.route('/shopWizard/addServiceType', methods = ['post'])
def addServiceType():
    ## extract service type info from data
    id = request.json_module.get('id')
    name = request.json.get('name')
    cost = request.json.get('cost')
    duration = request.json.get('duration')

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
@app.route('/shopWizard/removeServiceType', methods = ['delete'])
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

# Update service type details
@app.route('/shopWizard/updateServiceType', methods=['PUT'])
def updateServiceType():
    old_id = request.json.get('old_id')
    new_id = request.json.get('new_id')
    name = request.json.get('name')
    cost = request.json.get('cost')
    duration = request.json.get('duration')

    if not all([old_id, new_id, name, cost, duration]):
        return jsonify({'error': 'Missing required fields: id, name, cost, or duration'}), 400

    try:
         # Check if the new ID already exists and is not the old ID
        cursor.execute("SELECT * FROM servicetype WHERE id = %s AND id != %s", (new_id, old_id))
        if cursor.fetchone():
            return jsonify({'error': 'A servicetype with the new ID already exists'}), 400

        query = "UPDATE serviceType SET id = %s, name = %s, cost = %s, duration = %s WHERE id = %s"
        cursor.execute(query, (new_id, name, cost, duration, old_id))
        conn.commit()
        return jsonify({'message': 'Service type updated successfully'}), 200

    except mysql.connector.Error as e:
        return jsonify({'error': "Error updating serviceType: {str(e)}"}), 500

    




## --------------- get, add, and remove for Job table ------------------
## example request: http://127.0.0.1:5000/shopWizard/getJob?id=1001
@app.route('/shopWizard/getJob', methods=['GET'])
def getJob():
    job_id = request.args.get('id')
    if not job_id:
        return jsonify({'error': 'Missing required parameter: id'}), 400

    query = "SELECT * FROM job WHERE id = %s"
    cursor.execute(query, (job_id,))
    job = cursor.fetchone()

    if job:
        columns = [column[0] for column in cursor.description]
        return jsonify(dict(zip(columns, job))), 200
    else:
        return jsonify({'message': 'Job not found'}), 404

## example request: http://127.0.0.1:5000/shopWizard/getAllJobs
@app.route('/shopWizard/getAllJobs', methods=['GET'])
def getAllJobs():
    query = "SELECT * FROM job"
    cursor.execute(query)
    rows = cursor.fetchall()
    jobs = []

    if rows:
        columns = [column[0] for column in cursor.description]
        for row in rows:
            jobs.append(dict(zip(columns, row)))
        return jsonify(jobs), 200
    else:
        return jsonify({'message': 'No jobs found'}), 404

## example request: http://127.0.0.1:5000/shopWizard/addJob
@app.route('/shopWizard/addJob', methods=['POST'])
def addJob():
    vehicle = request.json.get('vehicle')
    mechanic = request.json.get('mechanic')
    serviceType = request.json.get('serviceType')
    status = request.json.get('status')

    if not all([vehicle, serviceType]):
        return jsonify({'error': 'Missing required fields'}), 400

    query = "INSERT INTO job (vehicle, mechanic, serviceType, status) VALUES (%s, %s, %s, %s)"
    try:
        cursor.execute(query, (vehicle, mechanic, serviceType, status))
        conn.commit()
        return jsonify({'message': 'Job added successfully'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

## example request: http://127.0.0.1:5000/shopWizard/deleteJob?id=1001
@app.route('/shopWizard/deleteJob', methods=['DELETE'])
def deleteJob():
    job_id = request.args.get('id')
    if not job_id:
        return jsonify({'error': 'Missing required parameter: id'}), 400

    query = "DELETE FROM job WHERE id = %s"
    try:
        cursor.execute(query, (job_id,))
        conn.commit()
        return jsonify({'message': 'Job deleted successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Update job details
@app.route('/shopWizard/updateJob', methods=['PUT'])
def updateJob():
    id = request.json.get('id')
    vehicle = request.json.get('vehicle')
    mechanic = request.json.get('mechanic')
    serviceType = request.json.get('serviceType')
    status = request.json.get('status')

    if not all([id, vehicle, serviceType]):
        return jsonify({'error': 'Missing required fields: id, vehicle, or serviceType'}), 400

    try:
        query = "UPDATE job SET vehicle = %s, mechanic = %s, serviceType = %s, status = %s WHERE id = %s"
        cursor.execute(query, (vehicle, mechanic, serviceType, status, id))
    except mysql.connector.Error as e:
        error_message = "Error updating job: " + str(e)
        return jsonify({'error': error_message})

    conn.commit()
    return jsonify({'message': 'Job updated successfully'}), 200







## --------------- get, add, and remove for Appointment table ------------------
## example request: http://127.0.0.1:5000/shopWizard/getAppointment?id=2001
@app.route('/shopWizard/getAppointment', methods=['GET'])
def getAppointment():
    appointment_id = request.args.get('id')
    if not appointment_id:
        return jsonify({'error': 'Missing required parameter: id'}), 400

    query = "SELECT * FROM appointment WHERE id = %s"
    cursor.execute(query, (appointment_id,))
    appointment = cursor.fetchone()

    if appointment:
        columns = [column[0] for column in cursor.description]
        return jsonify(dict(zip(columns, appointment))), 200
    else:
        return jsonify({'message': 'Appointment not found'}), 404

## example request: http://127.0.0.1:5000/shopWizard/getAllAppointments
@app.route('/shopWizard/getAllAppointments', methods=['GET'])
def getAllAppointments():
    query = "SELECT * FROM appointment"
    cursor.execute(query)
    rows = cursor.fetchall()
    appointments = []

    if rows:
        columns = [column[0] for column in cursor.description]
        for row in rows:
            appointments.append(dict(zip(columns, row)))
        return jsonify(appointments), 200
    else:
        return jsonify({'message': 'No appointments found'}), 404

## example request: http://127.0.0.1:5000/shopWizard/addAppointment
@app.route('/shopWizard/addAppointment', methods=['POST'])
def addAppointment():
    day = request.json.get('day')
    customer = request.json.get('customer')
    vehicle = request.json.get('vehicle')
    serviceType = request.json.get('serviceType')
    note = request.json.get('note')

    if not all([day, customer, vehicle, serviceType]):
        return jsonify({'error': 'Missing required fields'}), 400

    query = "INSERT INTO appointment (day, customer, vehicle, serviceType, note) VALUES (%s, %s, %s, %s, %s)"
    try:
        cursor.execute(query, (day, customer, vehicle, serviceType, note))
        conn.commit()
        return jsonify({'message': 'Appointment added successfully'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

## example request: http://127.0.0.1:5000/shopWizard/deleteAppointment?id=2001
@app.route('/shopWizard/deleteAppointment', methods=['DELETE'])
def deleteAppointment():
    appointment_id = request.args.get('id')
    if not appointment_id:
        return jsonify({'error': 'Missing required parameter: id'}), 400

    query = "DELETE FROM appointment WHERE id = %s"
    try:
        cursor.execute(query, (appointment_id,))
        conn.commit()
        return jsonify({'message': 'Appointment deleted successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Update appointment details
@app.route('/shopWizard/updateAppointment', methods=['PUT'])
def updateAppointment():
    id = request.json.get('id')
    day = request.json.get('day')
    customer = request.json.get('customer')
    vehicle = request.json.get('vehicle')
    serviceType = request.json.get('serviceType')
    note = request.json.get('note')

    if not all([id, day, customer, vehicle, serviceType]):
        return jsonify({'error': 'Missing required fields: id, day, customer, vehicle, or serviceType'}), 400

    try:
        query = "UPDATE appointment SET day = %s, customer = %s, vehicle = %s, serviceType = %s, note = %s WHERE id = %s"
        cursor.execute(query, (day, customer, vehicle, serviceType, note, id))
    except mysql.connector.Error as e:
        error_message = "Error updating appointment: " + str(e)
        return jsonify({'error': error_message})

    conn.commit()
    return jsonify({'message': 'Appointment updated successfully'}), 200




## run app
if __name__ == '__main__':
    app.run()