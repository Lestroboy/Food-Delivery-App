import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Loader2 } from 'lucide-react';
import { usePayment } from '../context/PaymentContext';

interface BottomBarProps {
  onNext: () => void;
  canProceed: boolean;
}

export function BottomBar({ onNext, canProceed }: BottomBarProps) {
  const { state } = usePayment();

  const getButtonText = () => {
    switch (state.currentStep) {
      case 0:
        return 'Continue to Address';
      case 1:
        return 'Continue to Payment';
      case 2:
        return 'Review Order';
      case 3:
        return `Pay $${state.orderSummary.total.toFixed(2)}`;
      default:
        return 'Continue';
    }
  };

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="sticky bottom-0 bg-white border-t border-gray-200 px-4 py-4"
    >
      <div className="max-w-lg mx-auto">
        {state.currentStep < 4 && (
          <>
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm text-gray-600">Total</span>
              <span className="text-lg font-bold text-gray-900">
                ${state.orderSummary.total.toFixed(2)}
              </span>
            </div>
            
            <button
              onClick={onNext}
              disabled={!canProceed || state.isProcessing}
              className={`w-full py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-all ${
                canProceed && !state.isProcessing
                  ? 'bg-orange-500 text-white hover:bg-orange-600'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {state.isProcessing ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <span>{getButtonText()}</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </>
        )}
      </div>
    </motion.div>
  );
}
