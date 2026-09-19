import { Routes, Route } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import Home from '../pages/Home/Home'

// Products
import ProductsPage from '../pages/Products/ProductsPage'
import PowerLanterns from '../pages/Products/PowerLanterns'
import Accessories from '../pages/Products/Accessories'
import Gifts from '../pages/Products/Gifts'

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

const AppRoutes = () => {
    return (
        <Routes>
            <Route element={<MainLayout />}>
                {/* Home */}
                <Route path="/" element={<Home />} />
                
                {/* Products Routes */}
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/products/power-lanterns" element={<PowerLanterns />} />
                <Route path="/products/accessories" element={<Accessories />} />
                <Route path="/products/gifts" element={<Gifts />} />
                
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
        </Routes>
    )
}

export default AppRoutes