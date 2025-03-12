import React, { useEffect, useState } from "react";
import "../styles/reviews.css";

interface Review {
  _id: string;
  username: string;
  reviewText: string;
  rating: number | null;
  createdAt: string;
}

const Reviews: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/v1/review/");
      const data = await response.json();

      if (data.success) {
        setReviews(data.data);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const handleHideReview = async (reviewId: string) => {
    // Update reviews state to hide review locally
    setReviews((prevReviews) => prevReviews.filter((review) => review._id !== reviewId));
  
    try {
      // Make API call to delete the review
      const response = await fetch(`http://localhost:4000/api/v1/review/${reviewId}`, {
        method: "DELETE",
      });
  
      if (!response.ok) {
        console.error("Failed to delete review on server:", response.statusText);
        // You might want to restore the review here if necessary
        fetchReviews();
      } else {
        const data = await response.json();
        console.log("Review deleted successfully:", data);
      }
    } catch (error) {
      console.error("Error deleting review:", error);
      // Handle any network issues
      fetchReviews();
    }
  };
  

  return (
    <div className="container">
      <h2>Admin Dashboard - Reviews</h2>
      <table  cellPadding="10">
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Review</th>
            <th>Rating</th>
            <th>Created At</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((review) => (
            <tr key={review._id}>
              <td>{review._id}</td>
              <td>{review.username}</td>
              <td>{review.reviewText}</td>
              <td>{review.rating !== null ? `${review.rating} ⭐` : "N/A"}</td>
              <td>{new Date(review.createdAt).toLocaleString()}</td>
              <td>
                <button
                  className="delete-btn"
                  onClick={() => handleHideReview(review._id)}
                >
                  Hide
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Reviews;
