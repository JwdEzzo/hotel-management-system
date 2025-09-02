"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Facebook,
  Instagram,
  Linkedin,
  Moon,
  Send,
  Sun,
  Twitter,
  Mail,
  Phone,
  MapPin,
  Heart,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

function MyFooter() {
  const [isDarkMode, setIsDarkMode] = React.useState(true);
  const navigate = useNavigate();
  function handleNavigateToContactUs() {
    console.log("Navigating to:", "/contact-us");
    navigate("/contact-us");
  }

  React.useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  return (
    <footer className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary/5 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-secondary/5 to-transparent rounded-full blur-3xl"></div>

      <div className="relative container mx-auto px-4 py-16 md:px-6 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-4 md:grid-cols-2">
          {/* Newsletter Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-4">
              <h2 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Stay in the Loop
              </h2>
              <p className="text-gray-300 text-lg leading-relaxed max-w-md">
                Get exclusive access to special offers and insider updates
                delivered straight to your inbox.
              </p>
            </div>

            <form className="relative max-w-md">
              <div className="relative">
                <Button onClick={handleNavigateToContactUs}>Contact Us</Button>
              </div>
            </form>

            {/* Social Media */}
            <div className="pt-4">
              <h3 className="text-lg font-semibold mb-4 text-gray-200">
                Connect With Us
              </h3>
              <div className="flex space-x-3">
                {[
                  {
                    icon: Facebook,
                    label: "Facebook",
                    color: "hover:bg-blue-600",
                  },
                  {
                    icon: Twitter,
                    label: "Twitter",
                    color: "hover:bg-sky-500",
                  },
                  {
                    icon: Instagram,
                    label: "Instagram",
                    color: "hover:bg-pink-600",
                  },
                  {
                    icon: Linkedin,
                    label: "LinkedIn",
                    color: "hover:bg-blue-700",
                  },
                ].map(({ icon: Icon, label, color }) => (
                  <TooltipProvider key={label}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className={`rounded-full border-white/20 bg-white/10 backdrop-blur-sm text-white hover:scale-110 transition-all duration-200 ${color}`}
                          onClick={() => {
                            window.open(
                              `https://${label.toLowerCase()}.com/`,
                              "_blank"
                            );
                          }}
                        >
                          <Icon className="h-4 w-4" />
                          <span className="sr-only">{label}</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent
                        side="top"
                        className="bg-slate-800 text-white border-slate-700"
                      >
                        <p>Follow us on {label}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-200">Quick Links</h3>
            <nav className="space-y-3">
              {["Home", "About"].map((link) => (
                <a
                  key={link}
                  href="#"
                  className="block text-gray-300 hover:text-white hover:translate-x-2 transition-all duration-200 "
                >
                  <span className="border-b border-transparent group-hover:border-primary pb-0.5">
                    {link}
                  </span>
                </a>
              ))}
            </nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-200">
              Get in Touch
            </h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 text-gray-300">
                <MapPin className="h-5 w-5 mt-0.5 text-white flex-shrink-0" />
                <div>
                  <p className="font-medium text-white">Visit Us</p>
                  <p className="text-sm leading-relaxed">
                    Beirut Hotel
                    <br />
                    Downtown Beirut, PIN 12345
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 text-gray-300">
                <Phone className="h-5 w-5 flex-shrink-0  text-white" />
                <div>
                  <p className="font-medium text-white">Call Us</p>
                  <p className="text-sm">123-456-7890</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 text-gray-300">
                <Mail className="h-5 w-5 flex-shrink-0 text-white" />
                <div>
                  <p className="font-medium text-white">Email Us</p>
                  <p className="text-sm">admin@hotel.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-16 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center space-x-2 text-gray-300">
              <p className="text-sm">© 2024 Beirut Hotel.</p>
              <p className="text-sm block">All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default MyFooter;
