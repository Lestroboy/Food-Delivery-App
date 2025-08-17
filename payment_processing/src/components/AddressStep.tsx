import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Home, Building, MapPin, Plus, Check } from 'lucide-react';
import { usePayment } from '../context/PaymentContext';
import { mockAddresses } from '../data/mockData';
import { Address } from '../types';

export function AddressStep() {
  const { state, dispatch } = usePayment();
  const [showAddForm, setShowAddForm] = useState(false);

  const selectAddress = (address: Address) => {
    dispatch({ type: 'SET_ADDRESS', payload: address });
  };

  const getAddressIcon = (type: string) => {
    switch (type) {
      case 'home':
        return <Home className="w-5 h-5" />;
      case 'work':
        return <Building className="w-5 h-5" />;
      default:
        return <MapPin className="w-5 h-5" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex-1 overflow-y-auto px-4 py-6"
    >
      <div className="max-w-lg mx-auto space-y-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Delivery Address</h2>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center space-x-2 text-orange-500 hover:text-orange-600 font-medium"
          >
            <Plus className="w-4 h-4" />
            <span>Add New</span>
          </button>
        </div>

        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4"
          >
            <h3 className="font-semibold mb-4">Add New Address</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Street Address"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="City"
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                />
                <input
                  type="text"
                  placeholder="ZIP Code"
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                />
              </div>
              <button className="w-full bg-orange-500 text-white py-2 rounded-lg font-medium hover:bg-orange-600 transition-colors">
                Save Address
              </button>
            </div>
          </motion.div>
        )}

        <div className="space-y-3">
          {mockAddresses.map((address) => (
            <motion.div
              key={address.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`bg-white rounded-lg shadow-sm border-2 p-4 cursor-pointer transition-all ${
                state.selectedAddress?.id === address.id
                  ? 'border-orange-500 bg-orange-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => selectAddress(address)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg ${
                    state.selectedAddress?.id === address.id
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {getAddressIcon(address.type)}
                  </div>
                  
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-gray-900 capitalize">
                        {address.type}
                      </h3>
                      {address.isDefault && (
                        <span className="bg-gray-100 text-xs px-2 py-1 rounded-full text-gray-600">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{address.street}</p>
                    <p className="text-sm text-gray-600">
                      {address.city}, {address.state} {address.zipCode}
                    </p>
                  </div>
                </div>
                
                {state.selectedAddress?.id === address.id && (
                  <div className="p-1 bg-orange-500 rounded-full">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
