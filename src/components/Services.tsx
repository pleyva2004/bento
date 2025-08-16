import React from 'react';

const Services: React.FC = () => {
  const services = [
    {
      title: "Strategy & Consulting",
      description: "AI roadmaps and strategic planning for sustainable growth and competitive advantage.",
      features: ["Market Analysis", "ROI Planning", "Implementation Strategy"]
    },
    {
      title: "Custom Development",
      description: "Bespoke AI solutions tailored to your specific business requirements and challenges.",
      features: ["Machine Learning", "NLP Systems", "Computer Vision"]
    },
    {
      title: "Integration & Scaling",
      description: "Seamless integration of AI systems with existing infrastructure and processes.",
      features: ["API Development", "Cloud Deployment", "Performance Optimization"]
    }
  ];

  return (
    <section className="min-h-screen flex items-center justify-center pl-24 pr-8">
      <div className="max-w-5xl w-full">
        <div className="space-y-12">
          <h2 className="text-4xl md:text-5xl font-light tracking-tight text-gray-900">
            AI Solutions
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="space-y-4 group cursor-pointer">
                <div className="border border-gray-200 p-8 hover:border-gray-300 transition-colors duration-300">
                  <h3 className="text-xl font-medium text-gray-900 mb-4">{service.title}</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">{service.description}</p>
                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="text-sm text-gray-500 flex items-center">
                        <div className="w-1 h-1 bg-gray-400 rounded-full mr-3"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;