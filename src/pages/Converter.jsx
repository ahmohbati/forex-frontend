import React, { useState, useEffect } from 'react';
import { currencyAPI, transactionAPI } from '../lib/api';
import { Calculator, ArrowRightLeft, History, TrendingUp } from 'lucide-react';

const Converter = () => {
  const [currencies, setCurrencies] = useState([]);
  const [fromCurrency, setFromCurrency] = useState('ETB');
  const [toCurrency, setToCurrency] = useState('USD');
  const [amount, setAmount] = useState('100');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [popularRates, setPopularRates] = useState([]);

  useEffect(() => {
    loadCurrencies();
    loadRecentTransactions();
    loadPopularRates();
  }, []);

  const loadCurrencies = async () => {
    try {
      const response = await currencyAPI.getCurrencies();
      setCurrencies(response.data);
    } catch (error) {
      console.error('Error loading currencies:', error);
    }
  };

  const loadRecentTransactions = async () => {
    try {
      const response = await transactionAPI.getTransactions();
      setRecentTransactions(response.data.slice(0, 3));
    } catch (error) {
      console.error('Error loading transactions:', error);
    }
  };

  const loadPopularRates = async () => {
    try {
      const response = await currencyAPI.getPopularRates();
      setPopularRates(response.data);
    } catch (error) {
      console.error('Error loading popular rates:', error);
    }
  };

  const handleConvert = async (e) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount))) return;

    setLoading(true);
    try {
      const conversion = await currencyAPI.convertCurrency(
        parseFloat(amount),
        fromCurrency,
        toCurrency
      );
      setResult(conversion.data);

      // Save transaction
      await transactionAPI.createTransaction({
        fromCurrency,
        toCurrency,
        amount: parseFloat(amount),
        type: 'CONVERT'
      });

      // Reload recent transactions
      loadRecentTransactions();
    } catch (error) {
      console.error('Conversion error:', error);
      alert('Error converting currency');
    } finally {
      setLoading(false);
    }
  };

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setResult(null);
  };

  const formatAmount = (amount, currency = 'ETB') => {
    return new Intl.NumberFormat('en-ET', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2
    }).format(amount);
  };

  const quickConvert = (targetCurrency) => {
    setToCurrency(targetCurrency);
    setResult(null);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Converter Card */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-2 mb-6">
              <Calculator className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-800">Currency Converter</h2>
            </div>
            
            {/* Quick Convert Buttons */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Convert ETB to:</h3>
              <div className="flex flex-wrap gap-2">
                {popularRates.slice(0, 6).map((rate) => (
                  <button
                    key={rate.targetCurrency}
                    onClick={() => quickConvert(rate.targetCurrency)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      toCurrency === rate.targetCurrency
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {rate.targetCurrency}
                  </button>
                ))}
              </div>
            </div>
            
            <form onSubmit={handleConvert} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter amount"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    From
                  </label>
                  <select
                    value={fromCurrency}
                    onChange={(e) => setFromCurrency(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {currencies.map(currency => (
                      <option key={currency.code} value={currency.code}>
                        {currency.code} - {currency.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={swapCurrencies}
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                  >
                    <ArrowRightLeft className="w-5 h-5" />
                  </button>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    To
                  </label>
                  <select
                    value={toCurrency}
                    onChange={(e) => setToCurrency(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {currencies.map(currency => (
                      <option key={currency.code} value={currency.code}>
                        {currency.code} - {currency.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {loading ? 'Converting...' : 'Convert Currency'}
              </button>
            </form>
            
            {result && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <h3 className="text-lg font-semibold text-green-800 mb-2">Conversion Result</h3>
                <p className="text-2xl font-bold text-green-900">
                  {formatAmount(result.originalAmount, result.fromCurrency)} = {formatAmount(result.convertedAmount, result.toCurrency)}
                </p>
                <div className="mt-2 text-sm text-green-700 space-y-1">
                  <p>Exchange Rate: 1 {result.fromCurrency} = {result.exchangeRate.toFixed(4)} {result.toCurrency}</p>
                  <p>Fee: {formatAmount(result.fee, result.fromCurrency)}</p>
                  <p className="text-xs opacity-75">Rate fetched at: {new Date(result.timestamp).toLocaleString('en-ET')}</p>
                </div>
              </div>
            )}
          </div>

          {/* Popular Rates Table */}
          <div className="bg-white rounded-lg shadow-md p-6 mt-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-800">Popular ETB Exchange Rates</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {popularRates.map((rate) => (
                <div key={rate.targetCurrency} className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="font-semibold text-gray-900">ETB/{rate.targetCurrency}</div>
                  <div className="text-lg font-bold text-blue-600">
                    {parseFloat(rate.rate).toFixed(4)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {rate.targetCurrencyDetail?.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Transactions Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-2 mb-4">
              <History className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-800">Recent Conversions</h3>
            </div>
            
            {recentTransactions.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No recent conversions</p>
            ) : (
              <div className="space-y-3">
                {recentTransactions.map((tx) => (
                  <div key={tx.id} className="border-l-4 border-blue-500 pl-3 py-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-medium text-sm">{tx.fromCurrency} → {tx.toCurrency}</span>
                        <p className="text-xs text-gray-600">
                          {formatAmount(tx.amount, tx.fromCurrency)}
                        </p>
                      </div>
                      <span className="font-medium text-green-600 text-sm">
                        {formatAmount(tx.convertedAmount, tx.toCurrency)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(tx.created_at).toLocaleDateString('en-ET')}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Info Card */}
          <div className="bg-blue-50 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-3">About ETB</h3>
            <div className="space-y-2 text-sm text-blue-700">
              <p>🇪🇹 Ethiopian Birr (ETB)</p>
              <p>Symbol: Br</p>
              <p>Base currency for this system</p>
              <p className="text-xs opacity-75 mt-2">
                Rates are for demonstration purposes. Actual rates may vary.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Converter;