import React from 'react'
import { Layout } from 'antd'
import Header from './Header'
import { Outlet } from 'react-router-dom'
import Footer from './Footer'
const { Content } = Layout

const LandingPageLayout: React.FC = () => {
    return (
        <Layout>
            <Header />
            <Content
            style={{
                scrollbarWidth: 'thin',
            }}
            >
                <Outlet />
            </Content>
            <Footer />

        </Layout>
    )
}

export default LandingPageLayout
