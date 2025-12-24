// Theme Management
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.querySelector('.theme-icon');
const body = document.body;

// Load saved theme
const savedTheme = localStorage.getItem('theme') || 'dark';
if (savedTheme === 'light') {
    body.classList.add('light-theme');
    themeIcon.textContent = '☀️';
} else {
    // Default to dark theme
    body.classList.remove('light-theme');
    themeIcon.textContent = '🌙';
}

// Theme toggle handler
themeToggle.addEventListener('click', () => {
    body.classList.toggle('light-theme');
    const isLight = body.classList.contains('light-theme');
    themeIcon.textContent = isLight ? '☀️' : '🌙';
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
});

// Navigation System
const backBtn = document.getElementById('backBtn');
const homeSection = document.getElementById('home');
const detailSections = document.querySelectorAll('.section-detail');
const courseCards = document.querySelectorAll('.course-card');
const header = document.getElementById('header');

// Show section function
let isInitialLoad = true; // Check if it's the first load

function showSection(sectionId) {
    // Hide all sections first
    homeSection.style.display = 'none';
    detailSections.forEach(section => section.style.display = 'none');

    if (sectionId === 'home') {
        homeSection.style.display = 'block';
        backBtn.style.display = 'none';

        // Go to top or course section based on load type
        if (isInitialLoad) {
            window.scrollTo({ top: 0, behavior: 'instant' });
            isInitialLoad = false; // এরপর থেকে আর টপ-এ যাবে না
        }
        // Go to course section if not initial load
        else {
            const courseSection = document.querySelector('.courses-section');
            if (courseSection) {
                courseSection.scrollIntoView({ behavior: 'smooth' });
            }
        }
    } else {
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.style.display = 'block';
            backBtn.style.display = 'flex';
            window.scrollTo({ top: 0, behavior: 'smooth' });
            isInitialLoad = false;
        }
    }
}

// Explore Courses button handler
const exploreBtn = document.getElementById('exploreBtn');

if (exploreBtn) {
    exploreBtn.addEventListener('click', () => {
        const courseSection = document.querySelector('.courses-section');
        if (courseSection) {
            courseSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
}

// Course card click handlers
courseCards.forEach(card => {
    card.addEventListener('click', (e) => {
        if (e.target.classList.contains('course-btn')) {
            const courseId = card.getAttribute('data-course');
            window.location.hash = courseId;
        }
    });
});

// Back button handler
backBtn.addEventListener('click', () => {
    window.location.hash = 'home';
});

// Handle hash changes
function handleHashChange() {
    const hash = window.location.hash.slice(1) || 'home';
    showSection(hash);
}

window.addEventListener('hashchange', handleHashChange);
window.addEventListener('load', handleHashChange);

// Header scroll effect
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
});

// Smooth scroll for internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href.length > 1) {
            e.preventDefault();
            const targetId = href.slice(1);
            window.location.hash = targetId;
        }
    });
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all animated elements
document.querySelectorAll('.course-card, .teacher-card, .stat-card, .detail-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Button hover effects
document.querySelectorAll('.btn, .course-btn').forEach(btn => {
    btn.addEventListener('mouseenter', function () {
        this.style.transform = 'translateY(-3px)';
    });

    btn.addEventListener('mouseleave', function () {
        this.style.transform = 'translateY(0)';
    });
});

// Stats counter animation
function animateCounter(element, target, hasPlus) {
    const duration = 2000;
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + (hasPlus ? '+' : '');
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + (hasPlus ? '+' : '');
        }
    }, 16);
}

// Track which stats have been animated
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
            entry.target.classList.add('animated');
            const numberElement = entry.target.querySelector('.stat-number');

            // Check if there's a plus sign
            const originalText = numberElement.textContent;
            const hasPlus = originalText.includes('+');

            // Number value extraction
            const value = parseInt(originalText.replace(/\D/g, ''));

            numberElement.textContent = '0'; // শুরুতে ০ করে দেওয়া
            animateCounter(numberElement, value, hasPlus);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-card').forEach(card => {
    statsObserver.observe(card);
});

// Logo click handler
document.querySelector('.logo').addEventListener('click', () => {
    isInitialLoad = true;
    window.location.hash = 'home';
});

// Prevent double-click text selection on buttons
document.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('mousedown', (e) => {
        e.preventDefault();
    });
});

// Initialize
console.log('PB Academia - Website Loaded Successfully ✓');