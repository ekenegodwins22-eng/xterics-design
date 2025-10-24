import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { useState } from "react";

export default function Portfolio() {
  const { data: projects, isLoading } = trpc.portfolio.list.useQuery();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredProjects = selectedCategory
    ? projects?.filter(p => p.category === selectedCategory)
    : projects;

  const categories = projects ? Array.from(new Set(projects.map(p => p.category))) : [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-white hover:text-blue-400 transition">
            Xterics
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-slate-300 hover:text-white transition">
              Home
            </Link>
            <Link href="/portfolio" className="text-blue-400 font-semibold">
              Portfolio
            </Link>
            <Button asChild variant="default" size="sm">
              <Link href="/#services">Services</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="container mx-auto px-4 py-16">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">Our Portfolio</h1>
        <p className="text-xl text-slate-300 max-w-2xl">
          Explore our past design work and see the quality of our services. Each project showcases our expertise and creativity.
        </p>
      </section>

      {/* Category Filter */}
      {categories.length > 0 && (
        <section className="container mx-auto px-4 mb-12">
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => setSelectedCategory(null)}
              variant={selectedCategory === null ? "default" : "outline"}
              className={selectedCategory === null ? "bg-blue-600" : "border-slate-500 text-slate-300"}
            >
              All Projects
            </Button>
            {categories.map(category => (
              <Button
                key={category}
                onClick={() => setSelectedCategory(category)}
                variant={selectedCategory === category ? "default" : "outline"}
                className={selectedCategory === category ? "bg-blue-600" : "border-slate-500 text-slate-300"}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Button>
            ))}
          </div>
        </section>
      )}

      {/* Portfolio Grid */}
      <section className="container mx-auto px-4 pb-20">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-slate-700 rounded-lg h-96 animate-pulse" />
            ))}
          </div>
        ) : filteredProjects && filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project: any) => (
              <Link key={project.id} href={`/portfolio/${project.id}`}>
                <Card className="bg-slate-800 border-slate-700 hover:shadow-lg hover:shadow-blue-500/20 transition cursor-pointer h-full">
                  {project.images && project.images.length > 0 ? (
                    <div className="h-48 overflow-hidden bg-slate-700 rounded-t-lg">
                      <img
                        src={project.images[0].imageUrl}
                        alt={project.title}
                        className="w-full h-full object-cover hover:scale-105 transition"
                      />
                    </div>
                  ) : (
                    <div className="h-48 bg-gradient-to-br from-slate-700 to-slate-600 rounded-t-lg flex items-center justify-center">
                      <span className="text-slate-400">No image</span>
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-white">{project.title}</CardTitle>
                    <CardDescription className="text-slate-400">
                      {project.category.charAt(0).toUpperCase() + project.category.slice(1)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-300 text-sm mb-4 line-clamp-2">{project.description}</p>
                    {project.price && (
                      <div className="text-2xl font-bold text-blue-400">
                        ${(project.price / 100).toFixed(2)}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="py-12 text-center">
              <p className="text-slate-400 text-lg">No portfolio projects yet</p>
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
