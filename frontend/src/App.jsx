import React from 'react'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { CheckoutProvider } from './context/CheckoutContext'
import { OrderProvider } from './context/OrderContext'
import AppRoutes from './routes/AppRoutes'

const App = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <CheckoutProvider>
          <OrderProvider>
            <AppRoutes />
          </OrderProvider>
        </CheckoutProvider>
      </CartProvider>
    </AuthProvider>
  )
}

export default App

