import React from 'react';

import elements from "../elements/elements.json";

export const Elements = Object.fromEntries(elements.map((element) => [`${element.atomic_symbol}${element.mass_number}`, <span><sup>{element.mass_number}</sup>{element.atomic_symbol}</span>]))