import { render, screen } from '@testing-library/react'
import { ThemeProvider } from '@transftw/theme-provider'
import { MultiStepForm } from '../MultiStepForm'

describe('MultiStepForm', () => {
  const mockSteps = [
    { id: 'step1', label: 'Step 1', component: <div>Step 1 Content</div> },
    { id: 'step2', label: 'Step 2', component: <div>Step 2 Content</div> }
  ]

  it('renders without crashing', () => {
    render(
      <ThemeProvider theme="luxe">
        <MultiStepForm steps={mockSteps} onComplete={jest.fn()} />
      </ThemeProvider>
    )
  })

  it('displays first step content', () => {
    render(
      <ThemeProvider theme="luxe">
        <MultiStepForm steps={mockSteps} onComplete={jest.fn()} />
      </ThemeProvider>
    )

    expect(screen.getByText('Step 1 Content')).toBeInTheDocument()
  })

  it('shows step labels in progress bar', () => {
    render(
      <ThemeProvider theme="luxe">
        <MultiStepForm steps={mockSteps} onComplete={jest.fn()} showProgress={true} />
      </ThemeProvider>
    )

    expect(screen.getByText('Step 1')).toBeInTheDocument()
    expect(screen.getByText('Step 2')).toBeInTheDocument()
  })
})
