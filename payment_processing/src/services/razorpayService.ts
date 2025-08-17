import { RazorpayOptions, RazorpayResponse, PaymentResult } from '../types';

export class RazorpayService {
  private static instance: RazorpayService;
  private keyId: string;

  private constructor() {
    this.keyId = import.meta.env.VITE_RAZORPAY_KEY_ID || '';
    
    if (!this.keyId) {
      console.warn('Razorpay Key ID not found in environment variables');
    }
  }

  static getInstance(): RazorpayService {
    if (!RazorpayService.instance) {
      RazorpayService.instance = new RazorpayService();
    }
    return RazorpayService.instance;
  }

  async loadRazorpayScript(): Promise<boolean> {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }

  async createOrder(amount: number, currency: string = 'INR'): Promise<{ id: string; amount: number; currency: string }> {
    // In a real application, this would be a backend API call
    // For demo purposes, we'll simulate order creation
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: `order_${Date.now().toString()}`,
          amount: amount * 100, // Razorpay expects amount in paise
          currency,
        });
      }, 500);
    });
  }

  async initiatePayment(
    amount: number,
    orderId: string,
    customerInfo: {
      name?: string;
      email?: string;
      contact?: string;
    },
    onSuccess: (response: RazorpayResponse) => void,
    onError: (error: any) => void
  ): Promise<void> {
    const isLoaded = await this.loadRazorpayScript();
    
    if (!isLoaded) {
      onError(new Error('Failed to load Razorpay SDK'));
      return;
    }

    if (!window.Razorpay) {
      onError(new Error('Razorpay SDK not available'));
      return;
    }

    const options: RazorpayOptions = {
      key: this.keyId,
      amount: amount * 100, // Convert to paise
      currency: 'INR',
      name: 'FoodieExpress',
      description: 'Food Delivery Payment',
      image: '/foodie-logo.png', // Add your logo here
      order_id: orderId,
      handler: onSuccess,
      prefill: {
        name: customerInfo.name,
        email: customerInfo.email,
        contact: customerInfo.contact,
      },
      notes: {
        address: 'Food Delivery Order',
      },
      theme: {
        color: '#F97316', // Orange color matching your theme
      },
      modal: {
        ondismiss: () => {
          onError(new Error('Payment cancelled by user'));
        },
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  }

  async verifyPayment(
    paymentId: string,
    orderId: string,
    signature: string
  ): Promise<boolean> {
    // In a real application, this would be a backend API call to verify the payment
    // For demo purposes, we'll simulate verification
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate successful verification for demo
        resolve(true);
      }, 1000);
    });
  }

  formatAmount(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  }
}

export const razorpayService = RazorpayService.getInstance();
