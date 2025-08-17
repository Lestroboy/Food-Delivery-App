import { faker } from '@faker-js/faker';
import { CartItem, Address, PaymentMethod } from '../types';

export const mockCartItems: CartItem[] = [
  {
    id: '1',
    name: 'Margherita Pizza',
    description: 'Fresh tomato sauce, mozzarella, and basil',
    price: 18.99,
    quantity: 2,
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop',
    restaurant: 'Tony\'s Pizzeria',
    customizations: ['Extra cheese', 'Thin crust']
  },
  {
    id: '2',
    name: 'Chicken Caesar Salad',
    description: 'Grilled chicken, romaine lettuce, parmesan, croutons',
    price: 14.50,
    quantity: 1,
    image: 'https://images.unsplash.com/photo-1551248429-40975aa4de74?w=400&h=300&fit=crop',
    restaurant: 'Fresh Garden Cafe',
    customizations: ['No croutons', 'Extra dressing']
  },
  {
    id: '3',
    name: 'Beef Burger Deluxe',
    description: 'Angus beef patty, lettuce, tomato, cheese, fries',
    price: 16.75,
    quantity: 1,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
    restaurant: 'Burger Junction',
    customizations: ['Medium rare', 'Sweet potato fries']
  }
];

export const mockAddresses: Address[] = [
  {
    id: '1',
    type: 'home',
    street: '123 Main Street, Apt 4B',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    isDefault: true
  },
  {
    id: '2',
    type: 'work',
    street: '456 Business Ave, Floor 10',
    city: 'New York',
    state: 'NY',
    zipCode: '10002',
    isDefault: false
  },
  {
    id: '3',
    type: 'other',
    street: '789 Friend\'s Place',
    city: 'Brooklyn',
    state: 'NY',
    zipCode: '11201',
    isDefault: false
  }
];

export const mockPaymentMethods: PaymentMethod[] = [
  {
    id: '1',
    type: 'razorpay',
    isDefault: true
  },
  {
    id: '2',
    type: 'card',
    cardNumber: '**** **** **** 4242',
    cardHolder: 'John Doe',
    expiryDate: '12/26',
    isDefault: false
  },
  {
    id: '3',
    type: 'card',
    cardNumber: '**** **** **** 5555',
    cardHolder: 'John Doe',
    expiryDate: '08/25',
    isDefault: false
  },
  {
    id: '4',
    type: 'paypal',
    isDefault: false
  },
  {
    id: '5',
    type: 'apple_pay',
    isDefault: false
  }
];
