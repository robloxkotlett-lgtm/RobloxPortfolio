/* ==========================================================================
   FOCUSDEV - ROBLOX PORTFOLIO INTERACTIVE LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lucide Icons
    if (window.lucide) {
        lucide.createIcons();
    }

    // 2. Dynamic Particle Canvas Background
    initParticleCanvas();

    // 3. Live GMT+3 Clock & Contact Availability Monitor
    initGMTClockAndAvailability();

    // 4. Navbar Sticky Scroll & Mobile Navigation
    initNavigation();

    // 5. Contact & Copy Buttons
    initCopyButtons();
});

/* --------------------------------------------------------------------------
   PARTICLE CANVAS (GOLD CONSTELLATION NETWORK)
   -------------------------------------------------------------------------- */
function initParticleCanvas() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const particleCount = Math.min(Math.floor(width / 18), 75);

    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.4,
            radius: Math.random() * 1.8 + 0.8,
            alpha: Math.random() * 0.6 + 0.2
        });
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0) p.x = width;
            if (p.x > width) p.x = 0;
            if (p.y < 0) p.y = height;
            if (p.y > height) p.y = 0;

            // Draw golden particle
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(229, 193, 88, ${p.alpha})`;
            ctx.shadowBlur = 8;
            ctx.shadowColor = 'rgba(229, 193, 88, 0.4)';
            ctx.fill();

            // Connect nearby particles with subtle golden lines
            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 120) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = `rgba(229, 193, 88, ${0.12 * (1 - dist / 120)})`;
                    ctx.lineWidth = 0.6;
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(animate);
    }

    animate();
}

/* --------------------------------------------------------------------------
   LIVE GMT+3 CLOCK & CONTACT AVAILABILITY MONITOR
   -------------------------------------------------------------------------- */
function initGMTClockAndAvailability() {
    const clockEl = document.getElementById('gmtClock');
    const statusBadge = document.getElementById('statusBadge');
    const statusDot = document.getElementById('statusDot');
    const statusText = document.getElementById('statusText');
    
    const cardStatusText = document.getElementById('cardStatusText');
    const cardStatusDot = document.getElementById('cardStatusDot');

    function updateTimeAndStatus() {
        const now = new Date();
        const utcHours = now.getUTCHours();
        const utcMinutes = now.getUTCMinutes();
        const utcSeconds = now.getUTCSeconds();

        // Calculate GMT+3 hours
        const gmt3Hours = (utcHours + 3) % 24;
        const formattedHours = String(gmt3Hours).padStart(2, '0');
        const formattedMinutes = String(utcMinutes).padStart(2, '0');
        const formattedSeconds = String(utcSeconds).padStart(2, '0');

        if (clockEl) {
            clockEl.textContent = `${formattedHours}:${formattedMinutes}:${formattedSeconds} GMT+3`;
        }

        // Contact Availability Rule:
        // Unavailable between 23:00 and 07:00 local time (gmt3Hours >= 23 or gmt3Hours < 7)
        const isUnavailable = (gmt3Hours >= 23 || gmt3Hours < 7);

        if (isUnavailable) {
            // Calculate minutes left until 07:00 GMT+3
            let totalMinsLeft = 0;
            if (gmt3Hours >= 23) {
                totalMinsLeft = (24 - gmt3Hours + 7) * 60 - utcMinutes;
            } else {
                totalMinsLeft = (7 - gmt3Hours) * 60 - utcMinutes;
            }

            const hLeft = Math.floor(totalMinsLeft / 60);
            const mLeft = totalMinsLeft % 60;
            const countdownStr = `(Available in ${hLeft}h ${mLeft}m)`;

            const labelStr = `Not available for contact ${countdownStr}`;

            if (statusBadge) statusBadge.classList.add('offline');
            if (statusDot) {
                statusDot.className = 'status-dot offline pulsing-red';
            }
            if (statusText) statusText.textContent = labelStr;

            if (cardStatusText) cardStatusText.textContent = labelStr;
            if (cardStatusDot) cardStatusDot.className = 'status-indicator-dot offline';
        } else {
            // Available for contact (07:00 - 23:00)
            const labelStr = "Available for contact";

            if (statusBadge) statusBadge.classList.remove('offline');
            if (statusDot) {
                statusDot.className = 'status-dot pulsing';
            }
            if (statusText) statusText.textContent = labelStr;

            if (cardStatusText) cardStatusText.textContent = labelStr;
            if (cardStatusDot) cardStatusDot.className = 'status-indicator-dot';
        }
    }

    updateTimeAndStatus();
    setInterval(updateTimeAndStatus, 1000);
}

/* --------------------------------------------------------------------------
   NAVIGATION & MOBILE MENU
   -------------------------------------------------------------------------- */
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const mobileToggle = document.getElementById('mobileToggle');
    const navLinks = document.getElementById('navLinks');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', () => {
            navLinks.classList.toggle('open');
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('open');
            });
        });
    }
}

/* --------------------------------------------------------------------------
   CONTACT COPY BUTTONS & TOAST
   -------------------------------------------------------------------------- */
function initCopyButtons() {
    const copyDiscordBtn = document.getElementById('copyDiscordBtn');

    if (copyDiscordBtn) {
        copyDiscordBtn.addEventListener('click', () => {
            navigator.clipboard.writeText('@Focusdev').then(() => {
                showToast('Copied Discord tag: @Focusdev');
            });
        });
    }
}

function showToast(message) {
    const toast = document.getElementById('toast');
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 2800);
}
