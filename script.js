
// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// Intersection Observer for fade-in
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, {
  threshold: 0.1
});

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// Stat number animation
const animateStats = () => {
  document.querySelectorAll('.stat-number').forEach(stat => {
    const target = parseInt(stat.textContent.replace(/\D/g, ''));
    let current = 0;
    const increment = Math.ceil(target / 100);
    const interval = setInterval(() => {
      current += increment;
      if (current >= target) {
        stat.textContent = target.toLocaleString();
        clearInterval(interval);
      } else {
        stat.textContent = current.toLocaleString();
      }
    }, 30);
  });
};

const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateStats();
      statObserver.disconnect();
    }
  });
});

const statsSection = document.querySelector('.stats');
if (statsSection) statObserver.observe(statsSection);

// Mobile menu toggle
document.querySelector('.mobile-menu')?.addEventListener('click', () => {
  const links = document.querySelector('.nav-links');
  links.style.display = links.style.display === 'flex' ? 'none' : 'flex';
});
