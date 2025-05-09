import React from 'react';
import { Carousel, Avatar, Typography } from 'antd';
import { Star } from 'lucide-react';
const { Title, Text } = Typography;

interface Testimonial {
    quote: string;
    author: string;
    position: string;
    company: string;
    avatar: string;
    rating: number;
}

const testimonials: Testimonial[] = [
    {
        quote: "HRFolio has transformed our hiring process. We've reduced our time-to-hire by 45% and improved the quality of our candidates.",
        author: "Garnea Smith",
        position: "Head of Talent Acquisition",
        company: "TechNova Inc.",
        avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        rating: 5
    },
    {
        quote: "The analytics and reporting features have provided us with insights we never had before. It's like having a recruitment consultant built into the software.",
        author: "Michael Chen",
        position: "HR Director",
        company: "Global Solutions Ltd.",
        avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        rating: 5
    },
    {
        quote: "The automated workflows have saved our team countless hours. We can now focus on what really matters - connecting with candidates.",
        author: "Emma Rodriguez",
        position: "Recruitment Manager",
        company: "Innovate Partners",
        avatar: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        rating: 4
    },
];

const Testimonials: React.FC = () => {
    return (
        <section className="py-16 md:py-24 bg-gray-50" id="testimonials">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <Title level={1} className=" mb-4">
                        Trusted by HR Teams Worldwide
                    </Title>
                    <Text type="secondary" strong className=" mb-8">
                        Hear from our customers about how HRFolio has transformed their recruitment process.
                    </Text>
                </div>

                <div className="max-w-4xl mx-auto">
                    <Carousel autoplay dots={{ className: "custom-dots" }}>
                        {testimonials.map((testimonial, index) => (
                            <div key={index} className="px-4 py-8">
                                <div className="bg-white rounded-xl shadow-md p-8 md:p-10 text-center">
                                    <div className="flex justify-center mb-6">
                                        {[...Array(testimonial.rating)].map((_, i) => (
                                            <Star key={i} fill="#faad14" color="#faad14" size={20} />
                                        ))}
                                    </div>
                                    <p className="text-xl md:text-2xl text-gray-500 italic mb-8">
                                        "{testimonial.quote}"
                                    </p>
                                    <div className="flex flex-col items-center">
                                        <Avatar
                                            src={testimonial.avatar}
                                            size={64}
                                            className="mb-4"
                                        />
                                        <Title level={4} className="text-lg font-semibold">{testimonial.author}</Title>
                                        <p className="text-gray-600">{testimonial.position}</p>
                                        <p className="text-primary font-medium">{testimonial.company}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </Carousel>
                </div>
            </div>
        </section>
    );
};

export default Testimonials;