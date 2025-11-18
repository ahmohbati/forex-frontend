import React from 'react'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import Transactions from '../pages/Transactions'

// Mock the API module
jest.mock('../lib/api', () => {
  return {
    transactionAPI: {
      getTransactions: jest.fn(),
      createTransaction: jest.fn(),
    },
    currencyAPI: {
      getCurrencies: jest.fn(),
    },
  }
})

import { transactionAPI, currencyAPI } from '../lib/api'

const sampleTransactions = [
  { id: 't1', amount: 100, toCurrency: 'USD', rate: 0.024, status: 'completed' },
  { id: 't2', amount: 200, toCurrency: 'EUR', rate: 0.022, status: 'pending' },
]

beforeEach(() => {
  transactionAPI.getTransactions.mockResolvedValue({ data: sampleTransactions })
  transactionAPI.createTransaction.mockResolvedValue({ data: { id: 't3' } })
  currencyAPI.getCurrencies.mockResolvedValue({ data: [{ code: 'USD' }, { code: 'EUR' }] })
})

afterEach(() => {
  jest.clearAllMocks()
})

test('renders transactions list and can create a new transaction', async () => {
  render(<Transactions />)

  // Wait for transactions to appear
  await waitFor(() => expect(transactionAPI.getTransactions).toHaveBeenCalled())

  // Check that existing transactions render
  expect(screen.getByText(/t1/)).toBeInTheDocument()
  expect(screen.getByText(/100/)).toBeInTheDocument()

  // Fill the create form and submit
  const amountInput = screen.getByPlaceholderText(/amount/i)
  const select = screen.getByRole('combobox')
  const submit = screen.getByRole('button', { name: /create/i })

  fireEvent.change(amountInput, { target: { value: '50' } })
  fireEvent.change(select, { target: { value: 'USD' } })
  fireEvent.click(submit)

  // Ensure createTransaction was called
  await waitFor(() => expect(transactionAPI.createTransaction).toHaveBeenCalled())

  // After creation, getTransactions should have been called at least twice
  expect(transactionAPI.getTransactions.mock.calls.length).toBeGreaterThanOrEqual(2)
})
