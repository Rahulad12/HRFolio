import { useState, useEffect } from 'react'
import { Layout, Button, Drawer, Grid } from 'antd'
import { Menu, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const { Header: AntHeader } = Layout
const { useBreakpoint } = Grid

const navItems = [
  { label: 'Features', href: '#features' },
  { label: 'Screenshots', href: '#screenshots' },
  { label: 'Benefits', href: '#benefits' },
]

export function NavHeader() {
  const [scrolled, setScrolled] = useState(false)
  const [drawerVisible, setDrawerVisible] = useState(false)
  const screens = useBreakpoint()
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <AntHeader
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'shadow-md' : ''}`}
      style={{
        background: scrolled ? '#001529' : 'transparent',
        padding: screens.md ? '0 50px' : '0 20px',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <div className="flex justify-between items-center w-full">
        <div
          className="cursor-pointer flex items-center justify-center"
          onClick={() => navigate('/')}
        >
          <span className={`${scrolled ? 'text-white' : 'text-gray-800'} text-3xl font-bold`}>H</span>
          <span className="text-orange-600 text-4xl font-extrabold">R</span>
          <span className={`${scrolled ? 'text-white' : 'text-gray-800'} font-semibold text-2xl`}>Folio</span>
        </div>

        {screens.md ? (
          <div className="flex items-center gap-8">
            {navItems.map(item => (
              <a key={item.label} href={item.href}>
                <span className={`${scrolled ? 'text-white' : 'text-gray-800'} cursor-pointer font-medium text-[16px]`}>
                  {item.label}
                </span>
              </a>
            ))}
            <Button type="primary" size="middle" onClick={() => navigate('/dashboard')}>
              Continue To Dashboard
            </Button>
          </div>
        ) : (
          <Button
            type="text"
            icon={<Menu className="text-xl" />}
            onClick={() => setDrawerVisible(true)}
            style={{ color: scrolled ? '#fff' : '#001529' }}
          />
        )}
      </div>

      <Drawer
        title={
          <div className="cursor-pointer flex items-center justify-center" onClick={() => navigate('/')}>
            <span className="text-3xl font-bold">H</span>
            <span className="text-orange-600 text-4xl font-extrabold">R</span>
            <span className="font-semibold text-2xl">Folio</span>
          </div>
        }
        placement="right"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        closeIcon={<X />}
        width={300}
      >
        <div className="flex flex-col gap-4 pt-4">
          {navItems.map(item => (
            <a key={item.label} href={item.href} className="px-4 py-2 text-gray-700 hover:text-blue-600">
              {item.label}
            </a>
          ))}
        </div>
        <div className="p-4">
          <Button type="primary" block onClick={() => navigate('/dashboard')}>
            Continue To Dashboard
          </Button>
        </div>
      </Drawer>
    </AntHeader>
  )
}
