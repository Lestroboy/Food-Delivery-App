import React, { useEffect } from 'react';
import { Header } from './components/Header';
import { ProgressBar } from './components/ProgressBar';
import { CartStep } from './components/CartStep';
import { AddressStep } from './components/AddressStep';
import { PaymentStep } from './components/PaymentStep';
import { OrderSummary } from './components/OrderSummary';
import { SuccessStep } from './components/SuccessStep';
import { BottomBar } from './components/BottomBar';
import { PaymentProvider, usePayment } from './context/PaymentContext';
import { mockCartItems } from './data/mockData';

const steps = ['Cart', 'Address', 'Payment', 'Review', 'Complete'];

function PaymentFlow() {
  const { state, dispatch, processRazorpayPayment } = usePayment();

  useEffect(() => {
    // Initialize with mock cart items
    dispatch({ type: 'SET_CART_ITEMS', payload: mockCartItems });
  }, [dispatch]);

  const handleNext = async () => {
    if (state.currentStep === 3) {
      // Process payment based on selected payment method
      if (state.selectedPaymentMethod?.type === 'razorpay') {
        await processRazorpayPayment();
      } else {
        // For other payment methods, simulate processing
        dispatch({ type: 'SET_PROCESSING', payload: true });
        
        // Simulate payment processing
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const orderId = `FE${Date.now().toString().slice(-6)}`;
        dispatch({ type: 'SET_ORDER_ID', payload: orderId });
        dispatch({ type: 'SET_PROCESSING', payload: false });
        dispatch({ type: 'SET_STEP', payload: state.currentStep + 1 });
      }
    } else {
      dispatch({ type: 'SET_STEP', payload: state.currentStep + 1 });
    }
  };

  const handleBack = () => {
    if (state.currentStep > 0) {
      // Reset payment result when going back
      if (state.paymentResult && !state.paymentResult.success) {
        dispatch({ type: 'SET_PAYMENT_RESULT', payload: null });
      }
      dispatch({ type: 'SET_STEP', payload: state.currentStep - 1 });
    }
  };

  const canProceed = () => {
    switch (state.currentStep) {
      case 0:
        return state.cartItems.length > 0;
      case 1:
        return state.selectedAddress !== null;
      case 2:
        return state.selectedPaymentMethod !== null;
      case 3:
        return state.selectedAddress && state.selectedPaymentMethod;
      default:
        return false;
    }
  };

  const renderStep = () => {
    switch (state.currentStep) {
      case 0:
        return <CartStep />;
      case 1:
        return <AddressStep />;
      case 2:
        return <PaymentStep />;
      case 3:
        return <OrderSummary />;
      case 4:
        return <SuccessStep />;
      default:
        return <CartStep />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header 
        onBack={handleBack} 
        showBack={state.currentStep > 0 && state.currentStep < 4} 
      />
      
      {state.currentStep < 4 && (
        <ProgressBar 
          currentStep={state.currentStep} 
          totalSteps={4} 
          steps={steps.slice(0, 4)} 
        />
      )}
      
      {renderStep()}
      
      <BottomBar 
        onNext={handleNext} 
        canProceed={canProceed()} 
      />
    </div>
  );
}

function App() {
  return (
    <PaymentProvider>
      <PaymentFlow />
    </PaymentProvider>
  );
}

export default App;
