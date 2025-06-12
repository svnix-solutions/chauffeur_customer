import React from 'react'
import { Link } from 'react-router-dom'
import { MapPinIcon, ClockIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/outline'

export function HomePage() {
  return (
    <div className="p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Welcome back!</h1>
        <p className="text-gray-600">Where would you like to go today?</p>
      </div>

      <div className="space-y-4">
        <Link
          to="/book"
          className="block p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:border-blue-500 transition-colors"
        >
          <div className="flex items-center">
            <MapPinIcon className="h-6 w-6 text-blue-600 mr-3" />
            <div>
              <h2 className="font-semibold text-gray-900">Book a Ride</h2>
              <p className="text-sm text-gray-600">Get a ride to your destination</p>
            </div>
          </div>
        </Link>

        <Link
          to="/current-ride"
          className="block p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:border-blue-500 transition-colors"
        >
          <div className="flex items-center">
            <ArrowTrendingUpIcon className="h-6 w-6 text-green-600 mr-3" />
            <div>
              <h2 className="font-semibold text-gray-900">Current Ride</h2>
              <p className="text-sm text-gray-600">Track your ongoing ride</p>
            </div>
          </div>
        </Link>

        <Link
          to="/rides"
          className="block p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:border-blue-500 transition-colors"
        >
          <div className="flex items-center">
            <ClockIcon className="h-6 w-6 text-blue-600 mr-3" />
            <div>
              <h2 className="font-semibold text-gray-900">Recent Rides</h2>
              <p className="text-sm text-gray-600">View your ride history</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}
