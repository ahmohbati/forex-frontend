import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ArrowRight, Shield, Zap, Globe, Flag } from 'lucide-react';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <section className="text-center py-16">
        <div className="flex items-center justify-center mb-4">
          <Flag className="w-8 h-8 text-green-600 mr-2" />
          <span className="text-lg font-semibold text-green-600">Ethiopian Birr Focused</span>
        </div>
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Forex Exchange Management
          <span className="text-green-600"> System</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Manage your currency exchanges with Ethiopian Birr as the base currency. 
          Get real-time rates and seamless transactions for ETB conversions.
        </p>
        {user ? (
          <div className="space-x-4">
            <Link 
              to="/dashboard" 
              className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors inline-flex items-center"
            >
              Go to Dashboard
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        ) : (
          <div className="space-x-4">
            <Link 
              to="/register" 
              className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              Get Started
            </Link>
            <Link 
              to="/login" 
              className="border border-green-600 text-green-600 px-8 py-3 rounded-lg hover:bg-green-50 transition-colors"
            >
              Sign In
            </Link>
          </div>
        )}
      </section>

      {/* Features Section */}
      <section className="py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Why Choose Our Platform?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Flag className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">ETB First</h3>
            <p className="text-gray-600">
              Ethiopian Birr as the primary base currency for all conversions and calculations.
            </p>
          </div>
          
          <div className="text-center p-6">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Real-time Rates</h3>
            <p className="text-gray-600">
              Get the latest ETB exchange rates updated in real-time for accurate conversions.
            </p>
          </div>
          
          <div className="text-center p-6">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Secure & Safe</h3>
            <p className="text-gray-600">
              Your financial data is protected with industry-standard security measures.
            </p>
          </div>
        </div>
      </section>

      {/* Supported Currencies */}
      <section className="py-16 bg-gray-50 rounded-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Supported Currencies</h2>
          <p className="text-gray-600 mb-8">Convert ETB to and from major world currencies</p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-2xl mx-auto">
            {['ETB', 'USD', 'EUR', 'GBP', 'AED', 'CNY', 'SAR', 'JPY', 'CAD', 'KES'].map((currency) => (
              <div key={currency} className="bg-white p-4 rounded-lg shadow-sm text-center">
                <div className="font-bold text-lg text-gray-800">{currency}</div>
                <div className="text-sm text-gray-600">
                  {currency === 'ETB' ? 'Ethiopian Birr' : 
                   currency === 'USD' ? 'US Dollar' :
                   currency === 'EUR' ? 'Euro' :
                   currency === 'GBP' ? 'British Pound' :
                   currency === 'AED' ? 'UAE Dirham' :
                   currency === 'CNY' ? 'Chinese Yuan' :
                   currency === 'SAR' ? 'Saudi Riyal' :
                   currency === 'JPY' ? 'Japanese Yen' :
                   currency === 'CAD' ? 'Canadian Dollar' : 'Kenyan Shilling'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;