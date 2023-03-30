import React from "react";
import { Outlet } from "@remix-run/react";

export default function PokemonRoute() {
  return (
    <div>
      <div>PokemonRoute</div>
      <div>
        <Outlet />
      </div>
    </div>
  );
}
