'use client';

import dynamic from 'next/dynamic';
import { PinIcon, ExternalIcon } from '@/components/ui/Icons';

interface CompanyMapProps {
  coords: { lat: number; lng: number };
  label: string;
}

function MapInner({ coords, label }: CompanyMapProps) {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { MapContainer, TileLayer, Marker, Popup } = require('react-leaflet');
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const L = require('leaflet');

  L.Icon.Default.mergeOptions({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  });

  const osmUrl = `https://www.openstreetmap.org/?mlat=${coords.lat}&mlon=${coords.lng}#map=17/${coords.lat}/${coords.lng}`;

  return (
    <div className="relative rounded-2xl overflow-hidden hairline bg-white">
      <div className="absolute z-1000 top-3 left-3 flex items-center gap-1.5 bg-white/95 backdrop-blur rounded-full pl-2 pr-3 py-1 text-[12px] text-slate-700 border border-slate-200 shadow-sm">
        <PinIcon className="w-3.5 h-3.5 text-accent" style={{ color: 'var(--accent)' }} />
        <span className="num">{coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}</span>
      </div>
      <a
        href={osmUrl}
        target="_blank"
        rel="noreferrer"
        className="absolute z-1000 top-3 right-3 inline-flex items-center gap-1 bg-white/95 backdrop-blur rounded-full px-3 py-1 text-[12px] text-slate-700 border border-slate-200 shadow-sm hover:bg-white"
      >
        Otevřít mapu <ExternalIcon className="w-3 h-3" />
      </a>
      <MapContainer
        center={[coords.lat, coords.lng]}
        zoom={15}
        style={{ height: '280px', width: '100%' }}
        scrollWheelZoom={false}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[coords.lat, coords.lng]}>
          <Popup>{label}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}

const CompanyMap = dynamic(() => Promise.resolve(MapInner), { ssr: false });

export default CompanyMap;
