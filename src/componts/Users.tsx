import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Users.css";

// User interface
interface User {
  _id: string;
  username: string;
  email: string;
}

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [userIdToDelete, setUserIdToDelete] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get("http://localhost:4000/api/v1/users", { withCredentials: true })
      .then((response) => {
        console.log("API Response:", response.data);
        if (response.data && Array.isArray(response.data.data)) {
          setUsers(response.data.data);
        } else {
          console.error("Unexpected API response structure:", response.data);
          setUsers([]); 
        }
      })
      .catch((error) => console.error("Error fetching users:", error));
  }, []);

  const handleDelete = (id: string) => {
    setUserIdToDelete(id);
    setShowModal(true);
  };

  const confirmDelete = () => {
    if (userIdToDelete) {
      axios
        .delete(`http://localhost:4000/api/v1/users/${userIdToDelete}`)
        .then(() => {
          setUsers((prevUsers) => prevUsers.filter(user => user._id !== userIdToDelete));
          setShowModal(false);
        })
        .catch((error) => {
          console.error("Error deleting user:", error);
          setShowModal(false);
        });
    }
  };

  const cancelDelete = () => setShowModal(false);

  return (
    <div className="content">
      <h2>User List</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users?.map((user, index) => (
            <tr key={user._id}>
              <td>{index + 1}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>
                <button className="delete-button" onClick={() => handleDelete(user._id)}>
                  Hide
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Are you sure you want to delete this user?</h3>
            <div className="modal-actions">
              <button className="modal-button cancel" onClick={cancelDelete}>Cancel</button>
              <button className="modal-button confirm" onClick={confirmDelete}>Confirm</button>
            </div>  
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
