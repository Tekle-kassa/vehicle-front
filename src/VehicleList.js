import React, { useState } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";

// AllVehicle component to display vehicles
const AllVehicle = () => {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editableStatus, setEditableStatus] = useState(null);
    const [selectedVehicleId, setSelectedVehicleId] = useState(null);
    const [updateMessage, setUpdateMessage] = useState("");

    // Backend URL for fetching vehicles
    const backendUrl =
        "https://vehicle-dashboard-backend-u0j5.onrender.com/api/vehicles";

    // Fetch vehicles from backend
    const fetchVehicles = async () => {
        try {
            const response = await axios.get(backendUrl);
            setVehicles(response.data.data.vehicles);
        } catch (err) {
            setError("Failed to fetch vehicles.");
        } finally {
            setLoading(false);
        }
    };

    // Fetch vehicles on component mount
    React.useEffect(() => {
        fetchVehicles();
    }, []);

    const handleDelete = (id) => {
        // Implement delete functionality
        alert(`Delete vehicle with ID: ${id}`);
    };

    const handleEdit = (id, currentStatus) => {
        // Toggle the editable state only when the edit icon is clicked
        setSelectedVehicleId(id);
        setEditableStatus(currentStatus);
    };

    const handleStatusChange = async (event) => {
        const updatedStatus = event.target.value;
        setEditableStatus(updatedStatus);

        // Optionally, update the status in the backend
        try {
            await axios.put(`${backendUrl}/${selectedVehicleId}`, {
                status: updatedStatus,
            });
            setUpdateMessage("Status updated successfully!");
            setTimeout(() => setUpdateMessage(""), 3000); // Hide message after 3 seconds
            // Reset editable status after update
            setSelectedVehicleId(null);
            setEditableStatus(null);
        } catch (err) {
            setError("Failed to update status.");
        }
    };

    if (loading) {
        return <p>Loading vehicles...</p>;
    }

    if (error) {
        return <p className="text-red-500">{error}</p>;
    }

    return (
        <div>
            <h3 className="text-xl font-bold mb-4">Vehicle List</h3>
            {/* Display success message */}
            {updateMessage && (
                <div className="bg-green-500 text-white p-2 rounded mb-4">
                    {updateMessage}
                </div>
            )}
            <table className="min-w-full bg-white border border-gray-300">
                <thead>
                    <tr>
                        <th className="border px-4 py-2">Name</th>
                        <th className="border px-4 py-2">Status</th>
                        <th className="border px-4 py-2">Created At</th>
                        <th className="border px-4 py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {vehicles.map((vehicle) => (
                        <tr key={vehicle._id} className="border-t">
                            <td className="border px-4 py-2">{vehicle.name}</td>
                            <td className="border px-4 py-2">
                                {selectedVehicleId === vehicle._id ? (
                                    <select
                                        value={editableStatus}
                                        onChange={handleStatusChange}
                                        className="border px-2 py-1 rounded"
                                    >
                                        <option value="active">Active</option>
                                        <option value="inactive">
                                            Inactive
                                        </option>
                                        <option value="maintenance">
                                            Maintenance
                                        </option>
                                    </select>
                                ) : (
                                    vehicle.status
                                )}
                            </td>
                            <td className="border px-4 py-2">
                                {new Date(
                                    vehicle.createdAt
                                ).toLocaleDateString()}{" "}
                                {new Date(
                                    vehicle.createdAt
                                ).toLocaleTimeString()}
                            </td>
                            <td className="border px-4 py-2 flex justify-around">
                                <button
                                    onClick={() =>
                                        handleEdit(vehicle._id, vehicle.status)
                                    }
                                    className="text-blue-500 hover:text-blue-700"
                                >
                                    <FaEdit />
                                </button>
                                {/* <button
                                    onClick={() => handleDelete(vehicle._id)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    <FaTrash />
                                </button> */}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AllVehicle;
