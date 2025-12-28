import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { useState } from 'react'
import { ThemeProvider, useTheme } from '@transftw/theme-provider'
import { HomePage } from './components/HomePage'
import { ComponentsPage } from './components/ComponentsPage'

const AppContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text.primary};
  transition: background 0.3s ease;
`

const Sidebar = styled.aside<{ $collapsed: boolean }>`
  width: ${props => props.$collapsed ? '60px' : '280px'};
  background: ${props => props.theme.colors.surface};
  border-right: 2px solid ${props => props.theme.colors.border};
  padding: 20px;
  overflow-y: auto;
  transition: width 0.3s ease;
  position: relative;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: ${props => props.theme.colors.background};
  }

  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.border};
    border-radius: 4px;
  }
`

const ToggleButton = styled.button`
  position: absolute;
  top: 20px;
  right: 10px;
  background: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.background};
  border: none;
  width: 30px;
  height: 30px;
  border-radius: ${props => props.theme.borderRadius.sm};
  cursor: pointer;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.theme.colors.secondary};
  }
`

const SidebarHeader = styled.div<{ $collapsed: boolean }>`
  margin-bottom: 30px;
  display: ${props => props.$collapsed ? 'none' : 'block'};
`

const Logo = styled(Link)`
  font-size: 24px;
  font-weight: bold;
  color: ${props => props.theme.colors.primary};
  text-decoration: none;
  display: block;
  margin-bottom: 10px;
  transition: color 0.2s;

  &:hover {
    color: ${props => props.theme.colors.secondary};
  }
`

const Subtitle = styled.p`
  font-size: 12px;
  color: ${props => props.theme.colors.text.secondary};
  margin: 0;
  line-height: 1.4;
`

const ThemeSwitcherContainer = styled.div<{ $collapsed: boolean }>`
  margin-bottom: 30px;
  display: ${props => props.$collapsed ? 'none' : 'block'};
`

const ThemeButton = styled.button<{ $active: boolean }>`
  width: 100%;
  padding: 12px;
  margin-bottom: 8px;
  background: ${props => props.$active ? props.theme.colors.primary : props.theme.colors.surface};
  color: ${props => props.$active ? props.theme.colors.background : props.theme.colors.text.primary};
  border: 2px solid ${props => props.$active ? props.theme.colors.primary : props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  cursor: pointer;
  font-size: 14px;
  font-weight: ${props => props.$active ? 'bold' : 'normal'};
  transition: all 0.2s;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
  }
`

const CategorySection = styled.div<{ $collapsed: boolean }>`
  margin-bottom: 30px;
  display: ${props => props.$collapsed ? 'none' : 'block'};
`

const CategoryTitle = styled.h3`
  font-size: 13px;
  color: ${props => props.theme.colors.accent};
  text-transform: uppercase;
  letter-spacing: 1.5px;
  margin: 0 0 15px 0;
  padding-bottom: 8px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  font-weight: 600;
`

const NavList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`

const NavItem = styled.li`
  margin-bottom: 8px;
`

const NavLink = styled(Link)<{ $active: boolean }>`
  display: block;
  color: ${props => props.$active ? props.theme.colors.primary : props.theme.colors.text.primary};
  text-decoration: none;
  font-size: 14px;
  padding: 10px 12px;
  border-radius: ${props => props.theme.borderRadius.sm};
  border-left: 3px solid ${props => props.$active ? props.theme.colors.primary : 'transparent'};
  transition: all 0.2s;
  background: ${props => props.$active ? props.theme.colors.border : 'transparent'};

  &:hover {
    background: ${props => props.theme.colors.border};
    border-left-color: ${props => props.theme.colors.primary};
  }
`

const Main = styled.main`
  flex: 1;
  padding: 40px;
  overflow-y: auto;
  max-width: 100%;
`

const Footer = styled.footer`
  padding: 20px;
  text-align: center;
  font-size: 12px;
  color: ${props => props.theme.colors.text.secondary};
  border-top: 1px solid ${props => props.theme.colors.border};

  a {
    color: ${props => props.theme.colors.primary};
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`

