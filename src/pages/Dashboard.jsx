import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { transactionAPI, currencyAPI } from '../lib/api';
import { TrendingUp, Clock, DollarSign, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [popularRates, setPopularRates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [txResponse, ratesResponse] = await Promise.all([
        transactionAPI.getTransactions(),
        currencyAPI.getPopularRates()
      ]);
      
      setTransactions(txResponse.data.slice(0, 5)); // Last 5 transactions
      setPopularRates(ratesResponse.data);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatAmount = (amount, currency = 'ETB') => {
    return new Intl.NumberFormat('en-ET', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        እንኳን ደህና መጡ, {user?.firstName || user?.email}!
      </h1>
      <p className="text-gray-600 mb-8">Welcome to your Forex Dashboard</p>

      {/* Popular ETB Exchange Rates */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {popularRates.slice(0, 4).map((rate) => (
          <div key={rate.targetCurrency} className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">ETB → {rate.targetCurrency}</p>
                <p className="text-xl font-bold text-gray-900">
                  1 Br = {parseFloat(rate.rate).toFixed(4)} {rate.targetCurrency}
                </p>
              </div>
              <div className="bg-blue-100 p-2 rounded-full">
                <DollarSign className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {rate.targetCurrencyDetail?.name}
            </p>
          </div>
        ))}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-full">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Transactions</p>
              <p className="text-2xl font-bold text-gray-900">{transactions.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-full">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Base Currency</p>
              <p className="text-2xl font-bold text-gray-900">ETB</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="bg-purple-100 p-3 rounded-full">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Active Session</p>
              <p className="text-2xl font-bold text-gray-900">Now</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <Clock className="w-5 h-5 mr-2" />
          Recent Transactions
        </h2>
        
        {transactions.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No transactions yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">From</th>
                  <th className="text-left py-2">To</th>
                  <th className="text-right py-2">Amount</th>
                  <th className="text-right py-2">Rate</th>
                  <th className="text-left py-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.id} className="border-b hover:bg-gray-50">
                    <td className="py-3">
                      <span className="font-medium">{tx.fromCurrency}</span>
                    </td>
                    <td className="py-3">
                      <span className="font-medium">{tx.toCurrency}</span>
                    </td>
                    <td className="py-3 text-right">
                      <span className="font-medium">
                        {formatAmount(tx.amount, tx.fromCurrency)} → {formatAmount(tx.convertedAmount, tx.toCurrency)}
                      </span>
                    </td>
                    <td className="py-3 text-right text-gray-600">
                      {tx.exchangeRate.toFixed(4)}
                    </td>
                    <td className="py-3 text-gray-600">
                      {new Date(tx.created_at).toLocaleDateString('en-ET')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;