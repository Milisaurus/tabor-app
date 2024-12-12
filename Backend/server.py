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

@app.route('/api/create-camp', methods=['POST'])
def create_camp():
    data = request.json
    camp_name = data.get("campName")

    if not camp_name:
        return jsonify({"error": "Camp name is required"}), 400

    file_path = os.path.join(CAMPS_DIR, f"{camp_name}.json")
    if os.path.exists(file_path):
        return jsonify({"error": "Camp already exists"}), 400

    # Init JSON
    initial_data = {
        "campName": camp_name,
        "teamCount": 0,
        "teams": [],
        "teamGames": [],
        "individualActivities": [],
    }

    # Save
    os.makedirs(CAMPS_DIR, exist_ok=True)
    with open(file_path, 'w') as f:
        json.dump(initial_data, f, indent=4)

    return jsonify({"message": "Camp created successfully", "campName": camp_name}), 200


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
    print(camp_name)
    camp_file_path = os.path.join(CAMPS_DIR, f"{camp_name}.json")
    if not os.path.exists(camp_file_path):
        return jsonify({"message": f"Camp file for '{camp_name}' not found."}), 404
    
    with open(camp_file_path, "r", encoding="utf-8") as f:
        camp_data = json.load(f)
    
    return jsonify(camp_data)


@app.route("/api/update-camp/<camp_name>", methods=["POST"])
def update_camp(camp_name):
    new_data = request.json

    camp_file_path = os.path.join(CAMPS_DIR, f"{camp_name}.json")
    if not os.path.exists(camp_file_path):
        return jsonify({"message": f"Camp file for {camp_name} not found."}), 404

    with open(camp_file_path, 'r', encoding="utf-8") as file:
        camp_data = json.load(file)

    camp_data.update(new_data)

    with open(camp_file_path, 'w', encoding="utf-8") as file:
        json.dump(camp_data, file, ensure_ascii=False, indent=4)

    return jsonify({"message": f"Camp '{camp_name}' was updated successfully"}), 200

@app.route("/api/calculate-team-scores/<camp_name>", methods=["GET"])
def calculate_team_scores(camp_name):
    try:
        camp_file = os.path.join(CAMPS_DIR, f"camp_{camp_name}.json")
        if not os.path.exists(camp_file):
            return jsonify({"error": f"Camp file '{camp_name}' not found"}), 404

        with open(camp_file, "r", encoding="utf-8") as file:
            data = json.load(file)

        camp_days = ["Sobota", "Neděle", "Pondělí", "Úterý", "Středa", "Čtvrtek", "Pátek"]

        scores = {team["name"]: {day: 0 for day in camp_days} for team in data["teams"]}

        for activity in data.get("individualActivities", []):
            day = activity["day"]
            points = activity["points"]
            participants = activity["participants"]

            for participant in participants:
                for team in data["teams"]:
                    if participant in team["children"]:
                        scores[team["name"]][day] += points

        for game in data.get("teamGames", []):
            day = game["day"]
            results = game["results"]

            for result in results:
                team_name = result["team_name"]
                if team_name in scores:
                    scores[team_name][day] += result["points_awarded"]

        return jsonify(scores), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@app.route('/api/add-game-types/<camp_name>', methods=['POST'])
def add_game_types(camp_name):
    """
    API, která generuje gameTypes a uloží je do JSON souboru.
    """
    try:
        camp_file_path = os.path.join(CAMPS_DIR, f"{camp_name}.json")
        if not os.path.exists(camp_file_path):
            return jsonify({"error": "Camp not found"}), 404

        with open(camp_file_path, "r", encoding="utf-8") as f:
            data = json.load(f)

        number_of_teams = data.get("teamCount", 0)

        # Generate gameTypes
        game_types = [
            {"type": "Méně bodovaná", 
             "point_scheme": calculate_points(number_of_teams, "méně bodovaná"), "everyone_else": 0,},
            {"type": "Více bodovaná", 
             "point_scheme": calculate_points(number_of_teams, "více bodovaná"), "everyone_else": 0,},
            {"type": "Velmi bodovaná", 
             "point_scheme": calculate_points(number_of_teams, "velmi bodovaná"), "everyone_else": 0,}
        ]

        # Save
        data["gameTypes"] = game_types
        with open(camp_file_path, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=4)

        return jsonify({"message": "GameTypes added successfully", "gameTypes": game_types}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 400

############################################ APIs #############################################

if __name__ == "__main__":
    app.run(debug=True)