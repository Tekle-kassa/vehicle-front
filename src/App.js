import React, { useState } from "react";
import axios from "axios";
import AllVehicle from "./VehicleList";

const App = () => {
    const [activeTab, setActiveTab] = useState("create");
    const [isOverlayOpen, setIsOverlayOpen] = useState(false);

    // Create form states
    const [name, setName] = useState("");
    const [status, setStatus] = useState("active");
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState(null); // For success or error messages

    // Dummy URL for POST request (replace with your backend endpoint)
    const backendUrl = "https://vehicle-dashboard-backend-u0j5.onrender.com/api/vehicles";

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setIsOverlayOpen(true); // Open overlay when switching tabs
        setMessage(null); // Reset any previous messages
    };

    const handleCreateVehicle = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage(null); // Reset previous message

        // Prepare data to send
        const vehicleData = { name, status };

        try {
            // Send POST request using Axios
            const response = await axios.post(backendUrl, vehicleData);

            // Handle success
            setIsLoading(false);
            setMessage({
                type: "success",
                text: "Vehicle created successfully!",
            });
            setName(""); // Reset form fields
            setStatus("active");
        } catch (err) {
            setIsLoading(false);
            setMessage({
                type: "error",
                text: err.message || "An error occurred",
            });
        }
    };

    const renderOverlayContent = () => {
        switch (activeTab) {
            case "create":
                return (
                    <form onSubmit={handleCreateVehicle} className="space-y-4">
                        <h2 className="text-xl font-bold mb-4">Create a New Vehicle</h2>

                        <div>
                            <label className="block text-sm font-medium">Vehicle Name</label>
                            <input
                                type="text"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium">Vehicle Status</label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                                required
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                                <option value="maintenance">Maintenance</option>
                            </select>
                        </div>

                        <div className="flex justify-between">
                            <button
                                type="submit"
                                className="bg-blue-500 text-white py-2 px-4 rounded"
                                disabled={isLoading}
                            >
                                {isLoading ? "Creating..." : "Create Vehicle"}
                            </button>
                            <button
                                type="button"
                                className="bg-gray-500 text-white py-2 px-4 rounded"
                                onClick={() => setIsOverlayOpen(false)}
                            >
                                Close
                            </button>
                        </div>
                    </form>
                );
            case "fetching":
                return <AllVehicle />;
            default:
                return null;
        }
    };

    const renderMessage = () => {
        if (message) {
            return (
                <div
                    className={`mt-4 p-4 rounded ${
                        message.type === "success"
                            ? "bg-green-500 text-white"
                            : "bg-red-500 text-white"
                    }`}
                >
                    <p>{message.text}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
            <div className="tabs mb-6">
                <button
                    onClick={() => handleTabChange("create")}
                    className={`tab ${
                        activeTab === "create" ? "bg-blue-500 text-white" : ""
                    } p-4 mx-2`}
                >
                    Create
                </button>
                <button
                    onClick={() => handleTabChange("fetching")}
                    className={`tab ${
                        activeTab === "fetching" ? "bg-blue-500 text-white" : ""
                    } p-4 mx-2`}
                >
                    Fetching
                </button>
            </div>

            {isOverlayOpen && (
                <div
                    className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
                    onClick={() => setIsOverlayOpen(false)}
                >
                    <div
                        className="bg-white p-6 rounded shadow-lg max-w-lg w-full"
                        onClick={(e) => e.stopPropagation()} // Prevent closing overlay when clicking inside it
                    >
                        {renderOverlayContent()}
                        {renderMessage()}
                    </div>
                </div>
            )}
        </div>
    );
};

export default App;
