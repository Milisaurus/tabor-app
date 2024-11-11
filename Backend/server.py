from flask import Flask, request, json, jsonify
from flask_cors import CORS
import json
import os

app = Flask(__name__)
CORS(app) # leave it as it is

CAMPS_DIR = "data/" # folder name with JSON files

# Function that evaluates point scheme based on number of teams
def calculate_points(number_of_teams, game_type):
    points = []

    if not isinstance(number_of_teams, int) or number_of_teams <= 0:
        raise ValueError("Počet týmů musí být kladné celé číslo.")

    # Last team gets 1 point and every other gets +1 based on it's position
    if game_type == "méně bodovaná":
        points = [i + 1 for i in range(number_of_teams)]

    # Last team gets 2 points and every other gets +2 based on it's position
    elif game_type == "více bodovaná":
        points = [2 * (i + 1) for i in range(number_of_teams)]

    # Last team gets 3 points and every other gets +3 based on it's position
    elif game_type == "velmi bodovaná":
        points = [3 * (i + 1) for i in range(number_of_teams)]
    
    return points



############################################ APIs #############################################

################################# Create new camp JSON file  ##################################
@app.route("/api/create-camp", methods=["POST"])
def create_camp():
    data = request.json 
    camp_name = data.get("campName")

    camp_file_path = os.path.join(CAMPS_DIR, f"camp_{camp_name}.json")

    number_of_teams = data.get("teamCount")
    game_types = [
        {"type": "méně bodovaná", "point_scheme": calculate_points(number_of_teams, "méně bodovaná")},
        {"type": "více bodovaná", "point_scheme": calculate_points(number_of_teams, "více bodovaná")},
        {"type": "velmi bodovaná", "point_scheme": calculate_points(number_of_teams, "velmi bodovaná")}
    ]

   # Uložení dat do souboru
    with open(camp_file_path, "w", encoding="utf-8") as f:
        data["gameTypes"] = game_types  # Přidání bodového schématu do dat tábora
        json.dump(data, f, ensure_ascii=False, indent=4)

    # Send a response
    return jsonify({"message": f"Camp '{camp_name}' was received successfully", "path": camp_file_path}), 200

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