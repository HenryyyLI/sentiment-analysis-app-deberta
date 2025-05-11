import React, { useState, useEffect, useContext } from 'react';
import './History.scss'; // Component-specific styles
import { AppContext } from '../../AppContext'; // Application-wide context for managing data
import { useNavigate } from 'react-router-dom'; // React Router hook for navigation
import Table from '@mui/material/Table'; // Material-UI Table for structured data display
import TableBody from '@mui/material/TableBody'; 
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper'; // Material-UI Paper for container background
import Button from '@mui/material/Button'; // Material-UI Button for operations
import Box from '@mui/material/Box'; // Material-UI Box for layout
import CircularProgress from '@mui/material/CircularProgress'; // Loading spinner
import Alert from '@mui/material/Alert'; // Alert for success/error messages
import Dialog from '@mui/material/Dialog'; // Modal Dialog for confirmation prompts
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

// History Component
const History = () => {
    // React Router hook to handle navigation
    const navigate = useNavigate();

    // Access global state and fetch function from context
    const { data, fetchAllData } = useContext(AppContext);

    // Local state variables
    const [open, setOpen] = useState(false); // Controls the visibility of the delete confirmation dialog
    const [isDeleting, setIsDeleting] = useState(false); // Tracks whether a delete operation is in progress
    const [deletionStatus, setDeletionStatus] = useState(null); // Tracks the success or failure of deletion
    const [selectedId, setSelectedId] = useState(null); // Stores the `_id` of the document to be deleted

    // Fetch All Data on Component Mount
    useEffect(() => {
        fetchAllData(); // Fetch data from the backend using the context function
    }, []); // Runs only once when the component is mounted

    // Handle Delete Operation
    const handleDelete = async (_id) => {
        
        setIsDeleting(true);     // Set deletion state to "in progress"
        setDeletionStatus(null); // Reset deletion status

        try {
            // Create query string with `_id`
            const params = new URLSearchParams();
            if (_id) {
                params.append("_id", _id);
            }

            // Send DELETE request to the backend API
            const response = await fetch(`http://localhost:5000/delete?${params.toString()}`);

            // Update deletion status based on the response
            if (response.ok) {
                setDeletionStatus('success');
            } else {
                setDeletionStatus('error');
            }
            
        } catch (err) {
            console.error("Error deleting data:", err);
            setDeletionStatus('error'); // Handle errors during fetch
        } finally {
            // Reset states after operation
            setIsDeleting(false);
            setOpen(false);
            fetchAllData(); // Refresh the table data
        }
    };

    // Render Component
    return (
        <div className="history">
            {/* Table Container */}
            <TableContainer 
                component={Paper} 
                sx={{
                    margin: '0 auto',
                    width: 1200,
                    maxHeight: '50vh', // Limit table height
                    overflowY: 'auto', // Enable vertical scrolling
                }} 
                className="table"
            >
                {/* Table */}
                <Table sx={{ tableLayout: 'fixed' }} aria-label="Documents Table">
                    {/* Table Header */}
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ width: '5%', fontWeight: 'bold' }}></TableCell>
                            <TableCell sx={{ width: '15%', fontWeight: 'bold' }}>Sentimental Label</TableCell>
                            <TableCell sx={{ width: '20%', fontWeight: 'bold' }}>Submit Time</TableCell>
                            <TableCell sx={{ width: '45%', fontWeight: 'bold' }}>Press Release</TableCell>
                            <TableCell sx={{ width: '15%', fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Operation</TableCell>
                        </TableRow>
                    </TableHead>
                    {/* Table Body */}
                    <TableBody>
                        {/* Map through the data array to render each document */}
                        {data?.map((document, index) => (
                            <TableRow
                                key={document._id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                {/* Row Index */}
                                <TableCell sx={{ maxHeight: "50px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                    {index + 1}
                                </TableCell>
                                {/* Sentimental Label */}
                                <TableCell sx={{ maxHeight: "50px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                    {document.sent_lab || 'N/A'}
                                </TableCell>
                                {/* Submit Time */}
                                <TableCell sx={{ maxHeight: "50px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                    {document.submit_time || 'N/A'}
                                </TableCell>
                                {/* Document Text */}
                                <TableCell sx={{ maxHeight: "50px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                    {document.text || 'N/A'}
                                </TableCell>
                                {/* Operations (Details & Delete Buttons) */}
                                <TableCell sx={{ maxHeight: "50px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                    <Button 
                                        sx={{ textTransform: 'none', boxShadow: 'none' }}
                                        className="operation"
                                        onClick={() => {navigate(`/document/${document._id}`)}} // Navigate to the document details page
                                    >
                                        Details
                                    </Button>
                                    <Button 
                                        sx={{ textTransform: 'none', boxShadow: 'none' }}
                                        className="operation"
                                        onClick={() => {
                                            setOpen(true); // Open the delete confirmation dialog
                                            setSelectedId(document._id); // Set the selected document's `_id`
                                        }}
                                    >
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Delete Confirmation Dialog */}
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle id="alert-dialog-title">
                    {"Confirm Deletion"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to delete this news article? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button 
                        sx={{ textTransform: 'none', boxShadow: 'none' }}
                        variant="contained"
                        onClick={() => handleDelete(selectedId)} // Trigger the delete operation
                        disabled={isDeleting} // Disable button if deletion is in progress
                        autoFocus             
                    >
                        {isDeleting ? (
                            <Box sx={{ display: 'flex' }}>
                                <CircularProgress /> {/* Show a spinner during deletion */}
                            </Box>
                        ) : (
                            'Confirm'
                        )}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Success Alert Dialog */}
            <Dialog open={deletionStatus === 'success'} onClose={() => setDeletionStatus(null)}>
                <Alert severity="success">Deletion Successful!</Alert>
            </Dialog>

            {/* Error Alert Dialog */}
            <Dialog open={deletionStatus === 'error'} onClose={() => setDeletionStatus(null)}>
                <Alert severity="error">Deletion Failed. Please try again.</Alert>
            </Dialog>
        </div>
    )
}

export default History;
