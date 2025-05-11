import {
  createBrowserRouter, // Function to create a router for web applications
  RouterProvider,      // React component that provides routing context to the app
  Outlet               // Placeholder component for nested routes
} from "react-router-dom";

import Home from "./pages/Home/Home";         // Home page component
import History from "./pages/History/History"; // History page component
import Document from "./pages/Document/Document"; // Document page component
import Navbar from "./components/Navbar/Navbar"; // Navbar component for navigation
import Footer from "./components/Footer/Footer"; // Footer component
import './app.scss';                             // Application-wide SCSS styles
import { AppProvider } from "./AppContext";     // Custom Context provider for state management

// Layout Component
const Layout = () => {
  /**
   * The Layout component defines the overall structure of the app, 
   * including a Navbar at the top, an Outlet for rendering nested routes, 
   * and a Footer at the bottom.
   */
  return (
    <div className="app">
      <Navbar />
      <Outlet /> {/* Placeholder for rendering nested routes */}
      <Footer />
    </div>
  );
};

// Router Configuration
const router = createBrowserRouter([
  {
    path: "/", // Root path
    element: <Layout />, // Use the Layout component for this path
    children: [
      {
        path: "/", // Home page route
        element: <Home />, // Render the Home component
      },
      {
        path: "/history", // History page route
        element: <History />, // Render the History component
      },
      {
        path: "/document/:_id", // Dynamic route for individual documents
        element: <Document />, // Render the Document component
      },
    ],
  },
]);

// Main App Component
function App() {
  /**
   * The App component is the root of the application.
   * It wraps the app in the AppProvider (provides context) and sets up the router.
   */
  return (
    <AppProvider> {/* Provides global state/context */}
      <RouterProvider router={router} /> {/* Provides routing logic */}
    </AppProvider>
  );
}

export default App; // Export the App component as the default export