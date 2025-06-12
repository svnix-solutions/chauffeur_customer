import React from 'react'

const cities = [
  { name: 'Mumbai', image: 'https://placehold.co/100x100?text=Mumbai' },
  { name: 'Delhi', image: 'https://placehold.co/100x100?text=Delhi' },
  { name: 'Bangalore', image: 'https://placehold.co/100x100?text=Bangalore' },
]

export default function CityStep({ onSelect }: { onSelect: (city: string) => void }) {
  return (
    <div className="flex flex-col items-center gap-4">
      <h2 className="text-xl font-bold mb-2">Select Your City</h2>
      <div className="grid grid-cols-2 gap-3 w-full max-w-md">
        {cities.map(city => (
          <button
            key={city.name}
            className="flex flex-col items-center bg-white rounded-lg shadow p-2 hover:bg-muted focus:outline-none"
            onClick={() => onSelect(city.name)}
          >
            <img src={city.image} alt={city.name} className="w-14 h-14 rounded mb-1 object-cover" />
            <span className="font-semibold text-base">{city.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
} 