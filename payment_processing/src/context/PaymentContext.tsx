import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { faker } from '@faker-js/faker';
import { CartItem, Address, PaymentMethod, OrderSummary, PaymentResult } from '../types';
import { razorpayService } from '../services/razorpayService';

interface PaymentState {
  cartItems: CartItem[];
  selectedAddress: Address | null;
  selectedPaymentMethod: PaymentMethod | null;
  orderSummary: OrderSummary;
  currentStep: number;
  isProcessing: boolean;
  orderId: string | null;
  paymentResult: PaymentResult | null;
  razorpayOrderId: string | null;
}

type PaymentAction =
  | { type: 'SET_CART_ITEMS'; payload: CartItem[] }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'SET_ADDRESS'; payload: Address }
  | { type: 'SET_PAYMENT_METHOD'; payload: PaymentMethod }
  | { type: 'SET_STEP'; payload: number }
  | { type: 'SET_PROCESSING'; payload: boolean }
  | { type: 'SET_ORDER_ID'; payload: string }
  | { type: 'SET_RAZORPAY_ORDER_ID'; payload: string }
  | { type: 'SET_PAYMENT_RESULT'; payload: PaymentResult }
  | { type: 'UPDATE_TIP'; payload: number }
  | { type: 'RESET_PAYMENT'; payload?: undefined };

const initialState: PaymentState = {
  cartItems: [],
  selectedAddress: null,
  selectedPaymentMethod: null,
  orderSummary: {
    subtotal: 0,
    deliveryFee: 3.99,
    tax: 0,
    tip: 0,
    total: 0,
  },
  currentStep: 0,
  isProcessing: false,
  orderId: null,
  paymentResult: null,
  razorpayOrderId: null,
};

function paymentReducer(state: PaymentState, action: PaymentAction): PaymentState {
  switch (action.type) {
    case 'SET_CART_ITEMS':
      const subtotal = action.payload.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const tax = subtotal * 0.08;
      return {
        ...state,
        cartItems: action.payload,
        orderSummary: {
          ...state.orderSummary,
          subtotal,
          tax,
          total: subtotal + state.orderSummary.deliveryFee + tax + state.orderSummary.tip,
        },
      };
    case 'UPDATE_QUANTITY':
      const updatedItems = state.cartItems.map(item =>
        item.id === action.payload.id ? { ...item, quantity: action.payload.quantity } : item
      );
      const newSubtotal = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const newTax = newSubtotal * 0.08;
      return {
        ...state,
        cartItems: updatedItems,
        orderSummary: {
          ...state.orderSummary,
          subtotal: newSubtotal,
          tax: newTax,
          total: newSubtotal + state.orderSummary.deliveryFee + newTax + state.orderSummary.tip,
        },
      };
    case 'REMOVE_ITEM':
      const filteredItems = state.cartItems.filter(item => item.id !== action.payload);
      const filteredSubtotal = filteredItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const filteredTax = filteredSubtotal * 0.08;
      return {
        ...state,
        cartItems: filteredItems,
        orderSummary: {
          ...state.orderSummary,
          subtotal: filteredSubtotal,
          tax: filteredTax,
          total: filteredSubtotal + state.orderSummary.deliveryFee + filteredTax + state.orderSummary.tip,
        },
      };
    case 'UPDATE_TIP':
      return {
        ...state,
        orderSummary: {
          ...state.orderSummary,
          tip: action.payload,
          total: state.orderSummary.subtotal + state.orderSummary.deliveryFee + state.orderSummary.tax + action.payload,
        },
      };
    case 'SET_ADDRESS':
      return { ...state, selectedAddress: action.payload };
    case 'SET_PAYMENT_METHOD':
      return { ...state, selectedPaymentMethod: action.payload };
    case 'SET_STEP':
      return { ...state, currentStep: action.payload };
    case 'SET_PROCESSING':
      return { ...state, isProcessing: action.payload };
    case 'SET_ORDER_ID':
      return { ...state, orderId: action.payload };
    case 'SET_RAZORPAY_ORDER_ID':
      return { ...state, razorpayOrderId: action.payload };
    case 'SET_PAYMENT_RESULT':
      return { ...state, paymentResult: action.payload };
    case 'RESET_PAYMENT':
      return {
        ...initialState,
        cartItems: state.cartItems,
        orderSummary: state.orderSummary,
      };
    default:
      return state;
  }
}

interface PaymentContextType {
  state: PaymentState;
  dispatch: React.Dispatch<PaymentAction>;
  processRazorpayPayment: () => Promise<void>;
}

const PaymentContext = createContext<PaymentContextType | null>(null);

export function PaymentProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(paymentReducer, initialState);

  const processRazorpayPayment = async (): Promise<void> => {
    try {
      dispatch({ type: 'SET_PROCESSING', payload: true });

      // Create Razorpay order
      const orderResponse = await razorpayService.createOrder(
        state.orderSummary.total,
        'INR'
      );

      dispatch({ type: 'SET_RAZORPAY_ORDER_ID', payload: orderResponse.id });

      // Get customer info from address
      const customerInfo = {
        name: 'Customer', // In real app, get from user profile
        email: 'customer@example.com', // In real app, get from user profile
        contact: '+919999999999', // In real app, get from user profile
      };

      // Initiate Razorpay payment
      await razorpayService.initiatePayment(
        state.orderSummary.total,
        orderResponse.id,
        customerInfo,
        async (response) => {
          // Payment successful
          try {
            // Verify payment (in real app, do this on backend)
            const isVerified = await razorpayService.verifyPayment(
              response.razorpay_payment_id,
              response.razorpay_order_id || orderResponse.id,
              response.razorpay_signature || ''
            );

            if (isVerified) {
              const orderId = `FE${Date.now().toString().slice(-6)}`;
              dispatch({ type: 'SET_ORDER_ID', payload: orderId });
              dispatch({
                type: 'SET_PAYMENT_RESULT',
                payload: {
                  success: true,
                  paymentId: response.razorpay_payment_id,
                  orderId: response.razorpay_order_id || orderResponse.id,
                },
              });
              dispatch({ type: 'SET_STEP', payload: 4 });
            } else {
              throw new Error('Payment verification failed');
            }
          } catch (error) {
            dispatch({
              type: 'SET_PAYMENT_RESULT',
              payload: {
                success: false,
                error: 'Payment verification failed',
              },
            });
          } finally {
            dispatch({ type: 'SET_PROCESSING', payload: false });
          }
        },
        (error) => {
          // Payment failed or cancelled
          dispatch({
            type: 'SET_PAYMENT_RESULT',
            payload: {
              success: false,
              error: error.message || 'Payment failed',
            },
          });
          dispatch({ type: 'SET_PROCESSING', payload: false });
        }
      );
    } catch (error) {
      dispatch({
        type: 'SET_PAYMENT_RESULT',
        payload: {
          success: false,
          error: error instanceof Error ? error.message : 'Payment processing failed',
        },
      });
      dispatch({ type: 'SET_PROCESSING', payload: false });
    }
  };

  return (
    <PaymentContext.Provider value={{ state, dispatch, processRazorpayPayment }}>
      {children}
    </PaymentContext.Provider>
  );
}

export function usePayment() {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
}
