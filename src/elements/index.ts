import elementsRaw from "./elements.json";

interface Element {
  atomic_number: number;
  atomic_symbol: string;
  isotopic_composition: number;
  mass_number: number;
  notes: string;
  relative_atomic_mass: number;
  standard_atomic_weight: string | number;
}

const elements: Record<string, Element> = Object.fromEntries(
  (elementsRaw as Element[]).map((element) => [
    `${element.atomic_symbol}${element.mass_number}`,
    element,
  ])
);

export default elements;
