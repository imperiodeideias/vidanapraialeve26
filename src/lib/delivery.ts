export type DeliveryRegion = { city: string; state: string };
/** Regras de entrega da loja (valores em centavos). */
export const FRETE_PERUIBE = 890;
export const FRETE_OUTRAS = 1890;
export const FRETE_GRATIS_ACIMA = 20000;
export const CIDADES_ATENDIDAS = ["Peruíbe", "Pedro de Toledo", "Ana Dias", "Itariri"];
const normalize = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLowerCase().replace(/\s+/g, " ");
export function deliveryCity(city: string) {
  const value = normalize(city);
  // Postal services may return the district together with its municipality.
  return value === "ana dias (itariri)" ? "ana dias" : value;
}
export function servesRegion({ city, state }: DeliveryRegion) {
  return normalize(state) === "sp" && CIDADES_ATENDIDAS.map(normalize).includes(deliveryCity(city));
}
export function deliveryFee(total: number, region: DeliveryRegion) {
  if (!servesRegion(region)) return null;
  return deliveryCity(region.city) === "peruibe" ? (total > FRETE_GRATIS_ACIMA ? 0 : FRETE_PERUIBE) : FRETE_OUTRAS;
}
const brl = (c: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(c / 100);
/** Texto curto das condições de entrega, derivado das regras acima. */
export const resumoEntrega = `Peruíbe: ${brl(FRETE_PERUIBE)} (grátis acima de ${brl(FRETE_GRATIS_ACIMA).replace(",00", "")}). Pedro de Toledo, Ana Dias e Itariri: ${brl(FRETE_OUTRAS)}.`;
