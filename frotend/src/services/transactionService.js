import axiosInstance from '../api/axiosConfig';

const API_BASE = '/transactions';

export const transactionService = {
  // Create a transaction
  createTransaction: async (transactionData) => {
    try {
      const backendTransaction = {
        auctionId: transactionData.auctionId,
        itemId: transactionData.itemId,
        sellerId: transactionData.sellerId,
        buyerId: transactionData.buyerId,
        sellingPrice: parseFloat(transactionData.sellingPrice || transactionData.amount),
        paymentStatus: transactionData.paymentStatus || 'PENDING',
      };

      const response = await axiosInstance.post(API_BASE, backendTransaction);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get transaction by ID
  getTransactionById: async (transactionId) => {
    try {
      const response = await axiosInstance.get(`${API_BASE}/${transactionId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get transactions by buyer ID
  getTransactionsByBuyer: async (buyerId) => {
    try {
      const response = await axiosInstance.get(`${API_BASE}/buyer/${buyerId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get transactions by seller ID
  getTransactionsBySeller: async (sellerId) => {
    try {
      const response = await axiosInstance.get(`${API_BASE}/seller/${sellerId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get all transactions (admin only)
  getAllTransactions: async () => {
    try {
      const response = await axiosInstance.get(`${API_BASE}/all`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update transaction payment status
  updatePaymentStatus: async (transactionId, status) => {
    try {
      const response = await axiosInstance.put(
        `${API_BASE}/${transactionId}/status`,
        null,
        { params: { status } }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default transactionService;
