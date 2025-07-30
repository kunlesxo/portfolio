import React, { useState, useEffect } from 'react';
import { Github, Linkedin, Mail, ExternalLink, Code, Database, Server, Smartphone, ArrowDown, Menu, X, MessageCircle, Download, FileText } from 'lucide-react';
import pics from '../assets/bolu.jpg'
const Portfolio = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [visibleSections, setVisibleSections] = useState(new Set());

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      
      // Intersection Observer for animations
      const sections = document.querySelectorAll('[data-section]');
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.8) {
          setVisibleSections(prev => new Set([...prev, section.dataset.section]));
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const skills = {
    backend: ['Python', 'Django', 'FastAPI', 'RESTful APIs', 'Microservices', 'JWT Authentication'],
    database: ['PostgreSQL', 'MySQL', 'SQLite', 'Database Design', 'Query Optimization'],
    frontend: ['React.js', 'HTML5', 'CSS3', 'Tailwind CSS', 'JavaScript', 'Responsive Design'],
    cloud: ['AWS', 'DigitalOcean', 'Koyeb', 'Docker', 'cPanel', 'Cloud Architecture']
  };

  const projects = [
    {
      title: 'SmartCash Platform',
      description: 'Modern financial management platform with intuitive UI and secure transaction processing',
      tech: ['React.js', 'FastAPI', 'PostgreSQL', 'Tailwind CSS'],
      github: 'https://github.com/kunlesxo',
      live: 'https://smartcash1.vercel.app',
      image: 'https://smartcash1.vercel.app/screenshot.png'
    },
    {
      title: 'Pasileb Business Platform',
      description: 'Business management solution with comprehensive features for modern enterprises',
      tech: ['React.js', 'Django', 'PostgreSQL', 'WebSockets'],
      github: 'https://github.com/kunlesxo',
      live: 'https://pasileb.vercel.app',
      image: 'https://pasileb.vercel.app/screenshot.png'
    },
    {
      title: 'Cyriox Cloud Database',
      description: 'Cloud-based database management system for distributors with invoice management, inventory tracking, and real-time sales reporting',
      tech: ['Django', 'PostgreSQL', 'WebSockets', 'Paystack API'],
      github: 'https://github.com/kunlesxo',
      live: 'https://cyriox-web.vercel.app',
      image: 'https://cyriox-web.vercel.app/screenshot.png'
    }
  ];

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-black/90 backdrop-blur-md border-b border-gray-800' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
              Portfolio
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-8">
              {['Home', 'About', 'Skills', 'Projects', 'Resume', 'Contact'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item.toLowerCase())}
                  className="hover:text-blue-400 transition-colors duration-300 relative group"
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
                </button>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-black/95 backdrop-blur-md border-t border-gray-800">
            <div className="px-4 py-6 space-y-4">
              {['Home', 'About', 'Skills', 'Projects', 'Resume', 'Contact'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item.toLowerCase())}
                  className="block w-full text-left hover:text-blue-400 transition-colors duration-300"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="min-h-screen flex items-center justify-center relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/20"></div>
        <div className="relative z-10 text-center px-4">
          <div className="animate-fade-in-up">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Adebajo Boluwatife
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Backend Developer & Software Engineer crafting scalable systems and efficient solutions
            </p>
            <div className="flex justify-center space-x-6 mb-12">
              <a href="https://github.com/kunlesxo" className="hover:text-blue-400 transition-colors duration-300 transform hover:scale-110">
                <Github size={28} />
              </a>
              <a href="https://linkedin.com/in/boluwatife-adebajo" className="hover:text-blue-400 transition-colors duration-300 transform hover:scale-110">
                <Linkedin size={28} />
              </a>
              <a href="mailto:adekunleadebajo99@gmail.com" className="hover:text-blue-400 transition-colors duration-300 transform hover:scale-110">
                <Mail size={28} />
              </a>
              <a href="https://wa.me/2348115212158" className="hover:text-green-400 transition-colors duration-300 transform hover:scale-110">
                <MessageCircle size={28} />
              </a>
            </div>
            <button
              onClick={() => scrollToSection('about')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/25"
            >
              Explore My Work
            </button>
          </div>
        </div>
        
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ArrowDown size={24} className="text-gray-400" />
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4" data-section="about">
        <div className="max-w-4xl mx-auto">
          <div className={`transition-all duration-1000 ${
            visibleSections.has('about') ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
              About Me
            </h2>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                  I'm a highly skilled Backend Developer and Software Engineer with extensive experience in designing 
                  scalable, efficient, and secure systems. I specialize in developing RESTful APIs, automating workflows, 
                  and optimizing system performance to drive business outcomes.
                </p>
                <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                  My expertise spans backend architecture, database management, cloud services, and payment integrations. 
                  I enjoy collaborating with cross-functional teams to deliver high-quality solutions that improve user 
                  experience and streamline operations.
                </p>
                <div className="flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <Code className="text-blue-400" size={20} />
                    <span>RESTful APIs</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Server className="text-green-400" size={20} />
                    <span>Scalable Systems</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Database className="text-purple-400" size={20} />
                    <span>Database Optimization</span>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="w-80 h-80 mx-auto bg-gradient-to-br from-blue-600 to-purple-600 rounded-full p-2">
                  <div className="w-full h-full bg-gray-800 rounded-full overflow-hidden relative">
                    <img 
                      src={pics}
                      alt="Adebajo Boluwatife Adekunle"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>
                </div>
                <div className="absolute -bottom-4 -right-4 bg-gradient-to-r from-green-400 to-blue-500 p-3 rounded-full">
                  <Code className="text-white" size={24} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-20 px-4 bg-gray-900/50" data-section="skills">
        <div className="max-w-6xl mx-auto">
          <div className={`transition-all duration-1000 ${
            visibleSections.has('skills') ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
              Skills & Technologies
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="group">
                <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 p-6 rounded-xl border border-blue-500/20 hover:border-blue-400/50 transition-all duration-300 transform hover:scale-105">
                  <Server className="text-blue-400 mb-4" size={32} />
                  <h3 className="text-xl font-semibold mb-4 text-blue-400">Backend</h3>
                  <div className="space-y-2">
                    {skills.backend.map((skill) => (
                      <div key={skill} className="text-gray-300 hover:text-white transition-colors duration-200">
                        {skill}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="group">
                <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 p-6 rounded-xl border border-purple-500/20 hover:border-purple-400/50 transition-all duration-300 transform hover:scale-105">
                  <Database className="text-purple-400 mb-4" size={32} />
                  <h3 className="text-xl font-semibold mb-4 text-purple-400">Database</h3>
                  <div className="space-y-2">
                    {skills.database.map((skill) => (
                      <div key={skill} className="text-gray-300 hover:text-white transition-colors duration-200">
                        {skill}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="group">
                <div className="bg-gradient-to-br from-green-600/20 to-green-800/20 p-6 rounded-xl border border-green-500/20 hover:border-green-400/50 transition-all duration-300 transform hover:scale-105">
                  <Code className="text-green-400 mb-4" size={32} />
                  <h3 className="text-xl font-semibold mb-4 text-green-400">Frontend</h3>
                  <div className="space-y-2">
                    {skills.frontend.map((skill) => (
                      <div key={skill} className="text-gray-300 hover:text-white transition-colors duration-200">
                        {skill}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="group">
                <div className="bg-gradient-to-br from-pink-600/20 to-pink-800/20 p-6 rounded-xl border border-pink-500/20 hover:border-pink-400/50 transition-all duration-300 transform hover:scale-105">
                  <Smartphone className="text-pink-400 mb-4" size={32} />
                  <h3 className="text-xl font-semibold mb-4 text-pink-400">Cloud & Tools</h3>
                  <div className="space-y-2">
                    {skills.cloud.map((skill) => (
                      <div key={skill} className="text-gray-300 hover:text-white transition-colors duration-200">
                        {skill}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 px-4" data-section="projects">
        <div className="max-w-6xl mx-auto">
          <div className={`transition-all duration-1000 ${
            visibleSections.has('projects') ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
              Featured Projects
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project, index) => (
                <div
                  key={project.title}
                  className="group bg-gray-900/50 rounded-xl overflow-hidden border border-gray-800 hover:border-blue-500/50 transition-all duration-300 transform hover:scale-105"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className="h-48 relative overflow-hidden bg-gray-800">
                    <img 
                      src={project.image} 
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = `https://via.placeholder.com/400x200/1f2937/3b82f6?text=${encodeURIComponent(project.title)}`;
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent group-hover:from-black/40 transition-all duration-300"></div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-3 group-hover:text-blue-400 transition-colors duration-300">
                      {project.title}
                    </h3>
                    <p className="text-gray-400 mb-4 leading-relaxed">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tech.map((tech) => (
                        <span key={tech} className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded-full text-sm border border-blue-500/20">
                          {tech}
                        </span>
                      ))}
                    </div>
                    <div className="flex space-x-3">
                      <a 
                        href={project.github} 
                        className="flex items-center space-x-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors duration-200 text-sm"
                      >
                        <Github size={16} />
                        <span>Code</span>
                      </a>
                      <a 
                        href={project.live} 
                        className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg transition-colors duration-200 text-sm font-medium"
                      >
                        <ExternalLink size={16} />
                        <span>Live Demo</span>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 bg-gray-900/50" data-section="contact">
        <div className="max-w-4xl mx-auto text-center">
          <div className={`transition-all duration-1000 ${
            visibleSections.has('contact') ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
              Let's Work Together
            </h2>
            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
              I'm always interested in new opportunities and exciting projects. 
              Let's discuss how we can bring your ideas to life.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-8 mb-12">
              <a href="mailto:adekunleadebajo99@gmail.com" className="group flex items-center space-x-3 text-lg hover:text-blue-400 transition-colors duration-300">
                <Mail className="group-hover:scale-110 transition-transform duration-300" size={24} />
                <span>adekunleadebajo99@gmail.com</span>
              </a>
              <a href="https://wa.me/2348115212158" className="group flex items-center space-x-3 text-lg hover:text-green-400 transition-colors duration-300">
                <MessageCircle className="group-hover:scale-110 transition-transform duration-300" size={24} />
                <span>WhatsApp: +234 811 521 2158</span>
              </a>
            </div>
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/25">
              Get In Touch
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-gray-800">
        <div className="max-w-6xl mx-auto text-center text-gray-400">
          <p>&copy; 2025 Adebajo Boluwatife Adekunle. Built with React & Tailwind CSS.</p>
        </div>
      </footer>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Portfolio;