interface Category {
  title: string
  path: string
}

const categories: Category[] = [
  { title: 'Primitives', path: '/primitives' },
  { title: 'Layout', path: '/layout' },
  { title: 'Typography', path: '/typography' },
  { title: 'Navigation', path: '/navigation' },
  { title: 'Feedback', path: '/feedback' },
  { title: 'Data', path: '/data' },
  { title: 'Animated', path: '/animated' },
  { title: 'Admin Dashboard', path: '/admin' },
  { title: 'Analytics', path: '/analytics' },
  { title: 'Creator Tools', path: '/creator' },
  { title: 'Forms', path: '/forms' },
  { title: 'Real-Time', path: '/realtime' },
]

function ThemeSwitcher({ collapsed }: { collapsed: boolean }) {
  const { themeName, setTheme } = useTheme()

  return (
    <ThemeSwitcherContainer $collapsed={collapsed}>
      <CategoryTitle>Theme</CategoryTitle>
      <ThemeButton
        $active={themeName === 'luxe'}
        onClick={() => setTheme('luxe')}
      >
        ✨ Luxe
      </ThemeButton>
      <ThemeButton
        $active={themeName === 'cyberpunk'}
        onClick={() => setTheme('cyberpunk')}
      >
        🌐 Cyberpunk
      </ThemeButton>
    </ThemeSwitcherContainer>
  )
}

function SidebarNav() {
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()

  return (
    <Sidebar $collapsed={collapsed}>
      <ToggleButton
        onClick={() => setCollapsed(!collapsed)}
        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? '>' : '<'}
      </ToggleButton>

      <SidebarHeader $collapsed={collapsed}>
        <Logo to="/">egirl-ui</Logo>
        <Subtitle>Theme-agnostic component library</Subtitle>
      </SidebarHeader>

      <ThemeSwitcher collapsed={collapsed} />

      <CategorySection $collapsed={collapsed}>
        <CategoryTitle>Components</CategoryTitle>
        <NavList>
          {categories.map(category => (
            <NavItem key={category.path}>
              <NavLink
                to={category.path}
                $active={location.pathname === category.path}
              >
                {category.title}
              </NavLink>
            </NavItem>
          ))}
        </NavList>
      </CategorySection>
    </Sidebar>
  )
}

function ShowcaseContent() {
  return (
    <BrowserRouter>
      <AppContainer>
        <SidebarNav />
        <Main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/primitives" element={<ComponentsPage category="primitives" />} />
            <Route path="/layout" element={<ComponentsPage category="layout" />} />
            <Route path="/typography" element={<ComponentsPage category="typography" />} />
            <Route path="/navigation" element={<ComponentsPage category="navigation" />} />
            <Route path="/feedback" element={<ComponentsPage category="feedback" />} />
            <Route path="/data" element={<ComponentsPage category="data" />} />
            <Route path="/animated" element={<ComponentsPage category="animated" />} />
            <Route path="/admin" element={<ComponentsPage category="admin" />} />
            <Route path="/analytics" element={<ComponentsPage category="analytics" />} />
            <Route path="/creator" element={<ComponentsPage category="creator" />} />
            <Route path="/forms" element={<ComponentsPage category="forms" />} />
            <Route path="/realtime" element={<ComponentsPage category="realtime" />} />
          </Routes>

          <Footer>
            <p>
              Built with 💖 by{' '}
              <a href="https://github.com/transquinnftw" target="_blank" rel="noopener noreferrer">
                QuinnFTW
              </a>
              {' | '}
              <a href="https://github.com/transquinnftw/egirl-platform" target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
            </p>
          </Footer>
        </Main>
      </AppContainer>
    </BrowserRouter>
  )
}

function App() {
  return (
    <ThemeProvider defaultTheme="luxe">
      <ShowcaseContent />
    </ThemeProvider>
  )
}

export default App
