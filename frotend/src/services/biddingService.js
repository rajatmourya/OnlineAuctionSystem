import axiosInstance from '../api/axiosConfig';

const API_BASE = '/bids';

export const biddingService = {
  // Place a bid
  placeBid: async (bidData) => {
    try {
      // Map frontend fields to backend fields
      const backendBid = {
        auctionId: bidData.auctionId,
        bidderId: bidData.bidderId || bidData.bidder,
        bidAmount: parseFloat(bidData.bidAmount || bidData.amount),
      };

      const response = await axiosInstance.post(API_BASE, backendBid);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get all bids for an auction
  getBidsForAuction: async (auctionId) => {
    try {
      const response = await axiosInstance.get(`${API_BASE}/auction/${auctionId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get highest bid for an auction
  getHighestBid: async (auctionId) => {
    try {
      const response = await axiosInstance.get(`${API_BASE}/auction/${auctionId}/highest`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get top N bids for an auction
  getTopBids: async (auctionId, limit = 5) => {
    try {
      const response = await axiosInstance.get(`${API_BASE}/auction/${auctionId}/top/${limit}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get all bids by bidder ID
  getBidsByBidder: async (bidderId) => {
    try {
      const response = await axiosInstance.get(`${API_BASE}/bidder/${bidderId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default biddingService;
