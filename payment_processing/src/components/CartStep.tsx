import React from 'react';
import { motion } from 'framer-motion';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { usePayment } from '../context/PaymentContext';

export function CartStep() {
  const { state, dispatch } = usePayment();

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity > 0) {
      dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
    } else {
      dispatch({ type: 'REMOVE_ITEM', payload: id });
    }
  };

  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex-1 overflow-y-auto px-4 py-6"
    >
      <div className="max-w-lg mx-auto space-y-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Order</h2>
        
        {state.cartItems.map((item) => (
          <motion.div
            key={item.id}
            layout
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
          >
            <div className="flex items-start space-x-4">
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 rounded-lg object-cover"
              />
              
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-500">{item.restaurant}</p>
                    <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                    
                    {item.customizations && item.customizations.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs text-gray-500">Customizations:</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {item.customizations.map((custom, index) => (
                            <span
                              key={index}
                              className="bg-gray-100 text-xs px-2 py-1 rounded-full text-gray-600"
                            >
                              {custom}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
                
                <div className="flex items-center justify-between mt-4">
                  <span className="font-semibold text-gray-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                  
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    
                    <span className="font-medium px-3 py-1 bg-gray-100 rounded-lg">
                      {item.quantity}
                    </span>
                    
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
        
        {state.cartItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Your cart is empty</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
