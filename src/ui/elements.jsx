import React from "react";

import elements from "../elements";

export const Elements = Object.fromEntries(
  Object.entries(elements).map(([key, element]) => [
    key,
    <span>
      <sup>{element.mass_number}</sup>
      {element.atomic_symbol}
    </span>,
  ])
);
