"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";

export default function SalyMapInner() {
  useEffect(() => {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });
  }, []);

  const salyLat = 14.4365;
  const salyLng = -17.0093;

  return (
    <MapContainer
      center={[salyLat, salyLng]}
      zoom={13}
      scrollWheelZoom={false}
      className="z-0 h-96 w-full overflow-hidden rounded-2xl border border-white/10"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[salyLat, salyLng]}>
        <Popup>
          <div className="font-semibold text-zinc-900">Saly Portudal, Sénégal</div>
          <div className="text-sm text-zinc-600">Découvrez nos biens d'exception</div>
        </Popup>
      </Marker>
    </MapContainer>
  );
}
