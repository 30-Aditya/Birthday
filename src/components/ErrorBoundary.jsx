import React from 'react'

export default class ErrorBoundary extends React.Component{
  constructor(props){ super(props); this.state = {error:null, info:null} }
  static getDerivedStateFromError(error){ return {error} }
  componentDidCatch(error, info){
    console.error('Uncaught error:', error, info)
    this.setState({info})
  }
  render(){
    if(this.state.error){
      return (
        <div style={{padding:40,fontFamily:'Inter, Arial, sans-serif'}}>
          <h2 style={{color:'#9b1452'}}>Application error</h2>
          <div style={{background:'#fff0f7', border:'1px solid #ffd1e8', padding:16, borderRadius:8}}>
            <div style={{fontWeight:700, color:'#4a0826', marginBottom:8}}>{String(this.state.error)}</div>
            <details style={{whiteSpace:'pre-wrap', color:'#6a1130'}}>
              {this.state.info && this.state.info.componentStack}
            </details>
          </div>
          <p style={{marginTop:12,color:'#4a0826'}}>Check the browser console for the full stack trace.</p>
        </div>
      )
    }
    return this.props.children
  }
}
