import api from './api';
import { RazorpayOrderResponse, RazorpayPaymentSuccessResponse } from '../types';

let isScriptLoading = false;
let isScriptLoaded = false;

export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (isScriptLoaded || window.Razorpay) {
      resolve(true);
      return;
    }

    if (isScriptLoading) {
      const interval = setInterval(() => {
        if (window.Razorpay) {
          clearInterval(interval);
          resolve(true);
        }
      }, 100);
      return;
    }

    isScriptLoading = true;
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => {
      isScriptLoaded = true;
      isScriptLoading = false;
      resolve(true);
    };
    script.onerror = () => {
      isScriptLoading = false;
      console.error('Failed to load Razorpay SDK script.');
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

export interface CreateOrderPayload {
  festivalId: number;
  amount: number;
  currency?: string;
  donorName?: string;
  donorPhone?: string;
}

export interface VerifyPaymentPayload {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  festivalId: number;
  donorId?: number;
  donorName: string;
  donorPhone: string;
  donorAddress?: string;
  amount: number;
  purpose?: string;
  isAnonymous?: boolean;
  remarks?: string;
}

export const createRazorpayOrder = async (payload: CreateOrderPayload): Promise<RazorpayOrderResponse> => {
  const response = await api.post('/payments/create-order', payload);
  return response.data;
};

export const verifyRazorpayPayment = async (payload: VerifyPaymentPayload) => {
  const response = await api.post('/payments/verify', payload);
  return response.data;
};

export interface StartPaymentOptions {
  orderData: RazorpayOrderResponse;
  festivalName: string;
  donorName: string;
  donorPhone: string;
  donorEmail?: string;
  onSuccess: (response: RazorpayPaymentSuccessResponse) => void;
  onError: (error: any) => void;
  onDismiss?: () => void;
}

export const openRazorpayCheckout = async (options: StartPaymentOptions) => {
  const scriptReady = await loadRazorpayScript();
  if (!scriptReady || !window.Razorpay) {
    options.onError(new Error('Razorpay SDK failed to load. Please check your internet connection.'));
    return;
  }

  const razorpayOptions = {
    key: options.orderData.keyId,
    amount: options.orderData.amount,
    currency: options.orderData.currency || 'INR',
    name: 'Donation.app Platform',
    description: `Contribution towards ${options.festivalName}`,
    image: 'https://images.unsplash.com/photo-1605626830588-4663e26b1c5a?w=120',
    order_id: options.orderData.orderId,
    handler: function (response: RazorpayPaymentSuccessResponse) {
      options.onSuccess(response);
    },
    prefill: {
      name: options.donorName !== 'Anonymous Donor' ? options.donorName : '',
      contact: options.donorPhone,
      email: options.donorEmail || 'devotee@donation.app',
    },
    notes: {
      platform: 'Donation.app Enterprise',
      festival: options.festivalName,
    },
    theme: {
      color: '#ea580c', // Orange theme
    },
    modal: {
      ondismiss: function () {
        if (options.onDismiss) {
          options.onDismiss();
        }
      },
    },
  };

  const razorpayInstance = new window.Razorpay(razorpayOptions);

  razorpayInstance.on('payment.failed', function (response: any) {
    console.error('Razorpay payment failed:', response.error);
    options.onError(response.error);
  });

  razorpayInstance.open();
};
