import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, MapPin, Phone, CreditCard } from 'lucide-react';
import { usePayment } from '../context/PaymentContext';

export function SuccessStep() {
  const { state } = usePayment();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="flex-1 flex items-center justify-center px-4 py-6"
    >
      <div className="max-w-lg mx-auto text-center space-y-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto"
        >
          <CheckCircle className="w-12 h-12 text-green-600" />
        </motion.div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Confirmed!</h2>
          <p className="text-gray-600">
            Thank you for your order. We've received your payment and your food is being prepared.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-left">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Order Details</h3>
            <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
              Confirmed
            </span>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Estimated Delivery</p>
                <p className="text-sm text-gray-600">25-35 minutes</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <MapPin className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Delivery Address</p>
                {state.selectedAddress && (
                  <p className="text-sm text-gray-600">
                    {state.selectedAddress.street}, {state.selectedAddress.city}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Phone className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Order ID</p>
                <p className="text-sm text-gray-600">#{state.orderId}</p>
              </div>
            </div>

            {state.paymentResult?.paymentId && (
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <CreditCard className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Payment ID</p>
                  <p className="text-sm text-gray-600 font-mono">
                    {state.paymentResult.paymentId}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <p className="text-sm text-orange-800">
            You'll receive real-time updates via SMS and push notifications. 
            You can track your order in the app.
          </p>
        </div>

        <div className="space-y-3">
          <button className="w-full bg-orange-500 text-white py-3 rounded-lg font-medium hover:bg-orange-600 transition-colors">
            Track Your Order
          </button>
          <button className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors">
            Order Again
          </button>
        </div>
      </div>
    </motion.div>
  );
}
