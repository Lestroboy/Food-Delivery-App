import React from 'react';
import { motion } from 'framer-motion';
import { Clock, MapPin, CreditCard } from 'lucide-react';
import { usePayment } from '../context/PaymentContext';

export function OrderSummary() {
  const { state } = usePayment();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex-1 overflow-y-auto px-4 py-6"
    >
      <div className="max-w-lg mx-auto space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Order Summary</h2>

        {/* Delivery Info */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <MapPin className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Delivery Address</h3>
                {state.selectedAddress ? (
                  <div>
                    <p className="text-sm text-gray-600">{state.selectedAddress.street}</p>
                    <p className="text-sm text-gray-600">
                      {state.selectedAddress.city}, {state.selectedAddress.state} {state.selectedAddress.zipCode}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-red-500">No address selected</p>
                )}
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Estimated Delivery</h3>
                <p className="text-sm text-gray-600">25-35 minutes</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CreditCard className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Payment Method</h3>
                {state.selectedPaymentMethod ? (
                  <p className="text-sm text-gray-600">
                    {state.selectedPaymentMethod.type === 'card' 
                      ? state.selectedPaymentMethod.cardNumber
                      : state.selectedPaymentMethod.type.replace('_', ' ')
                    }
                  </p>
                ) : (
                  <p className="text-sm text-red-500">No payment method selected</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h3 className="font-semibold text-gray-900 mb-4">Your Items</h3>
          <div className="space-y-3">
            {state.cartItems.map((item) => (
              <div key={item.id} className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div>
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                </div>
                <span className="font-semibold text-gray-900">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">${state.orderSummary.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Delivery Fee</span>
              <span className="font-medium">${state.orderSummary.deliveryFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tax</span>
              <span className="font-medium">${state.orderSummary.tax.toFixed(2)}</span>
            </div>
            {state.orderSummary.tip > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">Tip</span>
                <span className="font-medium">${state.orderSummary.tip.toFixed(2)}</span>
              </div>
            )}
            <div className="border-t pt-3">
              <div className="flex justify-between">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <span className="text-lg font-bold text-gray-900">
                  ${state.orderSummary.total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
