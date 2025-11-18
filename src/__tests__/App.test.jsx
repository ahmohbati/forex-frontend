import React from 'react'
import { render, screen } from '@testing-library/react'
import App from '../App'

test('mounts App and shows navbar title (nav link)', () => {
  render(<App />)
  // Navbar renders an anchor/link with the site title — query by role to avoid duplicate matches
  expect(screen.getByRole('link', { name: /forex exchange/i })).toBeInTheDocument()
})
