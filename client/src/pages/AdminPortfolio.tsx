import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Link } from "wouter";

export default function AdminPortfolio() {
  const { user } = useAuth();
  const { data: projects, refetch } = trpc.portfolio.list.useQuery();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "logo",
    price: "",
    isFeatured: false,
  });

  const createMutation = trpc.portfolio.create.useMutation({
    onSuccess: () => {
      setFormData({ title: "", description: "", category: "logo", price: "", isFeatured: false });
      setShowForm(false);
      refetch();
    },
  });

  const deleteMutation = trpc.portfolio.delete.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  if (user?.email !== "whestwhest5@gmail.com") {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="py-12 text-center">
            <p className="text-slate-400 text-lg mb-4">Access Denied</p>
            <Link href="/">
              <Button variant="default">Go Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      title: formData.title,
      description: formData.description || undefined,
      category: formData.category,
      price: formData.price ? parseInt(formData.price) : undefined,
      isFeatured: formData.isFeatured,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-white hover:text-blue-400 transition">
            Xterics
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-slate-300 hover:text-white transition">
              Orders
            </Link>
            <Link href="/admin/portfolio" className="text-blue-400 font-semibold">
              Portfolio
            </Link>
            <Button asChild variant="default" size="sm">
              <Link href="/">Home</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-white">Portfolio Management</h1>
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {showForm ? "Cancel" : "+ Add Project"}
          </Button>
        </div>

        {/* Add Project Form */}
        {showForm && (
          <Card className="bg-slate-800 border-slate-700 mb-8">
            <CardHeader>
              <CardTitle className="text-white">Add New Project</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-slate-300 text-sm font-semibold">Project Title *</label>
                  <Input
                    type="text"
                    placeholder="e.g., Modern Tech Startup Logo"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="bg-slate-700 border-slate-600 text-white mt-2"
                    required
                  />
                </div>

                <div>
                  <label className="text-slate-300 text-sm font-semibold">Description</label>
                  <textarea
                    placeholder="Describe the project..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="bg-slate-700 border-slate-600 text-white mt-2 w-full rounded px-3 py-2 border"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-300 text-sm font-semibold">Category *</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="bg-slate-700 border-slate-600 text-white mt-2 w-full rounded px-3 py-2 border"
                      required
                    >
                      <option value="logo">Logo Design</option>
                      <option value="branding">Branding</option>
                      <option value="social-media">Social Media</option>
                      <option value="web">Web Design</option>
                      <option value="packaging">Packaging</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-300 text-sm font-semibold">Price ($)</label>
                    <Input
                      type="number"
                      placeholder="e.g., 250"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="bg-slate-700 border-slate-600 text-white mt-2"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="rounded"
                  />
                  <label htmlFor="featured" className="text-slate-300 text-sm">
                    Featured on homepage
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={createMutation.isPending}>
                    {createMutation.isPending ? "Creating..." : "Create Project"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowForm(false)}
                    className="border-slate-600"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </section>

      {/* Projects List */}
      <section className="container mx-auto px-4 pb-20">
        <h2 className="text-2xl font-bold text-white mb-6">Projects ({projects?.length || 0})</h2>

        {projects && projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project: any) => (
              <Card key={project.id} className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">{project.title}</CardTitle>
                  <CardDescription className="text-slate-400">
                    {project.category} {project.isFeatured && "• Featured"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-300 text-sm mb-4">{project.description}</p>
                  {project.price && (
                    <p className="text-blue-400 font-semibold mb-4">${(project.price / 100).toFixed(2)}</p>
                  )}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 border-slate-600"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteMutation.mutate({ id: project.id })}
                      disabled={deleteMutation.isPending}
                    >
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="py-12 text-center">
              <p className="text-slate-400 text-lg">No projects yet. Create one to get started!</p>
            </CardContent>
          </Card>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-700 py-12">
        <div className="container mx-auto px-4 text-center text-slate-400">
          <p>&copy; 2025 Xterics. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
