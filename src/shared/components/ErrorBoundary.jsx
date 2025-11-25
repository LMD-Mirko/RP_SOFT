import React from 'react'
import Error500 from '../interfaces/Error500'

/**
 * ErrorBoundary para capturar errores de React y mostrar Error500
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary capturó un error:', error, errorInfo)
    this.setState({
      error,
      errorInfo
    })
  }

  render() {
    if (this.state.hasError) {
      return <Error500 />
    }

    return this.props.children
  }
}

export default ErrorBoundary

