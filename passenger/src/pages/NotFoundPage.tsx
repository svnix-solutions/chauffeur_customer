import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { HomeIcon } from '@heroicons/react/24/outline'

export function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-gray-900">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700">Page Not Found</h2>
          <p className="text-gray-500">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="flex justify-center">
          <Button asChild>
            <Link to="/" className="flex items-center gap-2">
              <HomeIcon className="h-5 w-5" />
              Back to Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
} 