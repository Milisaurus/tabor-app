from flask import Flask, request, json, jsonify
from flask_cors import CORS
import json
import os

app = Flask(__name__)
CORS(app) # leave it as it is

CAMPS_DIR = "data/" # folder name with JSON files


@app.route("/api/create-camp", methods=["POST"])
def create_camp():
    data = request.json 
    camp_name = "camp_" + data.get("campName")

    camp_file_path = os.path.join(CAMPS_DIR, f"{camp_name}.json")
    with open(camp_file_path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=4)

    return jsonify({"message": f"Camp '{camp_name}' was received successfully", "name": camp_name}), 200


@app.route("/api/get-camps", methods=["GET"])
def get_camps():
    camp_names = [
        {"campName": f.replace(".json", "")} for f in os.listdir(CAMPS_DIR) if f.endswith(".json")
    ]

    response = jsonify(camp_names)
    response.headers["Content-Type"] = "application/json; charset=utf-8"
    return response


@app.route("/api/get-camp-data/<camp_name>", methods=["GET"])
def get_camp_data(camp_name):
    camp_file_path = os.path.join(CAMPS_DIR, f"{camp_name}.json")
    if not os.path.exists(camp_file_path):
        return jsonify({"message": f"Camp file for '{camp_name}' not found."}), 404
    
    with open(camp_file_path, "r", encoding="utf-8") as f:
        camp_data = json.load(f)
    
    return jsonify(camp_data)


@app.route("/api/update-camp/<camp_name>", methods=["POST"])
def update_camp(camp_name):
    new_data = request.json
    camp_file_path = os.path.join(CAMPS_DIR, f"camp_{camp_name}.json")
    if not os.path.exists(camp_file_path):
        return jsonify({"message": f"Camp file for {camp_name} not found."}), 404

    with open(camp_file_path, 'r') as file:
        camp_data = json.load(camp_file_path)

    camp_data.update(new_data)

    with open(camp_file_path, 'w') as file:
        json.dump(camp_data, file, indent=4)

    return jsonify({"message": f"Camp '{camp_name}' was updated successfully"}), 200

if __name__ == "__main__":
    app.run(debug=True)