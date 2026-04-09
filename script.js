const API_KEY = "27bdc3a806072528f1808a4eeec66a72";

const contenedor = document.getElementById("contenedor");
const tendencias = document.getElementById("tendencias");
const favCont = document.getElementById("favoritos");

const buscador = document.getElementById("buscador");
const btnBuscar = document.getElementById("btnBuscar");

const modal = document.getElementById("modal");
const trailer = document.getElementById("trailer");
const cerrar = document.getElementById("cerrar");

let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];

/* ================== TENDENCIAS ================== */
async function cargarTendencias() {
    const res = await fetch(`https://api.themoviedb.org/3/trending/all/day?api_key=${API_KEY}`);
    const data = await res.json();
    mostrar(data.results, tendencias);
}

/* ================== BUSCAR ================== */
async function buscar() {
    const texto = buscador.value.trim();

    if (texto === "") {
        contenedor.innerHTML = "";
        return;
    }

    try {
        const res = await fetch(`https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&query=${texto}`);
        const data = await res.json();

        if (data.results && data.results.length > 0) {
            mostrar(data.results, contenedor);
        } else {
            contenedor.innerHTML = "<p>No se encontraron resultados</p>";
        }

    } catch (error) {
        console.error("Error en búsqueda:", error);
        contenedor.innerHTML = "<p>Error al buscar</p>";
    }
}

/* ================== MOSTRAR ================== */
function mostrar(lista, lugar) {
    lugar.innerHTML = "";

    lista.forEach(item => {
        if (!item.poster_path) return;

        const tipo = item.media_type || "movie";

        const esFavorito = favoritos.some(f => f.id === item.id);

        const card = document.createElement("div");
        card.classList.add("card");

        card.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w500${item.poster_path}">
            <button class="ver">▶</button>
            <button class="fav">${esFavorito ? "❌" : "⭐"}</button>
        `;

        /* VER TRAILER */
        card.querySelector(".ver").onclick = () => {
            verTrailer(item.id, tipo);
        };

        /* AGREGAR / QUITAR FAVORITO */
        card.querySelector(".fav").onclick = () => {
            guardar(item);
        };

        lugar.appendChild(card);
    });

    if (lugar.innerHTML === "") {
        lugar.innerHTML = "<p>No hay imágenes disponibles</p>";
    }
}

/* ================== TRAILER ================== */
async function verTrailer(id, tipo) {
    try {
        const res = await fetch(`https://api.themoviedb.org/3/${tipo}/${id}/videos?api_key=${API_KEY}`);
        const data = await res.json();

        if (!data.results || data.results.length === 0) {
            alert("No hay videos disponibles");
            return;
        }

        const video = data.results.find(v => v.site === "YouTube");

        if (video) {
            trailer.src = `https://www.youtube.com/embed/${video.key}`;
            modal.style.display = "block";
        } else {
            alert("No hay trailer en YouTube");
        }

    } catch (error) {
        console.error("Error trailer:", error);
        alert("Error al cargar trailer");
    }
}

/* ================== FAVORITOS ================== */
function guardar(item) {
    const index = favoritos.findIndex(f => f.id === item.id);

    if (index !== -1) {
        // ❌ eliminar
        favoritos.splice(index, 1);
    } else {
        // ⭐ agregar
        favoritos.push(item);
    }

    localStorage.setItem("favoritos", JSON.stringify(favoritos));
    mostrarFavoritos();
    buscar(); // 🔥 refresca resultados
}

function mostrarFavoritos() {
    mostrar(favoritos, favCont);
}

/* ================== EVENTOS ================== */
btnBuscar.addEventListener("click", buscar);

/* ENTER */
buscador.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        buscar();
    }
});

/* ❌ IMPORTANTE: NO usar keyup */
// buscador.addEventListener("keyup", buscar);

cerrar.onclick = () => {
    modal.style.display = "none";
    trailer.src = "";
};

/* cerrar haciendo click afuera */
window.onclick = (e) => {
    if (e.target === modal) {
        modal.style.display = "none";
        trailer.src = "";
    }
};

/* ================== INICIO ================== */
cargarTendencias();
mostrarFavoritos();
