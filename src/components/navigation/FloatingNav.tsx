import styled from '@emotion/styled';
import { motion, useScroll, useSpring } from 'framer-motion';
import { theme } from '../../styles/theme';
import { useEffect, useState } from 'react';
import { FaBars } from 'react-icons/fa';

const ProgressBar = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(
    90deg,
    ${theme.colors.accent},
    ${theme.colors.accent}dd
  );
  transform-origin: 0%;
  z-index: 1000;
  box-shadow: 0 0 10px ${theme.colors.accent}80;

  @media print {
    display: none;
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    height: 2px;
  }
`;

const NavContainer = styled.nav`
  position: fixed;
  top: 0;
  right: 0;
  margin-top: 8px;
  margin-right: 16px;
  z-index: 1001;

  @media print {
    display: none;
  }
`;

const NavList = styled.ul<{ open: boolean }>`
  list-style: none;
  display: flex;
  gap: 20px;
  padding: 10px 20px;
  border-radius: 8px;

  @media (max-width: ${theme.breakpoints.sm}) {
    flex-direction: column;
    position: absolute;
    top: 40px;
    right: 0;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    display: ${({ open }) => (open ? 'flex' : 'none')};
  }
`;

const NavItem = styled.li`
  font-size: 20px;

  a {
    text-decoration: none;
    color: ${theme.colors.text};

    &:hover {
      color: ${theme.colors.accent};
    }
  }
`;

const Hamburger = styled.button`
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  color: ${theme.colors.text};
  font-size: 20px;

  @media (max-width: ${theme.breakpoints.sm}) {
    display: block;
  }
`;

const sections = [
  { id: 'hero', name: 'About' },
  { id: 'projects', name: 'Projects' },
  { id: 'skills', name: 'Skills' },
  { id: 'contact', name: 'Contact' }
];

export const FloatingNav = () => {
  const [, setActiveSection] = useState('hero');
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;

      sections.forEach(({ id, name }) => {
        const element = document.getElementById(id);
        if (element) {
          const { top, bottom } = element.getBoundingClientRect();
          if (top <= windowHeight / 2 && bottom >= windowHeight / 2) {
            setActiveSection(id);
            const liveRegion = document.getElementById('section-announcer');
            if (liveRegion) {
              liveRegion.textContent = `Current section: ${name}`;
            }
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setMenuOpen(false);
    }
  };

  return (
    <>
      <ProgressBar
        style={{ scaleX }}
        role="progressbar"
        aria-label="Reading progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(scrollYProgress.get() * 100)}
      />
      <NavContainer>
        <Hamburger
          aria-label="Toggle navigation menu"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          <FaBars />
        </Hamburger>
        <NavList open={menuOpen}>
          {sections.map((section) => (
            <NavItem key={section.id}>
              <a href={`#${section.id}`} onClick={(e) => {
                e.preventDefault();
                scrollToSection(section.id);
              }}>
                {section.name}
              </a>
            </NavItem>
          ))}
        </NavList>
      </NavContainer>
      <div
        id="section-announcer"
        className="sr-only"
        role="status"
        aria-live="polite"
      />
    </>
  );
};
