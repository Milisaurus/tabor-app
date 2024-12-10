export const createCamp = async (campName) => {
    try {
        const response = await fetch("http://localhost:5000/api/create-camp", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ campName }),
        });

        if (!response.ok) {
            throw new Error("Couldn't create camp");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Backend error:", error);
        throw error;
    }
};

export const fetchCamps = async () => {
    try {
        const response = await fetch("http://localhost:5000/api/get-camps");
        if (!response.ok) {
            throw new Error("Error while loading camps.");
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error loading camp names:", error);
        throw error;
    }
};

export async function getCamp() {
    const campName = sessionStorage.getItem('camp_name');
    if (!campName) {
        console.log("No camp found in sessionStorage.");
        return null;
    }
    console.log("getCamp: Fetching camp ", campName);

    try {
        const response = await fetch(`http://localhost:5000/api/get-camp-data/${campName}`,{
            method: "GET"    
        });

        if (!response.ok) {
            console.log("Error getCamp:", response.message);
            return null;
        }
        const result = await response.json();
        return result;

    } catch (error) {
        console.error("Error:", error);
        return null;
    }
}

export async function updateCamp(data) {
    const campName = sessionStorage.getItem('camp_name');
    if (!campName) {
        console.log("No camp found in sessionStorage.");
        return null;
    }
    console.log("Updating camp file with name:", campName);
    
    try {
        const response = await fetch(`http://localhost:5000/api/update-camp/${campName}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: data
        });

        if (!response.ok) {
            console.log("Error updateCamp:", response.message);
        }

        const result = await response.json();
        console.log(result.message);

    } catch (error) {
        console.error("Error:", error);
        return null;
    }
}

export async function getTeams() {
    const campData = await getCamp();
    if (campData) {
        return campData.teams;
    }
    return [];
}

export async function updateTeam(teamIndex, updatedTeam, updatedCampData) {
    const campData = await getCamp();

    if (campData) {
        const updatedTeams = [...campData.teams];
        updatedTeams[teamIndex] = updatedTeam;

        const updatedCampDataWithTeams = {
            ...updatedCampData,
            teams: updatedTeams,
        };

        await updateCamp(JSON.stringify(updatedCampDataWithTeams));
    }
}

export async function fetchTeamScores(campData) {
    try {
        const response = await fetch("http://localhost:5000/api/calculate-team-scores", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(campData)
        });

        if (!response.ok) {
            throw new Error("Failed to fetch team scores");
        }

        const scores = await response.json();
        return scores;
    } catch (error) {
        console.error("Error fetching team scores:", error);
        return null;
    }
}

export const addGameTypes = async (campName) => {
    try {
        const response = await fetch(`http://localhost:5000/api/add-game-types/${campName}`, {
            method: "POST",
        });

        if (!response.ok) {
            throw new Error("Faild to create gameTypes.");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("addGameTypes API error:", error);
    }
};
