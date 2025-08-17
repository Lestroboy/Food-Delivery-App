export interface CartItem {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  image: string;
  restaurant: string;
  customizations?: string[];
}

export interface Address {
  id: string;
  type: 'home' | 'work' | 'other';
  street: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal' | 'apple_pay' | 'google_pay' | 'razorpay';
  cardNumber?: string;
  cardHolder?: string;
  expiryDate?: string;
  isDefault: boolean;
}

export interface OrderSummary {
  subtotal: number;
  deliveryFee: number;
  tax: number;
  tip: number;
  total: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  deliveryAddress: Address;
  paymentMethod: PaymentMethod;
  summary: OrderSummary;
  estimatedDelivery: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered';
  paymentId?: string;
  razorpayOrderId?: string;
}

export interface PaymentResult {
  success: boolean;
  paymentId?: string;
  orderId?: string;
  error?: string;
}
