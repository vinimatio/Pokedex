const pokemonList = document.querySelector('#pokemonList');
const loadMoreButton = document.querySelector('#loadMore');
const maxRecords = 151;
const limit = 8;
let offset = 0;

function convertTypesToColors(text) {

    const wordsToChange = {
        normal: '#a6a877',
        grass: '#77c850',
        fire: '#ee7f30',
        water: '#678fee',
        electric: '#f7cf2e',
        ice: '#98d5d7',
        ground: '#dfbf69',
        flying: '#a98ff0',
        poison: '#a040a0',
        fighting: '#bf3029',
        psychic: '#f65687',
        dark: '#725847',
        rock: '#b8a137',
        bug: '#a8b720',
        ghost: '#6e5896',
        steel: '#b9b7cf',
        dragon: '#6f38f6',
        fairy: '#f9aec7',
    }

    const checkNumberOfwrods = text.split(',');
    
    if (checkNumberOfwrods.length === 1) {
        text = `${text},${text}`
    } else {
        text = checkNumberOfwrods[0]+' 35%,'+checkNumberOfwrods[1]+' 65%';
    }

    return text.replace(/normal|grass|fire|water|electric|ice|ground|flying|poison|fighting|psychic|dark|rock|bug|ghost|steel|dragon|fairy/g, match => wordsToChange[match])
}


function loadPokemonItens(offset, limit) {



    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {

        pokemonList.innerHTML += pokemons.map((pokemon) => `
        <li class="pokemon ${pokemon.type}"  style="background: linear-gradient(225deg, ${convertTypesToColors(pokemon.types.map((type) => type).join())});">
                    <span class="number">#${pokemon.number}</span>
                    <span class="name">${pokemon.name}</span>
                    <div class="detail">
                        <ol class="types">
                        ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                        </ol>
                        <img src="${pokemon.photo}"
                            alt="${pokemon.name}">
                    </div>
                </li>
            `).join('');

    })

}

loadPokemonItens(offset, limit);

loadMoreButton.addEventListener('click', () => {
    offset += limit;
    const qtdRecordNextPage = offset + limit;

    if (qtdRecordNextPage >= maxRecords) {
        const newLimit = maxRecords - offset;
        loadPokemonItens(offset, newLimit);

        loadMoreButton.parentElement.removeChild(loadMoreButton);

    } else {
        loadPokemonItens(offset, limit);
    }
})