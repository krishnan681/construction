// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Configure ScrollTrigger for better mobile experience
ScrollTrigger.config({
    ignoreMobileResize: true,
});

// Normalize scroll
ScrollTrigger.normalizeScroll(true);

const canvas = document.querySelector(".canvas");
const context = canvas.getContext("2d");

// Canvas configuration
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    render();
}

const frameCount = 95;
const currentFrame = (index) => `./assets/images/house/${(index + 1).toString()}.png`;

const images = [];
const ball = { frame: 0 };

// Preload images
let imagesLoaded = 0;
for (let i = 0; i < frameCount; i++) {
    const img = new Image();
    img.src = currentFrame(i);
    img.onload = () => {
        imagesLoaded++;
        if (imagesLoaded === 1) render();
    };
    images.push(img);
}

// GSAP Image sequence
gsap.to(ball, {
    frame: frameCount - 1,
    snap: "frame",
    ease: "none",
    scrollTrigger: {
        scrub: 0.5,
        pin: ".canvas-container",
        start: "top top",
        end: "500%",
        invalidateOnRefresh: true,
    },
    onUpdate: render,
});

function render() {
    const img = images[ball.frame];
    if (!img || !img.complete) return;

    const canvasRatio = canvas.width / canvas.height;
    const imgRatio = img.width / img.height;

    let drawWidth, drawHeight, offsetX, offsetY;

    if (canvasRatio > imgRatio) {
        drawWidth = canvas.width;
        drawHeight = canvas.width / imgRatio;
        offsetX = 0;
        offsetY = (canvas.height - drawHeight) / 2;
    } else {
        drawWidth = canvas.height * imgRatio;
        drawHeight = canvas.height;
        offsetX = (canvas.width - drawWidth) / 2;
        offsetY = 0;
    }

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
}

// Handle resize
let resizeTimeout;
window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(resizeCanvas, 100);
});
resizeCanvas();

// Navbar change on scroll
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Reveal animations
gsap.utils.toArray('.reveal').forEach((el) => {
    gsap.from(el, {
        y: 50,
        opacity: 0,
        duration: 1.2,
        ease: "power4.out",
        scrollTrigger: {
            trigger: el,
            start: "top 95%",
            toggleActions: "play none none reverse",
            invalidateOnRefresh: true,
        }
    });
});

// Hero text exit
const heroTexts = gsap.utils.toArray('.house-text .reveal');
gsap.to(heroTexts, {
    opacity: 0,
    y: -50,
    stagger: 0.1,
    scrollTrigger: {
        trigger: ".canvas-container",
        start: "top top",
        end: "30%",
        scrub: 1
    }
});

// Load More Logic
const loadMoreBtn = document.getElementById('loadMoreBtn');
if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
        const hiddenCards = document.querySelectorAll('.expertise-hidden');

        // Remove d-none first
        hiddenCards.forEach(card => card.classList.remove('d-none'));

        // Animate in
        gsap.from(hiddenCards, {
            y: 100,
            opacity: 0,
            duration: 1,
            stagger: 0.2,
            ease: "power4.out",
            clearProps: "all"
        });

        // Hide button
        gsap.to(loadMoreBtn, {
            opacity: 0,
            y: 20,
            duration: 0.5,
            onComplete: () => loadMoreBtn.style.display = 'none'
        });
    });
}

// Horizontal Scroll logic
const horizontalWrapper = document.querySelector('.horizontal-wrapper');
if (horizontalWrapper) {
    const horizontalItems = document.querySelectorAll('.horizontal-item');

    gsap.to(horizontalWrapper, {
        x: () => -(horizontalWrapper.scrollWidth - window.innerWidth),
        ease: "none",
        scrollTrigger: {
            trigger: ".horizontal-scroll",
            start: "top top",
            end: () => `+=${horizontalWrapper.scrollWidth}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
        }
    });

    // Parallax effect on images within horizontal items
    horizontalItems.forEach(item => {
        const img = item.querySelector('img');
        gsap.fromTo(img,
            { x: "-10%" },
            {
                x: "10%",
                ease: "none",
                scrollTrigger: {
                    trigger: item,
                    containerAnimation: gsap.getById("horizontalTimeline"), // Note: using getById or just scoping
                    start: "left right",
                    end: "right left",
                    scrub: true,
                }
            }
        );
    });
}
