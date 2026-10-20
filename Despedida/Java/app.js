const people = [
    { id: 'brayan', name: 'Brayan', codeHash: '080bf176a72d105681656ff5e16783e6a60c1fe531a4f3b2e1e7010781534424', printCode: '482731', role: 'Gracias por las risas', symbol: '✦', accent: '#c7a8ff', preview: 'Tu mensaje personal está esperando.', message: 'Brayan, gracias por las bromas, las pláticas y por hacer más llevaderos tantos días de clase. Parece que fue ayer cuando empezamos y ya estamos pensando en la graduación. Voy a extrañar tenerte cerca todos los días, pero me quedo con un montón de buenos recuerdos. ¡Nos vemos pronto, hermano!' },
    { id: 'jorge', name: 'Jorge', codeHash: '46005296da6e06a7cabad40d2f5bd8759acc092ec6b85c6f67ef398ac1c0e959', printCode: '691408', role: 'Qué bueno coincidir', symbol: '◈', accent: '#ffbe9f', preview: 'Tu mensaje personal está esperando.', message: 'Jorge, qué bueno que nos tocó compartir este camino. Gracias por tu buena onda y por los momentos que vivimos en estos tres años; seguro que varios nos van a seguir dando risa cuando los recordemos. Ahora cada quien tendrá sus cosas, pero ojalá no perdamos el contacto. ¡Nos vemos en la graduación!' },
    { id: 'kevin', name: 'Kevin', codeHash: '2fa75c93db2e31bfc5ccd721504eadd33efe62494c47ba00bc3b4d580399f92e', printCode: '275936', role: 'Un amigo que me llevo', symbol: '✧', accent: '#9fe1d2', preview: 'Tu mensaje personal está esperando.', message: 'Kevin, gracias por compartir conmigo clases, trabajos y tantos momentos que hicieron especial esta etapa. Después de vernos casi todos los días, se va a sentir raro no tener esa rutina, la verdad. Pero me alegra saber que nos queda la graduación y todo lo bueno que viene. Te deseo lo mejor, ¡y no te desaparezcas!' },
    { id: 'mishel', name: 'Mishel', codeHash: '3c696425b00870ed955d55a95a580d5968b600c7f9d4bc416b289db1abf7ed33', printCode: '830517', role: 'Con mucho cariño', symbol: '♡', accent: '#f0a8c5', preview: 'Tu mensaje personal está esperando.', message: 'Mishel, gracias por tu alegría, tu cariño y por tantos momentos bonitos. Me da nostalgia pensar que ya no nos veremos de lunes a viernes como antes, pero me alegra muchísimo haber coincidido contigo. Espero que te vaya increíble en todo lo que te propongas. Te voy a extrañar; ¡nos vemos pronto!' },
    { id: 'yadira', name: 'Yadira', codeHash: '57457a4a18fc3afecda8f5d1fc44d59682813fa0c608dccc9c3c4b6e4c9cbce3', printCode: '154269', role: 'Gracias por tanto', symbol: '❋', accent: '#f2d18b', preview: 'Tu mensaje personal está esperando.', message: 'Yadira, quería decirte gracias por tu forma de ser y por cada momento que compartimos en estos años. Qué bonita etapa nos tocó vivir, con días buenos, días complicados y muchas cosas que recordar. Ahora toca seguir cada quien con sus planes, pero espero que sigamos en contacto. ¡Te quiero mucho y nos vemos en la graduación!' }
];

const videoGrid = document.querySelector('#videoGrid');
const videoMoments = [
    'Un día para recordar', 'Risas entre clases', 'Nuestra última actividad',
    'Así somos', 'Momentos espontáneos', 'Hasta la graduación'
];

