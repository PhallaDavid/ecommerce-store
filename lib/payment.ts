import api from "@/utils/axios";

/**
 * Handles the ABA PayWay payment redirection by fetching the payload from our API
 * and submitting it via a hidden form to ABA's payment gateway.
 * 
 * @param orderId The internal order ID to initiate payment for
 */
export const handleABAPayment = async (orderId: string | number) => {
  try {
    // 1. Get the payload from your API
    const response = await api.post(`/orders/${orderId}/pay-aba`);
    const { aba_url, payload } = response.data;

    if (!aba_url || !payload) {
      throw new Error("Invalid payment payload received from server");
    }

    // 2. Create a hidden form and submit it
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = aba_url;

    for (const key in payload) {
      if (Object.prototype.hasOwnProperty.call(payload, key)) {
        const hiddenField = document.createElement('input');
        hiddenField.type = 'hidden';
        hiddenField.name = key;
        hiddenField.value = payload[key];
        form.appendChild(hiddenField);
      }
    }

    document.body.appendChild(form);
    form.submit();
  } catch (error) {
    console.error("ABA Payment failed:", error);
    throw error;
  }
};
