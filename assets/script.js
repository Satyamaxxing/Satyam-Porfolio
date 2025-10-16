// Simple Portfolio JavaScript
class SimplePortfolio {
    constructor() {
        this.theme = localStorage.getItem('theme') || 'dark';
        this.themeToggle = document.getElementById('theme-toggle');
        this.loadMoreBtn = document.querySelector('.load-more-btn');
        this.projectsGrid = document.querySelector('.projects-grid');
        this.visitorCountEl = document.getElementById('visitor-count');
        
        this.init();
    }

    init() {
        this.setupTheme();
        this.setupLoadMore();
        this.setupImageFallback();
        this.setupSmoothScrolling();
        this.setupAnimations();
        this.setupVisitorCounter();
    }

    // Theme Management
    setupTheme() {
        this.applyTheme();
        this.updateThemeIcon();
        
        this.themeToggle.addEventListener('click', () => {
            this.toggleTheme();
        });

        // Listen for system theme changes
        if (window.matchMedia) {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                if (!localStorage.getItem('theme')) {
                    this.theme = e.matches ? 'dark' : 'light';
                    this.applyTheme();
                    this.updateThemeIcon();
                }
            });
        }
    }

    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.theme);
        localStorage.setItem('theme', this.theme);
    }

    toggleTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        this.applyTheme();
        this.updateThemeIcon();
        this.animateThemeToggle();
    }

    updateThemeIcon() {
        const icon = this.themeToggle.querySelector('i');
        icon.className = this.theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }

    animateThemeToggle() {
        this.themeToggle.style.transform = 'scale(0.8)';
        setTimeout(() => {
            this.themeToggle.style.transform = 'scale(1)';
        }, 150);
    }

    // Load More Projects
    setupLoadMore() {
        if (this.loadMoreBtn) {
            this.loadMoreBtn.addEventListener('click', () => {
                this.loadMoreProjects();
            });
        }
    }

    loadMoreProjects() {
        const newProjects = [
            {
                title: 'E-commerce Platform',
                description: 'Full-featured e-commerce solution with payment integration and admin dashboard.',
                tech: ['Vue.js', 'Express.js', 'PostgreSQL'],
                github: '#',
                demo: '#'
            },
            {
                title: 'Weather Dashboard',
                description: 'Real-time weather application with location-based forecasts and interactive maps.',
                tech: ['React', 'Weather API', 'Chart.js'],
                github: '#',
                demo: '#'
            }
        ];

        newProjects.forEach(project => {
            const projectElement = this.createProjectElement(project);
            this.projectsGrid.appendChild(projectElement);
            
            // Add animation
            setTimeout(() => {
                projectElement.classList.add('fade-in');
            }, 100);
        });

        // Update button
        const buttonSpan = this.loadMoreBtn.querySelector('span');
        if (buttonSpan) {
            buttonSpan.textContent = 'All Projects Loaded';
        } else {
            this.loadMoreBtn.textContent = 'All Projects Loaded';
        }
        this.loadMoreBtn.disabled = true;
        setTimeout(() => {
            this.loadMoreBtn.style.display = 'none';
        }, 1500);
    }

    createProjectElement(project) {
        const article = document.createElement('article');
        article.className = 'project';
        article.style.opacity = '0';
        article.style.transform = 'translateY(20px)';
        
        article.innerHTML = `
            <h3>${project.title}</h3>
            <p>${project.description}</p>
            <div class="project-tech">
                ${project.tech.map(tech => `<span>${tech}</span>`).join('')}
            </div>
            <div class="project-links">
                <a href="${project.github}" aria-label="GitHub"><i class="fab fa-github"></i></a>
                <a href="${project.demo}" aria-label="Live Demo"><i class="fas fa-external-link-alt"></i></a>
            </div>
        `;

        return article;
    }

    // Image Fallback
    setupImageFallback() {
        const profileImg = document.getElementById('profile-img');
        const placeholder = document.querySelector('.profile-placeholder');

        if (profileImg && placeholder) {
            profileImg.addEventListener('error', () => {
                profileImg.style.display = 'none';
                placeholder.style.display = 'flex';
            });

            profileImg.addEventListener('load', () => {
                placeholder.style.display = 'none';
            });
        }
    }

    // Smooth Scrolling
    setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                if (href === '#') return;
                
                e.preventDefault();
                const target = document.querySelector(href);
                
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // Simple Animations
    setupAnimations() {
        // Intersection Observer for fade-in animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observe sections and cards
        document.querySelectorAll('section, .project, .skill').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });

        // Add hover effects to skills
        document.querySelectorAll('.skill').forEach(skill => {
            skill.addEventListener('mouseenter', () => {
                skill.style.transform = 'translateY(-2px) scale(1.02)';
            });

            skill.addEventListener('mouseleave', () => {
                skill.style.transform = 'translateY(0) scale(1)';
            });
        });
    }

    // Visitor Counter
    setupVisitorCounter() {
        // Get current visitor count from localStorage
        let visitorCount = localStorage.getItem('visitorCount');
        
        // Check if this is a new session
        const lastVisit = localStorage.getItem('lastVisit');
        const currentTime = Date.now();
        const oneHour = 60 * 60 * 1000; // 1 hour in milliseconds
        
        if (!visitorCount) {
            // First time visitor
            visitorCount = 1;
        } else if (!lastVisit || (currentTime - parseInt(lastVisit)) > oneHour) {
            // New session (more than 1 hour since last visit)
            visitorCount = parseInt(visitorCount) + 1;
        }
        
        // Store updated count and timestamp
        localStorage.setItem('visitorCount', visitorCount.toString());
        localStorage.setItem('lastVisit', currentTime.toString());
        
        // Animate counter to current value
        this.animateCounter(0, parseInt(visitorCount), 2000);
    }

    animateCounter(start, end, duration) {
        const startTime = performance.now();
        const range = end - start;
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function for smooth animation
            const easeOutExpo = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            const current = Math.floor(start + range * easeOutExpo);
            
            if (this.visitorCountEl) {
                this.visitorCountEl.textContent = current.toLocaleString();
            }
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SimplePortfolio();
    
    // Add a simple welcome message
    console.log('🎉 Welcome to Satyam Kumar\'s Portfolio!\n🚀 Simple, Clean, Functional');
});