import React from 'react';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import { usePayment } from '../context/PaymentContext';

interface HeaderProps {
  onBack?: () => void;
  showBack?: boolean;
}

export function Header({ onBack, showBack = true }: HeaderProps) {
  const { state } = usePayment();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {showBack && onBack && (
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <h1 className="text-xl font-bold text-gray-900">FoodieExpress</h1>
        </div>
        
        <div className="flex items-center space-x-2">
          <ShoppingCart className="w-5 h-5 text-gray-600" />
          <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            {state.cartItems.reduce((sum, item) => sum + item.quantity, 0)}
          </span>
        </div>
      </div>
    </header>
  );
}
