import { Card, Typography } from 'antd';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Search, Users, Calendar, ClipboardCheck, BarChart, FileText } from 'lucide-react';

const { Text, Title } = Typography;
const features = [
  {
    icon: <Search className="w-10 h-10 text-blue-500" />,
    title: 'Smart Candidate Search',
    description: 'Find the right candidates quickly with powerful filters'
  },
  {
    icon: <Users className="w-10 h-10 text-blue-500" />,
    title: 'Applicant Tracking',
    description: 'Track candidates through every stage of your recruitment pipeline with ease.'
  },
  {
    icon: <FileText className="w-10 h-10 text-blue-500" />,
    title: 'Assessment Management',
    description: 'Create and publish job listings to multiple job boards with a single click.'
  },
  {
    icon: <Calendar className="w-10 h-10 text-blue-500" />,
    title: 'Interview Scheduling',
    description: 'Seamlessly schedule interviews with automated calendar integration.'
  },
  {
    icon: <ClipboardCheck className="w-10 h-10 text-blue-500" />,
    title: 'Customizable Workflows',
    description: 'Create tailored recruitment workflows that match your company\'s processes.'
  },
  {
    icon: <BarChart className="w-10 h-10 text-blue-500" />,
    title: 'Analytics & Reporting',
    description: 'Gain insights into your recruitment performance with detailed analytics.'
  }
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const Features = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section id="features" className="py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <Title level={1} className="mb-4">Powerful Features</Title>
          <Text type="secondary" strong className="mb-8 mx-auto">
            HRFolio offers a comprehensive suite of tools designed to streamline every aspect of your recruitment process.
          </Text>
        </div>

        <motion.div
          ref={ref}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={container}
          initial="hidden"
          animate={isInView ? "show" : "hidden"}
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={item}>
              <Card
                className="h-full hover:shadow-lg transition-shadow duration-300"
                hoverable
              >
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4 p-3 bg-blue-50 rounded-full">{feature.icon}</div>
                  <Title level={4} className="text-xl font-semibold mb-2">{feature.title}</Title>
                  <Text type="secondary" className="text-gray-500">{feature.description}</Text>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
