from flask import Flask, request, json, jsonify
from flask_cors import CORS
import json
import os

app = Flask(__name__)
CORS(app) # leave it as it is

CAMPS_DIR = "data/" # folder name with JSON files

############################################ APIs #############################################

################################# Create new camp JSON file  ##################################
@app.route("/api/create-camp", methods=["POST"])
def create_camp():
    data = request.json 
    camp_name = data.get("campName")

    camp_file_path = os.path.join(CAMPS_DIR, f"camp_{camp_name}.json")
    with open(camp_file_path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=4)

    # Send a response
    return jsonify({"message": f"Camp '{camp_name}' was received successfully"}), 200

################################# Get the name of every camp  #################################
@app.route("/api/get-camps", methods=["GET"])
def get_camps():
    camp_names = [
        {"campName": f.replace(".json", "")} for f in os.listdir(CAMPS_DIR) if f.endswith(".json")
    ]

    # Send a response
    response = jsonify(camp_names)
    response.headers["Content-Type"] = "application/json; charset=utf-8"
    return response

################################ Get the data of specific camp  ###############################
@app.route("/api/get-camp-data/<camp_name>", methods=["GET"])
def get_camp_data(camp_name):
    camp_file_path = os.path.join(CAMPS_DIR, f"{camp_name}.json")
    
    with open(camp_file_path, "r", encoding="utf-8") as f:
        camp_data = json.load(f)
    
    return jsonify(camp_data)

############################################ APIs #############################################

if __name__ == "__main__":
    app.run(debug=True)