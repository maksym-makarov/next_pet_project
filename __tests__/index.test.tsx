import { render, screen } from '@testing-library/react'
import Home from "../src/pages"

describe('Home', () => {
  beforeEach(() => {
    render(<Home />)
  })

  it('renders a heading', () => {
    const heading = screen.getByText(/Go to Users/)
    expect(heading).toBeInTheDocument()
  })


})