import fetch from 'node-fetch';
import readline from 'readline';

let playerHP = 300;
let botHP = 300;

// Création de l'interface readline
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function getPokemonData(pokemonName) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`);
    const data = await response.json();
    return data;
}

function getRandomMoves(moves) {
    const selectedMoves = [];
    while (selectedMoves.length < 5) {
        const move = moves[Math.floor(Math.random() * moves.length)];
        if (!selectedMoves.find(m => m.move.name === move.move.name)) {
            selectedMoves.push(move);
        }
    }
    return selectedMoves;
}

async function getMoveDetails(moveUrl) {
    const response = await fetch(moveUrl);
    const data = await response.json();
    return { name: data.name, pp: data.pp };
}

function displayHP() {
    console.log(`Points de vie du joueur : ${playerHP}`);
    console.log(`Points de vie du bot : ${botHP}`);
}

function attack(attacker, defenderHP, move) {
    if (move.pp > 0) {
        console.log(`${attacker} utilise ${move.name} !`);
        const damage = Math.floor(Math.random() * 50) + 1; // Dégâts aléatoires entre 1 et 50
        console.log(`Attaque réussie ! ${damage} dégâts infligés.`);
        move.pp--; // Réduire le PP après l'attaque
        return defenderHP - damage;
    } else {
        console.log(`${attacker} ne peut plus utiliser ${move.name} (PP épuisés) !`);
        return defenderHP;
    }
}

async function playGame() {
    const playerPokemon = process.argv[2] || 'pikachu';
    const botPokemon = 'charizard';

    console.log(`Le joueur a choisi ${playerPokemon}`);
    console.log(`Le bot utilise ${botPokemon}`);

    const playerData = await getPokemonData(playerPokemon);
    const botData = await getPokemonData(botPokemon);

    const playerMoves = getRandomMoves(playerData.moves);
    const botMoves = getRandomMoves(botData.moves);

    const playerMoveDetails = await Promise.all(playerMoves.map(m => getMoveDetails(m.move.url)));
    const botMoveDetails = await Promise.all(botMoves.map(m => getMoveDetails(m.move.url)));

    console.log(`Le combat commence !`);
    displayHP();

    while (playerHP > 0 && botHP > 0) {
        console.log("\nMouvements du joueur :");
        playerMoveDetails.forEach((move, index) => {
            console.log(`${index + 1}. ${move.name} (PP restant: ${move.pp})`);
        });

        // Attente de l'entrée de l'utilisateur
        const moveIndex = await new Promise(resolve => {
            rl.question("Choisissez un mouvement (1-5) : ", answer => {
                resolve(parseInt(answer) - 1);
            });
        });

        const playerMove = playerMoveDetails[moveIndex];

        botHP = attack(playerPokemon, botHP, playerMove);

        if (botHP <= 0) {
            console.log("Le bot est KO ! Vous avez gagné !");
            break;
        }

        const botMove = botMoveDetails[Math.floor(Math.random() * botMoveDetails.length)];
        playerHP = attack(botPokemon, playerHP, botMove);

        if (playerHP <= 0) {
            console.log("Vous êtes KO ! Le bot a gagné !");
            break;
        }

        displayHP();
    }

    // Fermeture de l'interface readline
    rl.close();
}

playGame().catch(console.error);
