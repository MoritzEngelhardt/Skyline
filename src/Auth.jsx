import { useState } from 'react'
import { supabase } from './supabaseClient'

export default function Auth({ onLogin }) {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  const handleSignUp = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) setMessage(error.message)
    else setMessage('Success! Account created. You can now log in.')
    
    setLoading(false)
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setMessage(error.message)
    } else {
      // If successful, pass the user data back up to your main App
      onLogin(data.user) 
    }
    
    setLoading(false)
  }

  return (
    <div className="auth-container" style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <h2>Log in to sync your Skyscrapers</h2>
      <form style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
          <button onClick={handleLogin} disabled={loading}>
            {loading ? 'Loading...' : 'Log In'}
          </button>
          <button onClick={handleSignUp} disabled={loading}>
            Sign Up
          </button>
        </div>
      </form>
      {message && <p style={{ color: 'blue', marginTop: '15px' }}>{message}</p>}
    </div>
  )
}