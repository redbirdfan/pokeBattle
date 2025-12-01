const battleModal = document.getElementById('battleModal');
const closeButton = document.querySelector('.close-button');
const battleContentDiv = document.getElementById('battleDescriptionContent');
const fightButton = document.getElementById('writeBattleButton');

function closeModal() {
    battleModal.style.display = 'none';
}

closeButton.addEventListener('click', closeModal);
window.addEventListener('click', (event) => {
    if (event.target == battleModal) {
        closeModal();
    }
});

async function makeApiRequest(pokemonOne, pokemonTwo) {
    const response = await fetch('http://localhost:5000/api/battle', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({pokemonOne, pokemonTwo})
    });
   
    const data = await response.json();

    if(!response.ok) {
        throw new Error(data.error || "Server error found");
    }

    return data.battleDescription;
}


writeBattleButton.addEventListener('click', async () => {
    
    const pokemonOne = document.getElementById('pokemonOne').value;
    const pokemonTwo = document.getElementById('pokemonTwo').value;
    
    if(!pokemonOne || !pokemonTwo){
        document.getElementById('battleResult').textContent = "A battle needs 2 Pokemon!!!";
        return;
    }

    writeBattleButton.disabled = true;
    document.getElementById('battleResult').textContent = "Generating battle, please wait...";

    try {
        const battleDescription = await makeApiRequest(pokemonOne, pokemonTwo);

        battleContentDiv.textContent = battleDescription
        battleModal.style.display = 'block';


    } catch (error) {
        console.error("Gemini request error:", error);
        document.getElementById('battleResult').textContent = "Error generating battle. Check the console for details.";
    } finally {
        writeBattleButton.disable = false;
    }
});


async function fetchPokemon() {
    try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=100');
        const data = await response.json();

        const pokemonNames = data.results.map(pokemon => pokemon.name);
        pokemonNames.sort();
        populateDropdowns(pokemonNames);

    } catch (error) {
        console.error('Error fetching Pokémon data:', error);
        
        const dropdownOne = document.getElementById('pokemonOne');
        dropdownOne.innerHTML = '<option value="">Error Loading Names</option>';
        document.getElementById('pokemonTwo').innerHTML = dropdownOne.innerHTML;

        throw error;
    }
}

function populateDropdowns(pokemonNames) {
    const dropdownOne = document.getElementById('pokemonOne');
    const dropdownTwo = document.getElementById('pokemonTwo');

    dropdownOne.innerHTML = '';
    dropdownTwo.innerHTML = '';

    pokemonNames.forEach(name => {
       
        const option = document.createElement('option');
        option.value = name;
        option.textContent = name.charAt(0).toUpperCase() + name.slice(1); 

        
        dropdownOne.appendChild(option);
        dropdownTwo.appendChild(option.cloneNode(true));
    });
}

fetchPokemon();