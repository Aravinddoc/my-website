document.addEventListener('DOMContentLoaded', function() {
  // DOM Elements
  const hamburger = document.getElementById('hamburger-menu');
  const navMenu = document.getElementById('nav-menu');
  const body = document.body;
  const navLinks = document.querySelectorAll('.nav-menu a');
  const internalLinks = document.querySelectorAll('a[href^="#"]');
  const ctaButtons = document.querySelectorAll('.cta-button');
  const themeToggle = document.getElementById('themeToggle');

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
      body.classList.toggle('menu-open');

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
      }
    }

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);

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
  }

  if (navLinks) {
    navLinks.forEach(link => link.addEventListener('click', handleNavLinkClick));
  }

  document.addEventListener('click', handleOutsideClick);
  window.addEventListener('resize', handleWindowResize);

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