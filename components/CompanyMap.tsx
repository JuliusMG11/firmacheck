'use client';

import dynamic from 'next/dynamic';

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

  return (
    <MapContainer
      center={[coords.lat, coords.lng]}
      zoom={15}
      style={{ height: '300px', width: '100%', borderRadius: '8px' }}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[coords.lat, coords.lng]}>
        <Popup>{label}</Popup>
      </Marker>
    </MapContainer>
  );
}

const CompanyMap = dynamic(() => Promise.resolve(MapInner), { ssr: false });

export default CompanyMap;
