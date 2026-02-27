import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', password: ''
  })
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    fetch('http://localhost:8080/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
      .then(res => {
        if (!res.ok) throw new Error('Erreur lors de la creation du compte')
        return res.json()
      })
      .then(() => {
        navigate('/login')
      })
      .catch(err => setError(err.message))
  }

  return (
    <div className="register-section">
      <h2 className="page-title">Creer un compte</h2>
      <div className="register-card">
        {error && <p className="login-error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="firstName">Prenom</label>
            <input
              id="firstName"
              name="firstName"
              placeholder="Jean"
              value={form.firstName}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="lastName">Nom</label>
            <input
              id="lastName"
              name="lastName"
              placeholder="Dupont"
              value={form.lastName}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="jean@email.com"
              value={form.email}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Mot de passe</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Minimum 6 caracteres"
              value={form.password}
              onChange={handleChange}
            />
          </div>
          <button type="submit" className="btn-add btn-register">S'inscrire</button>
        </form>
        <p className="login-link">
          Deja un compte ? <Link to="/login">Se connecter</Link>
        </p>
      </div>
    </div>
  )
}

export default Register
