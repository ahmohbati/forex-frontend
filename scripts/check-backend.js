const axios = require('axios')

const base = (typeof process !== 'undefined' && process.env && process.env.VITE_API_URL)
  || 'http://localhost:3000/api'

async function run() {
  console.log('Checking backend at', base)
  try {
    const res = await axios.get(`${base.replace(/\/$/, '')}/transactions`, { timeout: 3000 })
    console.log('Status:', res.status)
    if (res.data) {
      console.log('Sample response keys:', Object.keys(res.data).slice(0, 10))
    }
  } catch (err) {
    if (err.response) {
      console.error('Backend responded with status', err.response.status)
    } else {
      console.error('Error connecting to backend:', err.message)
    }
    process.exitCode = 1
  }
}

run()
