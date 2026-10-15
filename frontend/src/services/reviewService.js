import api from './api';

// Get product reviews
export const getProductReviews = async (productId, params = {}) => {
  try {
    const response = await api.get(`/reviews/product/${productId}`, { params });
    // Backend returns {success, data, total, pages, count}
    // Extract and return in expected format
    return {
      data: response.data || [],
      total: response.total || 0,
      pages: response.pages || 1,
      count: response.count || 0
    };
  } catch (error) {
    console.error('Get product reviews error:', error);
    throw error.response?.data || error;
  }
};

// Get review statistics
export const getReviewStats = async (productId) => {
  try {
    const { data } = await api.get(`/reviews/product/${productId}/stats`);
    return data.data;
  } catch (error) {
    console.error('Get review stats error:', error);
    throw error.response?.data || error;
  }
};

// Get single review
export const getReview = async (reviewId) => {
  try {
    const { data } = await api.get(`/reviews/${reviewId}`);
    return data.data;
  } catch (error) {
    console.error('Get review error:', error);
    throw error.response?.data || error;
  }
};

// Create review
export const createReview = async (reviewData) => {
  try {
    const { data } = await api.post('/reviews', reviewData);
    return data;
  } catch (error) {
    console.error('Create review error:', error);
    throw error.response?.data || error;
  }
};

// Update review
export const updateReview = async (reviewId, reviewData) => {
  try {
    const { data } = await api.put(`/reviews/${reviewId}`, reviewData);
    return data;
  } catch (error) {
    console.error('Update review error:', error);
    throw error.response?.data || error;
  }
};

// Delete review
export const deleteReview = async (reviewId) => {
  try {
    const { data } = await api.delete(`/reviews/${reviewId}`);
    return data;
  } catch (error) {
    console.error('Delete review error:', error);
    throw error.response?.data || error;
  }
};

// Vote on review (legacy - supports toggle)
export const voteReview = async (reviewId, vote) => {
  try {
    const { data } = await api.post(`/reviews/${reviewId}/vote`, { vote });
    return data;
  } catch (error) {
    console.error('Vote review error:', error);
    throw error.response?.data || error;
  }
};

// Add helpful reaction
export const addHelpfulReaction = async (reviewId) => {
  try {
    const { data } = await api.put(`/reviews/${reviewId}/helpful`);
    return data;
  } catch (error) {
    console.error('Add helpful reaction error:', error);
    throw error.response?.data || error;
  }
};

// Remove helpful reaction
export const removeHelpfulReaction = async (reviewId) => {
  try {
    const { data } = await api.delete(`/reviews/${reviewId}/helpful`);
    return data;
  } catch (error) {
    console.error('Remove helpful reaction error:', error);
    throw error.response?.data || error;
  }
};

// Report review
export const reportReview = async (reviewId, reason) => {
  try {
    const { data } = await api.post(`/reviews/${reviewId}/report`, { reason });
    return data;
  } catch (error) {
    console.error('Report review error:', error);
    throw error.response?.data || error;
  }
};

// Get my reviews
export const getMyReviews = async (params = {}) => {
  try {
    const { data } = await api.get('/reviews/user/me', { params });
    return data;
  } catch (error) {
    console.error('Get my reviews error:', error);
    throw error.response?.data || error;
  }
};

// Check if user can review
export const canUserReview = async (productId) => {
  try {
    const { data } = await api.get(`/reviews/can-review/${productId}`);
    return data.data;
  } catch (error) {
    console.error('Can user review error:', error);
    throw error.response?.data || error;
  }
};

// Admin: Get all reviews
export const getAdminReviews = async (params = {}) => {
  try {
    const { data } = await api.get('/reviews/admin/all', { params });
    return data;
  } catch (error) {
    console.error('Get admin reviews error:', error);
    throw error.response?.data || error;
  }
};

// Admin: Approve review
export const approveReview = async (reviewId) => {
  try {
    const { data } = await api.put(`/reviews/${reviewId}/approve`);
    return data;
  } catch (error) {
    console.error('Approve review error:', error);
    throw error.response?.data || error;
  }
};

// Admin: Reject review
export const rejectReview = async (reviewId, reason) => {
  try {
    const { data } = await api.put(`/reviews/${reviewId}/reject`, { reason });
    return data;
  } catch (error) {
    console.error('Reject review error:', error);
    throw error.response?.data || error;
  }
};

// Admin: Add response
export const addAdminResponse = async (reviewId, response) => {
  try {
    const { data } = await api.post(`/reviews/${reviewId}/response`, { response });
    return data;
  } catch (error) {
    console.error('Add admin response error:', error);
    throw error.response?.data || error;
  }
};
