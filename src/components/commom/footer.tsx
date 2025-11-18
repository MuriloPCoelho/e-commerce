import Link from "next/link";
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-white pb-16 md:pb-0">
      <div className="max-w-screen-xl mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">About Us</h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              Your trusted online store with the best products and quality service.
            </p>
            <div className="flex gap-3">
              <Link
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-400 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="size-5" />
              </Link>
              <Link
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-400 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="size-5" />
              </Link>
              <Link
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-400 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="size-5" />
              </Link>
            </div>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/ajuda" className="text-gray-400 hover:text-white transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/trocas-devolucoes" className="text-gray-400 hover:text-white transition-colors">
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link href="/rastreamento" className="text-gray-400 hover:text-white transition-colors">
                  Track Order
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-400 hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contato" className="text-gray-400 hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Institutional */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/sobre" className="text-gray-400 hover:text-white transition-colors">
                  About the Company
                </Link>
              </li>
              <li>
                <Link href="/politica-privacidade" className="text-gray-400 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/termos-uso" className="text-gray-400 hover:text-white transition-colors">
                  Terms of Use
                </Link>
              </li>
              <li>
                <Link href="/trabalhe-conosco" className="text-gray-400 hover:text-white transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/programa-afiliados" className="text-gray-400 hover:text-white transition-colors">
                  Affiliate Program
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2 text-gray-400">
                <Mail className="size-5 shrink-0 mt-0.5" />
                <a href="mailto:contato@loja.com" className="hover:text-white transition-colors">
                  contato@loja.com
                </a>
              </li>
              <li className="flex items-start gap-2 text-gray-400">
                <Phone className="size-5 shrink-0 mt-0.5" />
                <a href="tel:+5511999999999" className="hover:text-white transition-colors">
                  (11) 99999-9999
                </a>
              </li>
              <li className="flex items-start gap-2 text-gray-400">
                <MapPin className="size-5 shrink-0 mt-0.5" />
                <span>
                  Rua Exemplo, 123<br />
                  São Paulo - SP<br />
                  CEP 01234-567
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Payment Methods & Security */}
        <div className="border-t border-gray-800 pt-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-semibold mb-3">Payment Methods</h4>
              <div className="flex flex-wrap gap-2">
                <div className="bg-white rounded px-3 py-1.5 text-xs text-black font-medium">
                  Visa
                </div>
                <div className="bg-white rounded px-3 py-1.5 text-xs text-black font-medium">
                  Mastercard
                </div>
                <div className="bg-white rounded px-3 py-1.5 text-xs text-black font-medium">
                  Elo
                </div>
                <div className="bg-white rounded px-3 py-1.5 text-xs text-black font-medium">
                  PIX
                </div>
                <div className="bg-white rounded px-3 py-1.5 text-xs text-black font-medium">
                  Boleto
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-3">Security</h4>
              <p className="text-gray-400 text-xs leading-relaxed">
                Your data is protected with SSL certificate. 100% secure environment for your purchases.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
            <p>© {currentYear} E-commerce. All rights reserved.</p>
            <p className="text-xs">
              CNPJ: 00.000.000/0001-00
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
