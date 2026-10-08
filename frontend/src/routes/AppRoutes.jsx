import { Routes, Route } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import Home from '../pages/Home/Home'

// Products
import ProductsPage from '../pages/Products/ProductsPage'
import ProductDetail from '../pages/Products/ProductDetail'

// Cart
import Cart from '../pages/Cart/Cart'

// Bundles
import TitanBundle from '../pages/Bundles/TitanBundle'
import StringLightsBundle from '../pages/Bundles/StringLightsBundle'
import BackyardBundle from '../pages/Bundles/BackyardBundle'
import Quiz from '../pages/Bundles/Quiz'

// About
import AboutPage from '../pages/About/AboutPage'
import GiveLight from '../pages/About/GiveLight'

// Support
import Shipping from '../pages/Support/Shipping'
import Guides from '../pages/Support/Guides'
import Returns from '../pages/Support/Returns'
import AccessibilityPage from '../pages/Support/Accessibility'
import Contact from '../pages/Support/Contact'

// Auth
import Login from '../pages/Auth/Login'
import Register from '../pages/Auth/Register'
import Profile from '../pages/Auth/Profile'
import ProtectedRoute from '../components/common/ProtectedRoute'

// Checkout
import CheckoutPage from '../pages/Checkout/CheckoutPage'
import OrderPendingPage from '../pages/Checkout/OrderPendingPage'

// Orders
import MyOrdersPage from '../pages/Orders/MyOrdersPage'
import OrderDetailPage from '../pages/Orders/OrderDetailPage'

// Admin
import AdminRoute from '../components/common/AdminRoute'
import AdminLayout from '../layouts/AdminLayout'
import AdminDashboard from '../pages/Admin/AdminDashboard'
import AdminProducts from '../pages/Admin/AdminProducts'

const AppRoutes = () => {
    return (
        <Routes>
            <Route element={<MainLayout />}>
                {/* Home */}
                <Route path="/" element={<Home />} />
                
                {/* Auth Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route 
                    path="/profile" 
                    element={
                        <ProtectedRoute>
                            <Profile />
                        </ProtectedRoute>
                    } 
                />
                
                {/* Products Routes */}
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/products/:slug" element={<ProductDetail />} />
                
                {/* Cart */}
                <Route path="/cart" element={<Cart />} />
                
                {/* Checkout Routes */}
                <Route 
                    path="/checkout" 
                    element={
                        <ProtectedRoute>
                            <CheckoutPage />
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path="/orders/pending/:orderId" 
                    element={
                        <ProtectedRoute>
                            <OrderPendingPage />
                        </ProtectedRoute>
                    } 
                />
                
                {/* Order Routes */}
                <Route 
                    path="/orders" 
                    element={
                        <ProtectedRoute>
                            <MyOrdersPage />
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path="/orders/my-orders" 
                    element={
                        <ProtectedRoute>
                            <MyOrdersPage />
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path="/orders/:orderId" 
                    element={
                        <ProtectedRoute>
                            <OrderDetailPage />
                        </ProtectedRoute>
                    } 
                />
                
                {/* Bundles Routes */}
                <Route path="/bundles/titan" element={<TitanBundle />} />
                <Route path="/bundles/string-lights" element={<StringLightsBundle />} />
                <Route path="/bundles/backyard" element={<BackyardBundle />} />
                <Route path="/bundles/LuminAidd-quiz" element={<Quiz />} />
                
                {/* About Routes */}
                <Route path="/about" element={<AboutPage />} />
                <Route path="/give-light" element={<GiveLight />} />
                
                {/* Support Routes */}
                <Route path="/support/shipping" element={<Shipping />} />
                <Route path="/support/guides" element={<Guides />} />
                <Route path="/support/returns" element={<Returns />} />
                <Route path="/support/accessibility" element={<AccessibilityPage />} />
                <Route path="/support/contact" element={<Contact />} />
            </Route>

            {/* Admin Routes */}
            <Route element={<AdminRoute />}>
                <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="products" element={<AdminProducts />} />
                </Route>
            </Route>
        </Routes>
    )
}

export default AppRoutes