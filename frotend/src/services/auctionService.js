import axiosInstance from '../api/axiosConfig';

const API_BASE = '/auctions';

export const auctionService = {
  // Get all auctions
  getAllAuctions: async () => {
    try {
      const response = await axiosInstance.get(API_BASE);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get auction by ID
  getAuctionById: async (auctionId) => {
    try {
      const response = await axiosInstance.get(`${API_BASE}/${auctionId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Create new auction
  createAuction: async (auctionData) => {
    try {
      // Handle date conversion properly
      let endTimeISO = null;
      if (auctionData.endDate) {
        // datetime-local format is "YYYY-MM-DDTHH:mm" (no timezone)
        // Convert to proper Date object and then to ISO string
        const endDate = new Date(auctionData.endDate);
        if (isNaN(endDate.getTime())) {
          throw new Error('Invalid end date format');
        }
        endTimeISO = endDate.toISOString();
      }

      // Map frontend fields to backend fields
      const backendAuction = {
        title: auctionData.name || auctionData.title,
        description: auctionData.description || '',
        category: auctionData.category,
        startingPrice: parseFloat(auctionData.startPrice || auctionData.startingPrice),
        reservePrice: parseFloat(auctionData.startPrice || auctionData.startingPrice), // Use startPrice as reserve
        sellerId: auctionData.sellerId || auctionData.seller,
        endTime: endTimeISO,
        startTime: new Date().toISOString(),
        images: auctionData.image ? [auctionData.image] : [],
        condition: auctionData.condition || 'NEW',
        quantity: auctionData.quantity || 1,
        status: 'ACTIVE',
      };

      console.log('Sending auction data:', JSON.stringify(backendAuction, null, 2));
      console.log('End date input:', auctionData.endDate);
      console.log('End time ISO:', endTimeISO);

      const response = await axiosInstance.post(API_BASE, backendAuction);
      return response.data;
    } catch (error) {
      console.error('Error creating auction:', error);
      console.error('Error response:', error.response);
      
      // Extract error message from response
      let errorMessage = 'Failed to post auction';
      if (error.response) {
        if (error.response.data) {
          if (typeof error.response.data === 'string') {
            errorMessage = error.response.data;
          } else if (error.response.data.message) {
            errorMessage = error.response.data.message;
          } else if (error.response.data.error) {
            errorMessage = error.response.data.error;
          }
        }
        if (error.response.status === 403) {
          errorMessage = 'Access Denied: You do not have permission to create auctions';
        } else if (error.response.status === 401) {
          errorMessage = 'Unauthorized: Please login again';
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      const errorObj = new Error(errorMessage);
      errorObj.error = errorMessage;
      errorObj.details = error.response?.data;
      throw errorObj;
    }
  },

  // Update auction
  updateAuction: async (auctionId, auctionData) => {
    try {
      const backendAuction = {
        title: auctionData.name || auctionData.title,
        description: auctionData.description,
        category: auctionData.category,
        startingPrice: parseFloat(auctionData.startPrice || auctionData.startingPrice),
        reservePrice: parseFloat(auctionData.reservePrice || auctionData.startPrice),
        endTime: auctionData.endDate ? new Date(auctionData.endDate).toISOString() : auctionData.endTime,
        images: auctionData.image ? [auctionData.image] : auctionData.images || [],
        condition: auctionData.condition,
        quantity: auctionData.quantity || 1,
      };

      const response = await axiosInstance.put(`${API_BASE}/${auctionId}`, backendAuction);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Close auction
  closeAuction: async (auctionId) => {
    try {
      await axiosInstance.post(`${API_BASE}/${auctionId}/close`);
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Helper: Update auction status based on end date
  updateAuctionStatus: (auctions) => {
    const now = new Date();

    return auctions.map(a => {
      const endTime = a.endTime || a.endDate;
      if (a.status === "ACTIVE" && endTime && new Date(endTime) <= now) {
        return { ...a, status: "CLOSED" };
      }
      return a;
    });
  },
};

export default auctionService;
