require('@testing-library/jest-dom');

// Provide a default VITE_API_URL to Jest tests so modules reading process.env work
if (typeof process !== 'undefined' && process.env) {
	if (!process.env.VITE_API_URL) {
		process.env.VITE_API_URL = 'http://localhost:3000/api'
	}
}
