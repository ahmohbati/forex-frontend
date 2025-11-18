import React from 'react'
import { render, screen } from '@testing-library/react'

test('renders hello world', () => {
  render(<div>hello world</div>)
  expect(screen.getByText(/hello world/i)).toBeInTheDocument()
})
