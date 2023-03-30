import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function buildOneFiftyOriginal() {
  for (let i = 1; i <= 150; i++) {
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
          abilityId = Number(url.slice(searchIndex + 1).slice(0, -1));
        } else {
          console.log("char is", url[searchIndex]);
          searchIndex--;
        }
      }

      await prisma.ability.upsert({
        where: { id: abilityId },
        create: {
          id: abilityId,
          name: ability.ability.name,
          url: ability.ability.url,
        },
        update: {},
      });

      abilityIds.push({ id: abilityId });
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
          searchingForFirstSlash = false;
          moveId = Number(url.slice(searchIndex + 1).slice(0, -1));
        } else {
          searchIndex--;
        }
      }

      await prisma.move.upsert({
        where: { id: moveId },
        create: {
          id: moveId,
          name: move.move.name,
          url: move.move.url,
        },
        update: {},
      });

      moveIds.push({ id: moveId });
    }

    await prisma.pokemon.create({
      data: {
        id: i,
        name: thisPokemon.name,
        height: thisPokemon.height,
        weight: thisPokemon.weight,
        spriteUrl: thisPokemon.sprites.front_default,
        abilities: {
          connect: abilityIds,
        },
        moves: {
          connect: moveIds,
        },
      },
    });
  }
}

buildOneFiftyOriginal()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