function renderVideos() {
    videoGrid.innerHTML = videoMoments.map((title, index) => `
        <article class="video-card" style="--video-delay: ${index * 90}ms">
            <div class="video-wrap">
                <video controls playsinline preload="metadata" aria-label="Video: ${title}">
                    <source src="assets/video-${String(index + 1).padStart(2, '0')}.mp4" type="video/mp4">
                </video>
                <div class="video-placeholder"><span class="play-mark" aria-hidden="true">▶</span><strong>${title}</strong><small>Agrega assets/video-${String(index + 1).padStart(2, '0')}.mp4</small></div>
            </div>
            <p><span>0${index + 1}</span> ${title}</p>
        </article>
    `).join('');

    videoGrid.querySelectorAll('video').forEach((video) => {
        const placeholder = video.nextElementSibling;
        video.addEventListener('loadeddata', () => placeholder.classList.add('is-hidden'), { once: true });
        video.addEventListener('error', () => placeholder.classList.remove('is-hidden'));
        video.load();
    });
}

const grid = document.querySelector('#messageGrid');
const qrNotice = document.querySelector('#qrNotice');
const toast = document.querySelector('#toast');
let toastTimer;

function escapeHtml(value) {
    return value.replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
}

function getMessageUrl(id) {
    const url = new URL(window.location.href);
    url.hash = `mensaje-${id}`;
    return url.href;
}

function showToast(message) {
    toast.textContent = message;
    toast.classList.add('visible');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove('visible'), 2800);
}

function renderPeople() {
    grid.innerHTML = people.map((person, index) => `
        <article class="message-card" style="--accent: ${person.accent}" id="mensaje-${person.id}">
            <div class="message-top"><span class="message-index">RECUERDO · 0${index + 1}</span><span class="message-symbol" aria-hidden="true">${person.symbol}</span></div>
            <h3>${escapeHtml(person.name)}</h3>
            <span class="role">${escapeHtml(person.role)}</span>
            <p class="message-preview">“${escapeHtml(person.preview)}”</p>
            <form class="access-form" data-access="${person.id}" hidden>
                <label for="codigo-${person.id}">Escribe tu código personal</label>
                <div class="access-controls"><input id="codigo-${person.id}" name="code" type="password" inputmode="numeric" autocomplete="one-time-code" maxlength="6" pattern="[0-9]{6}" placeholder="6 dígitos" aria-label="Código personal de ${escapeHtml(person.name)}" required><button class="message-link" type="submit">Abrir mensaje <span aria-hidden="true">↗</span></button></div>
                <span class="access-error" role="alert" aria-live="polite"></span>
            </form>
            <button class="message-link locked-toggle" type="button" data-person="${person.id}" aria-label="Mostrar acceso al mensaje de ${escapeHtml(person.name)}">Ingresar código <span aria-hidden="true">↗</span></button>
        </article>
    `).join('');
}

function revealMessage(person, card) {
    card.querySelector('.access-form').hidden = true;
    card.querySelector('.locked-toggle').hidden = true;
    card.querySelector('.message-preview').hidden = true;
    let detail = card.querySelector('.message-full');
    if (detail) return;
    detail = document.createElement('p');
    detail.className = 'message-full';
    detail.style.cssText = 'color:#d5d1de;font-size:12px;line-height:1.8;border-top:1px solid rgba(255,255,255,.12);padding-top:14px;margin:0 0 15px;';
    detail.textContent = person.message;
    card.appendChild(detail);
}

grid.addEventListener('click', (event) => {
    const button = event.target.closest('[data-person]');
    if (!button) return;
    const card = button.closest('.message-card');
    const form = card.querySelector('.access-form');
    form.hidden = !form.hidden;
    if (!form.hidden) form.querySelector('input').focus();
    if (window.location.hash !== `#mensaje-${button.dataset.person}`) history.replaceState(null, '', getMessageUrl(button.dataset.person));
});

grid.addEventListener('submit', (event) => {
    const form = event.target.closest('.access-form');
    if (!form) return;
    event.preventDefault();
    const person = people.find((item) => item.id === form.dataset.access);
    const card = form.closest('.message-card');
    const input = form.querySelector('input');
    const error = form.querySelector('.access-error');
    if (!window.crypto?.subtle) {
        error.textContent = 'Abre la página publicada con su enlace HTTPS para validar tu código.';
        return;
    }
    const codeDigest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input.value));
    const enteredCodeHash = [...new Uint8Array(codeDigest)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
    if (!person || enteredCodeHash !== person.codeHash) {
        error.textContent = 'Ese código no coincide. Revisa el que te entregaron e inténtalo otra vez.';
        input.select();
        return;
    }
    error.textContent = '';
    revealMessage(person, card);
});

