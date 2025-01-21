// API
// Authors: Milan Vrbas <xvrbas01>, Jan Juračka <xjurac07>

// API to create a new camp
export const createCamp = async (campName) => {
    try {
        const response = await fetch(`https://Milisaurus.pythonanywhere.com/api/create-camp/${campName}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
            throw new Error("Couldn't create camp");
        }

        // Return the response data
        return await response.json();
    } 
    catch (error) {
        console.error("Backend error:", error);
        throw error;
    }
};

// API to fetch the list of camps
export const fetchCamps = async () => {
    try {
        const response = await fetch("http://localhost:5000/api/get-camps", {
            method: "GET",
            headers: {"Content-Type": "application/json",},
        });

        if (!response.ok) {
            throw new Error("Error while loading camps.");
        }

        // Return the response data
        return await response.json();
    } 
    catch (error) {
        console.error("Error:", error);
        throw error;
    }
};

// API to fetch camp data
export const getCamp = async () => {
    const campName = sessionStorage.getItem('camp_name');

    // Check if the campName is found in sessionStorage
    if (!campName) {
        console.log("No camp found in sessionStorage.");
        return null;
    }

    try {
        const response = await fetch(`http://localhost:5000/api/get-camp-data/${campName}`, {
            method: "GET",
            headers: {"Content-Type": "application/json",},
        });

        if (!response.ok) {
            console.log("Error getCamp:", response.message);
            return null;
        }

        // Return the response data
        console.log("Camp data received successfully");
        return await response.json();
    } 
    catch (error) {
        console.error("Error:", error);
        return null;
    }
};

// API to update camp data
export const updateCamp = async (data) => {
    const campName = sessionStorage.getItem('camp_name');

    // Check if the campName is found in sessionStorage
    if (!campName) {
        console.log("No camp found in sessionStorage.");
        return null;
    }

    try {
        const response = await fetch(`http://localhost:5000/api/update-camp/${campName}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: data,
        });

        if (!response.ok) {
            throw new Error("Error updating camp data.");
        }

        const result = await response.json();
        console.log(result.message);

    } 
    catch (error) {
        console.error("Error:", error);
        return null;
    }
};

// API to fetch teams from the current camp data
export const getTeams = async () => {
    // Fetch the current camp data
    const campData = await getCamp();

    // If camp data is found, return the teams array; otherwise, return an empty array
    return campData ? campData.teams : [];
};

// API to update a specific team's data
export const updateTeam = async (teamIndex, updatedTeam, updatedCampData) => {
    // Fetch the current camp data
    const campData = await getCamp();

    if (campData) {
        // Create a copy of the teams array and update the team at the specified index
        const updatedTeams = [...campData.teams];
        updatedTeams[teamIndex] = updatedTeam;

        // Create an updated camp data object with the modified teams array
        const updatedCampDataWithTeams = {
            ...updatedCampData,
            teams: updatedTeams,
        };

        // Update the camp with the modified data
        await updateCamp(JSON.stringify(updatedCampDataWithTeams));
    }
};

// API to fetch the team scores for a specific camp
export const fetchTeamScores = async (campName) => {
    try {
        const response = await fetch(`http://localhost:5000/api/calculate-team-scores/${campName}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch team scores");
        }

        console.log("Scores received successfully");
        // Return the team scores
        return await response.json();
    } 
    catch (error) {
        console.error("Error fetching team scores:", error);
        return null;
    }
};

// API to add game types to a specific camp
export const addGameTypes = async (campName) => {
    try {
        const response = await fetch(`http://localhost:5000/api/add-game-types/${campName}`, {
            method: "POST",
            headers: {"Content-Type": "application/json",},
        });

        if (!response.ok) {
            throw new Error("Failed to create gameTypes.");
        }

        // Return the team scores
        return await response.json();
    } 
    catch (error) {
        console.error("addGameTypes API error:", error);
    }
};

// API to fetch filtered activities based on day and game type
export const fetchFilteredActivities = async (campName, day, gameType) => {
    try {
        const response = await fetch(`http://localhost:5000/api/get-filtered-activities/${campName}?day=${day}&game_type=${gameType}`, {
            method: "GET",
            headers: {"Content-Type": "application/json",},
        });

        if (!response.ok) {
            throw new Error("Error fetching filtered activities.");
        }

        // Return the filtered activities
        console.log("Filtered camp games received successfully");
        return await response.json();
    } 
    catch (error) {
        console.error("Error fetching filtered activities:", error);
        throw error;
    }
};