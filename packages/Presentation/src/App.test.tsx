import { render, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
  it('renders the app header', () => {
    render(<App />)
    const headingElement = screen.getByText(/MVVM React - Presentation Layer/i)
    expect(headingElement).toBeInTheDocument()
  })

  it('renders the welcome message', () => {
    render(<App />)
    const welcomeElement = screen.getByText(/Welcome to your MVVM React application!/i)
    expect(welcomeElement).toBeInTheDocument()
  })
})
