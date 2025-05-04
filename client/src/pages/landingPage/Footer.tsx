import { Layout } from "antd";
import { useNavigate } from "react-router-dom";
const { Footer: AntFooter } = Layout;

const Footer = () => {
  const navigate = useNavigate();
  return (
    <AntFooter className="!bg-[#001529] !text-gray-400" >
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Branding */}
          <div className="md:col-span-1">
            <div className="cursor-pointer flex items-center justify-center" onClick={() => navigate('/')}>
              <span className="text-white text-5xl font-bold">H</span>
              <span className="text-orange-600 text-6xl font-extrabold">R</span>
              <span className="text-white font-semibold text-3xl">Folio</span>

            </div>
            <p className="mt-4 text-gray-400">
              Modern recruitment management system that streamlines your entire
              hiring process.
            </p>

          </div>
          {/* Product */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white text-gray-500">Features</a></li>
              <li><a href="#" className="hover:text-white">Pricing</a></li>
              <li><a href="#" className="hover:text-white">Integrations</a></li>
              <li><a href="#" className="hover:text-white">Roadmap</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white">Blog</a></li>
              <li><a href="#" className="hover:text-white">Documentation</a></li>
              <li><a href="#" className="hover:text-white">API Reference</a></li>
              <li><a href="#" className="hover:text-white">Support</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white">About Us</a></li>
              <li><a href="#" className="hover:text-white">Careers</a></li>
              <li><a href="#" className="hover:text-white">Contact</a></li>
              <li><a href="#" className="hover:text-white">Legal</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} HRFolio. All rights reserved.
        </div>
      </div>
    </AntFooter>
  );
};

export default Footer;
