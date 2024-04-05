import { useEffect, useState } from 'react';
import { getAuth, signInWithCustomToken, signOut } from "firebase/auth";
import axios from 'axios';


export default function Settings (props) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    // DEBUG
    const [errorMessage, setErrorMessage] = useState('');

    const conectar = async () => {
      try {
        const port = await navigator.serial.requestPort();
        console.log(port.getInfo());
      } catch (error) {
        console.log(error);
      }
    }

    const handleSubmit = async e => {
      e.preventDefault();
      setErrorMessage('');
      var url = 'https://us-central1-vicon-ed78f.cloudfunctions.net/customAuth';
      //var url = 'http://localhost:5001/vicon-ed78f/us-central1/customAuth';
      axios.post(url, {
        username: username,
        password: password
      })
      .then(function (response) {
        console.log(response);
        const auth = getAuth();
        signInWithCustomToken(auth, response.data)
          .then((userCredential) => {
            const user = userCredential.user;
            console.log(user);
          })
          .catch((error) => {
            console.log(error);
            setErrorMessage('Error al inciar sesion con token personalizado.');
          });
      })
      .catch(function (error) {
        setErrorMessage(error.response.data);
        console.log(error.response.data);
      });
    }

    const logOut = () => {
      const auth = getAuth();
      signOut(auth).then(() => {
        // Sign-out successful.
      }).catch((error) => {
        // An error happened.
      });
    }
  
    return(
      <div className='page'>
        <h1>Configuraciones</h1>
  
        <div>
          <h4>Hardware</h4>
  
          <button className='button-filled' onClick={conectar}><span className="material-icons-round">usb</span>Emparejar escaner USB</button>
        </div>
  
        <div style={{gap: '1rem', display: 'flex', flexDirection: 'column'}}>
          <h4>Usuario</h4>

          {
            props.authState ?
            <div style={{width: '280px', gap: '1rem', display: 'flex', flexDirection: 'column'}}>
              <h3>{props.client}</h3>
              <p>{props.deviceLocation}</p>
              <button className='button-tonal' onClick={logOut}>Cerrar sesion</button>
            </div> :
            <form onSubmit={handleSubmit} style={{width: '280px', gap: '1rem', display: 'flex', flexDirection: 'column'}}>
              <div className='input-container'>
                <input className='input-normal' id="input-username" type="text" value={username} onChange={e => {setUsername(e.target.value)}}/>
                <label className='input-label' htmlFor='input-username'>Usuario</label>
              </div>
        
              <div className='input-container'>
                <input className='input-normal' id="input-password" type="password" value={password} onChange={e => {setPassword(e.target.value)}}/>
                <label className='input-label' htmlFor='input-password'>Contraseña</label>
              </div>

              <button className='button-tonal' type='submit'>Ingresar</button>

              <p style={{color: 'var(--error)'}}><small>{errorMessage}</small></p>
            </form>
          }




         

        </div>
  <code>v2.0</code>
      </div>
    )
  }