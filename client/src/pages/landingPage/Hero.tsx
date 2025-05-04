import { Button, Image } from 'antd';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
    const navigate = useNavigate();

    const features = [
        'Smart candidate search',
        'Track candidates’ progress',
        'Applicant tracking',
        'Assessment management',
        'Interview scheduling',
    ];

    return (
        <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-primary-100/30" />
            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-14 lg:gap-24">
                    <motion.div
                        className="flex-1"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-gray-900 mb-6">
                            Hire Smarter with{' '}
                            <span className="inline-block bg-gradient-to-r from-blue-900 via-orange-600 to-blue-800 bg-clip-text text-transparent relative">
                                HRFolio
                                <svg
                                    className="absolute -bottom-2 left-0 w-full"
                                    viewBox="0 0 200 12"
                                    fill="none"
                                >
                                    <path
                                        d="M1 8.5C47.6667 4.16667 154.4 -2.4 199 8.5"
                                        stroke="#818CF8"
                                        strokeWidth="2"
                                    />
                                </svg>
                            </span>
                        </h1>
                        <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed max-w-2xl">
                            Transform your hiring process with HRFolio’s intelligent recruitment platform.
                            Streamline workflows, discover top talent, and make smart hiring decisions faster.
                        </p>
                        <ul className="space-y-4 mb-8">
                            {features.map((feature, index) => (
                                <motion.li
                                    key={index}
                                    className="flex items-center text-gray-700"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                >
                                    <CheckCircle className="w-5 h-5 text-primary-500 mr-3" />
                                    <span className="text-md md:text-lg">{feature}</span>
                                </motion.li>
                            ))}
                        </ul>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button
                                type="primary"
                                size="large"
                                className="flex items-center justify-center group transition-all duration-300 shadow-md w-60"
                                onClick={() => navigate('/login')}
                            >
                                Get Started
                                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </div>
                    </motion.div>

                    <motion.div
                        className="flex-1"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                    >
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-tr from-primary-500/10 via-primary-300/5 to-transparent rounded-2xl backdrop-blur-md" />
                            <Image
                                src="https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                                alt="HRFolio Dashboard"
                                className="rounded-2xl shadow-2xl animate-float object-cover"
                            />
                            <motion.div
                                className="absolute -bottom-6 -right-6 bg-white rounded-xl shadow-lg p-4 flex items-center gap-4 border border-gray-100"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4, duration: 0.5 }}
                            >
                                <div className="bg-primary-500 rounded-full p-2">
                                    <svg
                                        className="w-6 h-6 text-white"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M13 10V3L4 14h7v7l9-11h-7z"
                                        />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900">Faster Hiring</p>
                                    <p className="text-sm text-gray-500">40% reduction in time-to-hire</p>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
