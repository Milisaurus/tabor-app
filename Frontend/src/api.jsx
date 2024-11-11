import React from 'react';

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

      if (result.path) {
        sessionStorage.setItem('campFilePath', result.path);
        console.log("Path to the JSON file saved in sessionStorage:", result.path);
        } else {
            console.log("No path returned in the server response.");
        }

    } catch (error) {
      console.error("Error:", error);
    }
}

export async function getCamp() {
    const campName = sessionStorage.getItem('campName'); // Retrieve the camp name from session storage
    if (!campName) {
        console.log("No camp name found in sessionStorage.");
        return null; // If camp name is not found, return nothing (null)
    }

    try {
        const response = await fetch(`http://localhost:5000/api/get-camp-data/${campName}`);
        if (!response.ok) {
            // If the response status is not OK, throw an error
            throw new Error(`Error: ${response.statusText}`);
        }
        const result = await response.json();
        return result; // Return the retrieved camp data
    } catch (error) {
        console.error("Error fetching camp data:", error);
        return null; // Return nothing if an error occurs
    }
}