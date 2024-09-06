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

    const listaRepertorio = document.getElementById('lista-repertorio');
    const filtros = document.querySelectorAll('.filtro-btn');
    let repertorio = [];

    // Función para cargar el repertorio desde el archivo JSON
    async function cargarRepertorio() {
        try {
            const response = await fetch('/data/repertorio.json');
            repertorio = await response.json();
            mostrarCanciones('todos');
        } catch (error) {
            console.error('Error al cargar el repertorio:', error);
        }
    }

    // Función para verificar si un año pertenece a una década
    function perteneceADecada(año, decada) {
        const inicioDecada = parseInt(decada);
        return año >= inicioDecada && año < inicioDecada + 10;
    }

    // Función para mostrar las canciones filtradas
    function mostrarCanciones(filtro = 'todos') {
        listaRepertorio.innerHTML = '';
        repertorio.forEach(cancion => {
            const año = parseInt(cancion.año);
            console.log(`Canción: ${cancion.nombre}, Año: ${año}, Filtro: ${filtro}`); // Para depuración
            if (filtro === 'todos' || 
                (filtro === '20s' && perteneceADecada(año, 1920)) ||
                (filtro === '30s' && perteneceADecada(año, 1930)) ||
                (filtro === '40s' && perteneceADecada(año, 1940)) ||
                (filtro === '50s' && perteneceADecada(año, 1950)) ||
                (filtro === '60s' && perteneceADecada(año, 1960)) ||
                (filtro === '70s' && perteneceADecada(año, 1970)) ||
                (filtro === '80s' && perteneceADecada(año, 1980)) ||
                (filtro === '90s' && perteneceADecada(año, 1990)) ||
                (filtro === '2000s' && perteneceADecada(año, 2000))) {
                const elemento = document.createElement('div');
                elemento.className = 'cancion';
                elemento.innerHTML = `
                    <h3>${cancion.nombre}</h3>
                    <p>${cancion.artista}</p>
                    <p>Año: ${cancion.año}</p>
                `;
                listaRepertorio.appendChild(elemento);
            }
        });
    }

    // Evento para los botones de filtro
    filtros.forEach(btn => {
        btn.addEventListener('click', function() {
            filtros.forEach(b => b.classList.remove('activo'));
            this.classList.add('activo');
            mostrarCanciones(this.dataset.filtro);
        });
    });

    // Cargar el repertorio al iniciar
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