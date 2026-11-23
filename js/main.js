//Inicializar iconos de Lucide
lucide.createIcons();

//Filtrado dinámico de proyectos
const filterButtons = document.querySelectorAll('.filter-btn');
const projectItems = document.querySelectorAll('.project-item');

filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        filterButtons.forEach(b => {
            b.classList.remove('active');
            b.classList.add('btn-outline-secondary', 'text-light');
        });
        btn.classList.add('active');
        btn.classList.remove('btn-outline-secondary', 'text-light');

        const filter = btn.getAttribute('data-filter');

        projectItems.forEach(item => {
            if (filter === 'all' || item.getAttribute('data-category') === filter) {
                item.classList.remove('d-none');
            } else {
                item.classList.add('d-none');
            }
        });
    });
});

//Envío real del formulario mediante Fetch API (Web3Forms)
const contactForm = document.getElementById('contact-form');
const feedback = document.getElementById('form-feedback');
const submitBtn = document.getElementById('submit-btn');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Enviando...';
    submitBtn.disabled = true;

    const formData = new FormData(contactForm);

    try {
        const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            body: formData
        });
        const data = await response.json();

        if (data.success) {
            feedback.textContent = '¡Mensaje enviado con éxito! Te responderé pronto.';
            feedback.classList.remove('d-none', 'text-danger');
            feedback.classList.add('text-neon');
            contactForm.reset();
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        feedback.textContent = 'Hubo un error al enviar. Verifica tu Access Key.';
        feedback.classList.remove('d-none', 'text-neon');
        feedback.classList.add('text-danger');
    } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
});

//Efecto de luz ambiental siguiendo el cursor (Spotlight)
const spotlight = document.getElementById('spotlight');
if (spotlight) {
    window.addEventListener('mousemove', (e) => {
        spotlight.style.setProperty('--x', `${e.clientX}px`);
        spotlight.style.setProperty('--y', `${e.clientY}px`);
    });
}

//Fondo animado de red geométrica (Canvas HTML5)
const canvas = document.getElementById('network-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
const mouse = { x: null, y: null, radius: 140 };

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});
window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
});

class GeometricNode {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.6;
        this.vy = (Math.random() - 0.5) * 0.6;
        this.size = Math.random() * 4 + 2;
        this.angle = Math.random() * Math.PI * 2;
        this.spin = (Math.random() - 0.5) * 0.02;
        const shapes = ['dot', 'dot', 'triangle', 'ring', 'cross'];
        this.shape = shapes[Math.floor(Math.random() * shapes.length)];
        this.isNeon = Math.random() > 0.75;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.angle += this.spin;
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        const color = this.isNeon ? 'rgba(41, 237, 34, 0.55)' : 'rgba(174, 181, 191, 0.35)';
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.lineWidth = 1.2;

        if (this.shape === 'dot') {
            ctx.beginPath();
            ctx.arc(0, 0, this.size * 0.6, 0, Math.PI * 2);
            ctx.fill();
        } else if (this.shape === 'ring') {
            ctx.beginPath();
            ctx.arc(0, 0, this.size * 1.4, 0, Math.PI * 2);
            ctx.stroke();
        } else if (this.shape === 'triangle') {
            const s = this.size * 2.2;
            ctx.beginPath();
            ctx.moveTo(0, -s);
            ctx.lineTo(s * 0.86, s * 0.5);
            ctx.lineTo(-s * 0.86, s * 0.5);
            ctx.closePath();
            ctx.stroke();
        } else if (this.shape === 'cross') {
            const s = this.size * 1.2;
            ctx.beginPath();
            ctx.moveTo(-s, 0);
            ctx.lineTo(s, 0);
            ctx.moveTo(0, -s);
            ctx.lineTo(0, s);
            ctx.stroke();
        }
        ctx.restore();
    }
}

function initNetwork() {
    particles = [];
    const numberOfNodes = Math.min(Math.floor((canvas.width * canvas.height) / 16000), 85);
    for (let i = 0; i < numberOfNodes; i++) {
        particles.push(new GeometricNode());
    }
}

function connectNodes() {
    const maxDistance = 135;
    for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
            const distance = Math.hypot(particles[a].x - particles[b].x, particles[a].y - particles[b].y);
            if (distance < maxDistance) {
                const opacity = (1 - distance / maxDistance) * 0.25;
                ctx.strokeStyle = `rgba(174, 181, 191, ${opacity})`;
                ctx.lineWidth = 0.8;
                ctx.beginPath();
                ctx.moveTo(particles[a].x, particles[a].y);
                ctx.lineTo(particles[b].x, particles[b].y);
                ctx.stroke();
            }
        }
        if (mouse.x !== null && mouse.y !== null) {
            const distMouse = Math.hypot(particles[a].x - mouse.x, particles[a].y - mouse.y);
            if (distMouse < mouse.radius) {
                const opacity = (1 - distMouse / mouse.radius) * 0.6;
                ctx.strokeStyle = `rgba(41, 237, 34, ${opacity})`;
                ctx.lineWidth = 1.1;
                ctx.beginPath();
                ctx.moveTo(particles[a].x, particles[a].y);
                ctx.lineTo(mouse.x, mouse.y);
                ctx.stroke();
            }
        }
    }
}

function animateNetwork() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
    }
    connectNodes();
    requestAnimationFrame(animateNetwork);
}

initNetwork();
animateNetwork();
window.addEventListener('resize', initNetwork);