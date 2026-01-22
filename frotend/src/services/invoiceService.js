import axiosInstance from '../api/axiosConfig';

const API_BASE = '/invoices';

// Helper function to download PDF
const downloadPDFBlob = (blobData, filename) => {
  const url = window.URL.createObjectURL(new Blob([blobData], { type: 'application/pdf' }));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

export const invoiceService = {
  // Get invoice by transaction ID
  getInvoiceByTransaction: async (transactionId) => {
    try {
      const response = await axiosInstance.get(`${API_BASE}/transaction/${transactionId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get invoices by buyer ID
  getInvoicesByBuyer: async (buyerId) => {
    try {
      const response = await axiosInstance.get(`${API_BASE}/buyer/${buyerId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get invoices by seller ID
  getInvoicesBySeller: async (sellerId) => {
    try {
      const response = await axiosInstance.get(`${API_BASE}/seller/${sellerId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Download invoice as PDF
  downloadInvoicePDF: async (invoiceId) => {
    try {
      const response = await axiosInstance.get(`${API_BASE}/${invoiceId}/download`, {
        responseType: 'blob',
      });
      
      downloadPDFBlob(response.data, `Invoice-${invoiceId}.pdf`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Download invoice by transaction ID
  downloadInvoicePDFByTransaction: async (transactionId) => {
    try {
      // First get the invoice to get the invoice ID
      const invoiceResponse = await axiosInstance.get(`${API_BASE}/transaction/${transactionId}`);
      const invoice = invoiceResponse.data;
      
      if (invoice && invoice.id) {
        // Download using invoice ID
        const pdfResponse = await axiosInstance.get(`${API_BASE}/${invoice.id}/download`, {
          responseType: 'blob',
        });
        
        downloadPDFBlob(pdfResponse.data, `Invoice-${invoice.invoiceNumber || invoice.id}.pdf`);
        return pdfResponse.data;
      } else {
        // Fallback: try direct download endpoint
        const response = await axiosInstance.get(`${API_BASE}/transaction/${transactionId}/download`, {
          responseType: 'blob',
        });
        
        downloadPDFBlob(response.data, `Invoice-${transactionId}.pdf`);
        return response.data;
      }
    } catch (error) {
      console.error("Error downloading invoice:", error);
      throw error.response?.data || error.message;
    }
  },
};

export default invoiceService;
