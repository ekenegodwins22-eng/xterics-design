import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Dashboard() {
  const { user, isAuthenticated, logout } = useAuth();
  const [, navigate] = useLocation();

  const { data: orders, isLoading: ordersLoading } = trpc.orders.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const { data: customOrders, isLoading: customOrdersLoading } = trpc.customOrders.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Please log in to access your dashboard</h2>
          <Button onClick={() => navigate("/")} variant="default">
            Go to Home
          </Button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-900/20 text-yellow-400 border-yellow-600";
      case "paid":
        return "bg-blue-900/20 text-blue-400 border-blue-600";
      case "in-progress":
        return "bg-purple-900/20 text-purple-400 border-purple-600";
      case "completed":
        return "bg-green-900/20 text-green-400 border-green-600";
      case "cancelled":
        return "bg-red-900/20 text-red-400 border-red-600";
      case "quoted":
        return "bg-cyan-900/20 text-cyan-400 border-cyan-600";
      case "accepted":
        return "bg-green-900/20 text-green-400 border-green-600";
      default:
        return "bg-slate-700 text-slate-300 border-slate-600";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      {/* Navigation */}
      <nav className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-slate-300">{user?.name}</span>
            <Button
              onClick={() => {
                logout();
                navigate("/");
              }}
              variant="outline"
              className="border-slate-500 text-slate-300"
            >
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12">
        {/* User Info Card */}
        <Card className="bg-slate-800 border-slate-700 mb-8">
          <CardHeader>
            <CardTitle className="text-white">Welcome, {user?.name}!</CardTitle>
            <CardDescription className="text-slate-400">{user?.email}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate("/")} variant="default" className="bg-blue-600 hover:bg-blue-700">
              ← Back to Home
            </Button>
          </CardContent>
        </Card>

        {/* Orders Tabs */}
        <Tabs defaultValue="orders" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-slate-800 border-slate-700">
            <TabsTrigger value="orders" className="data-[state=active]:bg-slate-700">
              Service Orders ({orders?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="custom" className="data-[state=active]:bg-slate-700">
              Custom Orders ({customOrders?.length || 0})
            </TabsTrigger>
          </TabsList>

          {/* Service Orders Tab */}
          <TabsContent value="orders" className="space-y-4 mt-6">
            {ordersLoading ? (
              <div className="text-center py-8">
                <p className="text-slate-400">Loading your orders...</p>
              </div>
            ) : orders && orders.length > 0 ? (
              <div className="space-y-4">
                {orders.map(order => (
                  <Card key={order.id} className="bg-slate-800 border-slate-700">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-white">Order #{order.id}</CardTitle>
                          <CardDescription className="text-slate-400">
                            Service ID: {order.serviceId}
                          </CardDescription>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-slate-400">Client Name</p>
                          <p className="text-white font-medium">{order.clientName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-400">Email</p>
                          <p className="text-white font-medium">{order.clientEmail}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-slate-400 mb-1">Description</p>
                        <p className="text-slate-300 text-sm">{order.description}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-700">
                        <div>
                          <p className="text-sm text-slate-400">Price</p>
                          <p className="text-lg font-bold text-blue-400">${(order.price / 100).toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-400">Created</p>
                          <p className="text-slate-300 text-sm">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="py-8 text-center">
                  <p className="text-slate-400 mb-4">You haven't placed any service orders yet</p>
                  <Button onClick={() => navigate("/")} className="bg-blue-600 hover:bg-blue-700">
                    Browse Services
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Custom Orders Tab */}
          <TabsContent value="custom" className="space-y-4 mt-6">
            {customOrdersLoading ? (
              <div className="text-center py-8">
                <p className="text-slate-400">Loading your custom orders...</p>
              </div>
            ) : customOrders && customOrders.length > 0 ? (
              <div className="space-y-4">
                {customOrders.map(customOrder => (
                  <Card key={customOrder.id} className="bg-slate-800 border-slate-700">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-white">Custom Order #{customOrder.id}</CardTitle>
                          <CardDescription className="text-slate-400">
                            Submitted on {new Date(customOrder.createdAt).toLocaleDateString()}
                          </CardDescription>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(customOrder.status)}`}>
                          {customOrder.status.charAt(0).toUpperCase() + customOrder.status.slice(1)}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-slate-400">Client Name</p>
                          <p className="text-white font-medium">{customOrder.clientName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-400">Email</p>
                          <p className="text-white font-medium">{customOrder.clientEmail}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-slate-400 mb-1">Project Description</p>
                        <p className="text-slate-300 text-sm">{customOrder.description}</p>
                      </div>
                      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-700">
                        {customOrder.budget && (
                          <div>
                            <p className="text-sm text-slate-400">Budget</p>
                            <p className="text-lg font-bold text-slate-300">${(customOrder.budget / 100).toFixed(2)}</p>
                          </div>
                        )}
                        {customOrder.quotedPrice && (
                          <div>
                            <p className="text-sm text-slate-400">Quoted Price</p>
                            <p className="text-lg font-bold text-blue-400">${(customOrder.quotedPrice / 100).toFixed(2)}</p>
                          </div>
                        )}
                        <div>
                          <p className="text-sm text-slate-400">Status</p>
                          <p className="text-slate-300 text-sm capitalize">{customOrder.status}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="py-8 text-center">
                  <p className="text-slate-400 mb-4">You haven't submitted any custom orders yet</p>
                  <Button onClick={() => navigate("/custom-order")} className="bg-green-600 hover:bg-green-700">
                    Request Custom Design
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

