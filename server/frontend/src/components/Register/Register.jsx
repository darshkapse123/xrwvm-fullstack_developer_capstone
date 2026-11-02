
import React, { useState } from 'react';
import './Register.css';
import Header from '../Header/Header';

const Register = () => {
  const [userName, setUserName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const register_url = window.location.origin + '/djangoapp/registration';

  const register = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(register_url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userName,
          firstName,
          lastName,
          email,
          password
        }),
      });

      const json = await res.json();

      if (res.ok && json.status === 'Registered') {
        alert('Registration successful!');
        window.location.href = '/login';
      } else {
        alert(json.error || 'Registration failed.');
      }
    } catch (error) {
      alert('Unable to connect to the server.');
      console.error(error);
    }
  };

  return (
    <div>
      <Header />

      <div className="register_container">
        <h1 className="header">Sign-up</h1>

        <form onSubmit={register}>
          <div className="inputs">

            <div className="input">
              <input
                className="input_field"
                type="text"
                placeholder="Username"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
              />
            </div>

            <div className="input">
              <input
                className="input_field"
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>

            <div className="input">
              <input
                className="input_field"
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>

            <div className="input">
              <input
                className="input_field"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input">
              <input
                className="input_field"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

          </div>

          <div className="submit_panel">
            <button className="submit" type="submit">
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
