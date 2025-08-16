import React from 'react';

const Contact: React.FC = () => {
  return (
    <section className="min-h-screen flex items-center justify-center pl-24 pr-8 bg-gray-50">
      <div className="max-w-4xl w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-8">
            <h2 className="text-4xl md:text-5xl font-light tracking-tight text-gray-900">
              Let's build the future together
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Ready to transform your business with AI? Get in touch and let's discuss how we can help you achieve your goals.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-gray-900 flex items-center justify-center">
                  <span className="text-white text-xs">📧</span>
                </div>
                <span className="text-gray-600">hello@neuralstrategies.ai</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-gray-900 flex items-center justify-center">
                  <span className="text-white text-xs">📱</span>
                </div>
                <span className="text-gray-600">+1 (555) 123-4567</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Your name"
                className="w-full p-4 border border-gray-200 focus:border-gray-400 outline-none transition-colors duration-300"
              />
              <input
                type="email"
                placeholder="Your email"
                className="w-full p-4 border border-gray-200 focus:border-gray-400 outline-none transition-colors duration-300"
              />
              <textarea
                placeholder="Tell us about your project"
                rows={4}
                className="w-full p-4 border border-gray-200 focus:border-gray-400 outline-none transition-colors duration-300 resize-none"
              />
            </div>
            <button className="w-full bg-gray-900 text-white py-4 hover:bg-gray-800 transition-colors duration-300">
              <span className="text-sm font-medium tracking-wide">Send Message</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;