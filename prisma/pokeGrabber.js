import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function buildOneFiftyOriginal() {
  for (let i = 1; i <= 3; i++) {
    let pokePromise = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`);
    let thisPokemon = await pokePromise.json();

    // create array of abiliy ids from abilities array
    const abilityIds = [];
    for (let ability of thisPokemon.abilities) {
      const url = ability.ability.url;
      let abilityId;

      // parse ability id from ability url
      let searchingForFirstSlash = true;
      let searchIndex = url.length - 2;
      while (searchingForFirstSlash) {
        if (url[searchIndex] === "/") {
          console.log("char is", url[searchIndex]);
          searchingForFirstSlash = false;
          abilityId = url.slice(searchIndex + 1).slice(0, -1);
        } else {
          console.log("char is", url[searchIndex]);
          searchIndex--;
        }
      }

      abilityIds.push(abilityId);
    }

    // create array of move ids from moves array
    const moveIds = [];
    for (let move of thisPokemon.moves) {
      const url = move.move.url;
      let moveId;

      // parse move id from move url
      let searchingForFirstSlash = true;
      let searchIndex = url.length - 2;
      while (searchingForFirstSlash) {
        if (url[searchIndex] === "/") {
          console.log("char is", url[searchIndex]);
          searchingForFirstSlash = false;
          moveId = url.slice(searchIndex + 1).slice(0, -1);
        } else {
          console.log("char is", url[searchIndex]);
          searchIndex--;
        }
      }

      moveIds.push(moveId);
    }

    await prisma.pokemon.create({
      data: {
        pokeId: i,
        name: thisPokemon.name,
        height: thisPokemon.height,
        weight: thisPokemon.weight,
        spriteUrl: thisPokemon.sprites.front_default,
      },
    });
  }
}

// buildOneFiftyOriginal()
//   .then(async () => {
//     await prisma.$disconnect();
//   })
//   .catch(async (e) => {
//     console.error(e);
//     await prisma.$disconnect();
//     process.exit(1);
//   });

buildOneFiftyOriginal();
