import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Cookies from 'universal-cookie';
import './Login.css'
import { storeWorker } from '../../redux/workerSlice';
import { workerInterface } from '../../types';

const Login = () => {
  const [Email, setEmail] = useState("")
  const [Password, setPassword] = useState("")
  const [ErrorMessage, setErrorMessage] = useState("")
  const dispatch = useDispatch();
  const navigate = useNavigate()

  const Login = () => {
    if(Email === "" && Password === "") {
      setErrorMessage("Rellene todos los espacios por favor")
    } else {
      SendLogin();
    }
  }

  const SendLogin = () => {
    const post = fetch("http://localhost:8080/api/v1/worker/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        Email,
        Password
      })
    })
    .then(response => {
      if(response.status === 404) {
        console.clear()
        setErrorMessage("El correo no existe.")
      } else if(response.status === 409) {
        console.clear()
        setErrorMessage("La contraseña es incorrecta.")
      } else if(response.status === 200) {
        response.json().then(data => {
          storeLogin(data);
        })
      }
    })
  }

  const storeLogin = (data: workerInterface) => {
    const cookies = new Cookies();
    cookies.set('Logged', true, {path: "/"})
    cookies.set('Email', data.email, {path: "/"});
    cookies.set('FName', data.fname, {path: "/"});
    cookies.set('LName', data.lname, {path: "/"});
    cookies.set('Country', data.country, {path: "/"});
    cookies.set('Tags', data.tags, {path: "/"});
    const cookieData = cookies.getAll();
    dispatch(storeWorker(cookieData))
    navigate("/browse")
  }

  return (
    <div className="loginContainer">
      <div className="loginContent">
        <h1>Entrar a <span>Workaholic</span></h1>
        <p style={{color: "var(--error)"}}>{ErrorMessage}</p>
        <p>Correo</p>
        <input type="text" onChange={(e) => setEmail(e.target.value)}/>
        <p>Contraseña</p>
        <input type="password" onChange={(e) => setPassword(e.target.value)}/>
      </div>
      <button className='loginSubmit' onClick={() => Login()}>Submit</button>
    </div>
  )
}

export default Login