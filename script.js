/* =========================================
   1. INITIALIZATION
   ========================================= */
document.addEventListener("DOMContentLoaded", () => {

    // Typewriter Effect
    if (document.querySelector('.auto-type')) {
        new Typed('.auto-type', {
            strings: [
                "Data Analyst",
                "Attrition Risk Modeler",
                "Business Intelligence Analyst",
                "Insights Analyst"
            ],
            typeSpeed: 100,
            backSpeed: 50,
            loop: true
        });
    }

    initNeuralNetwork();
    initCounters();
    initSkillBars();

    const el = document.getElementById('year');
    if (el) el.textContent = new Date().getFullYear();
});

/* =========================================
   2. BACKGROUND CANVAS (particle network)
   ========================================= */
function initNeuralNetwork() {
    const canvas = document.getElementById("neural-canvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particlesArray;

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initParticles();
    });

    class Particle {
        constructor(x, y, directionX, directionY, size, color) {
            this.x = x; this.y = y;
            this.directionX = directionX; this.directionY = directionY;
            this.size = size; this.color = color;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
        update() {
            if (this.x > canvas.width || this.x < 0) this.directionX = -this.directionX;
            if (this.y > canvas.height || this.y < 0) this.directionY = -this.directionY;
            this.x += this.directionX;
            this.y += this.directionY;
            this.draw();
        }
    }

    function initParticles() {
        particlesArray = [];
        let numberOfParticles = (canvas.width * canvas.height) / 9000;

        for (let i = 0; i < numberOfParticles; i++) {
            let size = (Math.random() * 3) + 1;
            let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
            let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
            let directionX = (Math.random() * 2) - 1;
            let directionY = (Math.random() * 2) - 1;

            // Data palette: indigo + gold
            let color = Math.random() > 0.5 ? '#4C4FE8' : '#E8A94C';

            particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
        }
    }

    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, innerWidth, innerHeight);

        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
        }
        connect();
    }

    function connect() {
        let opacityValue = 1;
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a; b < particlesArray.length; b++) {
                let distance = ((particlesArray[a].x - particlesArray[b].x) ** 2) +
                               ((particlesArray[a].y - particlesArray[b].y) ** 2);

                if (distance < (canvas.width / 7) * (canvas.height / 7)) {
                    opacityValue = 1 - (distance / 20000);
                    ctx.strokeStyle = 'rgba(76, 79, 232,' + opacityValue + ')';
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    initParticles();
    animate();
}

/* =========================================
   3. COUNTERS (supports whole numbers + decimals like AUC 0.857)
   ========================================= */
function initCounters() {
    const counters = document.querySelectorAll('.counter-value');
    const speed = 200;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = +counter.getAttribute('data-target');
                const isDecimal = counter.getAttribute('data-decimal') === 'true';

                const updateCount = () => {
                    const raw = counter.innerText.replace(/,/g, '').replace('0.', '') || "0";
                    const count = isDecimal ? +counter.dataset.progress || 0 : +raw;
                    const inc = target / speed;
                    const next = count + inc;

                    if (next < target) {
                        counter.dataset.progress = next;
                        counter.innerText = isDecimal
                            ? '0.' + String(Math.ceil(next)).padStart(3, '0')
                            : Math.ceil(next).toLocaleString();
                        setTimeout(updateCount, 20);
                    } else {
                        counter.innerText = isDecimal
                            ? '0.' + String(target).padStart(3, '0')
                            : target.toLocaleString() + "+";
                    }
                };
                updateCount();
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
}

/* =========================================
   4. SKILL BARS (Trigger on Scroll)
   ========================================= */
function initSkillBars() {
    const skillsSection = document.querySelector('#about');
    if (!skillsSection) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                runSkillAnimation('.skill-excel',  '.skill-excel-val',  90, '#4C4FE8');
                runSkillAnimation('.skill-python', '.skill-python-val', 85, '#17a2b8');
                runSkillAnimation('.skill-dash',   '.skill-dash-val',   88, '#E8A94C');
                runSkillAnimation('.skill-report', '.skill-report-val', 92, '#343a40');

                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    observer.observe(skillsSection);
}

function runSkillAnimation(circleSelector, textSelector, endValue, color) {
    const circle = document.querySelector(circleSelector);
    const text = document.querySelector(textSelector);
    if (!circle || !text) return;

    let startValue = 0;
    let speed = 20;

    let progress = setInterval(() => {
        startValue++;
        text.textContent = `${startValue}%`;
        circle.style.background = `conic-gradient(${color} ${startValue * 3.6}deg, rgba(0,0,0,0.06) 0deg)`;

        if (startValue === endValue) clearInterval(progress);
    }, speed);
}

/* =========================================
   5. NAVIGATION & UTILITIES
   ========================================= */
window.addEventListener('scroll', function () {
    const nav = document.getElementById('navbar-top');
    if (window.scrollY > 50) {
        nav.classList.add('fixed-top');
        document.body.style.paddingTop = nav.offsetHeight + 'px';
    } else {
        nav.classList.remove('fixed-top');
        document.body.style.paddingTop = '0';
    }
});

let mybutton = document.getElementById("btn-back-to-top");
window.onscroll = function () {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        mybutton.style.display = "block";
    } else {
        mybutton.style.display = "none";
    }
};

if (mybutton) {
    mybutton.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Portfolio filtering
$(document).ready(function () {
    $(".filter-item").click(function () {
        const value = $(this).attr("data-filter");

        $(".filter-item").removeClass("active");
        $(this).addClass("active");

        if (value == "all") {
            $(".post").show(600);
        } else {
            $(".post").not("." + value).hide(600);
            $(".post").filter("." + value).show(600);
        }
    });
});