'use client';

import { useState } from 'react';
import { ArrowRight, Check, ChevronDown, ChevronUp, Mail } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Metadata } from 'next';


export default function LandingPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'features' | 'pricing' | 'testimonials'>('features');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [demoForm, setDemoForm] = useState({
    name: '',
    email: '',
    organization: '',
    message: 'I would like to schedule a demo of MyDataCollect'
  });

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const handleDemoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real implementation, you would send this to your backend or email service
    window.location.href = `mailto:ovyscakesng@gmail.com?subject=Demo Request for MyDataCollect&body=Name: ${demoForm.name}%0D%0AEmail: ${demoForm.email}%0D%0AOrganization: ${demoForm.organization}%0D%0AMessage: ${demoForm.message}`;
    setShowDemoModal(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setDemoForm(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">

      {/* Demo Request Modal */}
      {showDemoModal && (
        <div className="text-gray-600 fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">Request a Demo</h3>
              <button 
                onClick={() => setShowDemoModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleDemoSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={demoForm.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={demoForm.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label htmlFor="organization" className="block text-sm font-medium text-gray-700 mb-1">Organization</label>
                  <input
                    type="text"
                    id="organization"
                    name="organization"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={demoForm.organization}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={demoForm.message}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="mt-6">
                <button
                  type="submit"
                  className="w-full flex items-center justify-center px-4 py-2 bg-indigo-800 text-white rounded-md hover:bg-indigo-700"
                >
                  <Mail className="w-5 h-5 mr-2" />
                  Send Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Professional <span className="text-indigo-800">Custom Form</span> Development
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                We build tailored form solutions with enterprise-grade database management for NGOs and businesses. 
                Trusted by organizations like CHAI Nigeria for large-scale data collection projects.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a 
                  href="#pricing" 
                  className="px-6 py-3 bg-indigo-800 text-white rounded-md hover:bg-indigo-700 transition-colors text-center font-medium"
                >
                  View Pricing Plans
                </a>
                <button 
                  onClick={() => setShowDemoModal(true)}
                  className="px-6 py-3 border border-indigo-600 text-indigo-800 rounded-md hover:bg-indigo-50 transition-colors text-center font-medium"
                >
                  Request Demo
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="bg-indigo-100 rounded-xl p-8 shadow-lg">
                <img 
                  src="/form-preview.svg" 
                  alt="Custom Form Preview"
                  className="w-full h-auto rounded-lg"
                  onError={(e) => {
                    // Fallback in case the SVG isn't found
                    e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 600'%3E%3Crect width='100%25' height='100%25' fill='white'/%3E%3Crect x='50' y='50' width='700' height='500' rx='10' ry='10' fill='%23f5f5f5' stroke='%23e5e5e5'/%3E%3Crect x='100' y='100' width='600' height='50' rx='5' ry='5' fill='%23e0e7ff'/%3E%3Crect x='100' y='180' width='600' height='40' rx='5' ry='5' fill='white' stroke='%23d1d5db'/%3E%3Crect x='100' y='240' width='600' height='40' rx='5' ry='5' fill='white' stroke='%23d1d5db'/%3E%3Crect x='100' y='300' width='280' height='40' rx='5' ry='5' fill='white' stroke='%23d1d5db'/%3E%3Crect x='420' y='300' width='280' height='40' rx='5' ry='5' fill='white' stroke='%23d1d5db'/%3E%3Crect x='100' y='380' width='600' height='100' rx='5' ry='5' fill='white' stroke='%23d1d5db'/%3E%3Crect x='100' y='520' width='200' height='50' rx='5' ry='5' fill='%234f46e5'/%3E%3C/svg%3E"
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Updated Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Professional Form Development Services</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We handle the complex form development so you can focus on your data
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="bg-indigo-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-indigo-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Custom Form Development</h3>
              <p className="text-gray-600">
                Our team designs and builds tailored forms to your exact specifications, handling all the technical complexity.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="bg-indigo-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-indigo-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Scalable Database Solutions</h3>
              <p className="text-gray-600">
                We implement robust database architectures that grow with your needs, from hundreds to millions of submissions.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="bg-indigo-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-indigo-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Ongoing Support & Maintenance</h3>
              <p className="text-gray-600">
                Comprehensive support packages to ensure your forms and databases run smoothly with regular updates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Case Study Section */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8 bg-indigo-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Proven Results</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See how we helped CHAI Nigeria streamline their recruitment process
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="md:flex">
              <div className="md:flex-shrink-0 md:w-1/3 bg-indigo-800 p-8 flex items-center justify-center">
                <div className="text-white">
                  <div className="text-5xl font-bold mb-2">20,000+</div>
                  <div className="text-xl">Candidates Processed</div>
                </div>
              </div>
              <div className="p-8 md:w-2/3">
                <div className="uppercase tracking-wide text-sm text-indigo-800 font-semibold">Case Study</div>
                <h3 className="text-2xl font-bold text-gray-900 mt-2 mb-4">Kano IEV Project Recruitment</h3>
                <p className="text-gray-600 mb-6">
                  CHAI Nigeria needed a robust solution to handle mass recruitment for their Kano IEV project. 
                  MyDataCollect provided a custom form solution that processed over 20,000 applications with 
                  98% data accuracy and reduced processing time by 60%.
                </p>
                <div className="flex items-center">
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">CHAI Nigeria Project Lead</div>
                    <div className="text-sm text-gray-500">Public Health Initiative</div>
                  </div>
                </div>
                <a 
                  href="/case-studies/chai-nigeria" 
                  className="mt-6 inline-flex items-center text-indigo-800 hover:text-indigo-800"
                >
                  Read full case study <ArrowRight className="ml-1 w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the plan that fits your organization's needs
            </p>
          </div>
          
          <div className="text-gray-500 grid md:grid-cols-3 gap-8">
            {/* Lite Plan */}
            <div className="border border-gray-200 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Lite</h3>
              <p className="text-gray-600 mb-6">Perfect for small teams and startups</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">$29</span>
                <span className="text-gray-600">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-2" />
                  <span>Up to 1,000 submissions/month</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-2" />
                  <span>Basic form builder</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-2" />
                  <span>Standard analytics</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-2" />
                  <span>Email support</span>
                </li>
              </ul>
              <a 
                href="/signup?plan=lite" 
                className="block w-full py-3 px-4 bg-indigo-800 text-white text-center rounded-md hover:bg-indigo-700 transition-colors"
              >
                Get Started
              </a>
            </div>
            
            {/* Pro Plan (Featured) */}
            <div className="border-2 border-indigo-600 rounded-xl p-6 relative">
              <div className="absolute top-0 right-0 bg-indigo-800 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
                MOST POPULAR
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Pro</h3>
              <p className="text-gray-600 mb-6">For growing businesses and NGOs</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">$99</span>
                <span className="text-gray-600">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-2" />
                  <span>Up to 10,000 submissions/month</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-2" />
                  <span>Advanced form builder</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-2" />
                  <span>Enhanced analytics</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-2" />
                  <span>Priority email & chat support</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-2" />
                  <span>API access</span>
                </li>
              </ul>
              <a 
                href="/signup?plan=pro" 
                className="block w-full py-3 px-4 bg-indigo-800 text-white text-center rounded-md hover:bg-indigo-700 transition-colors"
              >
                Get Started
              </a>
            </div>
            
            {/* Enterprise Plan */}
            <div className="border border-gray-200 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Enterprise</h3>
              <p className="text-gray-600 mb-6">For large-scale deployments</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">Custom</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-2" />
                  <span>Unlimited submissions</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-2" />
                  <span>Enterprise-grade form builder</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-2" />
                  <span>Custom analytics & reporting</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-2" />
                  <span>24/7 dedicated support</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-2" />
                  <span>SSO & custom integrations</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-2" />
                  <span>On-premise options</span>
                </li>
              </ul>
              <a 
                href="/contact" 
                className="block w-full py-3 px-4 bg-indigo-800 text-white text-center rounded-md hover:bg-indigo-700 transition-colors"
              >
                Contact Sales
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">
              Everything you need to know about MyDataCollect
            </p>
          </div>
          
          <div className="space-y-4">
            {[
              {
                question: "How does MyDataCollect handle data security?",
                answer: "We use enterprise-grade encryption both in transit and at rest. All data is stored in secure, SOC 2 compliant data centers with regular audits. For enterprise customers, we offer additional security measures including private cloud deployments."
              },
              {
                question: "Can I migrate my existing forms to MyDataCollect?",
                answer: "Yes! We provide migration tools and services to help you transition your existing forms and data seamlessly. Our team can assist with complex migrations for enterprise customers."
              },
              {
                question: "What happens if I exceed my submission limit?",
                answer: "For Lite and Pro plans, you'll be notified when you approach your limit. You can either upgrade your plan or purchase additional submissions as needed. Enterprise plans have no hard limits."
              },
              {
                question: "Do you offer discounts for non-profits?",
                answer: "Yes, we offer special pricing for registered NGOs and non-profit organizations. Contact our sales team with proof of your non-profit status to learn more."
              }
            ].map((item, index) => (
              <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  className="w-full flex justify-between items-center p-6 text-left"
                  onClick={() => toggleFaq(index)}
                >
                  <h3 className="text-lg font-medium text-gray-900">{item.question}</h3>
                  {expandedFaq === index ? (
                    <ChevronUp className="w-5 h-5 text-indigo-800" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-indigo-800" />
                  )}
                </button>
                {expandedFaq === index && (
                  <div className="p-6 pt-0 text-gray-600">
                    <p>{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-indigo-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to streamline your data collection?</h2>
          <p className="text-xl text-indigo-100 mb-8">
            Join thousands of organizations using MyDataCollect to power their forms and data management.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/MDCSignIn" 
              className="px-6 py-3 bg-white text-indigo-800 rounded-md hover:bg-gray-100 transition-colors text-center font-medium"
            >
              Start Free Trial
            </a>
            <button 
              onClick={() => setShowDemoModal(true)}
              className="cursor-pointer px-6 py-3 bg-white text-indigo-800 rounded-md hover:bg-gray-100 transition-colors text-center font-medium"
            >
              Request Demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="#features" className="text-gray-400 hover:text-white">Features</a></li>
                <li><a href="#pricing" className="text-gray-400 hover:text-white">Pricing</a></li>
                <li><a href="/integrations" className="text-gray-400 hover:text-white">Integrations</a></li>
                <li><a href="/updates" className="text-gray-400 hover:text-white">Updates</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="/about" className="text-gray-400 hover:text-white">About</a></li>
                <li><a href="/careers" className="text-gray-400 hover:text-white">Careers</a></li>
                <li><a href="/blog" className="text-gray-400 hover:text-white">Blog</a></li>
                <li><a href="/press" className="text-gray-400 hover:text-white">Press</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="/documentation" className="text-gray-400 hover:text-white">Documentation</a></li>
                <li><a href="/support" className="text-gray-400 hover:text-white">Support</a></li>
                <li><a href="/community" className="text-gray-400 hover:text-white">Community</a></li>
                <li><a href="/status" className="text-gray-400 hover:text-white">Status</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="/privacy" className="text-gray-400 hover:text-white">Privacy</a></li>
                <li><a href="/terms" className="text-gray-400 hover:text-white">Terms</a></li>
                <li><a href="/security" className="text-gray-400 hover:text-white">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <span className="text-2xl font-bold text-white">MyDataCollect</span>
            </div>
            <div className="text-gray-400 text-sm">
              © {new Date().getFullYear()} MyDataCollect. All rights reserved.
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};