function showTargetMessage() {
    const id = window.location.hash.replace('#mensaje-', '');
    const person = people.find((item) => item.id === id);
    const card = document.getElementById(`mensaje-${id}`);
    if (!person || !card) return;
    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    const form = card.querySelector('.access-form');
    if (form && !card.querySelector('.message-full')) {
        form.hidden = false;
        window.setTimeout(() => form.querySelector('input').focus({ preventScroll: true }), 350);
    }
}

function printCards() {
    const local = window.location.protocol === 'file:' || ['localhost', '127.0.0.1'].includes(window.location.hostname);
    if (local) {
        qrNotice.hidden = false;
        showToast('Publica la página en HTTPS antes de imprimir las tarjetas y sus códigos personales.');
        qrNotice.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
    }

    const cards = [...grid.querySelectorAll('.message-card')];
    cards.forEach((card, index) => {
        const person = people[index];
        const image = document.createElement('img');
        image.className = 'qr-code';
        image.alt = `Código QR para el mensaje de ${person.name}`;
        image.src = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(getMessageUrl(person.id))}`;
        card.appendChild(image);
        const pin = document.createElement('p');
        pin.className = 'print-pin';
        pin.textContent = `Tu código personal: ${person.printCode}`;
        card.appendChild(pin);
    });

    qrNotice.hidden = false;
    qrNotice.textContent = 'Al imprimir desde esta página compartida aparecerán los códigos de las cinco tarjetas. Recorta cada una y entrega únicamente su PIN al destinatario correspondiente.';
    const qrImages = [...grid.querySelectorAll('.qr-code')];
    Promise.all(qrImages.map((image) => image.decode().catch(() => undefined))).then(() => window.print());
}

window.addEventListener('afterprint', () => {
    grid.querySelectorAll('.qr-code, .print-pin').forEach((element) => element.remove());
});

renderPeople();
renderVideos();
const groupPhoto = document.querySelector('.photo-frame img');
const photoPlaceholder = document.querySelector('.photo-placeholder');
groupPhoto.addEventListener('load', () => photoPlaceholder.classList.add('is-hidden'), { once: true });
groupPhoto.addEventListener('error', () => {
    groupPhoto.hidden = true;
    photoPlaceholder.classList.remove('is-hidden');
});
if (groupPhoto.complete && groupPhoto.naturalWidth > 0) photoPlaceholder.classList.add('is-hidden');
window.addEventListener('hashchange', showTargetMessage);
if (window.location.hash.startsWith('#mensaje-')) window.setTimeout(showTargetMessage, 300);
document.querySelector('#printButton').addEventListener('click', printCards);

document.querySelector('#musicButton').addEventListener('click', async (event) => {
    const button = event.currentTarget;
    const audio = document.querySelector('#backgroundMusic');
    const label = document.querySelector('#musicLabel');
    if (audio.paused) {
        try {
            await audio.play();
            button.classList.add('playing');
            button.setAttribute('aria-label', 'Pausar música');
            label.textContent = 'Pausar música';
        } catch {
            showToast('Agrega tu canción como assets/musica.mp3 y vuelve a intentarlo.');
        }
    } else {
        audio.pause();
        button.classList.remove('playing');
        button.setAttribute('aria-label', 'Reproducir música');
        label.textContent = 'Acompañar con música';
    }
});

if (window.matchMedia('(prefers-reduced-motion: no-preference)').matches && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const animation = entry.target.animate([{ opacity: 0, transform: 'translateY(18px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 650, easing: 'cubic-bezier(.2,.7,.2,1)' });
            animation.onfinish = () => animation.cancel();
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.12 });
    document.querySelectorAll('.intro-grid, .memory-strip, .section-heading, .group-photo-card, .video-card, .message-card, .final-section > *').forEach((element) => observer.observe(element));
}
