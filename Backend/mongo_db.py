from pymongo import MongoClient
import json
from bson import ObjectId
from dotenv import load_dotenv
import os

# MongoDB Connection Configuration
load_dotenv()
MONGO_URI = os.getenv("MONGO_URI")
DATABASE_NAME = os.getenv("DATABASE_NAME")
COLLECTION_NAME = os.getenv("COLLECTION_NAME")

class MongoDBClient:
    """
    A MongoDB client class to handle common database operations such as:
    - Connecting to MongoDB
    - Inserting documents
    - Searching documents (one or multiple)
    - Deleting documents
    """

    def __init__(self, uri, database, collection):
        """
        Initialize the client, connect to the MongoDB server,
        and select the specified database and collection.
        """
        self.client = MongoClient(uri)
        self.db = self.client[database]
        self.collection = self.db[collection]

    def save_to_mongo(self, document):
        """
        Insert a single document into the MongoDB collection.
        If insertion fails, print the error.
        """
        try:
            result = self.collection.insert_one(document)
            print('Document has been successfully inserted into the MongoDB collection.')
        except Exception as e:
            print(f'An error occurred while saving the document. Error: {e}')
        
    def search_one(self, _id):
        """
        Search for a single document in the collection by its ObjectId (_id).
        Returns a list (usually with 0 or 1 item) of the matching document(s).
        
        - Converts the ObjectId field to a string for each document to
          make it JSON-serializable.
        - Raises ValueError if _id is not a valid ObjectId string.
        """
        try:
            query = {"_id": ObjectId(_id)}
        except Exception as e:
            raise ValueError(f"Invalid ObjectId: {_id}. Error: {e}")

        # Perform the query
        cursor = self.collection.find(query)
        # Convert each document's ObjectId to a string
        data = [
            {key: (str(value) if isinstance(value, ObjectId) else value) for key, value in document.items()}
            for document in cursor
        ]
        return data

    def search_all(self, filter_criteria={}):
        """
        Search for multiple documents in the collection.
        - Optionally accepts filter_criteria to narrow the search.
        - Converts any ObjectId fields to strings.
        - Returns a list of matching documents.
        """
        cursor = self.collection.find(filter_criteria)
        data = [
            {key: (str(value) if isinstance(value, ObjectId) else value) for key, value in document.items()}
            for document in cursor
        ]
        return data

    def delete_one(self, _id):
        """
        Delete a single document from the collection by its ObjectId.
        Returns the number of documents deleted (0 or 1).
        
        - Raises ValueError if _id is not a valid ObjectId string.
        """
        try:
            query = {"_id": ObjectId(_id)}
        except Exception as e:
            raise ValueError(f"Invalid ObjectId: {_id}. Error: {e}")

        result = self.collection.delete_one(query)
        deleted_count = result.deleted_count
        return deleted_count