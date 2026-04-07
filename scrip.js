const API_KEY = "27bdc3a806072528f1808a4eeec66a72";

const contenedor = document.getElementById("contenedor");
const buscador = document.getElementById("buscador");
const tipo = document.getElementById("tipo");

const modal = document.getElementById("modal");
const trailer = document.getElementById("trailer");
const cerrar = document.getElementById("cerrar");

// FAVORITOS
let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];

async function buscar() {
    const texto = buscador.value;
    const tipoValor = tipo.value;

    const url = `https://api.themoviedb.org/3/search/${tipoValor}?api_key=${API_KEY}&query=${texto}`;

    const res = await fetch(url);
    const data = await res.json();

    mostrar(data.results);
}

function mostrar(lista) {
    contenedor.innerHTML = "";

    lista.forEach(item => {
        if (!item.poster_path) return;

        const titulo = item.title || item.name;

        contenedor.innerHTML += `
            <div class="card">
                <img src="https://image.tmdb.org/t/p/w500${item.poster_path}">
                <h3>${titulo}</h3>
                <button class="ver" onclick="verTrailer(${item.id}, '${item.media_type || tipo.value}')">▶</button>
                <button class="fav" onclick="guardar('${titulo}')">⭐</button>
            </div>
        `;
    });
}

async function verTrailer(id, tipo) {
    const url = `https://api.themoviedb.org/3/${tipo}/${id}/videos?api_key=${API_KEY}`;
    const res = await fetch(url);
    const data = await res.json();

    const video = data.results.find(v => v.type === "Trailer");

    if (video) {
        trailer.src = `https://www.youtube.com/embed/${video.key}`;
        modal.style.display = "block";
    } else {
        alert("No hay trailer disponible");
    }
}

function guardar(titulo) {
    favoritos.push(titulo);
    localStorage.setItem("favoritos", JSON.stringify(favoritos));
    alert("Guardado en favoritos ⭐");
}

cerrar.onclick = () => {
    modal.style.display = "none";
    trailer.src = "";
};

buscador.addEventListener("keyup", buscar);
tipo.addEventListener("change", buscar);
