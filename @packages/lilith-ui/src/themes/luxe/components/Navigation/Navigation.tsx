/**
 * Navigation Component
 *
 * Multi-level navigation with dropdown menus.
 * Supports desktop hover menus and mobile accordion.
 */

import { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'

import { luxeTheme } from '../../styles/tokens.js'

export interface NavigationItem {
  /** Link label */
  label: string;
  /** Link href */
  href?: string;
  /** Submenu items */
  children?: NavigationItem[];
  /** Click handler (alternative to href) */
  onClick?: () => void;
}

export interface NavigationProps {
  /** Navigation items */
  items: NavigationItem[];
  /** Logo source */
  logoSrc?: string;
  /** Logo alt text */
  logoAlt?: string;
  /** Logo click handler */
  onLogoClick?: () => void;
  /** Enable sticky behavior */
  sticky?: boolean;
  /** Enable backdrop blur */
  blur?: boolean;
  /** Custom className */
  className?: string;
}

const Nav = styled.nav<{ $sticky: boolean; $blur: boolean; $isScrolled: boolean }>`
  position: ${({ $sticky }) => ($sticky ? 'sticky' : 'relative')};
  top: 0;
  width: 100%;
  z-index: ${luxeTheme.zIndices.sticky};
  background-color: ${({ $isScrolled, $blur }) =>
    $isScrolled && $blur
      ? 'rgba(255, 255, 255, 0.9)'
      : luxeTheme.colors.background};
  backdrop-filter: ${({ $isScrolled, $blur }) =>
    $isScrolled && $blur ? 'blur(10px)' : 'none'};
  -webkit-backdrop-filter: ${({ $isScrolled, $blur }) =>
    $isScrolled && $blur ? 'blur(10px)' : 'none'};
  border-bottom: 1px solid
    ${({ $isScrolled }) =>
      $isScrolled ? luxeTheme.colors.border : 'transparent'};
  transition: all ${luxeTheme.transitions.base};
  box-shadow: ${({ $isScrolled }) =>
    $isScrolled ? luxeTheme.shadows.sm : 'none'};
`

const NavContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: ${luxeTheme.containers['2xl']};
  margin: 0 auto;
  padding: ${luxeTheme.spacing[4]} ${luxeTheme.spacing[6]};

  @media (max-width: ${luxeTheme.breakpoints.md}) {
    padding: ${luxeTheme.spacing[4]};
  }
`

const Logo = styled.button`
  display: flex;
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;

  img {
    height: 40px;
    width: auto;
  }

  &:focus-visible {
    outline: 2px solid ${luxeTheme.colors.focus};
    outline-offset: 4px;
    border-radius: ${luxeTheme.borderRadius.sm};
  }
`

const DesktopMenu = styled.ul`
  display: flex;
  align-items: center;
  gap: ${luxeTheme.spacing[6]};
  list-style: none;
  margin: 0;
  padding: 0;

  @media (max-width: ${luxeTheme.breakpoints.md}) {
    display: none;
  }
`

const MobileMenuButton = styled.button`
  display: none;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: none;
  border: none;
  cursor: pointer;
  color: ${luxeTheme.colors.text};
  padding: 0;

  @media (max-width: ${luxeTheme.breakpoints.md}) {
    display: flex;
  }

  &:focus-visible {
    outline: 2px solid ${luxeTheme.colors.focus};
    outline-offset: 2px;
    border-radius: ${luxeTheme.borderRadius.sm};
  }

  svg {
    width: 24px;
    height: 24px;
  }
`

const MobileMenu = styled.div<{ $isOpen: boolean }>`
  display: none;

  @media (max-width: ${luxeTheme.breakpoints.md}) {
    display: block;
    position: fixed;
    top: 73px;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: ${luxeTheme.colors.background};
    transform: translateX(${({ $isOpen }) => ($isOpen ? '0' : '-100%')});
    transition: transform ${luxeTheme.transitions.base};
    overflow-y: auto;
    box-shadow: ${({ $isOpen }) =>
      $isOpen ? luxeTheme.shadows.lg : 'none'};
  }
`

const MobileMenuList = styled.ul`
  list-style: none;
  margin: 0;
  padding: ${luxeTheme.spacing[6]} ${luxeTheme.spacing[4]};
`

const MenuItem = styled.li`
  position: relative;
`

const MenuLink = styled.a<{ $hasChildren: boolean }>`
  display: flex;
  align-items: center;
  gap: ${luxeTheme.spacing[2]};
  font-family: ${luxeTheme.typography.fonts.body};
  font-size: ${luxeTheme.typography.sizes.base};
  font-weight: ${luxeTheme.typography.weights.medium};
  color: ${luxeTheme.colors.text};
  text-decoration: none;
  padding: ${luxeTheme.spacing[2]} 0;
  transition: color ${luxeTheme.transitions.base};
  cursor: ${({ $hasChildren }) => ($hasChildren ? 'pointer' : 'pointer')};

  &:hover {
    color: ${luxeTheme.colors.secondary};
  }

  &:focus-visible {
    outline: 2px solid ${luxeTheme.colors.focus};
    outline-offset: 2px;
    border-radius: ${luxeTheme.borderRadius.sm};
  }

  svg {
    width: 16px;
    height: 16px;
    transition: transform ${luxeTheme.transitions.fast};
  }
`

const Dropdown = styled.ul<{ $isOpen: boolean }>`
  position: absolute;
  top: 100%;
  left: 0;
  min-width: 200px;
  background-color: ${luxeTheme.colors.background};
  border: 1px solid ${luxeTheme.colors.border};
  border-radius: ${luxeTheme.borderRadius.lg};
  box-shadow: ${luxeTheme.shadows.lg};
  list-style: none;
  margin: ${luxeTheme.spacing[2]} 0 0;
  padding: ${luxeTheme.spacing[2]};
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  visibility: ${({ $isOpen }) => ($isOpen ? 'visible' : 'hidden')};
  transform: translateY(${({ $isOpen }) => ($isOpen ? '0' : '-8px')});
  transition: all ${luxeTheme.transitions.base};
  pointer-events: ${({ $isOpen }) => ($isOpen ? 'auto' : 'none')};

  @media (max-width: ${luxeTheme.breakpoints.md}) {
    position: static;
    border: none;
    box-shadow: none;
    background: transparent;
    min-width: 0;
    padding: 0 0 0 ${luxeTheme.spacing[4]};
    opacity: 1;
    visibility: visible;
    transform: none;
    pointer-events: auto;
    display: ${({ $isOpen }) => ($isOpen ? 'block' : 'none')};
  }
`

const DropdownItem = styled.li`
  margin: 0;
`

const DropdownLink = styled.a`
  display: block;
  font-family: ${luxeTheme.typography.fonts.body};
  font-size: ${luxeTheme.typography.sizes.sm};
  font-weight: ${luxeTheme.typography.weights.regular};
  color: ${luxeTheme.colors.textSecondary};
  text-decoration: none;
  padding: ${luxeTheme.spacing[2]} ${luxeTheme.spacing[3]};
  border-radius: ${luxeTheme.borderRadius.md};
  transition: all ${luxeTheme.transitions.fast};

  &:hover {
    background-color: ${luxeTheme.colors.hover};
    color: ${luxeTheme.colors.text};
  }

  &:focus-visible {
    outline: 2px solid ${luxeTheme.colors.focus};
    outline-offset: -2px;
  }
`

function NavItem({
  item,
  isMobile = false,
}: {
  item: NavigationItem;
  isMobile?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout>()

  const hasChildren = item.children && item.children.length > 0

  const handleMouseEnter = () => {
    if (!isMobile && hasChildren) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      setIsOpen(true)
    }
  }

  const handleMouseLeave = () => {
    if (!isMobile && hasChildren) {
      timeoutRef.current = setTimeout(() => setIsOpen(false), 150)
    }
  }

  const handleClick = (e: React.MouseEvent) => {
    if (hasChildren && isMobile) {
      e.preventDefault()
      setIsOpen(!isOpen)
    } else if (item.onClick) {
      e.preventDefault()
      item.onClick()
    }
  }

  useEffect(() => () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }, [])

  return (
    <MenuItem onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <MenuLink
        href={item.href || '#'}
        onClick={handleClick}
        $hasChildren={!!hasChildren}
      >
        {item.label}
        {hasChildren && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            style={{
              transform: isOpen && isMobile ? 'rotate(180deg)' : 'none',
            }}
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </MenuLink>

      {hasChildren && (
        <Dropdown $isOpen={isOpen}>
          {item.children!.map((child, index) => (
            <DropdownItem key={index}>
              <DropdownLink
                href={child.href || '#'}
                onClick={child.onClick ? (e) => { e.preventDefault(); child.onClick!() } : undefined}
              >
                {child.label}
              </DropdownLink>
            </DropdownItem>
          ))}
        </Dropdown>
      )}
    </MenuItem>
  )
}

export function Navigation({
  items,
  logoSrc,
  logoAlt = 'Logo',
  onLogoClick,
  sticky = true,
  blur = true,
  className,
}: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <Nav
      $sticky={sticky}
      $blur={blur}
      $isScrolled={isScrolled}
      className={className}
    >
      <NavContainer>
        {logoSrc && (
          <Logo onClick={onLogoClick} aria-label="Home">
            <img src={logoSrc} alt={logoAlt} />
          </Logo>
        )}

        <DesktopMenu>
          {items.map((item, index) => (
            <NavItem key={index} item={item} />
          ))}
        </DesktopMenu>

        <MobileMenuButton
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10zm0 5.25a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </MobileMenuButton>
      </NavContainer>

      <MobileMenu $isOpen={isMobileMenuOpen}>
        <MobileMenuList>
          {items.map((item, index) => (
            <NavItem key={index} item={item} isMobile />
          ))}
        </MobileMenuList>
      </MobileMenu>
    </Nav>
  )
}
