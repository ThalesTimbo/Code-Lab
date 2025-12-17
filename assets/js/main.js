/**
 * CodeLab - Main JavaScript
 * Animações, Lazy Loading, Interatividade
 */

(function() {
    'use strict';

    // Navigation

    const navbar = document.getElementById('navbar');
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const sectionsToReveal = [
        ...document.querySelectorAll('section'),
        ...document.querySelectorAll('.service-card'),
        ...document.querySelectorAll('.portfolio-item'),
        ...document.querySelectorAll('.team-card'),
        ...document.querySelectorAll('.contact-item'),
        ...document.querySelectorAll('.stat-item')
    ];

    // Navbar scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });

    // Mobile menu toggle
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });

        // Close menu on link click
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
            });
        });
    }

    // Reveal on scroll
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -5% 0px'
    });

    sectionsToReveal.forEach(el => {
        if (!el.classList.contains('reveal')) {
            el.classList.add('reveal');
        }
        revealObserver.observe(el);
    });

    // Active nav link on scroll
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop - 150) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

  window.addEventListener("load", () => {
    const loading = document.getElementById("loading-screen");

    loading.style.opacity = "0";

    setTimeout(() => {
      loading.style.display = "none";
    }, 600);
  });


    // Lazy Loading

    const lazyLoadObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                
                // Load image if data-src exists
                if (element.dataset.src) {
                    const src = element.dataset.src.trim();
                    const safeSrc = encodeURI(src);
                    element.style.backgroundImage = `url("${safeSrc}")`;
                    element.dataset.src = '';
                }
                
                // Add loaded class
                element.classList.add('loaded');
                observer.unobserve(element);
            }
        });
    }, {
        rootMargin: '50px',
        threshold: 0.1
    });

    // Observe all lazy-load elements
    document.addEventListener('DOMContentLoaded', () => {
        const lazyElements = document.querySelectorAll('.lazy-load');
        lazyElements.forEach(el => lazyLoadObserver.observe(el));
    });

    // ============================================
    // Counter Animation
    // ============================================
    const animateCounter = (element, target, duration = 2000) => {
        let start = 0;
        const increment = target / (duration / 16);
        
        const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
                element.textContent = target + (target >= 100 ? '+' : '');
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(start) + (target >= 100 ? '+' : '');
            }
        }, 16);
    };

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                const statNumber = entry.target.querySelector('.stat-number');
                const target = parseInt(statNumber.dataset.target);
                animateCounter(statNumber, target);
                entry.target.classList.add('animated');
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat-item').forEach(stat => {
        counterObserver.observe(stat);
    });

    // ============================================
    // Form Handling
    // ============================================
    const contactForm = document.getElementById('contactForm');
    const phoneInput = document.getElementById('phone');
    
    if (contactForm) {
        if (phoneInput) {
            phoneInput.addEventListener('input', () => {
                // máscara simples BR: (11) 99999-9999
                let v = String(phoneInput.value || '').replace(/\D/g, '').slice(0, 11);
                if (v.length > 10) {
                    v = v.replace(/^(\d{2})(\d{5})(\d{4}).*$/, '($1) $2-$3');
                } else if (v.length > 6) {
                    v = v.replace(/^(\d{2})(\d{4})(\d{0,4}).*$/, '($1) $2-$3');
                } else if (v.length > 2) {
                    v = v.replace(/^(\d{2})(\d{0,4}).*$/, '($1) $2');
                } else if (v.length > 0) {
                    v = v.replace(/^(\d{0,2}).*$/, '($1');
                }
                phoneInput.value = v;
            });
        }

        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const button = contactForm.querySelector('button[type="submit"]');
            const originalText = button ? button.textContent : '';

            if (button) {
                button.textContent = 'Enviando...';
                button.disabled = true;
            }

            const formData = new FormData(contactForm);

            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json'
                    },
                    body: formData
                });

                if (!response.ok) {
                    throw new Error('FormSubmit response not ok');
                }

                if (button) {
                    button.textContent = 'Enviado!';
                }
                contactForm.reset();
            } catch (error) {
                console.error('Erro ao enviar formulário:', error);
                if (button) {
                    button.textContent = 'Tente novamente';
                }
            } finally {
                if (button) {
                    setTimeout(() => {
                        button.textContent = originalText || 'Enviar';
                        button.disabled = false;
                    }, 2500);
                }
            }
        });
    }

    // ============================================
    // Portfolio Hover Effects
    // ============================================
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    const doubleTapDelay = 400; // ms
    const lastTapMap = new WeakMap();

    const openPortfolioUrl = (item) => {
        const targetUrl = item.dataset.url;
        if (targetUrl) {
            window.open(targetUrl, '_blank', 'noopener');
        }
    };

    portfolioItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.02)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });

        // Desktop: duplo clique nativo
        item.addEventListener('dblclick', function() {
            openPortfolioUrl(this);
        });

        // Mobile: emular duplo toque
        item.addEventListener('pointerup', function(event) {
            if (event.pointerType !== 'touch') return;
            const lastTap = lastTapMap.get(this) || 0;
            const now = Date.now();
            if (now - lastTap <= doubleTapDelay) {
                openPortfolioUrl(this);
                lastTapMap.set(this, 0);
            } else {
                lastTapMap.set(this, now);
            }
        });
    });

    // ============================================
    // Service Cards Animation
    // ============================================
    const serviceObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('loaded');
                }, index * 100);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.service-card').forEach(card => {
        serviceObserver.observe(card);
    });

    // ============================================
    // Cursor Effect (Optional - can be removed)
    // ============================================
    const createCursor = () => {
        const cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        document.body.appendChild(cursor);
        
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });
        
        // Highlight on interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .portfolio-item');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.style.transform = 'scale(1.5)';
            });
            el.addEventListener('mouseleave', () => {
                cursor.style.transform = 'scale(1)';
            });
        });
    };

    // Uncomment to enable cursor effect
    // createCursor();

})();


