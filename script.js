class ParallaxManager {
    constructor() {
        this.layers = document.querySelectorAll('.layer');
        this.scrollY = 0;
        this.targetScrollY = 0;
        this.lastScrollY = 0;
        this.animationId = null;
        this.hero = document.getElementById('heroScene');
        this.mouseX = 0;
        this.mouseY = 0;
        this.smoothFactor = 0.08;
        
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => this.onScroll(), { passive: true });
        this.hero.addEventListener('mousemove', (e) => this.onMouseMove(e), { passive: true });
        this.hero.addEventListener('mouseleave', () => this.resetMouseParallax(), { passive: true });
        this.update();
    }

    onScroll() {
        this.targetScrollY = window.scrollY;
    }

    onMouseMove(e) {
        this.mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        this.mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    }

    resetMouseParallax() {
        this.mouseX *= 0.95;
        this.mouseY *= 0.95;
    }

    update() {
        this.scrollY += (this.targetScrollY - this.scrollY) * this.smoothFactor;

        this.layers.forEach((layer) => {
            const speed = parseFloat(layer.getAttribute('data-speed'));
            const parallaxY = this.scrollY * speed;
            
            let parallaxX = 0;
            let parallaxScale = 1;
            
            if (speed < 0.4) {
                parallaxX = this.mouseX * 15 * (0.4 - speed);
                parallaxScale = 1 + (this.mouseY * 0.015 * (0.4 - speed));
            }
            
            layer.style.transform = `translate3d(${parallaxX}px, ${parallaxY}px, 0) scale(${parallaxScale})`;
        });

        this.animationId = requestAnimationFrame(() => this.update());
    }

    destroy() {
        cancelAnimationFrame(this.animationId);
    }
}


class BackToTopButton {
    constructor() {
        this.button = document.getElementById('backToTopBtn');
        this.threshold = 300;
        this.isVisible = false;
        
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => this.handleScroll(), { passive: true });
        this.button.addEventListener('click', (e) => {
            e.preventDefault();
            this.scrollToTop();
        });
        this.button.addEventListener('mousedown', (e) => {
            e.preventDefault();
        });
    }

    handleScroll() {
        const isNowVisible = window.scrollY > this.threshold;
        
        if (isNowVisible !== this.isVisible) {
            this.isVisible = isNowVisible;
            if (isNowVisible) {
                this.button.classList.add('show');
            } else {
                this.button.classList.remove('show');
            }
        }
    }

    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
}

class ScrollIndicator {
    constructor() {
        this.indicator = document.querySelector('.scroll-indicator');
        this.fadeStartDistance = 0;
        this.fadeOutDistance = 400;
        
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => this.handleScroll(), { passive: true });
    }

    handleScroll() {
        const scrollDistance = window.scrollY;
        const opacity = Math.max(0, 1 - (scrollDistance / this.fadeOutDistance));
        
        this.indicator.style.opacity = opacity;
        
        if (opacity < 0.05) {
            this.indicator.style.pointerEvents = 'none';
        } else {
            this.indicator.style.pointerEvents = 'auto';
        }
    }
}


class PerformanceMonitor {
    constructor() {
        this.frameCount = 0;
        this.lastTime = performance.now();
        this.fps = 60;
    }

    update() {
        this.frameCount++;
        const currentTime = performance.now();
        const deltaTime = currentTime - this.lastTime;

        if (deltaTime >= 1000) {
            this.fps = Math.round((this.frameCount * 1000) / deltaTime);
            this.frameCount = 0;
            this.lastTime = currentTime;
        }

        return this.fps;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const parallaxManager = new ParallaxManager();
    const backToTopButton = new BackToTopButton();
    const scrollIndicator = new ScrollIndicator();
    const perfMonitor = new PerformanceMonitor();
});

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

const Easing = {
    easeInOutCubic: (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
    easeOutQuad: (t) => 1 - (1 - t) * (1 - t),
    easeInQuad: (t) => t * t,
    linear: (t) => t,
};

window.addEventListener('resize', debounce(() => {
}, 250));

const prefersReducedMotion = window.matchMedia('(prefers-motion: reduce)').matches;

if (prefersReducedMotion) {
    document.documentElement.style.scrollBehavior = 'auto';
}
