'use client';

import React, { useState } from 'react';

const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscriptionMessage, setSubscriptionMessage] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes('@')) {
      setSubscriptionMessage('Please enter a valid email address');
      return;
    }

    setIsSubscribing(true);

    // Simulate subscription (replace with actual API call if needed)
    setTimeout(() => {
      setSubscriptionMessage('Thank you for subscribing!');
      setEmail('');
      setIsSubscribing(false);

      // Clear message after 3 seconds
      setTimeout(() => setSubscriptionMessage(''), 3000);
    }, 1000);
  };

  return (
    <footer className="backdrop-blur-[1px] bg-white/5 border-t border-white/10 pb-32 md:pb-24">
      <div className="max-w-7xl mx-auto w-full px-8 md:pl-24 lg:pl-32 lg:pr-16 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Stay Updated Section */}
          <div className="lg:col-span-1 max-w-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Stay Updated</h3>
            <p className="text-sm text-gray-600 mb-6">
              Subscribe to our newsletter for the latest insights on data intelligence, AI strategy, and enterprise solutions.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-3 max-w-full">
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full sm:flex-1 px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                  disabled={isSubscribing}
                />
                <button
                  type="submit"
                  disabled={isSubscribing}
                  className="w-full sm:w-auto px-6 py-2.5 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  {isSubscribing ? 'Subscribing...' : 'Subscribe'}
                </button>
              </div>
              {subscriptionMessage && (
                <p className={`text-xs ${subscriptionMessage.includes('Thank') ? 'text-green-600' : 'text-red-600'}`}>
                  {subscriptionMessage}
                </p>
              )}
            </form>
          </div>

          {/* Vericals Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Solutions</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Aether
                </a>
              </li>
            </ul>
          </div>

          {/* Explore Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Explore</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="/insights"
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Careers
                </a>
              </li>
            </ul>
          </div>

          {/* Quick Links Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Acceptable Use Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} Levrok Labs. All rights reserved.
            </p>
            <div className="flex space-x-6">
              {/* Add social media icons if needed */}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

