import elementsRaw from "./elements.json";

export interface Element {
  key: string;
  atomic_number: number;
  atomic_symbol: string;
  isotopic_composition: number;
  mass_number: number;
  notes: string;
  relative_atomic_mass: number;
  standard_atomic_weight: string | number;
}

const elements: Record<string, Element> = Object.fromEntries(
  (elementsRaw as Element[]).map((element) => {
    let key = `${element.atomic_symbol}${element.mass_number}`;
    let value: Element = { ...element, key };
    return [key, value];
  })
);

export default elements;
