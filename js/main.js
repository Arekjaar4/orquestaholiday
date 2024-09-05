document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded');
    const videoPlayer = document.querySelector('#video-player iframe');
    const carousel = document.getElementById('video-carousel');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    async function loadVideos() {
        try {
            const response = await fetch('/data/videos.json');
            const videos = await response.json();
            
            if (videos.length > 0) {
                videoPlayer.src = `https://www.youtube.com/embed/${videos[0].id}`;
            }

            videos.forEach((video, index) => {
                const thumbnail = document.createElement('div');
                thumbnail.className = 'video-thumbnail';
                thumbnail.setAttribute('data-video', video.id);
                thumbnail.innerHTML = `
                    <img src="https://img.youtube.com/vi/${video.id}/mqdefault.jpg" alt="${video.title}">
                `;
                carousel.appendChild(thumbnail);

                thumbnail.addEventListener('click', function() {
                    videoPlayer.src = `https://www.youtube.com/embed/${video.id}`;
                    highlightThumbnail(this);
                });

                if (index === 0) {
                    highlightThumbnail(thumbnail);
                }
            });
        } catch (error) {
            console.error('Error al cargar los videos:', error);
        }
    }

    function highlightThumbnail(thumbnail) {
        carousel.querySelectorAll('.video-thumbnail').forEach(t => t.classList.remove('active'));
        thumbnail.classList.add('active');
    }

    function scrollCarousel(direction) {
        const scrollAmount = carousel.offsetWidth;
        carousel.scrollBy({
            left: direction * scrollAmount,
            behavior: 'smooth'
        });
    }

    prevBtn.addEventListener('click', () => scrollCarousel(-1));
    nextBtn.addEventListener('click', () => scrollCarousel(1));

    loadVideos();

    async function cargarRepertorio() {
        try {
            const response = await fetch('/data/repertorio.json');
            const repertorio = await response.json();
            
            const listaRepertorio = document.getElementById('lista-repertorio');
            
            repertorio.forEach(cancion => {
                const elementoCancion = document.createElement('div');
                elementoCancion.className = 'cancion';
                elementoCancion.innerHTML = `
                    <span class="numero-cancion">${cancion.id}</span>
                    <h3>${cancion.nombre}</h3>
                    <p>Artista: ${cancion.artista}</p>
                    <p>Año: ${cancion.año}</p>
                `;
                listaRepertorio.appendChild(elementoCancion);
            });
        } catch (error) {
            console.error('Error al cargar el repertorio:', error);
        }
    }

    cargarRepertorio();

    const vinylRecord = document.querySelector('.vinyl-record');
    console.log('Vinyl record element:', vinylRecord);
    
    if (vinylRecord) {
        console.log('Vinyl record found, applying rotation');
        vinylRecord.classList.add('rotating');
        let rotation = 0;
        /*setInterval(() => {
            rotation += 5;
            vinylRecord.style.transform = `rotateY(${rotation}deg)`;
        }, 20);*/
    } else {
        console.error('Vinyl record element not found');
    }
});