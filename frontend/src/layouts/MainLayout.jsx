import React from 'react'
import { Outlet } from 'react-router'
import AnnouncementBar from '../components/layout/AnnouncementBar'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'

const MainLayout = () => {
    return (
        <div className="main-layout">
        <AnnouncementBar />

        <Header />

        <main>
            <Outlet />
        </main>

        <Footer />
        </div>
    )
}

export default MainLayout