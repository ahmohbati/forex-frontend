import React, { useEffect, useState, useCallback } from 'react'
import { transactionAPI, currencyAPI } from '../lib/api'

export default function Transactions() {
  const [transactions, setTransactions] = useState([])
  const [amount, setAmount] = useState('')
  const [toCurrency, setToCurrency] = useState('USD')
  const [currencies, setCurrencies] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [page, setPage] = useState(1)
  const [pageSize] = useState(10)
  const [total, setTotal] = useState(null)

  useEffect(() => {
    fetchTransactions()
    fetchCurrencies()
  }, [])

  // Refetch when page or pageSize changes
  useEffect(() => {
    fetchTransactions()
  }, [page, pageSize])

  const normalizeTransaction = useCallback((t) => {
    // Provide fallbacks in case backend uses different field names
    return {
      id: t.id ?? t._id ?? t.transactionId ?? 'unknown',
      amount: t.amount ?? t.value ?? t.etbAmount ?? 0,
      toCurrency: t.toCurrency ?? t.targetCurrency ?? t.currencyTo ?? '-',
      rate: t.rate ?? t.exchangeRate ?? null,
      status: t.status ?? t.state ?? 'pending',
    }
  }, [])

  async function fetchTransactions() {
    try {
      setLoading(true)
      // If backend accepts pagination params, include them
      const res = await transactionAPI.getTransactions({ page, limit: pageSize })
      const data = res.data || []
      setTransactions(data.map(normalizeTransaction))
      // Try to get total count from response meta if available
      if (res.meta?.total != null) setTotal(res.meta.total)
      if (res.headers && res.headers['x-total-count']) setTotal(Number(res.headers['x-total-count']))
    } catch (err) {
      setError(err.message || 'Failed to load transactions')
    } finally {
      setLoading(false)
    }
  }

  async function fetchCurrencies() {
    try {
      const res = await currencyAPI.getCurrencies()
      setCurrencies(res.data || [])
    } catch (err) {
      // ignore silently
    }
  }

  async function handleCreate(e) {
    e.preventDefault()
    try {
      setLoading(true)
      const payload = { amount: Number(amount), fromCurrency: 'ETB', toCurrency }
      await transactionAPI.createTransaction(payload)
      setAmount('')
      // After creation, refetch the first page
      setPage(1)
      await fetchTransactions()
      // Show a short success message
      setError(null)
      setSuccess('Transaction created')
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError(err.message || 'Failed to create transaction')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h2 className="text-2xl font-bold mb-4">Transactions</h2>

      <form onSubmit={handleCreate} className="mb-6 flex gap-2">
        <input
          type="number"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount (ETB)"
          className="border px-3 py-2 rounded w-40"
          required
        />

        <select
          value={toCurrency}
          onChange={(e) => setToCurrency(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          {currencies.length ? (
            currencies.map((c) => (
              <option value={c.code} key={c.code}>{c.code}</option>
            ))
          ) : (
            <>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
            </>
          )}
        </select>

        <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-60">
          {loading ? 'Sending...' : 'Create'}
        </button>
      </form>

      {error && <div className="text-red-600 mb-4">{error}</div>}
      {success && <div className="text-green-600 mb-4">{success}</div>}

      <div className="bg-white shadow rounded overflow-hidden">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Amount (ETB)</th>
              <th className="px-4 py-2">To</th>
              <th className="px-4 py-2">Rate</th>
              <th className="px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-gray-500">No transactions found</td>
              </tr>
            ) : (
              transactions.map((t) => (
                <tr key={t.id} className="border-t">
                  <td className="px-4 py-2">{t.id}</td>
                  <td className="px-4 py-2">{t.amount}</td>
                  <td className="px-4 py-2">{t.toCurrency}</td>
                  <td className="px-4 py-2">{t.rate ?? '-'}</td>
                  <td className="px-4 py-2">{t.status ?? 'pending'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-gray-600">
          {total != null ? `Page ${page} of ${Math.max(1, Math.ceil(total / pageSize))} — ${total} total` : `Page ${page}`}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >Prev</button>
          <button
            onClick={() => setPage((p) => {
              if (total != null) {
                const last = Math.max(1, Math.ceil(total / pageSize))
                return Math.min(last, p + 1)
              }
              return p + 1
            })}
            disabled={total != null && page >= Math.ceil(total / pageSize)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >Next</button>
        </div>
      </div>
    </div>
  )
}
