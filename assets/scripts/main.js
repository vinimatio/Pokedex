const pokemonList = document.querySelector('#pokemonList');
const loadMoreButton = document.querySelector('#loadMore');
const section = document.querySelector('.content');
const closeButton = document.querySelector('#closeButton');
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

    const checkNumberOfwords = text.split(',');

    if (checkNumberOfwords.length === 1) {
        text = `${text},${text}`
    } else {
        text = checkNumberOfwords[0] + ' 35%,' + checkNumberOfwords[1] + ' 65%';
    }

    return text.replace(/normal|grass|fire|water|electric|ice|ground|flying|poison|fighting|psychic|dark|rock|bug|ghost|steel|dragon|fairy/g, match => wordsToChange[match])
}

const countDown = (() => {
    let count = maxRecords + 1;
    return () => {
        count--;
        return count;
    };

})();

function loadPokemonItens(offset, limit) {

    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {

        pokemonList.innerHTML += pokemons.map((pokemon) => `                              
            <li id="${pokemon.number}" class="pokemon ${pokemon.type}"  style="background: linear-gradient(225deg, ${convertTypesToColors(pokemon.types.map((type) => type).join())}); z-index: ${countDown()}">
                <span class="number">#${pokemon.number}</span>
                <span class="name">${pokemon.name}</span>
                <div class="detail">
                    <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                    </ol>
                    <img src="${pokemon.photo}" alt="${pokemon.name}">
                </div>
            </li>
            
        `).join('');


        if (offset > 0) {
            window.scrollBy(0, 1000);
        };


    });

};

function createCard() {
    document.addEventListener('DOMContentLoaded', () => {
        document.addEventListener('click', (event) => {
            let targetCard = event.target.closest('.pokemon');

            if (targetCard) {
                targetId = targetCard.id;
                pokemon = pokeApi.getPokemonToCard(targetId)
                pokemon.then((pokemon) => {
                    section.insertAdjacentHTML('beforeend', `<div class="selectedCard" style="background: linear-gradient(225deg, ${convertTypesToColors(pokemon.types.map((type) => type).join())});">

                    <div class="titleSelectedCard">
                        <span>${pokemon.name}</span>
                        <span class="numberTitleSelectedCard">#${pokemon.number}</span>
                    </div>

                    <div>
                        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.number}.png"
                            alt="${pokemon.name}">
                    </div>

                    <div class="typesSelectedCard">
                        ${pokemon.types.map((type) => `<span class="typeSelectedCard type ${type}">${type}</span>`).join('')}                        
                    </div>

                    <div class="statsSelectedCard">

                        <div class="statSelectedCard">
                            <span class="statName">Hp</span><progress value="${pokemon.hp}" max="100"></progress><span>${pokemon.hp}</span>
                        </div>

                        <div class="statSelectedCard">
                            <span class="statName">Atk</span><progress value="${pokemon.attack}" max="100"></progress><span>${pokemon.attack}</span>
                        </div>

                        <div class="statSelectedCard">
                            <span class="statName">Def</span><progress value="${pokemon.defense}" max="100"></progress><span>${pokemon.defense}</span>
                        </div>

                        <div class="statSelectedCard">
                            <span class="statName">Spd</span><progress value="${pokemon.speed}" max="100"></progress><span>${pokemon.speed}</span>
                        </div>

                    </div>

                </div>`);

                })
                loadMoreButton.style.display = 'none'
                closeButton.style.display = 'block'
            };

        });
    });

};

createCard();

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

closeButton.addEventListener('click', () => {
    const pokemonCard = document.querySelectorAll('.selectedCard');

    pokemonCard.forEach((el) => {
        el.parentNode.removeChild(el);
    });

    closeButton.style.display = 'none'
    loadMoreButton.style.display = 'block'
})

loadPokemonItens(offset, limit);