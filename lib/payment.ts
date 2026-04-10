import api from "@/utils/axios";

/**
 * Handles the ABA PayWay payment redirection by fetching the payload from our API
 * and submitting it via a hidden form to ABA's payment gateway.
 * 
 * @param orderId The internal order ID to initiate payment for
 */
export const handleABAPayment = async (orderId: string | number) => {
  try {
    // 1. Get the ABA response from your API
    const response = await api.post(`/orders/${orderId}/pay-aba`);
    
    // The response now contains qrImage, qrtString, abapay_deeplink, etc.
    return response.data;
  } catch (error) {
    console.error("ABA Payment failed:", error);
    throw error;
  }
};
