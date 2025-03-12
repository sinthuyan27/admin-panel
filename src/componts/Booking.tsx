import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Booking.css";

interface Booking {
  status: string;
  _id: string;
  fullName: string;
  phone: string;
  userEmail: string;
  tourName: string;
  guestSize: number;
  assignedGuide?: string;
  possiblePlaces?: string[];
 
}

interface Guide {
  _id: string;
  name: string;
}

const Book: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [guides, setGuides] = useState<Guide[]>([]);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [currentBooking, setCurrentBooking] = useState<Booking | null>(null);

  useEffect(() => {
    // Fetch bookings
    axios
      .get("http://localhost:4000/api/v1/booking")
      .then((response) => setBookings(response.data.data))
      .catch((error) => console.error("Error fetching bookings:", error));

    // Fetch guides
    axios
      .get("http://localhost:4000/guide")
      .then((response) => setGuides(response.data.data))
      .catch((error) => console.error("Error fetching guides:", error));
  }, []);

  // Open edit modal
  const handleEditBooking = (booking: Booking) => {
    setCurrentBooking(booking);
    setShowEditModal(true);
  };

  // Handle form submission for assigning a guide and updating status
  const handleEditSubmit = async () => {
    if (currentBooking) {
      const { _id, assignedGuide, status, possiblePlaces } = currentBooking;
  
      try {
        await axios.put(`http://localhost:4000/api/v1/booking/${_id}`, {
          guideId: assignedGuide,
          status, // Use the status from the form
          possiblePlaces, // Use possible places if available
        });
  
        // Update local state with the new booking details
        setBookings((prevBookings) =>
          prevBookings.map((booking) =>
            booking._id === _id ? { ...booking, assignedGuide, status } : booking
          )
        );
        setShowEditModal(false);
        setCurrentBooking(null);
        alert("Booking updated successfully");
      } catch (error) {
        console.error("Error updating booking:", error);
        alert("Error updating booking");
      }
    }
  };
  

  return (
    <div className="content">
      <h2>Admin Dashboard</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Full Name</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Tour Name</th>
            <th>Guest Size</th>
            <th>Action</th>
            <th>Status</th>
            {/* <th>Guide</th> */}
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking, index) => (
            <tr key={booking._id}>
              <td>{index + 1}</td>
              <td>{booking.fullName}</td>
              <td>{booking.phone}</td>
              <td>{booking.userEmail}</td>
              <td>{booking.tourName}</td>
              <td>{booking.guestSize}</td>
              <td>{booking.status}</td>
              {/* <td>{booking.assignedGuide}</td> */}
              <td>
                <button className="edit-button" onClick={() => handleEditBooking(booking)}>
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Modal */}
      {showEditModal && currentBooking && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Edit Booking</h3>
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="modal-form">
                <label>Full Name:</label>
                <input
                  type="text"
                  value={currentBooking.fullName}
                  readOnly
                />
              </div>
              <div className="modal-form">
                <label>Phone:</label>
                <input
                  type="text"
                  value={currentBooking.phone}
                  readOnly
                />
              </div>
              <div className="modal-form">
                <label>Status:</label>
                <select
                  value={currentBooking.status}
                  onChange={(e) => setCurrentBooking({ ...currentBooking, status: e.target.value })}
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div className="modal-form">
                <label>Assign Guide:</label>
                <select
                  value={currentBooking.assignedGuide || ""}
                  onChange={(e) => setCurrentBooking({ ...currentBooking, assignedGuide: e.target.value })}
                >
                  <option value="">Select a Guide</option>
                  {guides.map((guide) => (
                    <option key={guide._id} value={guide._id}>
                      {guide.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="modal-actions">
                <button className="modal-button cancel" onClick={() => setShowEditModal(false)}>
                  Cancel
                </button>
                <button className="modal-button confirm" onClick={handleEditSubmit}>
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Book;
