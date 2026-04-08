const API_KEY = "27bdc3a806072528f1808a4eeec66a72";

const contenedor = document.getElementById("contenedor");
const tendencias = document.getElementById("tendencias");
const favCont = document.getElementById("favoritos");
const buscador = document.getElementById("buscador");

const modal = document.getElementById("modal");
const trailer = document.getElementById("trailer");
const cerrar = document.getElementById("cerrar");

let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];

/* TENDENCIAS */
async function cargarTendencias() {
    const res = await fetch(`https://api.themoviedb.org/3/trending/all/day?api_key=${API_KEY}`);
    const data = await res.json();
    mostrar(data.results, tendencias);
}

/* BUSCAR */
async function buscar() {
    const texto = buscador.value;
    const res = await fetch(`https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&query=${texto}`);
    const data = await res.json();
    mostrar(data.results, contenedor);
}

/* MOSTRAR */
function mostrar(lista, lugar) {
    lugar.innerHTML = "";

    lista.forEach(item => {
        if (!item.poster_path) return;

        const titulo = item.title || item.name;

        lugar.innerHTML += `
            <div class="card">
                <img src="https://image.tmdb.org/t/p/w500${item.poster_path}">
                <button class="ver" onclick="verTrailer(${item.id}, '${item.media_type}')">▶</button>
                <button class="fav" onclick="guardar('${titulo}')">⭐</button>
            </div>
        `;
    });
}

/* TRAILER */
async function verTrailer(id, tipo) {
    const res = await fetch(`https://api.themoviedb.org/3/${tipo}/${id}/videos?api_key=${API_KEY}`);
    const data = await res.json();

    const video = data.results.find(v => v.type === "Trailer");

    if (video) {
        trailer.src = `https://www.youtube.com/embed/${video.key}`;
        modal.style.display = "block";
    }
}

/* FAVORITOS */
function guardar(titulo) {
    favoritos.push(titulo);
    localStorage.setItem("favoritos", JSON.stringify(favoritos));
    alert("Agregado ⭐");
}

/* EVENTOS */
buscador.addEventListener("keyup", buscar);
cerrar.onclick = () => {
    modal.style.display = "none";
    trailer.src = "";
};

/* INICIO */
cargarTendencias();
