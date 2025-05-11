import React, { useState, useEffect, Fragment } from 'react';
import { useParams } from "react-router-dom"; // React Router hook to access route parameters
import './Document.scss'; // Component-specific styles
import Typography from "@mui/material/Typography"; // Material-UI Typography for text styling
import Box from "@mui/material/Box"; // Material-UI Box for layout
import Tooltip from "@mui/material/Tooltip"; // Material-UI Tooltip for hoverable tooltips
import * as echarts from "echarts"; // ECharts library for rendering charts
import "echarts-wordcloud"; // Word cloud plugin for ECharts

// Document Component
const Document = () => {
    // React state to store fetched document data
    const [data, setData] = useState(null);

    // Extract `_id` from route parameters
    const { _id } = useParams();

    // Fetch Document Data
    useEffect(() => {
        // Function to fetch document data from the backend using the `_id`
        const fetchData = async (_id) => {
            try {
                // Construct query parameters
                const params = new URLSearchParams();
                if (_id) {
                    params.append("_id", _id);
                }

                // Fetch data from the backend API
                const response = await fetch(`http://127.0.0.1:5000/?${params.toString()}`);
                if (!response.ok) {
                    // Throw error for non-2xx HTTP responses
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                // Parse response as JSON and update the `data` state
                const result = await response.json();
                setData(result.data[0]);
            } catch (err) {
                // Log any errors to the console
                console.error("Error fetching data:", err);
            }
        };

        // Trigger data fetching
        fetchData(_id);
    }, [_id]); // Re-run effect when `_id` changes

    // Highlight Sentiment Words in Text
    const getHighlightedText = (text, posWords, negWords, posDict, negDict) => {
        // If no text is available, return it as-is
        if (!text) return text;

        // Combine positive and negative words
        const allWords = [...posWords, ...negWords];

        // Create a regular expression to match these words
        const regex = new RegExp(`(${allWords.join("|")})`, "gi");

        // Split text into lines for rendering
        const lines = text.split("\n");

        // Process each line of text and highlight sentiment words
        return lines.map((line, lineIndex) => (
            <Fragment key={lineIndex}>
                {line.split(regex).map((part, index) => {
                    // Highlight positive words with tooltips
                    if (posWords.includes(part)) {
                        const tooltipContent = `Score: ${posDict[part]?.score || 0}`;
                        return (
                            <Tooltip
                                key={`${lineIndex}-${index}`}
                                title={<Typography sx={{ fontSize: "14px" }}>{tooltipContent}</Typography>}
                                arrow
                            >
                                <Typography
                                    component="span"
                                    sx={{
                                        backgroundColor: "lightgreen",
                                        padding: "2px 4px",
                                        borderRadius: "4px",
                                        margin: "0 2px",
                                        fontWeight: "bold",
                                    }}
                                >
                                    {part}
                                </Typography>
                            </Tooltip>
                        );
                    }

                    // Highlight negative words with tooltips
                    if (negWords.includes(part)) {
                        const tooltipContent = `Score: ${negDict[part]?.score || 0}`;
                        return (
                            <Tooltip
                                key={`${lineIndex}-${index}`}
                                title={<Typography sx={{ fontSize: "14px" }}>{tooltipContent}</Typography>}
                                arrow
                            >
                                <Typography
                                    component="span"
                                    sx={{
                                        backgroundColor: "lightcoral",
                                        padding: "2px 4px",
                                        borderRadius: "4px",
                                        margin: "0 2px",
                                        fontWeight: "bold",
                                    }}
                                >
                                    {part}
                                </Typography>
                            </Tooltip>
                        );
                    }

                    // Render non-highlighted text normally
                    return <Typography component="span" key={`${lineIndex}-${index}`}>{part}</Typography>;
                })}
                {lineIndex < lines.length - 1 && <br />} {/* Add line breaks between lines */}
            </Fragment>
        ));
    };

    // Render Word Clouds
    const renderWordCloud = (id, words) => {
        // Initialize the ECharts instance
        const chartDom = document.getElementById(id);
        const myChart = echarts.init(chartDom);

        // Define word cloud chart options
        const option = {
            tooltip: {
                show: true,
                formatter: (params) => `${params.name}<br>Score: ${params.value}`, // Display word score in tooltip
            },
            series: [
                {
                    type: "wordCloud", // Word cloud chart type
                    shape: "circle", // Shape of the word cloud
                    sizeRange: [12, 50], // Font size range
                    rotationRange: [-90, 90], // Word rotation angles
                    textStyle: {
                        fontFamily: "sans-serif",
                        fontWeight: "bold",
                        color: () => {
                            // Generate random colors for words
                            return `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)})`;
                        },
                    },
                    data: words, // Words and their associated scores
                },
            ],
        };

        // Set the chart options
        myChart.setOption(option);
    };

    // Generate Word Clouds When Data Changes
    useEffect(() => {
        if (data) {
            // Map positive words and scores for word cloud
            const posWords = Object.entries(data.pos_dict || {}).map(([word, metrics]) => ({
                name: word,
                value: metrics.score || 1,
            }));

            // Map negative words and scores for word cloud
            const negWords = Object.entries(data.neg_dict || {}).map(([word, metrics]) => ({
                name: word,
                value: metrics.score || 1,
            }));

            // Render word clouds for positive and negative dictionaries
            renderWordCloud("posWordCloud", posWords);
            renderWordCloud("negWordCloud", negWords);
        }
    }, [data]); // Re-run effect when `data` changes

    // Render Component
    return (
        <div className="document">
            {/* Left side for word clouds */}
            <div className="left">
                {/* Positive Word Cloud */}
                <div className="plot">
                    <div className="title-bar">
                        <div className="bar"></div>
                        <div className="plot-title">Positive Sentiment Dictionary</div>
                    </div>
                    <div
                        id="posWordCloud"
                        style={{
                            width: "100%",
                            height: "300px",
                        }}
                    ></div>
                </div>
                {/* Negative Word Cloud */}
                <div className="plot">
                    <div className="title-bar">
                        <div className="bar"></div>
                        <div className="plot-title">Negative Sentiment Dictionary</div>
                    </div>
                    <div
                        id="negWordCloud"
                        style={{
                            width: "100%",
                            height: "300px",
                        }}
                    ></div>
                </div>
            </div>

            {/* Right side for text analysis */}
            <Box 
                sx={{
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                    padding: "16px",
                    overflowY: "auto",
                    overflowX: "hidden",
                    width: "100%",
                    height: "calc(100vh + 20px)",
                    maxHeight: "calc(100vh + 20px)",
                }}
                className="right"
            >
                {data ? (
                    <Typography variant="text">
                        {getHighlightedText(
                            data.text, // Original text
                            Object.keys(data.pos_dict || {}), // Positive words
                            Object.keys(data.neg_dict || {}), // Negative words
                            data.pos_dict || {}, // Positive word metadata
                            data.neg_dict || {} // Negative word metadata
                        )}
                    </Typography>
                ) : (
                    <Typography variant="text">Loading or no data available</Typography> // Fallback text
                )}
            </Box>
        </div>
    );
};

export default Document;