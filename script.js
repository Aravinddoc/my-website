document.addEventListener('DOMContentLoaded', function() {
  // DOM Elements
  const hamburger = document.getElementById('hamburger-menu');
  const navMenu = document.getElementById('nav-menu');
  const body = document.body;
  const navLinks = document.querySelectorAll('.nav-menu a');
  const internalLinks = document.querySelectorAll('a[href^="#"]');
  const ctaButtons = document.querySelectorAll('.cta-button');
  const themeToggle = document.getElementById('themeToggle');
  const header = document.querySelector('header');

  // Navigation Menu Functions
  function toggleMenu() {
    // First add the squeezing class
    hamburger.classList.add('squeezing');

    // After the squeeze animation, add the active class
    setTimeout(() => {
      hamburger.classList.remove('squeezing');
      hamburger.classList.toggle('active');
      if (navMenu) {
        navMenu.classList.add('opening');
      }
      const isOpening = !body.classList.contains('menu-open');
      body.classList.toggle('menu-open');
      if (hamburger) {
        hamburger.setAttribute('aria-expanded', String(isOpening));
      }

      // Wait for the menu to finish opening
      setTimeout(() => {
        if (navMenu) {
          navMenu.classList.remove('opening');
          navMenu.classList.toggle('active');
        }
      }, 50);
    }, 100); // This timing matches the squeeze animation duration
  }

  function closeMenu() {
    // First add the squeezing class
    hamburger.classList.add('squeezing');

    // After the squeeze animation, remove active class
    setTimeout(() => {
      hamburger.classList.remove('squeezing');
      hamburger.classList.remove('active');
      if (navMenu) {
        navMenu.classList.remove('active');
        navMenu.classList.remove('opening');
      }
      body.classList.remove('menu-open');
      if (hamburger) {
        hamburger.setAttribute('aria-expanded', 'false');
      }
    }, 200);
  }

  function smoothScroll(targetElement) {
    if (targetElement) {
      closeMenu();
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }

  function handleNavLinkClick() {
    closeMenu();
  }

  function handleOutsideClick(event) {
    if (navMenu && hamburger) {
      const isClickInsideMenu = navMenu.contains(event.target);
      const isClickOnHamburger = hamburger.contains(event.target);

      if (!isClickInsideMenu && !isClickOnHamburger && navMenu.classList.contains('active')) {
        closeMenu();
      }
    }
  }

  function handleWindowResize() {
    if (navMenu && window.innerWidth > 768 && navMenu.classList.contains('active')) {
      closeMenu();
    }
  }

  function handleInternalLinkClick(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    const target = document.querySelector(targetId);
    smoothScroll(target);
  }

  // Theme Toggle Functionality
  if (themeToggle) {
    const toggleText = themeToggle.querySelector('.toggle-text');
    const root = document.documentElement;

    // Function to update theme
    function setTheme(theme) {
      if (theme === 'dark' || theme === 'light') {
        root.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        if (toggleText) {
          toggleText.textContent = `${theme} mode`;
        }
        themeToggle.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
      }
    }

    // Check for saved theme preference; otherwise respect current attribute
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      const current = root.getAttribute('data-theme') || 'light';
      if (toggleText) toggleText.textContent = `${current} mode`;
      themeToggle.setAttribute('aria-pressed', current === 'dark' ? 'true' : 'false');
    }

    // Listen for theme toggle clicks
    themeToggle.addEventListener('click', function() {
      const currentTheme = root.getAttribute('data-theme');
      setTheme(currentTheme === 'light' ? 'dark' : 'light');
    });

    // Listen for system theme changes
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    darkModeMediaQuery.addEventListener('change', function(e) {
      if (!localStorage.getItem('theme')) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    });
  }

  // Event Listeners
  if (hamburger) {
    hamburger.addEventListener('click', toggleMenu);
    // Close on Escape
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        closeMenu();
      }
    });
  }

  if (navLinks) {
    navLinks.forEach(link => link.addEventListener('click', handleNavLinkClick));
  }

  document.addEventListener('click', handleOutsideClick);
  window.addEventListener('resize', handleWindowResize);

  // Header scrolled state for subtle shadow/background
  const updateHeaderScrolled = () => {
    if (!header) return;
    if (window.scrollY > 8) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  updateHeaderScrolled();
  window.addEventListener('scroll', updateHeaderScrolled, { passive: true });

  // Active link highlighting
  const sections = Array.from(document.querySelectorAll('main section[id]'));
  const highlightActiveLink = () => {
    const scrollPos = window.scrollY + 120; // header offset
    let currentId = sections[0] ? sections[0].id : '';
    for (const section of sections) {
      if (section.offsetTop <= scrollPos) {
        currentId = section.id;
      }
    }
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (!href) return;
      const id = href.startsWith('#') ? href.slice(1) : '';
      if (id === currentId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  };
  highlightActiveLink();
  window.addEventListener('scroll', highlightActiveLink, { passive: true });

  if (internalLinks) {
    internalLinks.forEach(anchor => anchor.addEventListener('click', handleInternalLinkClick));
  }

  if (ctaButtons) {
    ctaButtons.forEach(button => button.addEventListener('click', handleInternalLinkClick));
  }

  // Add event listener removal on page unload
  window.addEventListener('unload', function() {
    document.removeEventListener('click', handleOutsideClick);
    window.removeEventListener('resize', handleWindowResize);
  });
});