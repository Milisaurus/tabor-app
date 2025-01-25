# Backend server (BE)
# Authors: Milan Vrbas <xvrbas01>, Jan Juračka <xjurac07>

from flask import Flask, request, json, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)

CORS(app) # leave it as it is

CAMPS_DIR = "data/" # Folder name where camp JSON files are stored

# Helper function to read camp data from JSON file
def read_camp_data(camp_name):
    # Create the path for the camp file
    camp_file_path = os.path.join(CAMPS_DIR, f"{camp_name}.json")

    # Check if the camp file exists
    if not os.path.exists(camp_file_path):
        return None

    # Open and read the camp file, returning the JSON data
    with open(camp_file_path, "r", encoding="utf-8") as file:
        return json.load(file)


# Helper function to save camp data to JSON file
def save_camp_data(camp_name, data):
    # Create the path for the camp file
    camp_file_path = os.path.join(CAMPS_DIR, f"{camp_name}.json")

    # Ensure the directory exists
    os.makedirs(CAMPS_DIR, exist_ok=True)

    # Open the camp file and write the data as JSON
    with open(camp_file_path, "w", encoding="utf-8") as file:
        json.dump(data, file, ensure_ascii=False, indent=4)

# Function that evaluates point scheme based on number of teams
def calculate_points(number_of_teams, game_type):
    # Check if the number of teams is a positive integer
    if not isinstance(number_of_teams, int) or number_of_teams <= 0:
        raise ValueError("The number of teams must be an unsigned int.")

    # Last team gets 1 point and every other gets +1 based on it's position
    if game_type == "méně bodovaná":
        return [number_of_teams - i for i in range(number_of_teams)]

    # Last team gets 2 points and every other gets +2 based on it's position
    elif game_type == "více bodovaná":
        return [2 * (number_of_teams - i) for i in range(number_of_teams)]

    # Last team gets 3 points and every other gets +3 based on it's position
    elif game_type == "velmi bodovaná":
        return [3 * (number_of_teams - i) for i in range(number_of_teams)]

############################################ APIs #############################################

# API route to create a new camp
@app.route('/api/create-camp/<camp_name>', methods=['GET'])
def create_camp(camp_name):
    # Check if camp name is provided
    if not camp_name:
        return jsonify({"error": "Camp name is required"}), 400

    # Check if camp already exists
    if os.path.exists(os.path.join(CAMPS_DIR, f"{camp_name}.json")):
        return jsonify({"error": "Camp already exists"}), 400

    # Initialize the structure for the new camp
    initial_data = {
        "campName": camp_name,
        "teamCount": 0,
        "teams": [],
        "teamGames": [],
        "individualActivities": [],
    }

    # Create the directory if it doesn't exist and save the camp data
    save_camp_data(camp_name, initial_data)

    return jsonify({"message": "Camp created successfully", "campName": camp_name}), 200

# API route to get a list of all camps
@app.route("/api/get-camps", methods=["GET"])
def get_camps():
    # List all JSON files in the CAMPS_DIR folder and extract the camp names
    camp_names = [
        {"campName": f.replace(".json", "")} for f in os.listdir(CAMPS_DIR) if f.endswith(".json")
    ]

    # Send back camp names
    return jsonify(camp_names)

# API route to get the data of a specific camp
@app.route("/api/get-camp-data/<camp_name>", methods=["GET"])
def get_camp_data(camp_name):
    # Define file path for the camp JSON file
    camp_data = read_camp_data(camp_name)

    # Check if the camp file exists (shouldn't happen)
    if not camp_data:
        return jsonify({"message": f"Camp file for '{camp_name}' not found."}), 404

    # Return the camp data
    return jsonify(camp_data)

# API route to update a specific camp with new data
@app.route("/api/update-camp/<camp_name>", methods=["POST"])
def update_camp(camp_name):
    # Extract the new data from the request
    new_data = request.json

    # Read the current camp data
    camp_data = read_camp_data(camp_name)

    # Check if the camp file exists
    if not camp_data:
        return jsonify({"message": f"Camp file for {camp_name} not found."}), 404

    # Update the camp data with the new data
    camp_data.update(new_data)

    # Save the updated camp data
    save_camp_data(camp_name, camp_data)

    # Return a success message
    return jsonify({"message": f"Camp '{camp_name}' was updated successfully"}), 200

