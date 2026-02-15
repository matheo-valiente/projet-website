import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', password: ''
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    fetch('http://localhost:8080/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
      .then(res => res.json())
      .then(data => {
        alert('Compte créé !')
        navigate('/')
      })
  }

  return (
    <div className="register-section">
      <h2 className="page-title">Créer un compte</h2>
      <div className="register-card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="firstName">Prénom</label>
            <input
              id="firstName"
              name="firstName"
              placeholder="Prénom"
              value={form.firstName}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="lastName">Nom</label>
            <input
              id="lastName"
              name="lastName"
              placeholder="Nom"
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
              placeholder="Email"
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
              placeholder="Mot de passe"
              value={form.password}
              onChange={handleChange}
            />
          </div>
          <button type="submit" className="btn-add btn-register">S'inscrire</button>
        </form>
      </div>
    </div>
  )
}

export default Register
