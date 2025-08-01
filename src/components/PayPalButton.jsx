import React from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { useNavigate } from 'react-router-dom';

const PayPalButton = ({ selectedTemplate, formData }) => {
  const navigate = useNavigate();

  const handleApprove = async (data, actions) => {
    const order = await actions.order.capture();
    const orderId = data.orderID;

    // Store formData in localStorage so /success can access it
    localStorage.setItem('formData', JSON.stringify(formData));

    // Redirect to success page with orderId in query params
    navigate(`/success?orderId=${orderId}`);
  };

  const handleError = (err) => {
    console.error('PayPal Checkout error:', err);
    alert('Something went wrong with the payment. Please try again.');
  };

  return (
    <PayPalScriptProvider
      options={{
        clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID,
        currency: 'USD',
        intent: 'capture',
      }}
    >
      <div className="mt-6 text-center">
        <PayPalButtons
          style={{
            layout: 'vertical',
            color: 'gold',
            label: 'paypal',
            shape: 'rect',
          }}
          createOrder={(data, actions) => {
            return actions.order.create({
              purchase_units: [
                {
                  description: `Portfolio Template: ${selectedTemplate}`,
                  amount: { value: '2.00' },
                },
              ],
            });
          }}
          onApprove={handleApprove}
          onError={handleError}
        />
      </div>
    </PayPalScriptProvider>
  );
};

export default PayPalButton;
