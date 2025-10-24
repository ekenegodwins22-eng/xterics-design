import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { useState } from "react";

const ADMIN_EMAIL = "whestwhest5@gmail.com";
const WHATSAPP_CONTACT = "+2347046907742";

export default function AdminDashboard() {
  const { user, isAuthenticated, logout } = useAuth();
  const [, navigate] = useLocation();

  // Check if user is admin
  const isAdmin = isAuthenticated && user?.email === ADMIN_EMAIL;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Please log in to access admin dashboard</h2>
          <Button onClick={() => navigate("/")} variant="default">
            Go to Home
          </Button>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Access Denied</h2>
          <p className="text-slate-400 mb-6">You do not have permission to access the admin dashboard.</p>
          <p className="text-slate-400 mb-6">Logged in as: <strong>{user?.email}</strong></p>
          <Button onClick={() => navigate("/")} variant="default">
            Go to Home
          </Button>
        </div>
      </div>
    );
  }

  return <AdminDashboardContent user={user} logout={logout} navigate={navigate} />;
}

function AdminDashboardContent({ user, logout, navigate }: any) {
  const { data: allOrders, isLoading: ordersLoading, refetch: refetchOrders } = trpc.orders.getAllOrders.useQuery();
  const { data: allCustomOrders, isLoading: customOrdersLoading, refetch: refetchCustomOrders } = trpc.customOrders.getAllCustomOrders.useQuery();
  const updateOrderStatusMutation = trpc.orders.updateStatus.useMutation();
  const updateCustomOrderStatusMutation = trpc.customOrders.updateStatus.useMutation();

  const [selectedOrderStatus, setSelectedOrderStatus] = useState<{ [key: number]: string }>({});
  const [selectedCustomOrderStatus, setSelectedCustomOrderStatus] = useState<{ [key: number]: string }>({});

  const handleUpdateOrderStatus = async (orderId: number, newStatus: string) => {
    try {
      await updateOrderStatusMutation.mutateAsync({ orderId, status: newStatus });
      setSelectedOrderStatus(prev => ({ ...prev, [orderId]: "" }));
      refetchOrders();
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Failed to update order status");
    }
  };

  const handleUpdateCustomOrderStatus = async (customOrderId: number, newStatus: string) => {
    try {
      await updateCustomOrderStatusMutation.mutateAsync({ customOrderId, status: newStatus });
      setSelectedCustomOrderStatus(prev => ({ ...prev, [customOrderId]: "" }));
      refetchCustomOrders();
    } catch (error) {
      console.error("Error updating custom order status:", error);
      alert("Failed to update custom order status");
    }
  };

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
          <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-slate-300 text-sm">👤 {user?.name}</span>
            <Button onClick={() => navigate("/")} variant="outline" className="border-slate-500 text-slate-300">
              Back to Home
            </Button>
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
        {/* Admin Info Card */}
        <Card className="bg-slate-800 border-slate-700 mb-8">
          <CardHeader>
            <CardTitle className="text-white">Welcome, Admin!</CardTitle>
            <CardDescription className="text-slate-400">
              Manage all orders and custom requests from your clients
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-700 rounded-lg p-4">
                <p className="text-slate-400 text-sm">Total Service Orders</p>
                <p className="text-3xl font-bold text-blue-400">{allOrders?.length || 0}</p>
              </div>
              <div className="bg-slate-700 rounded-lg p-4">
                <p className="text-slate-400 text-sm">Total Custom Orders</p>
                <p className="text-3xl font-bold text-green-400">{allCustomOrders?.length || 0}</p>
              </div>
              <div className="bg-slate-700 rounded-lg p-4">
                <p className="text-slate-400 text-sm">WhatsApp Contact</p>
                <a
                  href={`https://wa.me/${WHATSAPP_CONTACT.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg font-bold text-green-400 hover:text-green-300 transition"
                >
                  {WHATSAPP_CONTACT}
                </a>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders Management Tabs */}
        <Tabs defaultValue="orders" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-slate-800 border-slate-700">
            <TabsTrigger value="orders" className="data-[state=active]:bg-slate-700">
              Service Orders ({allOrders?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="custom" className="data-[state=active]:bg-slate-700">
              Custom Orders ({allCustomOrders?.length || 0})
            </TabsTrigger>
          </TabsList>

          {/* Service Orders Tab */}
          <TabsContent value="orders" className="space-y-4 mt-6">
            {ordersLoading ? (
              <div className="text-center py-8">
                <p className="text-slate-400">Loading orders...</p>
              </div>
            ) : allOrders && allOrders.length > 0 ? (
              <div className="space-y-4">
                {allOrders.map(order => (
                  <Card key={order.id} className="bg-slate-800 border-slate-700">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-white">Order #{order.id}</CardTitle>
                          <CardDescription className="text-slate-400">
                            Service ID: {order.serviceId} | {new Date(order.createdAt).toLocaleDateString()}
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
                        <p className="text-slate-300 text-sm bg-slate-700 p-3 rounded">{order.description}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-700">
                        <div>
                          <p className="text-sm text-slate-400">Price</p>
                          <p className="text-lg font-bold text-blue-400">${(order.price / 100).toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-400 mb-2">Update Status</p>
                          <select
                            value={selectedOrderStatus[order.id] || ""}
                            onChange={(e) => {
                              if (e.target.value) {
                                handleUpdateOrderStatus(order.id, e.target.value);
                              }
                            }}
                            className="bg-slate-700 border border-slate-600 text-white rounded px-2 py-1 text-sm w-full"
                          >
                            <option value="">Select status...</option>
                            <option value="pending">Pending</option>
                            <option value="paid">Paid</option>
                            <option value="in-progress">In Progress</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="py-8 text-center">
                  <p className="text-slate-400">No service orders yet</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Custom Orders Tab */}
          <TabsContent value="custom" className="space-y-4 mt-6">
            {customOrdersLoading ? (
              <div className="text-center py-8">
                <p className="text-slate-400">Loading custom orders...</p>
              </div>
            ) : allCustomOrders && allCustomOrders.length > 0 ? (
              <div className="space-y-4">
                {allCustomOrders.map(customOrder => (
                  <Card key={customOrder.id} className="bg-slate-800 border-slate-700">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-white">Custom Order #{customOrder.id}</CardTitle>
                          <CardDescription className="text-slate-400">
                            {new Date(customOrder.createdAt).toLocaleDateString()}
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
                        <p className="text-slate-300 text-sm bg-slate-700 p-3 rounded">{customOrder.description}</p>
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
                          <p className="text-sm text-slate-400 mb-2">Update Status</p>
                          <select
                            value={selectedCustomOrderStatus[customOrder.id] || ""}
                            onChange={(e) => {
                              if (e.target.value) {
                                handleUpdateCustomOrderStatus(customOrder.id, e.target.value);
                              }
                            }}
                            className="bg-slate-700 border border-slate-600 text-white rounded px-2 py-1 text-sm w-full"
                          >
                            <option value="">Select status...</option>
                            <option value="pending">Pending</option>
                            <option value="quoted">Quoted</option>
                            <option value="accepted">Accepted</option>
                            <option value="in-progress">In Progress</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="py-8 text-center">
                  <p className="text-slate-400">No custom orders yet</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

