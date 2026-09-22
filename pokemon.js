const PAGE_SIZE = 20;
const listWrapper = document.querySelector(".list-wrapper");
const searchInput = document.querySelector("#search-input");
const numberFilter = document.querySelector("#number");
const nameFilter = document.querySelector("#name");
const notFoundMessage = document.querySelector("#not-found-message");
const loadMoreButton = document.querySelector("#load-more-button");
const loadingIndicator = document.querySelector("#loading-indicator");

let allPokemons = [];
let nextPageUrl = `https://pokeapi.co/api/v2/pokemon?limit=${PAGE_SIZE}`;
let isLoading = false;

loadNextPage();

async function loadNextPage() {
        if (!nextPageUrl || isLoading) return;

        isLoading = true;
        setLoading(true);

        try {
                const response = await fetch(nextPageUrl);
                if (!response.ok) throw new Error("No se pudo cargar la lista de Pokémon");
                const data = await response.json();

                allPokemons = allPokemons.concat(data.results);
                nextPageUrl = data.next;

                displayPokemons(allPokemons);
                updateLoadMoreButton();
        } catch (error) {
                console.error("Error al cargar la lista de Pokémon:", error.message);
        } finally {
                isLoading = false;
                setLoading(false);
        }
}

function setLoading(loading) {
        if (!loadingIndicator) return;
        loadingIndicator.style.display = loading ? "flex" : "none";
}

function updateLoadMoreButton() {
        if (!loadMoreButton) return;
        const searchActive = searchInput.value.trim() !== "";
        loadMoreButton.style.display = !searchActive && nextPageUrl ? "inline-block" : "none";
}

if (loadMoreButton) {
        loadMoreButton.addEventListener("click", loadNextPage);
}

async function fetchPokemonDataBeforeRedirect(id) {
        try {
                const [pokemon, pokemonSpecies] = await Promise.all([
                        fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then((res) => {
                                if (!res.ok) throw new Error('Pokemon no encontrado');
                                return res.json()
                        }),
                        fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`).then((res) => {
                                if (!res.ok) throw new Error('Especies de Pokemon no encontradas');
                                return res.json()
                        }),
                ]);
                return true;
        } catch (error) {
                console.error("Error al obtener datos del pokemon:", error.message);
                return false;
        }
}

function displayPokemons(pokemon) {
        listWrapper.innerHTML = "";
        pokemon.forEach((pokemon) => {
                const pokemonID = pokemon.url.split("/")[6];
                const listItem = document.createElement("div");
                listItem.className = "list-item";
                listItem.innerHTML = `
                <div class="number-wrap"> 
                        <p class="caption-fonts">${pokemonID}</p>
                </div>
                <div class="img-wrap"> 
                        <img src="https://raw.githubusercontent.com/pokeapi/sprites/master/sprites/pokemon/other/dream-world/${pokemonID}.svg" alt="${pokemon.name}" loading="lazy" onerror="this.src='./assets/pokeball.svg'" />
                </div>
                <div class="name-wrap"> 
                        <p class="body3-fonts">${pokemon.name}</p>
                </div>   
                `;

                listItem.addEventListener("click", async () => {
                        const success = await fetchPokemonDataBeforeRedirect(pokemonID);
                        if (success) {
                                window.location.href = `./detail.html?id=${pokemonID}`;
                        }
                });
                listWrapper.appendChild(listItem);
        });
}

searchInput.addEventListener("keyup", handleSearch);

function handleSearch() {
        const searchTerm = searchInput.value.toLowerCase();
        let filteredPokemons;

        if (numberFilter.checked) {
                filteredPokemons = allPokemons.filter((pokemon) => {
                        const pokemonID = pokemon.url.split("/")[6];
                        return pokemonID.startsWith(searchTerm);
                });
        } else if (nameFilter.checked) {
                filteredPokemons = allPokemons.filter((pokemon) => {
                        return pokemon.name.toLowerCase().startsWith(searchTerm);
                });
        } else {
                filteredPokemons = allPokemons;
        }

        displayPokemons(filteredPokemons);

        if (filteredPokemons.length === 0) {
                notFoundMessage.style.display = "block";
        } else {
                notFoundMessage.style.display = "none";
        }

        updateLoadMoreButton();
}

const closeButton = document.querySelector("#search-close-icon");
closeButton.addEventListener("click", clearSearch);

function clearSearch() {
        searchInput.value = "";
        displayPokemons(allPokemons);
        notFoundMessage.style.display = "none";
        updateLoadMoreButton();
}
