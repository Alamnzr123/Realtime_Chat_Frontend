import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    username: '',
    password: '',
  })

  const onSubmit = (e) => {
    e.preventDefault()

    axios.post(`${process.env.REACT_APP_BACKEND_URL}/login`, form)
    .then((response) => {
      // console.log(response.data)
      const result = response.data
      localStorage.setItem('user', JSON.stringify(result.data))
      return navigate('/chat');
    }).catch((err) => {
      console.log(err)
    })
  }
  return (
    <>
      <h1>Halaman Login</h1>

      <form onSubmit={(e) => onSubmit(e)}>
        <div>
          <input type="text" onChange={(e) => setForm({...form, username: e.target.value})} placeholder="username" />
        </div>
        <div>
          <input type="password" onChange={(e) => setForm({...form, password: e.target.value})} placeholder="password" />
        </div>
        <div>
          <button type="submit">Login</button>
        </div>

      </form>


    </>
  )
}

export default Login