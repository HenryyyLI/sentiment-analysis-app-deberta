import React, { useState, useContext } from 'react';
import './Home.scss'; // Component-specific styles
import { AppContext } from '../../AppContext'; // Global context for managing state
import Button from '@mui/material/Button'; // Material-UI Button component
import Box from '@mui/material/Box'; // Material-UI Box for layout
import CircularProgress from '@mui/material/CircularProgress'; // Material-UI loading spinner
import Alert from '@mui/material/Alert'; // Material-UI Alert for success/error messages
import Dialog from '@mui/material/Dialog'; // Material-UI Dialog for displaying messages

// Home Component
const Home = () => {
    // Access the `fetchAllData` function from the global context
    const { fetchAllData } = useContext(AppContext);

    // Local state variables
    const [isFocused, setIsFocused] = useState(false); // Tracks whether the textarea is focused
    const [text, setText] = useState(''); // Stores the user-entered text
    const [isSubmitting, setIsSubmitting] = useState(false); // Tracks whether a submission is in progress
    const [submissionStatus, setSubmissionStatus] = useState(null); // Tracks the submission status (success or error)

    // Handle Submission
    const handleSubmit = async () => {
        // Set state to indicate submission is in progress
        setIsSubmitting(true);
        setSubmissionStatus(null); // Reset submission status
        setText(text); // Update the state with the current text

        // If the input is empty, set an error status and stop execution
        if (!text.trim()) {
            setSubmissionStatus('error');
            return;
        }

        try {
            // Send POST request to the backend with the entered text
            const response = await fetch('http://localhost:5000/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // Specify JSON content type
                },
                body: JSON.stringify({ text }), // Send the text as JSON
            });

            // Update the submission status based on the server response
            if (response.ok) {
                setSubmissionStatus('success'); // Set success status
                setText(''); // Clear the input field
            } else {
                setSubmissionStatus('error'); // Set error status
            }
            
        } catch (err) {
            console.error("Error during submission:", err);
            setSubmissionStatus('error'); // Set error status on exception
        } finally {
            setIsSubmitting(false); // Reset the submitting state
            fetchAllData(); // Refresh the global data
        }
    };

    // Render Component
    return (
        <div className="home">
            {/* Main Content */}
            <div className="content">
                {/* Logo */}
                <div className="logo">
                    <img src="/img/logo.svg" alt="Logo" />
                </div>
                {/* Text Area */}
                <div className="textArea">
                    <Box
                        sx={{
                            borderRadius: "5px",
                            overflow: "hidden",
                            padding: "8px",
                            border: "1px solid transparent",
                            transition: "box-shadow 0.2s ease",
                            boxShadow: "0 0 0 1px #ccc",
                            ":focus-within": {
                                boxShadow: "0 0 0 2px #1976d2", // Highlight box when focused
                            },
                        }}
                        className="textField"
                    >
                        {/* User Input Textarea */}
                        <textarea
                            onFocus={() => setIsFocused(true)} // Track when the textarea is focused
                            onBlur={() => setIsFocused(false)} // Track when the textarea loses focus
                            value={text} // Bind to the `text` state
                            onChange={(e) => setText(e.target.value)} // Update state on user input
                            placeholder="Please Enter Your Press Release Here." // Placeholder text
                        />
                    </Box>
                    {/* Buttons */}
                    <div className="buttons">
                        {/* Reset Button */}
                        <Button 
                            sx={{ textTransform: 'none', boxShadow: 'none' }} 
                            variant="contained" 
                            onClick={() => setText('')} // Clear the textarea
                        >
                            Reset
                        </Button>
                        {/* Submit Button */}
                        <Button 
                            sx={{ textTransform: 'none', boxShadow: 'none' }}
                            variant="contained"
                            onClick={handleSubmit} // Trigger the submission function
                            disabled={isSubmitting} // Disable button while submitting
                        >
                            {isSubmitting ? (
                                // Show loading spinner if submission is in progress
                                <Box sx={{ display: 'flex' }}>
                                    <CircularProgress />
                                </Box>
                            ) : (
                                'Submit'
                            )}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Submission Success Dialog */}
            <Dialog
                open={submissionStatus === 'success'} // Show dialog if submission is successful
                onClose={() => setSubmissionStatus(null)} // Close dialog when dismissed
            >
                <Alert severity="success">Submission Successful!</Alert>
            </Dialog>

            {/* Submission Error Dialog */}
            <Dialog
                open={submissionStatus === 'error'} // Show dialog if submission fails
                onClose={() => setSubmissionStatus(null)} // Close dialog when dismissed
            >
                <Alert severity="error">Submission Failed. Please try again.</Alert>
            </Dialog>
        </div>
    );
};

export default Home; // Export the Home component
