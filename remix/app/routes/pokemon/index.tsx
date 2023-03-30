import React from "react";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import type { Pokemon } from "@prisma/client";

import { db } from "~/utils/db.server";

export const loader = async () => {
  return json({
    pokemon: await db.pokemon.findMany({
      take: 5,
      select: { id: true, name: true, spriteUrl: true },
    }),
  });
};

export default function PokemonIndexRoute() {
  const data = useLoaderData<typeof loader>();

  return (
    <div>
      <ul>
        {data.pokemon.map((thisPokemon) => (
          <li key={thisPokemon.id}>
            {thisPokemon.name}
            <img src={thisPokemon.spriteUrl} />
          </li>
        ))}
      </ul>
    </div>
  );
}
