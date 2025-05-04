import { Layout } from 'antd'
import Header from './Header'
import { Outlet } from 'react-router-dom'
import Footer from './Footer'
const { Content } = Layout

const LandingPageLayout = () => {
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
