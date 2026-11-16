// Distância entre duas coordenadas (fórmula de Haversine), em metros.
export function distanciaMetros(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const rad = (g) => (g * Math.PI) / 180;
  const dLat = rad(lat2 - lat1);
  const dLon = rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

export function formatarDistancia(m) {
  return m < 1000 ? `${Math.round(m)} m` : `${(m / 1000).toFixed(1)} km`;
}

export function maisProximo(pontos, lat, lon) {
  let melhor = null;
  for (const p of pontos) {
    const d = distanciaMetros(lat, lon, p.latitude, p.longitude);
    if (!melhor || d < melhor.distancia) melhor = { ...p, distancia: d };
  }
  return melhor;
}
