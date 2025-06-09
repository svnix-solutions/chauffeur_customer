import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { HelpCircle, MessageCircle, Phone, Mail } from "lucide-react"

export default function HelpPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              Help & Support
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full justify-start">
              <MessageCircle className="h-4 w-4 mr-2" />
              Chat with Support
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Phone className="h-4 w-4 mr-2" />
              Call Support
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Mail className="h-4 w-4 mr-2" />
              Email Support
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-medium">How do I book a ride?</h3>
              <p className="text-sm text-muted-foreground">
                Open the app, enter your destination, and tap "Book Now". A driver will be assigned to you shortly.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">How do I pay for my ride?</h3>
              <p className="text-sm text-muted-foreground">
                You can pay using cash, credit card, or digital payment methods. Add your preferred payment method in the app settings.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">What if I need to cancel my ride?</h3>
              <p className="text-sm text-muted-foreground">
                You can cancel your ride up to 5 minutes after booking without any charge. After that, a cancellation fee may apply.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 