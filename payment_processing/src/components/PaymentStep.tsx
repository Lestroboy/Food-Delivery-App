import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Check, Plus, DollarSign, Zap } from 'lucide-react';
import { usePayment } from '../context/PaymentContext';
import { mockPaymentMethods } from '../data/mockData';
import { PaymentMethod } from '../types';

export function PaymentStep() {
  const { state, dispatch } = usePayment();
  const [showAddForm, setShowAddForm] = useState(false);
  const [customTip, setCustomTip] = useState(false);
  const [tipAmount, setTipAmount] = useState('');

  const selectPaymentMethod = (method: PaymentMethod) => {
    dispatch({ type: 'SET_PAYMENT_METHOD', payload: method });
  };

  const selectTip = (amount: number) => {
    dispatch({ type: 'UPDATE_TIP', payload: amount });
    setCustomTip(false);
  };

  const handleCustomTip = (value: string) => {
    setTipAmount(value);
    const amount = parseFloat(value) || 0;
    dispatch({ type: 'UPDATE_TIP', payload: amount });
  };

  const getPaymentIcon = (type: string) => {
    switch (type) {
      case 'card':
        return <CreditCard className="w-5 h-5" />;
      case 'razorpay':
        return <Zap className="w-5 h-5" />;
      case 'paypal':
        return <div className="w-5 h-5 bg-blue-500 rounded text-white text-xs flex items-center justify-center font-bold">P</div>;
      case 'apple_pay':
        return <div className="w-5 h-5 bg-black rounded text-white text-xs flex items-center justify-center font-bold">A</div>;
      case 'google_pay':
        return <div className="w-5 h-5 bg-green-500 rounded text-white text-xs flex items-center justify-center font-bold">G</div>;
      default:
        return <CreditCard className="w-5 h-5" />;
    }
  };

  const getPaymentLabel = (method: PaymentMethod) => {
    switch (method.type) {
      case 'razorpay':
        return 'Razorpay (Cards, UPI, Wallets)';
      case 'card':
        return method.cardNumber || 'Credit Card';
      default:
        return method.type.replace('_', ' ');
    }
  };

  const getPaymentDescription = (method: PaymentMethod) => {
    switch (method.type) {
      case 'razorpay':
        return 'Pay securely with cards, UPI, wallets & more';
      case 'card':
        return method.cardHolder ? `${method.cardHolder} • ${method.expiryDate}` : '';
      default:
        return '';
    }
  };

  const tipSuggestions = [
    { label: '15%', amount: state.orderSummary.subtotal * 0.15 },
    { label: '18%', amount: state.orderSummary.subtotal * 0.18 },
    { label: '20%', amount: state.orderSummary.subtotal * 0.20 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex-1 overflow-y-auto px-4 py-6"
    >
      <div className="max-w-lg mx-auto space-y-6">
        {/* Payment Methods */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Payment Method</h2>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center space-x-2 text-orange-500 hover:text-orange-600 font-medium"
            >
              <Plus className="w-4 h-4" />
              <span>Add Card</span>
            </button>
          </div>

          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4"
            >
              <h3 className="font-semibold mb-4">Add New Card</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Card Number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                  />
                  <input
                    type="text"
                    placeholder="CVV"
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Cardholder Name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                />
                <button className="w-full bg-orange-500 text-white py-2 rounded-lg font-medium hover:bg-orange-600 transition-colors">
                  Add Card
                </button>
              </div>
            </motion.div>
          )}

          <div className="space-y-3">
            {mockPaymentMethods.map((method) => (
              <motion.div
                key={method.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`bg-white rounded-lg shadow-sm border-2 p-4 cursor-pointer transition-all ${
                  state.selectedPaymentMethod?.id === method.id
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => selectPaymentMethod(method)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${
                      state.selectedPaymentMethod?.id === method.id
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {getPaymentIcon(method.type)}
                    </div>
                    
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-gray-900">
                          {getPaymentLabel(method)}
                        </h3>
                        {method.isDefault && (
                          <span className="bg-gray-100 text-xs px-2 py-1 rounded-full text-gray-600">
                            Recommended
                          </span>
                        )}
                      </div>
                      {getPaymentDescription(method) && (
                        <p className="text-sm text-gray-600">{getPaymentDescription(method)}</p>
                      )}
                    </div>
                  </div>
                  
                  {state.selectedPaymentMethod?.id === method.id && (
                    <div className="p-1 bg-orange-500 rounded-full">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Payment Security Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
            <div className="flex items-start space-x-3">
              <div className="p-1 bg-blue-500 rounded-full">
                <Check className="w-3 h-3 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-900">Secure Payment</p>
                <p className="text-xs text-blue-700 mt-1">
                  Your payment information is encrypted and secure. We don't store your card details.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tip Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Tip</h3>
          <div className="grid grid-cols-4 gap-3 mb-4">
            {tipSuggestions.map((tip) => (
              <button
                key={tip.label}
                onClick={() => selectTip(tip.amount)}
                className={`py-3 px-2 rounded-lg border-2 font-medium transition-all ${
                  Math.abs(state.orderSummary.tip - tip.amount) < 0.01
                    ? 'border-orange-500 bg-orange-50 text-orange-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-sm">{tip.label}</div>
                <div className="text-xs text-gray-500">₹{tip.amount.toFixed(0)}</div>
              </button>
            ))}
            <button
              onClick={() => setCustomTip(true)}
              className={`py-3 px-2 rounded-lg border-2 font-medium transition-all ${
                customTip
                  ? 'border-orange-500 bg-orange-50 text-orange-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <DollarSign className="w-4 h-4 mx-auto mb-1" />
              <div className="text-xs">Custom</div>
            </button>
          </div>
          
          {customTip && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-4"
            >
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="number"
                  placeholder="0.00"
                  value={tipAmount}
                  onChange={(e) => handleCustomTip(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                />
              </div>
            </motion.div>
          )}
        </div>

        {/* Payment Error Display */}
        {state.paymentResult && !state.paymentResult.success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 rounded-lg p-4"
          >
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">!</span>
              </div>
              <div>
                <p className="text-sm font-medium text-red-900">Payment Failed</p>
                <p className="text-xs text-red-700 mt-1">
                  {state.paymentResult.error || 'Please try again or use a different payment method.'}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