# API route to calculate team scores
@app.route("/api/calculate-team-scores/<camp_name>", methods=["GET"])
def calculate_team_scores(camp_name):
    # Read the camp data
    camp_data = read_camp_data(camp_name)

    # Check if the camp file exists
    if not camp_data:
        return jsonify({"message": f"Camp file for {camp_name} not found."}), 404

    # List of days for the camp week
    camp_days = ["Sobota", "Neděle", "Pondělí", "Úterý", "Středa", "Čtvrtek", "Pátek"]

    # Initialize the scores for each team
    scores = {team["name"]: {day: 0 for day in camp_days} for team in camp_data["teams"]}

     # Calculate scores from individual activities
    for activity in camp_data.get("individualActivities", []):
        day = activity["day"]
        points = activity["points"]
        participants = activity["participants"]

        # Handle "odd" or "even" cases
        if "odd" in participants or "even" in participants:
            odd_or_even = camp_data.get("oddOrEven", {})
            relevant_participants = []

            # Collect participants from the appropriate category
            if "even" in participants:
                relevant_participants.extend(odd_or_even.get("even", []))
            if "odd" in participants:
                relevant_participants.extend(odd_or_even.get("odd", []))

            # Add points to teams based on these participants
            for participant in relevant_participants:
                for team in camp_data["teams"]:
                    if participant in team["children"]:
                        scores[team["name"]][day] += points
        else:
            # Add points to each team based on their participants
            for participant in participants:
                for team in camp_data["teams"]:
                    if participant in team["children"]:
                        scores[team["name"]][day] += points

    # Calculate scores from team games
    for game in camp_data.get("teamGames", []):
        day = game["day"]
        results = game["results"]

        # Add points to each team based on the game results
        for result in results:
            team_name = result["team_name"]
            if team_name in scores:
                scores[team_name][day] += result["points_awarded"]

    # Return the calculated scores
    return jsonify(scores), 200

# API route to add game types and calculate the points for each
@app.route('/api/add-game-types/<camp_name>', methods=['POST'])
def add_game_types(camp_name):

    # Read the camp data
    camp_data = read_camp_data(camp_name)

    # Check if the camp file exists
    if not camp_data:
        return jsonify({"message": f"Camp file for {camp_name} not found."}), 404

    # Get the number of teams
    number_of_teams = camp_data.get("teamCount", 0)

     # Define the game types and calculate the corresponding point schemes
    game_types = [
        {"type": "Méně bodovaná",
            "point_scheme": calculate_points(number_of_teams, "méně bodovaná"),},
        {"type": "Více bodovaná",
            "point_scheme": calculate_points(number_of_teams, "více bodovaná"),},
        {"type": "Velmi bodovaná",
            "point_scheme": calculate_points(number_of_teams, "velmi bodovaná"),}
    ]

    # Add the calculated game types to the camp data
    camp_data["gameTypes"] = game_types

    # Save the updated camp data
    save_camp_data(camp_name, camp_data)

    return jsonify({"message": "GameTypes added successfully", "gameTypes": game_types}), 200

# API route to get filtered activities based on day and game type
@app.route("/api/get-filtered-activities/<camp_name>", methods=["GET"])
def get_filtered_activities(camp_name):
    # Get the "day" and "game_type" from the request query parameters
    day = request.args.get("day")
    game_type = request.args.get("game_type")

    # game_type can be empty - do not filter individual/team activities/games

    # Read the camp data
    camp_data = read_camp_data(camp_name)

    # Check if the camp file exists
    if not camp_data:
        return jsonify({"message": f"Camp file for '{camp_name}' not found."}), 404

     # Filter the games based on the day and game type
    filtered_games = []
    if game_type == "individual":
        if day:
            filtered_games = [
                game for game in camp_data.get("individualActivities", [])
                if game["day"] == day
            ]
        else:
            filtered_games = camp_data.get("individualActivities", [])
    elif game_type == "team":
        if day:
            filtered_games = [
                game for game in camp_data.get("teamGames", [])
                if game["day"] == day
            ]
        else:
            filtered_games = camp_data.get("teamGames", [])
    elif game_type == "":
        # If game_type is empty or unspecified, return both individual and team games for that day (all days)
        if day:
            filtered_games = [
                game for game in camp_data.get("individualActivities", [])
                if game["day"] == day
            ] + [
                game for game in camp_data.get("teamGames", [])
                if game["day"] == day
            ]
        else:
            filtered_games = (
                camp_data.get("individualActivities", []) +
                camp_data.get("teamGames", [])
            )


    # Return the filtered games
    return jsonify(filtered_games)

############################################ APIs #############################################

# Run the Flask app
if __name__ == "__main__":
    app.run(debug=True)