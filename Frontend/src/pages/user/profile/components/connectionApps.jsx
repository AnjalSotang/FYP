import { Card, CardContent, CardDescription, CardFooter,CardHeader, CardTitle } from "@/components/ui/card"
import {
    Smartphone
  } from "lucide-react"
  import { Button } from "@/components/ui/button"

const ConnectedApps = () => {
  // Mock connected apps
  const connectedApps = [
    { id: 1, name: "Google Fit", connected: true, icon: "🔄" },
    { id: 2, name: "Apple Health", connected: false, icon: "❤️" },
    { id: 3, name: "Fitbit", connected: true, icon: "⌚" },
  ]

return(
    <Card id="connected-apps">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Smartphone className="h-5 w-5 text-lime-400" />
                Connected Apps
              </CardTitle>
              <CardDescription>
                Manage connections with other fitness apps and devices
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {connectedApps.map((app) => (
                  <div key={app.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{app.icon}</div>
                      <div>
                        <h3 className="font-medium text-white">{app.name}</h3>
                        <p className="text-sm text-gray-300">{app.connected ? "Connected" : "Not connected"}</p>
                      </div>
                    </div>
                    <Button
                      variant={app.connected ? "outline" : "default"}
                      size="sm"
                     
                    >
                      {app.connected ? "Disconnect" : "Connect"}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
)}


export default ConnectedApps;