export type DeliveryRegion = { city: string; state: string };
const normalize = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLowerCase().replace(/\s+/g, " ");
export function deliveryCity(city: string) {
  const value = normalize(city);
  // Postal services may return the district together with its municipality.
  return value === "ana dias (itariri)" ? "ana dias" : value;
}
export function servesRegion({ city, state }: DeliveryRegion) {
  return normalize(state) === "sp" && ["peruibe", "pedro de toledo", "ana dias", "itariri"].includes(deliveryCity(city));
}
export function deliveryFee(total: number, region: DeliveryRegion) {
  if (!servesRegion(region)) return null;
  return deliveryCity(region.city) === "peruibe" ? (total > 20000 ? 0 : 890) : 1890;
}
