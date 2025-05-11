from flask import Flask, g, request, jsonify, make_response
from flask_cors import CORS
from datetime import datetime

# MongoDBClient: A helper class (presumably) wrapping PyMongo or similar 
# for MongoDB interactions.
from mongo_db import MongoDBClient

# sentModel: A custom sentiment analysis model/module
from sentModel import sentModel

# Flask App Initialization
__all__ = ['app']
app = Flask(__name__)
CORS(app)

# Database Configuration
HOST = 'localhost'
PORT = 27017
DATABASE_NAME = 'machinelearning'
COLLECTION_NAME = 'englishtext'

def get_conn():
    """
    Retrieves or creates (if not already present) a MongoDB connection 
    and attaches it to Flask's 'g' (global context) object.
    """
    if not hasattr(g, 'mongo'):
        g.mongo = MongoDBClient(HOST, PORT, DATABASE_NAME, COLLECTION_NAME)
    return g.mongo

# Default Route
@app.route('/')
def get_data_one():
    """
    If an '_id' parameter is provided via query string,
    searches the MongoDB collection for a single document with that _id.
    Otherwise, returns a welcome message.
    """
    _id = request.args.get('_id')

    # If no _id is provided, just return a welcome message.
    if not _id:
        return '<h1>Welcome to MachineLearning Project Backend Interface (MongoDB Version)</h1>'

    # Search for document by _id
    conn = get_conn()
    data = conn.search_one(_id=_id)

    # Return the data (if found) in JSON format
    response = make_response(jsonify({"data": data}))
    response.headers["Content-Type"] = "application/json"
    return response

# Fetch All Documents
@app.route('/all')
def get_data_all():
    """
    Retrieves all documents from the MongoDB collection 
    and returns them as JSON.
    """
    conn = get_conn()
    data = conn.search_all()

    response = make_response(jsonify({"data": data}))
    response.headers["Content-Type"] = "application/json"
    return response

# Submit Text for Sentiment Analysis
@app.route('/submit', methods=['POST'])
def submit_text():
    """
    Expects JSON data with a 'text' field in the request body.
    1. Parses the input text.
    2. Passes it to the sentModel for sentiment analysis.
    3. Saves the original text along with analysis results and 
       submission time into MongoDB.
    4. Returns a confirmation message in JSON.
    """
    try:
        data = request.get_json()
        # Validate that we have 'text' in the posted data
        if not data or 'text' not in data:
            return jsonify({"error": "Invalid input. 'text' field is required."}), 400

        text = data.get('text', '')

        # Run sentiment analysis on the input text
        sm = sentModel()
        score, sent_lab, pos_dict, neg_dict = sm.run_score(text)

        # Record the current UTC time for the submission
        submit_time = datetime.utcnow()

        # Store results in MongoDB
        conn = get_conn()
        document = {
            "text": text,
            "submit_time": submit_time,
            "sent_lab": sent_lab,
            "pos_dict": pos_dict,
            "neg_dict": neg_dict
        }
        conn.save_to_mongo(document)

        print("Received text:", text)
        return jsonify({"message": "Text received and saved successfully!"})

    except Exception as e:
        # Catch any unexpected exceptions, return status 500
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500

# Delete Document by _id
@app.route('/delete')
def delete_text():
    """
    Expects '_id' parameter from the query string to identify 
    which document should be deleted from MongoDB.
    Returns a success message if deleted; otherwise a 404 if not found.
    """
    _id = request.args.get('_id')

    conn = get_conn()
    deleted_count = conn.delete_one(_id=_id)

    if deleted_count > 0:
        response_data = {"message": "Document deleted successfully."}
        status_code = 200
    else:
        response_data = {"error": "No document found to delete."}
        status_code = 404

    response = make_response(jsonify(response_data), status_code)
    response.headers["Content-Type"] = "application/json"
    return response

# Run the Flask Application
if __name__ == '__main__':
    app.run()
