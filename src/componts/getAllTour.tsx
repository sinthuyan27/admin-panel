import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/All Tour.css";

interface Tour {
  _id: string;
  title: string;
  city: string;
  desc: string;
  price: number;
  storage: string;
  maxGroupSize: number;
  image: string;
  reviews: any[];
  featured: boolean;
}

const Tours: React.FC = () => {
  const [tours, setTours] = useState<Tour[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [newTour, setNewTour] = useState<Tour>({
    _id: "",
    title: "",
    city: "",
    desc: "",
    price: 0,
    storage: "10",
    maxGroupSize: 10,
    image: "",
    reviews: [],
    featured: false,
  });
  const [image, setImage] = useState<File | null>(null); 

  useEffect(() => {
    axios
      .get("http://localhost:4000/api/v1/tours")
      .then((response) => {
        setTours(response.data.data);
      })
      .catch((error) => console.error("Error fetching tours:", error));
  }, []);

  const handleAddTour = () => {
    const formData = new FormData();
    formData.append("title", newTour.title);
    formData.append("city", newTour.city);
    formData.append("desc", newTour.desc);
    formData.append("price", newTour.price.toString());
    formData.append("storage", newTour.storage);
    formData.append("maxGroupSize", newTour.maxGroupSize.toString());

    // Append the image if a file is selected
    if (image) {
      formData.append("image", image);
    }

    axios
      .post("http://localhost:4000/api/v1/tours", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((_response) => {
        // Fetch the updated list of tours
        axios
          .get("http://localhost:4000/api/v1/tours")
          .then((response) => {
            setTours(response.data.data); 
          })
          .catch((error) => console.error("Error fetching tours:", error));

        // Reset form and close modal
        setNewTour({
          _id: "",
          title: "",
          city: "",
          desc: "",
          price: 0,
          storage: "10",
          maxGroupSize: 10,
          image: "",
          reviews: [],
          featured: false,
        });
        setImage(null);
        setShowModal(false); 
      })
      .catch((error) => console.error("Error adding tour:", error));
  };

  const handleDeleteTour = async (id: string) => {
    try {
      await axios.delete(`http://localhost:4000/api/v1/tours/${id}`);
      setTours((prevTours) => prevTours.filter((tour) => tour._id !== id));
    } catch (error) {
      console.error("Error deleting tour:", error);
    }
  };

  return (
    <div className="container">
      <h2>Tour List</h2>
      <button className="add-button" onClick={() => setShowModal(true)}>
        Add New Tour
      </button>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>City</th>
            <th>Description</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tours.map((tour) => (
            <tr key={tour._id}>
              <td>{tour._id}</td>
              <td>{tour.title}</td>
              <td>{tour.city}</td>
              <td>{tour.desc}</td>
              <td>{tour.price}</td>
              <td>
                <button className="delete-button" onClick={() => handleDeleteTour(tour._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add Tour Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Add New Tour</h3>
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="modal-form">
                <label>Title:</label>
                <input
                  type="text"
                  value={newTour.title}
                  onChange={(e) => setNewTour({ ...newTour, title: e.target.value })}
                  required
                />
              </div>
              <div className="modal-form">
                <label>City:</label>
                <input
                  type="text"
                  value={newTour.city}
                  onChange={(e) => setNewTour({ ...newTour, city: e.target.value })}
                  required
                />
              </div>
              <div className="modal-form">
                <label>Description:</label>
                <textarea
                  value={newTour.desc}
                  onChange={(e) => setNewTour({ ...newTour, desc: e.target.value })}
                  required
                ></textarea>
              </div>
              <div className="modal-form">
                <label>Price:</label>
                <input
                  type="number"
                  value={newTour.price}
                  onChange={(e) => setNewTour({ ...newTour, price: +e.target.value })}
                  required
                />
              </div>
              <div className="modal-form">
                <label>Tour Image:</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
                />
              </div>
              <div className="modal-actions">
                <button className="cancel-button" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button className="submit-button" onClick={handleAddTour}>
                  Add Tour
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tours;
