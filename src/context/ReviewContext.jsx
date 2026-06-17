import { createContext, useContext, useState, useEffect } from 'react';

const ReviewContext = createContext(null);

export function ReviewProvider({ children }) {
  const [reviews, setReviews] = useState(() => {
    try {
      const stored = localStorage.getItem('fritzoria_reviews');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('fritzoria_reviews', JSON.stringify(reviews));
  }, [reviews]);

  const getReviewsByBook = (bookId) =>
    reviews.filter(r => r.bookId === bookId).sort((a, b) => new Date(b.date) - new Date(a.date));

  const addReview = ({ bookId, userId, userName, rating, comment }) => {
    const review = {
      id: `rev-${Date.now()}`,
      bookId,
      userId,
      userName,
      rating,
      comment,
      date: new Date().toISOString(),
    };
    setReviews(prev => [review, ...prev]);
    return review;
  };

  const hasUserReviewed = (bookId, userId) =>
    reviews.some(r => r.bookId === bookId && r.userId === userId);

  const getAverageRating = (bookId, fallback) => {
    const bookReviews = getReviewsByBook(bookId);
    if (bookReviews.length === 0) return fallback;
    const sum = bookReviews.reduce((s, r) => s + r.rating, 0);
    return Math.round((sum / bookReviews.length) * 10) / 10;
  };

  return (
    <ReviewContext.Provider value={{ reviews, getReviewsByBook, addReview, hasUserReviewed, getAverageRating }}>
      {children}
    </ReviewContext.Provider>
  );
}

export function useReviews() {
  return useContext(ReviewContext);
}
