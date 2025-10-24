import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { APP_LOGO, APP_TITLE, getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const { data: services, isLoading: servicesLoading } = trpc.services.list.useQuery();
  const { data: featuredPortfolio, isLoading: portfolioLoading } = trpc.portfolio.featured.useQuery();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {APP_LOGO && <img src={APP_LOGO} alt="Logo" className="h-8 w-8" />}
            <h1 className="text-2xl font-bold text-white">{APP_TITLE}</h1>
          </div>
          <div className="flex items-center gap-4">
            <Link href="#services" className="text-slate-300 hover:text-white transition">
              Services
            </Link>
            <Link href="/portfolio" className="text-slate-300 hover:text-white transition">
              Portfolio
            </Link>
            <Link href="#custom" className="text-slate-300 hover:text-white transition">
              Custom Order
            </Link>
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <span className="text-slate-300 text-sm">{user?.name}</span>
                <Link href="/dashboard" className="text-slate-300 hover:text-white transition">
                  Dashboard
                </Link>
                {user?.email === "whestwhest5@gmail.com" && (
                  <Link href="/admin" className="text-yellow-400 hover:text-yellow-300 transition font-semibold">
                    Admin
                  </Link>
                )}
              </div>
            ) : (
              <Button asChild variant="default" size="sm">
                <a href={getLoginUrl()}>Login with Google</a>
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex-1 container mx-auto px-4 py-20 flex flex-col justify-center">
        <div className="max-w-2xl">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Professional Graphic Design Services
          </h2>
          <p className="text-xl text-slate-300 mb-8 leading-relaxed">
            Transform your brand vision into stunning visual designs. From logos to complete branding packages, we deliver excellence.
          </p>
          <div className="flex gap-4">
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
              <a href="#services">Browse Services</a>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-slate-500 text-white hover:bg-slate-800">
              <a href="#custom">Request Custom Design</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Portfolio Section */}
      <section id="portfolio" className="py-20 border-t border-slate-700">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <h3 className="text-4xl font-bold text-white">Featured Work</h3>
            <Link href="/portfolio">
              <Button variant="outline" className="border-slate-500 text-slate-300">
                View All Portfolio →
              </Button>
            </Link>
          </div>
          
          {portfolioLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-slate-700 rounded-lg h-64 animate-pulse" />
              ))}
            </div>
          ) : featuredPortfolio && featuredPortfolio.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredPortfolio.map((project: any) => (
                <Link key={project.id} href={`/portfolio/${project.id}`}>
                  <div className="bg-slate-800 rounded-lg overflow-hidden hover:shadow-lg hover:shadow-blue-500/20 transition cursor-pointer group h-full flex flex-col">
                    {project.images && project.images.length > 0 ? (
                      <div className="h-48 overflow-hidden bg-slate-700">
                        <img 
                          src={project.images[0].imageUrl} 
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition"
                        />
                      </div>
                    ) : (
                      <div className="h-48 bg-gradient-to-br from-slate-700 to-slate-600 flex items-center justify-center">
                        <span className="text-slate-400">No image</span>
                      </div>
                    )}
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="text-lg font-bold text-white mb-1">{project.title}</h4>
                        <p className="text-slate-400 text-sm">{project.category}</p>
                      </div>
                      {project.price && (
                        <div className="text-xl font-bold text-blue-400 mt-3">
                          ${(project.price / 100).toFixed(2)}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-400 text-lg">No portfolio projects yet</p>
            </div>
          )}
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="bg-slate-800/50 py-20 border-t border-slate-700">
        <div className="container mx-auto px-4">
          <h3 className="text-4xl font-bold text-white mb-12">Our Services</h3>
          
          {servicesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-slate-700 rounded-lg h-64 animate-pulse" />
              ))}
            </div>
          ) : services && services.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map(service => (
                <Link key={service.id} href={`/service/${service.id}`}>
                  <div className="bg-slate-700 rounded-lg overflow-hidden hover:shadow-lg hover:shadow-blue-500/20 transition cursor-pointer group">
                    {service.image && (
                      <div className="h-48 overflow-hidden bg-slate-600">
                        <img 
                          src={service.image} 
                          alt={service.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <h4 className="text-xl font-bold text-white mb-2">{service.name}</h4>
                      <p className="text-slate-300 text-sm mb-4">{service.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-blue-400">
                          ${(service.price / 100).toFixed(2)}
                        </span>
                        <Button variant="default" size="sm">
                          Select
                        </Button>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-400 text-lg">No services available yet</p>
            </div>
          )}
        </div>
      </section>

      {/* Custom Order Section */}
      <section id="custom" className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-4xl font-bold text-white mb-6">Custom Order</h3>
            <p className="text-slate-300 mb-8">
              Don't see what you need? Tell us about your unique project and we'll create a custom quote for you.
            </p>
            <Button asChild size="lg" className="w-full bg-green-600 hover:bg-green-700">
              <Link href="/custom-order">Request Custom Design</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-700 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="text-center">
              <h4 className="text-white font-semibold mb-3">Contact Us</h4>
              <a
                href="https://wa.me/2347046907742"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-400 hover:text-green-300 transition inline-flex items-center gap-2"
              >
                <span>📱</span> WhatsApp: +234 704 690 7742
              </a>
            </div>
            <div className="text-center">
              <h4 className="text-white font-semibold mb-3">Quick Links</h4>
              <div className="space-y-2">
                <Link href="#services" className="text-slate-400 hover:text-white transition block">
                  Services
                </Link>
                <Link href="/portfolio" className="text-slate-400 hover:text-white transition block">
                  Portfolio
                </Link>
                <Link href="#custom" className="text-slate-400 hover:text-white transition block">
                  Custom Order
                </Link>
              </div>
            </div>
            <div className="text-center">
              <h4 className="text-white font-semibold mb-3">About</h4>
              <p className="text-slate-400 text-sm">Professional graphic design services for your brand</p>
            </div>
          </div>
          <div className="border-t border-slate-700 pt-8 text-center text-slate-400">
            <p>&copy; 2025 Xterics. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
