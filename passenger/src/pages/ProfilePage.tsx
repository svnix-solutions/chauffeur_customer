import { Link } from "react-router-dom"
import { useProfile } from "@/hooks/useProfile"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Settings, Bell, Shield, HelpCircle, LogOut } from "lucide-react"

export default function ProfilePage() {
  const { profile, isLoading, isSigningOut, signOut } = useProfile()

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-2xl mx-auto">
        {/* Profile Header */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={profile?.user_image} alt={profile?.full_name} />
                <AvatarFallback>{profile?.full_name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold">{profile?.full_name}</h2>
                <p className="text-gray-500">{profile?.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Menu */}
        <Card>
          <CardHeader>
            <CardTitle>Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Link
                to="settings"
                className="flex items-center p-3 rounded-lg hover:bg-gray-100"
              >
                <Settings className="h-5 w-5 mr-3" />
                <span>Account Settings</span>
              </Link>
              <Link
                to="notifications"
                className="flex items-center p-3 rounded-lg hover:bg-gray-100"
              >
                <Bell className="h-5 w-5 mr-3" />
                <span>Notifications</span>
              </Link>
              <Link
                to="privacy"
                className="flex items-center p-3 rounded-lg hover:bg-gray-100"
              >
                <Shield className="h-5 w-5 mr-3" />
                <span>Privacy & Security</span>
              </Link>
              <Link
                to="help"
                className="flex items-center p-3 rounded-lg hover:bg-gray-100"
              >
                <HelpCircle className="h-5 w-5 mr-3" />
                <span>Help & Support</span>
              </Link>
              <Button
                variant="ghost"
                className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => signOut()}
                disabled={isSigningOut}
              >
                <LogOut className="h-5 w-5 mr-3" />
                <span>Sign Out</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 