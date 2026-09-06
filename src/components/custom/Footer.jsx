import React from "react";
import { motion } from "framer-motion";
import { Newspaper, Mail, Phone, MapPin, ArrowUp, Sparkles } from "lucide-react";
import { FaTwitter, FaFacebook, FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }
  };

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-20 w-80 h-80 bg-accent/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-1/3 w-60 h-60 bg-tertiary/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.div variants={itemVariants} className="flex items-center space-x-2 mb-6">
              <div className="relative">
                <Newspaper className="h-6 w-6 text-primary" />
                <Sparkles className="absolute -top-1 -right-1 w-3 h-3 text-accent animate-pulse" />
              </div>
              <h2 className="text-2xl font-bold">
                <span className="text-gradient">News</span>
                <span className="text-tertiary">Mania</span>
              </h2>
            </motion.div>
            <motion.p variants={itemVariants} className="text-gray-400 mb-6">
              A multi-perspective news aggregation platform providing balanced,
              credible news insights from various sources.
            </motion.p>
            <motion.div variants={itemVariants} className="flex space-x-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-gradient flex items-center justify-center text-white hover:shadow-lg transition-all"
              >
                <FaTwitter size={18} />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-gradient-alt flex items-center justify-center text-white hover:shadow-lg transition-all"
              >
                <FaFacebook size={18} />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-gradient-tri flex items-center justify-center text-white hover:shadow-lg transition-all"
              >
                <FaInstagram size={18} />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-gradient flex items-center justify-center text-white hover:shadow-lg transition-all"
              >
                <FaLinkedin size={18} />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-gradient-alt flex items-center justify-center text-white hover:shadow-lg transition-all"
              >
                <FaYoutube size={18} />
              </a>
            </motion.div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.h3 variants={itemVariants} className="text-xl font-semibold mb-6 text-gradient">
              Quick Links
            </motion.h3>
            <motion.ul variants={itemVariants} className="space-y-3">
              <li>
                <Link to="/" className="text-gray-400 hover:text-primary transition-colors flex items-center group">
                  <span className="w-1 h-1 rounded-full bg-primary mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/categories-info" className="text-gray-400 hover:text-primary transition-colors flex items-center group">
                  <span className="w-1 h-1 rounded-full bg-primary mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Categories
                </Link>
              </li>
              <li>
                <Link to="/trending-info" className="text-gray-400 hover:text-primary transition-colors flex items-center group">
                  <span className="w-1 h-1 rounded-full bg-primary mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Trending
                </Link>
              </li>
              <li>
                <Link to="/ai-summary" className="text-gray-400 hover:text-primary transition-colors flex items-center group">
                  <span className="w-1 h-1 rounded-full bg-primary mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  AI Summary
                </Link>
              </li>
              <li>
                <Link to="/discussions" className="text-gray-400 hover:text-primary transition-colors flex items-center group">
                  <span className="w-1 h-1 rounded-full bg-primary mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Discussions
                </Link>
              </li>
              <li>
                <Link to="/about-us" className="text-gray-400 hover:text-primary transition-colors flex items-center group">
                  <span className="w-1 h-1 rounded-full bg-primary mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  About Us
                </Link>
              </li>
            </motion.ul>
          </motion.div>

          {/* News Categories */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.h3 variants={itemVariants} className="text-xl font-semibold mb-6 text-gradient-alt">
              News Categories
            </motion.h3>
            <motion.ul variants={itemVariants} className="space-y-3">
              <li>
                <Link to="/categories-info?category=politics" className="text-gray-400 hover:text-accent transition-colors flex items-center group">
                  <span className="w-1 h-1 rounded-full bg-accent mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Politics
                </Link>
              </li>
              <li>
                <Link to="/categories-info?category=technology" className="text-gray-400 hover:text-accent transition-colors flex items-center group">
                  <span className="w-1 h-1 rounded-full bg-accent mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Technology
                </Link>
              </li>
              <li>
                <Link to="/categories-info?category=climate" className="text-gray-400 hover:text-accent transition-colors flex items-center group">
                  <span className="w-1 h-1 rounded-full bg-accent mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Climate
                </Link>
              </li>
              <li>
                <Link to="/categories-info?category=health" className="text-gray-400 hover:text-accent transition-colors flex items-center group">
                  <span className="w-1 h-1 rounded-full bg-accent mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Health
                </Link>
              </li>
              <li>
                <Link to="/categories-info?category=economy" className="text-gray-400 hover:text-accent transition-colors flex items-center group">
                  <span className="w-1 h-1 rounded-full bg-accent mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Economy
                </Link>
              </li>
              <li>
                <Link to="/categories-info?category=sports" className="text-gray-400 hover:text-accent transition-colors flex items-center group">
                  <span className="w-1 h-1 rounded-full bg-accent mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Sports
                </Link>
              </li>
            </motion.ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.h3 variants={itemVariants} className="text-xl font-semibold mb-6 text-gradient-tri">
              Contact Us
            </motion.h3>
            <motion.ul variants={itemVariants} className="space-y-4">
              <li className="flex items-start group">
                <Mail className="w-5 h-5 text-primary mt-1 mr-3 flex-shrink-0 group-hover:text-accent transition-colors" />
                <span className="text-gray-400 group-hover:text-white transition-colors">pranavkapratwar106@gmail.com</span>
              </li>
              <li className="flex items-start group">
                <Phone className="w-5 h-5 text-primary mt-1 mr-3 flex-shrink-0 group-hover:text-accent transition-colors" />
                <span className="text-gray-400 group-hover:text-white transition-colors">+91 8262820855</span>
              </li>
              <li className="flex items-start group">
                <MapPin className="w-5 h-5 text-primary mt-1 mr-3 flex-shrink-0 group-hover:text-accent transition-colors" />
                <span className="text-gray-400 group-hover:text-white transition-colors">KIT College,Gokul Shirgaon,Kolhapur</span>
              </li>
            </motion.ul>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} NewsMania. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link to="/privacy" className="text-gray-500 hover:text-primary text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-500 hover:text-primary text-sm transition-colors">
                Terms of Service
              </Link>
              <Link to="/cookies" className="text-gray-500 hover:text-primary text-sm transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <motion.button
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 w-12 h-12 rounded-full bg-gradient flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all z-50"
        whileHover={{ y: -5, scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <ArrowUp className="w-5 h-5" />
      </motion.button>
    </footer>
  );
}
