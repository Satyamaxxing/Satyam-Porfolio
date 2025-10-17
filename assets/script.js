// Simple Portfolio JavaScript
class SimplePortfolio {
    constructor() {
        this.theme = localStorage.getItem('theme') || 'dark';
        this.themeToggle = document.getElementById('theme-toggle');
        this.loadMoreBtn = document.querySelector('.load-more-btn');
        this.projectsGrid = document.querySelector('.projects-grid');
        this.visitorCountEl = document.getElementById('visitor-count');
        
        // Apply theme immediately before other initialization
        this.applyTheme();
        this.init();
    }

    init() {
        this.setupTheme();
        this.setupLoadMore();
        this.setupImageFallback();
        this.setupSmoothScrolling();
        this.setupAnimations();
        this.setupVisitorCounter();
        this.setupProfileImageClick();
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
            
            // Add animation without observer interference
            projectElement.style.opacity = '1';
            projectElement.style.transform = 'translateY(0)';
            setTimeout(() => {
                projectElement.classList.add('fade-in');
            }, 100);
        });

        // Update button
        const buttonSpan = this.loadMoreBtn.querySelector('span');
        if (buttonSpan) {
            buttonSpan.textContent = 'All Projects Loaded ✓';
        } else {
            this.loadMoreBtn.textContent = 'All Projects Loaded ✓';
        }
        
        // Change button style to show completion
        this.loadMoreBtn.style.background = 'var(--accent)';
        this.loadMoreBtn.style.color = 'var(--bg)';
        this.loadMoreBtn.style.cursor = 'default';
        this.loadMoreBtn.disabled = true;
        
        // Hide button after longer delay so users can see the success state
        setTimeout(() => {
            this.loadMoreBtn.style.opacity = '0';
            this.loadMoreBtn.style.transform = 'translateY(20px)';
            setTimeout(() => {
                this.loadMoreBtn.style.display = 'none';
            }, 300);
        }, 3000);
    }

    createProjectElement(project) {
        const article = document.createElement('article');
        article.className = 'project loaded-project';
        article.style.opacity = '0';
        article.style.transform = 'translateY(20px)';
        article.style.transition = 'all 0.6s ease-out';
        
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

        // Observe sections and cards (but not loaded projects)
        document.querySelectorAll('section, .project:not(.loaded-project), .skill').forEach(el => {
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

    // Profile Image Click Effect
    setupProfileImageClick() {
        const profileImage = document.querySelector('.profile-image');
        const sarcasticMessages = [
            "Really? Clicking my face? That's not how networking works! 🤨",
            "Wow, what did you expect to happen? A secret menu? 🙄",
            "Congratulations! You've discovered... absolutely nothing! 🎉",
            "Oh look, someone found the most obvious clickable thing! 👏",
            "Fun fact: Clicking faces doesn't make you friends! 😏",
            "Achievement unlocked: Professional Time Waster! 🏆",
            "That's not how you download more RAM, buddy! 💾",
            "Plot twist: I'm still just a picture! Mind = blown! 🤯",
            "You must be really bored to click random images! 😴",
            "Breaking news: Local person discovers hover effects! 📰",
            "Roses are red, violets are blue, you clicked my face, what's wrong with you? 🌹",
            "Error 404: Your social skills not found! 🚫"
        ];

        let clickCount = 0;
        let messageTimeout;

        if (profileImage) {
            profileImage.style.cursor = 'pointer';
            profileImage.addEventListener('click', () => {
                clickCount++;
                
                // Clear any existing message
                this.clearMessage();
                
                // Get a random message
                const randomMessage = sarcasticMessages[Math.floor(Math.random() * sarcasticMessages.length)];
                
                // Special messages for multiple clicks
                let finalMessage = randomMessage;
                if (clickCount > 5) {
                    finalMessage = "Seriously? You've clicked " + clickCount + " times! Get a hobby! 🤦‍♂️";
                } else if (clickCount > 10) {
                    finalMessage = "Okay, I'm genuinely concerned about you now... 😳";
                }
                
                // Show message
                this.showSarcasticMessage(finalMessage);
                
                // Add click animation
                profileImage.style.transform = 'scale(0.95) rotate(5deg)';
                profileImage.style.filter = 'brightness(1.2) saturate(1.5)';
                
                setTimeout(() => {
                    profileImage.style.transform = 'scale(1) rotate(0deg)';
                    profileImage.style.filter = 'brightness(1) saturate(1)';
                }, 200);
                
                // Auto-hide message after 4 seconds
                messageTimeout = setTimeout(() => {
                    this.clearMessage();
                }, 4000);
            });
        }
    }

    showSarcasticMessage(message) {
        // Remove any existing message
        this.clearMessage();
        
        // Create message element
        const messageDiv = document.createElement('div');
        messageDiv.className = 'sarcastic-message';
        messageDiv.textContent = message;
        messageDiv.id = 'sarcastic-msg';
        
        // Insert after profile section
        const profileSection = document.querySelector('.profile-section');
        if (profileSection) {
            profileSection.insertAdjacentElement('afterend', messageDiv);
            
            // Animate in
            setTimeout(() => {
                messageDiv.classList.add('show');
            }, 10);
        }
    }

    clearMessage() {
        const existingMessage = document.getElementById('sarcastic-msg');
        if (existingMessage) {
            existingMessage.classList.remove('show');
            setTimeout(() => {
                if (existingMessage.parentNode) {
                    existingMessage.parentNode.removeChild(existingMessage);
                }
            }, 300);
        }
    }

    // Real Visitor Counter using API
    setupVisitorCounter() {
        this.updateVisitorCount();
    }

    async updateVisitorCount() {
        try {
            // Option 1: Using CountAPI (free service)
            const response = await fetch('https://api.countapi.xyz/hit/satyam-portfolio/visits');
            const data = await response.json();
            
            if (data && data.value) {
                this.animateCounter(0, data.value, 2000);
            } else {
                // Fallback to localStorage method
                this.fallbackVisitorCounter();
            }
        } catch (error) {
            console.log('Visitor counter API failed, using fallback');
            this.fallbackVisitorCounter();
        }
    }

    fallbackVisitorCounter() {
        // Fallback to localStorage method
        let visitorCount = localStorage.getItem('visitorCount');
        
        const lastVisit = localStorage.getItem('lastVisit');
        const currentTime = Date.now();
        const oneHour = 60 * 60 * 1000;
        
        if (!visitorCount) {
            visitorCount = 1;
        } else if (!lastVisit || (currentTime - parseInt(lastVisit)) > oneHour) {
            visitorCount = parseInt(visitorCount) + 1;
        }
        
        localStorage.setItem('visitorCount', visitorCount.toString());
        localStorage.setItem('lastVisit', currentTime.toString());
        
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