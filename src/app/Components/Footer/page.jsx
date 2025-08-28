import Link from "next/link";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import SubscribeForm from "./Components/SubscribeForm/SubscribeForm";

export default function Footer() {
  return (
    <footer className="bg-neutral text-neutral-content py-16 px-6 border-t border-neutral-content/20">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Section 1: Logo, Copyright & Social Links */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          {/* Logo + Name */}
          <Link href="/">
            <div className="flex items-center gap-2">
              <img
                src="/logo.png"
                alt="BookShore Logo"
                className="w-14 h-14"
              />
              <span className="text-3xl font-bold text-primary">BookShore</span>
            </div>
          </Link>

          {/* Copyright */}
          <p className="text-sm mt-4 text-neutral-content opacity-70">
            © {new Date().getFullYear()} BookShore. All rights reserved.
          </p>

          {/* Social Links */}
          <div className="flex gap-5 mt-6">
            <Link href="https://facebook.com" aria-label="Facebook">
              <FaFacebook className="text-3xl text-neutral-content opacity-70 hover:text-secondary transition-colors" />
            </Link>
            <Link href="https://twitter.com" aria-label="Twitter">
              <FaTwitter className="text-3xl text-neutral-content opacity-70 hover:text-secondary transition-colors" />
            </Link>
            <Link href="https://instagram.com" aria-label="Instagram">
              <FaInstagram className="text-3xl text-neutral-content opacity-70 hover:text-secondary transition-colors" />
            </Link>
            <Link href="https://linkedin.com" aria-label="LinkedIn">
              <FaLinkedin className="text-3xl text-neutral-content opacity-70 hover:text-secondary transition-colors" />
            </Link>
          </div>
        </div>

        {/* Section 2: Quick Links */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <h3 className="text-lg font-semibold text-neutral-content mb-4">Quick Links</h3>
          <ul className="space-y-2 text-neutral-content opacity-80">
            <li><Link href="/" className="hover:text-secondary transition-colors">Home</Link></li>
            <li><Link href="/books" className="hover:text-secondary transition-colors">All Books</Link></li>
            <li><Link href="/cart" className="hover:text-secondary transition-colors">Cart</Link></li>
            <li><Link href="/profile" className="hover:text-secondary transition-colors">Profile</Link></li>
            <li><Link href="/dashboard" className="hover:text-secondary transition-colors">Dashboard</Link></li>
          </ul>
        </div>
        
        {/* Section 3: More Links */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <h3 className="text-lg font-semibold text-neutral-content mb-4">Support</h3>
          <ul className="space-y-2 text-neutral-content opacity-80">
            <li><Link href="/about" className="hover:text-secondary transition-colors">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-secondary transition-colors">Contact</Link></li>
            <li><Link href="/faq" className="hover:text-secondary transition-colors">FAQ</Link></li>
            <li><Link href="/privacy" className="hover:text-secondary transition-colors">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-secondary transition-colors">Terms of Service</Link></li>
          </ul>
        </div>

        {/* Section 4: Newsletter Subscribe */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <h3 className="text-lg font-semibold text-neutral-content mb-4">Stay Up to Date</h3>
          <p className="text-sm text-neutral-content opacity-80 mb-4">
            Subscribe to our newsletter for the latest book releases and exclusive offers.
          </p>
          <SubscribeForm />
        </div>
      </div>
    </footer>
  );
}