import { Link } from 'react-router-dom';
import { 
  Zap, 
  ArrowRight, 
  Mail, 
  Phone, 
  MapPin, 
  HeadphonesIcon 
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Column 1: Brand */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
                <Zap className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold text-white">EVehicle</span>
            </div>
            <p className="text-sm leading-relaxed">
              Nền tảng C2C hàng đầu cho xe điện và pin tại Việt Nam. 
              Giao dịch an toàn, minh bạch với sự hỗ trợ của đội ngũ môi giới chuyên nghiệp.
            </p>
            <div className="flex gap-4">
              <a href="#" className="h-10 w-10 rounded-lg bg-slate-800 hover:bg-primary transition-colors flex items-center justify-center">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Về chúng tôi */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold text-lg">Về chúng tôi</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-sm hover:text-primary transition-colors flex items-center gap-2">
                  <ArrowRight className="h-3 w-3" />
                  Giới thiệu
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-sm hover:text-primary transition-colors flex items-center gap-2">
                  <ArrowRight className="h-3 w-3" />
                  Cách thức hoạt động
                </Link>
              </li>
              <li>
                <Link to="/packages" className="text-sm hover:text-primary transition-colors flex items-center gap-2">
                  <ArrowRight className="h-3 w-3" />
                  Bảng giá
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm hover:text-primary transition-colors flex items-center gap-2">
                  <ArrowRight className="h-3 w-3" />
                  Liên hệ
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Hỗ trợ */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold text-lg">Hỗ trợ</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/faq" className="text-sm hover:text-primary transition-colors flex items-center gap-2">
                  <ArrowRight className="h-3 w-3" />
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm hover:text-primary transition-colors flex items-center gap-2">
                  <ArrowRight className="h-3 w-3" />
                  Điều khoản sử dụng
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-sm hover:text-primary transition-colors flex items-center gap-2">
                  <ArrowRight className="h-3 w-3" />
                  Chính sách bảo mật
                </Link>
              </li>
              <li>
                <Link to="/dispute" className="text-sm hover:text-primary transition-colors flex items-center gap-2">
                  <ArrowRight className="h-3 w-3" />
                  Giải quyết tranh chấp
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Liên hệ */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold text-lg">Liên hệ</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <Mail className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <a href="mailto:support@evehicle.vn" className="hover:text-primary transition-colors">
                  support@evehicle.vn
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <a href="tel:1900xxxx" className="hover:text-primary transition-colors">
                  Hotline: 1900-xxxx
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>Hà Nội, Việt Nam</span>
              </li>
              <li className="flex items-start gap-2">
                <HeadphonesIcon className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>Hỗ trợ 24/7</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
            <p className="text-slate-400">
              &copy; 2025 EVehicle Marketplace. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link to="/terms" className="text-slate-400 hover:text-primary transition-colors">
                Điều khoản
              </Link>
              <Link to="/privacy" className="text-slate-400 hover:text-primary transition-colors">
                Bảo mật
              </Link>
              <Link to="/cookies" className="text-slate-400 hover:text-primary transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}


