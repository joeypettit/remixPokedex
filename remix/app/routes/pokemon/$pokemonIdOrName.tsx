import React from "react";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import type { Pokemon } from "@prisma/client";
import type { LoaderArgs } from "@remix-run/node";

import { db } from "~/utils/db.server";

export const loader = async ({ params }: LoaderArgs) => {
  let thisPokemon;

  if (Number.isNaN(Number(params.pokemonIdOrName))) {
    thisPokemon = await db.pokemon.findUnique({
      where: { name: params.pokemonIdOrName },
      include: {
        Ability: true,
        Move: true,
      },
    });
  } else {
    thisPokemon = await db.pokemon.findUnique({
      where: { id: Number(params.pokemonIdOrName) },
      include: {
        Ability: true,
        Move: true,
      },
    });
  }

  if (!thisPokemon) {
    throw new Error("Pokemon not found");
  }

  console.log("this pokemon", thisPokemon);

  return json({ thisPokemon });
};

export default function PokemonByIdOrNameRoute() {
  const data = useLoaderData<typeof loader>();

  return (
    <div>
      <div>{data.thisPokemon.name}</div>
      <img
        src={data.thisPokemon.spriteUrl}
        alt={"pic of" + data.thisPokemon.name}
      />
      <div></div>
    </div>
  );
}
