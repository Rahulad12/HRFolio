import { Layout} from "antd";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
const { Footer: AntFooter } = Layout;

const Footer = () => {
  const navigate = useNavigate();
  return (
    <AntFooter className="!bg-[#001529] !text-gray-400" role="contentinfo">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Branding */}
          <div className="md:col-span-1">
            <div
              className="cursor-pointer flex items-center justify-center md:justify-start"
              onClick={() => navigate('/')}
            >
              <span className="text-white text-5xl font-bold">H</span>
              <span className="text-orange-600 text-6xl font-extrabold">R</span>
              <span className="text-white font-semibold text-3xl ml-1">Folio</span>
            </div>
            <p className="mt-4 text-gray-400 text-sm text-center md:text-left">
              Modern recruitment management system that streamlines your entire hiring process.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              {["Features", "Pricing", "Integrations", "Roadmap"].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="!text-gray-400"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              {["Blog", "Documentation", "API Reference", "Support"].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="!text-gray-400"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              {["About Us", "Careers", "Contact", "Legal"].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="!text-gray-400 hover:text-orange-400 transition-colors duration-200"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-6 text-center text-sm text-gray-500">
          © {dayjs().year()} <span className="text-white font-semibold">HRFolio</span>. All rights reserved.
        </div>
      </div>
    </AntFooter >
  );
};

export default Footer;
