import React from "react";
import {
  MountainIcon,
  FacebookIcon,
  TwitterIcon,
  InstagramIcon,
  LinkedinIcon,
  Copyright,
} from "lucide-react";
import {
  InstagramLogoIcon,
  LinkedInLogoIcon,
  TwitterLogoIcon,
} from "@radix-ui/react-icons";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-muted py-4 md:py-4 w-full">
      <div className="container  mx-auto flex flex-col md:flex-row items-center justify-between gap-5 text-sm px-4 md:px-6 text-center">
        {/* Logo and Copyright */}
        <div className="flex flex-row gap-2  items-center justify-center space-y-4">
          <Copyright className="h-4 w-4 m-0" />
          <p className="text-xs text-muted-foreground">
            {new Date().getFullYear()} Transporation Authority LLC . All rights
            reserved.
          </p>
        </div>

        {/* Quick Links */}
        <div className="flex gap-2">
          <h3 className="font-semibold text-foreground">Quick Links : </h3>
          <Link to="/" className="text-muted-foreground hover:text-foreground">
            Home
          </Link>
          <Link
            to="/booking"
            className="text-muted-foreground hover:text-foreground"
          >
            Book Now
          </Link>
          <Link
            to="/login"
            className="text-muted-foreground hover:text-foreground"
          >
            Login
          </Link>
        </div>

        {/* Social Links */}
        <div className="flex gap-2">
          <h3 className="font-semibold text-foreground">Follow Us : </h3>
          <div className="flex justify-center space-x-4">
            <a
              href="#"
              className="text-muted-foreground hover:text-foreground"
              aria-label="Facebook"
            >
              <FacebookIcon className="h-5 w-5" />
            </a>
            <a
              href="#"
              className="text-muted-foreground hover:text-foreground"
              aria-label="Twitter"
            >
              <TwitterLogoIcon className="h-5 w-5" />
            </a>
            <a
              href="#"
              className="text-muted-foreground hover:text-foreground"
              aria-label="Instagram"
            >
              <InstagramLogoIcon className="h-5 w-5" />
            </a>
            <a
              href="#"
              className="text-muted-foreground hover:text-foreground"
              aria-label="LinkedIn"
            >
              <LinkedInLogoIcon className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
