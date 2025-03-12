import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/guide.css"

// Define a Guide interface
interface Guide {
  name: string;
  experience: number;
  languages: string[];
}

const GuideCRUD: React.FC = () => {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newGuide, setNewGuide] = useState<Guide>({
    name: "",
    experience: 0,
    languages: [""],
  });

  // Fetch guides when the component mounts
  useEffect(() => {
    axios
      .get("http://localhost:4000/guide")
      .then((response) => {
        setGuides(response.data.data);
      })
      .catch((error) => console.error("Error fetching guides:", error));
  }, []);

  // Handle creating a new guide
  const handleAddGuide = async () => {
    try {
      // Only send necessary data (don't include _id)
      await axios.post("http://localhost:4000/guide", newGuide);
      setGuides([...guides, newGuide]); // Add the new guide to the state
      setShowAddModal(false); // Close the modal
      setNewGuide({ name: "", experience: 0, languages: [""] }); // Reset the form
    } catch (error) {
      console.error("Error adding guide:", error);
    }
  };

  return (
    <div className="container">
      <h2>Manage Guides</h2>

      {/* Button to open the Create Guide modal */}
      <button className="create-btn" onClick={() => setShowAddModal(true)}>
        Create Guide
      </button>

      {/* Display the list of guides */}
      <table className="guide-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Experience</th>
            <th>Languages</th>
          </tr>
        </thead>
        <tbody>
          {guides.map((guide, index) => (
            <tr key={index}>
              <td>{guide.name}</td>
              <td>{guide.experience} years</td>
              <td>{guide.languages.join(", ")}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add Guide Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Create New Guide</h3>
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                value={newGuide.name}
                onChange={(e) =>
                  setNewGuide({ ...newGuide, name: e.target.value })
                }
                placeholder="Enter guide name"
                required
              />
            </div>
            <div className="form-group">
              <label>Experience (years)</label>
              <input
                type="number"
                value={newGuide.experience}
                onChange={(e) =>
                  setNewGuide({ ...newGuide, experience: +e.target.value })
                }
                placeholder="Enter experience"
                required
              />
            </div>
            <div className="form-group">
              <label>Languages</label>
              <input
                type="text"
                value={newGuide.languages.join(", ")}
                onChange={(e) =>
                  setNewGuide({
                    ...newGuide,
                    languages: e.target.value.split(","),
                  })
                }
                placeholder="Enter languages (comma separated)"
                required
              />
            </div>
            <div className="modal-actions">
              <button
                className="cancel-btn"
                onClick={() => setShowAddModal(false)}
              >
                Close
              </button>
              <button className="submit-btn" onClick={handleAddGuide}>
                Add Guide
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GuideCRUD;
