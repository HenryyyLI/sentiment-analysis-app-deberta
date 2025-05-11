import React, { createContext, useState } from 'react';

// Context Creation
export const AppContext = createContext();
/**
 * AppContext is the context object that will be used to provide global state and functions
 * across the application via the Context API.
 */

// AppProvider Component
export const AppProvider = ({ children }) => {
  /**
   * The AppProvider component wraps its children and provides global state and functions
   * using the Context API.
   */

  // State to hold the application-wide data
  const [data, setData] = useState([]);

  /**
   * fetchAllData:
   * - Fetches all data from the backend API (`/all` endpoint).
   * - Updates the `data` state with the fetched result.
   * - Handles potential HTTP or network errors gracefully.
   */
  const fetchAllData = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/all`); // Sends GET request to the backend API
      if (!response.ok) {
        // If the response status is not 2xx, throw an error
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json(); // Parse the response as JSON
      setData(result.data); // Update the state with the fetched data
    } catch (err) {
      console.error("Error fetching data:", err); // Log any errors
    }
  };

  /**
   * The value object contains:
   * - `data`: The global state for the app's data.
   * - `setData`: A state updater function for `data`.
   * - `fetchAllData`: A function to fetch data from the API.
   * These are provided to all components wrapped by AppProvider.
   */
  return (
    <AppContext.Provider value={{ data, setData, fetchAllData }}>
      {children} {/* Render children components inside the context provider */}
    </AppContext.Provider>
  );
};