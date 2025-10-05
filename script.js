document.addEventListener('DOMContentLoaded', function() {
  // DOM Elements
  const hamburger = document.getElementById('hamburger-menu');
  const navMenu = document.getElementById('nav-menu');
  const body = document.body;
  const navLinks = document.querySelectorAll('.nav-menu a');
  const internalLinks = document.querySelectorAll('a[href^="#"]');
  const ctaButtons = document.querySelectorAll('.cta-button');
  const themeToggle = document.getElementById('themeToggle');
  const scrollToTopBtn = document.getElementById('scrollToTop');
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

  // Scroll to Top Button Functionality
  if (scrollToTopBtn) {
    // Show/hide scroll to top button
    function toggleScrollToTopButton() {
      if (window.pageYOffset > 300) {
        scrollToTopBtn.classList.add('visible');
      } else {
        scrollToTopBtn.classList.remove('visible');
      }
    }

    // Scroll to top when button is clicked
    scrollToTopBtn.addEventListener('click', function() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });

    // Check scroll position on scroll
    window.addEventListener('scroll', toggleScrollToTopButton);
    
    // Check initial scroll position
    toggleScrollToTopButton();
  }

  // Header Scroll Effect
  let lastScroll = 0;
  function handleHeaderScroll() {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
  }

  window.addEventListener('scroll', handleHeaderScroll);

  // Intersection Observer for Scroll Animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all sections
  const sections = document.querySelectorAll('section');
  sections.forEach(section => {
    observer.observe(section);
  });

  // Add subtle parallax effect to home section
  const homeSection = document.getElementById('home');
  if (homeSection) {
    window.addEventListener('scroll', function() {
      const scrolled = window.pageYOffset;
      const parallaxSpeed = 0.5;
      if (scrolled < window.innerHeight) {
        homeSection.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
      }
    });
  }

  // Enhanced hover effects for CTA buttons
  if (ctaButtons) {
    ctaButtons.forEach(button => {
      button.addEventListener('mouseenter', function(e) {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        button.style.setProperty('--x', x + 'px');
        button.style.setProperty('--y', y + 'px');
      });
    });
  }

  // Smooth scroll behavior for all internal links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
        
        closeMenu();
      }
    });
  });

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

  // Add loading animation
  window.addEventListener('load', function() {
    document.body.classList.add('loaded');
  });

  // Prevent animations on window resize
  let resizeTimer;
  window.addEventListener('resize', function() {
    document.body.classList.add('resize-animation-stopper');
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
      document.body.classList.remove('resize-animation-stopper');
    }, 400);
  });

  // Add event listener removal on page unload
  window.addEventListener('unload', function() {
    document.removeEventListener('click', handleOutsideClick);
    window.removeEventListener('resize', handleWindowResize);
  });

  // Add smooth reveal animation on page load
  setTimeout(() => {
    document.querySelectorAll('section').forEach((section, index) => {
      setTimeout(() => {
        section.style.animationDelay = `${index * 0.1}s`;
      }, index * 100);
    });
  }, 100);
});
