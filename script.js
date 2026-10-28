/* ==========================================================================
   FOCUSDEV - ROBLOX LUAU PORTFOLIO INTERACTIVE LOGIC
   Timezone: GMT+2
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lucide Icons
    if (window.lucide) {
        lucide.createIcons();
    }

    // 2. Dynamic Gold Constellation Canvas
    initParticleCanvas();

    // 3. Live GMT+2 Clock
    initGMTClock();

    // 4. Navbar Sticky Scroll & Mobile Navigation
    initNavigation();

    // 5. Contact & Copy Buttons
    initCopyButtons();
});

/* --------------------------------------------------------------------------
   PARTICLE CANVAS (REFINED GOLD CONSTELLATION NETWORK)
   -------------------------------------------------------------------------- */
function initParticleCanvas() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const particles = [];
    const particleCount = Math.min(Math.floor(width / 22), 65);

    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.35,
            vy: (Math.random() - 0.5) * 0.35,
            radius: Math.random() * 1.5 + 0.6,
            alpha: Math.random() * 0.5 + 0.15
        });
    }

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        particles.forEach(p => {
            if (p.x > width) p.x = Math.random() * width;
            if (p.y > height) p.y = Math.random() * height;
        });
    });

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

            // Draw gold particle
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(229, 193, 88, ${p.alpha})`;
            ctx.shadowBlur = 6;
            ctx.shadowColor = 'rgba(229, 193, 88, 0.3)';
            ctx.fill();

            // Connect nearby nodes
            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 110) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = `rgba(229, 193, 88, ${0.09 * (1 - dist / 110)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(animate);
    }

    animate();
}

/* --------------------------------------------------------------------------
   LIVE GMT+2 CLOCK
   -------------------------------------------------------------------------- */
function initGMTClock() {
    const clockEl = document.getElementById('gmtClock');
    if (!clockEl) return;

    function updateTime() {
        const now = new Date();
        const utcHours = now.getUTCHours();
        const utcMinutes = now.getUTCMinutes();
        const utcSeconds = now.getUTCSeconds();

        // Calculate GMT+2 hours (0-23)
        const gmt2Hours = (utcHours + 2) % 24;
        const formattedHours = String(gmt2Hours).padStart(2, '0');
        const formattedMinutes = String(utcMinutes).padStart(2, '0');
        const formattedSeconds = String(utcSeconds).padStart(2, '0');

        clockEl.textContent = `${formattedHours}:${formattedMinutes}:${formattedSeconds} GMT+2`;
    }

    updateTime();
    setInterval(updateTime, 1000);
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
        mobileToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            navLinks.classList.toggle('open');
        });

        // Close when clicking nav links
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('open');
            });
        });

        // Close when clicking outside of the navbar
        document.addEventListener('click', (e) => {
            if (!navbar.contains(e.target)) {
                navLinks.classList.remove('open');
            }
        });
    }
}

/* --------------------------------------------------------------------------
   CONTACT COPY BUTTONS & TOAST
   -------------------------------------------------------------------------- */
let toastTimeout = null;

function initCopyButtons() {
    const copyDiscordBtn = document.getElementById('copyDiscordBtn');

    if (copyDiscordBtn) {
        copyDiscordBtn.addEventListener('click', () => {
            const discordTag = '@F0cus_dev';
            
            // Clipboard API with fallback
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(discordTag).then(() => {
                    handleCopySuccess(copyDiscordBtn, discordTag);
                }).catch(() => {
                    fallbackCopyText(discordTag, copyDiscordBtn);
                });
            } else {
                fallbackCopyText(discordTag, copyDiscordBtn);
            }
        });
    }
}

function handleCopySuccess(button, text) {
    showToast(`Copied Discord tag: ${text}`);

    const originalHTML = button.innerHTML;
    button.innerHTML = `<i data-lucide="check"></i> <span>Copied!</span>`;
    if (window.lucide) lucide.createIcons();

    setTimeout(() => {
        button.innerHTML = originalHTML;
        if (window.lucide) lucide.createIcons();
    }, 2000);
}

function fallbackCopyText(text, button) {
    const tempInput = document.createElement('input');
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    try {
        document.execCommand('copy');
        handleCopySuccess(button, text);
    } catch (err) {
        showToast('Discord Tag: ' + text);
    }
    document.body.removeChild(tempInput);
}

function showToast(message) {
    const toast = document.getElementById('toast');
    if (!toast) return;

    if (toastTimeout) {
        clearTimeout(toastTimeout);
    }

    toast.textContent = message;
    toast.classList.add('show');

    toastTimeout = setTimeout(() => {
        toast.classList.remove('show');
    }, 2800);
}
