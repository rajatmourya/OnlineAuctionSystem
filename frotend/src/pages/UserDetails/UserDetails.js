import React, { useEffect, useState } from "react";
import "./UserDetails.css";
import userService from "../../services/userService";

function UserDetails() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getAllUsers();
      setUsers(data);
      setError("");
    } catch (err) {
      const errorMessage = err?.error || err?.message || "Failed to fetch users";
      setError(errorMessage);
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleString();
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className="page-content">
      <div className="table-container">
        <h2 className="page-heading">USER DETAILS</h2>

        {loading ? (
          <p className="no-data">Loading users...</p>
        ) : error ? (
          <p className="no-data" style={{ color: "red" }}>{error}</p>
        ) : users.length === 0 ? (
          <p className="no-data">No users registered</p>
        ) : (
          <table className="auction-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Address</th>
                <th>Role</th>
                <th>Status</th>
                <th>Registration Time</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name || "N/A"}</td>
                  <td>{user.email}</td>
                  <td>{user.mobileNumber || "N/A"}</td>
                  <td>{user.address || "N/A"}</td>
                  <td>{user.role || "N/A"}</td>
                  <td>{user.active ? "Active" : "Inactive"}</td>
                  <td>{formatDate(user.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default UserDetails;
