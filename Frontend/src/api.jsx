export async function createCamp(data) {
    try {
        const response = await fetch("http://localhost:5000/api/create-camp", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: data
        });

        const result = await response.json();
        console.log(result.message);

        if (result.name) {
            sessionStorage.setItem('camp_name', result.name);
        } else {
            console.log("No camp_name returned in the server response.");
        }
        console.log("Current camp_name stored in sessionStorage: ", result.name);

    } catch (error) {
      console.error("Error:", error);
    }
}

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