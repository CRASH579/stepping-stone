// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      window.scrollTo({
        top: target.offsetTop - 80,
        behavior: 'smooth'
      });
      
      // Close mobile menu if open
      const navLinks = document.querySelector('.nav-links');
      if (navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
      }
    }
  });
});

// Improved Intersection Observer for fade-in with sequential timing
const observerOptions = {
  threshold: 0.15,
  rootMargin: '0px 0px -50px 0px'
};

const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Add staggered delay based on the element's position
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, i * 100);
    }
  });
}, observerOptions);

document.querySelectorAll('.fade-in').forEach(el => fadeObserver.observe(el));

// Enhanced stat number animation with easing
const animateStats = () => {
  document.querySelectorAll('.stat-number').forEach(stat => {
    const target = parseInt(stat.textContent.replace(/\D/g, ''));
    const duration = 2000; // ms
    const frameDuration = 1000/60; // 60fps
    const totalFrames = Math.round(duration/frameDuration);
    
    // Use easeOutExpo for a more natural counting effect
    const easeOutExpo = t => (t === 1) ? 1 : 1 - Math.pow(2, -10 * t);
    
    let frame = 0;
    const counter = setInterval(() => {
      frame++;
      const progress = easeOutExpo(frame / totalFrames);
      const currentCount = Math.round(target * progress);
      
      if (frame === totalFrames) {
        stat.textContent = target.toLocaleString();
        clearInterval(counter);
      } else {
        stat.textContent = currentCount.toLocaleString();
      }
    }, frameDuration);
  });
};

const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateStats();
      statObserver.disconnect();
    }
  });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.stats');
if (statsSection) statObserver.observe(statsSection);

// Mobile menu functionality
const mobileMenu = document.querySelector('.mobile-menu');
const navLinks = document.querySelector('.nav-links');
const body = document.body;

if (mobileMenu && navLinks) {
  // Set initial delay for menu items
  const navItems = navLinks.querySelectorAll('li');
  navItems.forEach((item, index) => {
    item.style.setProperty('--delay', index);
  });

  mobileMenu.addEventListener('click', (e) => {
    e.stopPropagation();
    e.preventDefault();
    const isExpanded = mobileMenu.getAttribute('aria-expanded') === 'true';
    
    // Toggle the menu
    mobileMenu.setAttribute('aria-expanded', String(!isExpanded));
    mobileMenu.classList.toggle('active');
    navLinks.classList.toggle('active');
    
    // Handle body scroll
    body.style.overflow = isExpanded ? '' : 'hidden';
  });

  // Close menu when clicking a link
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      mobileMenu.classList.remove('active');
      mobileMenu.setAttribute('aria-expanded', 'false');
      body.style.overflow = '';
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (navLinks.classList.contains('active') && 
        !navLinks.contains(e.target) && 
        !mobileMenu.contains(e.target)) {
      navLinks.classList.remove('active');
      mobileMenu.classList.remove('active');
      mobileMenu.setAttribute('aria-expanded', 'false');
      body.style.overflow = '';
    }
  });
}

// Add scroll-based header styling
window.addEventListener('scroll', () => {
  const header = document.querySelector('header');
  if (window.scrollY > 100) {
    header.style.boxShadow = 'var(--shadow)';
  } else {
    header.style.boxShadow = 'var(--shadow-sm)';
  }
});

// Add passive scroll event listeners for performance
document.addEventListener('touchstart', function() {}, {passive: true});
document.addEventListener('touchmove', function() {}, {passive: true});