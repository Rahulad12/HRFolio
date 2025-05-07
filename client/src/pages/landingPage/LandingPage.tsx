import React from 'react'
import Benefits from './Benefits'
import Features from './Feature'
import Hero from './Hero'
import DashboardImage from './Dashboard'
import Testimonials from './Testimonals'
const LandingPage: React.FC = () => {
    return (
        <>
            <Hero />
            <Features />
            <DashboardImage />
            <Benefits />
            <Testimonials />
        </>
    )
}

export default LandingPage
