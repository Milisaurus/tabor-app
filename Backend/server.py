from flask import Flask, request, json, jsonify
from flask_cors import CORS
import json
import os

app = Flask(__name__)


CORS(app, origins=["http://localhost:5173"])  # Povolení CORS pro frontend běžící na portu 5173

# folder name with JSON files
CAMPS_DIR = "camps"

@app.route("/api/create-camp", methods=["POST"])
def create_camp():
    data = request.json  # Získání JSON dat z požadavku
    camp_name = data.get("campName")  # Získání názvu kempu z JSON

    camp_file_path = os.path.join(CAMPS_DIR, f"camp_{camp_name}.json")
    with open(camp_file_path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=4)

     # Write camp name on terminal
    print(f"New camp '{camp_name}' successfully created")

    # Send a response
    return jsonify({"message": f"Camp '{camp_name}' was received successfully"}), 200

if __name__ == "__main__":
    app.run(debug=True)