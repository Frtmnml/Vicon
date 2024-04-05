import { useEffect, useState } from 'react';
import axios from 'axios';
import './Avanzado.css';
import { doc, setDoc, getFirestore, Timestamp } from "firebase/firestore";
import '../firebaseInit';

const db = getFirestore();

export default function Avanzado (props) {
    const [cedula, setCedula] = useState('');
    const [nombre, setNombre] = useState('');
    const [apellidos, setApellidos] = useState('');
    const [provincia, setProvincia] = useState('');
    const [canton, setCanton] = useState('');
    const [distrito, setDistrito] = useState('');
    //
    const [motivo, setMotivo] = useState('');
    const [destino, setDestino] = useState('');
    const [email, setEmail] = useState('');
    const [telefono, setTelefono] = useState('');
    const [placaVehiculo, setPlacaVehiculo] = useState('');
    const [descripcionVehiculo, setDescripcionVehiculo] = useState('');
    const [notas, setNotas] = useState('');
    // DEBUG
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
  
    const [valor, setValor] = useState('');

    useEffect(() => {
        setCedula(props.cedula);
      }, [props.cedula]);
  
    useEffect(() => {
        console.log(props.cedula.length);
        if (cedula.length === 9) {
            //var url = 'http://localhost:8080/';
            // var url = 'https://padron.riffraff.digital/';
            var url ='https://padron.anep.app/';
            axios.get(url, {
                params: {
                    cedula: cedula
                }
            })
            .then(function (response) {
                var data = response.data;
                if (!data) {
                    setErrorMessage('No se encontraron resultados');
                }
                console.log('UNO')
                setNombre(data.nombre.replace('\ufffd', 'Ñ'));
                setApellidos(data.apellido1.replace('\ufffd', 'Ñ') + ' ' + data.apellido2.replace('\ufffd', 'Ñ'));
                setProvincia(data.provincia);
                setCanton(data.canton);
                setDistrito(data.distrito);
                console.log(response.data);
                setLoading(false);
        
            })
            .catch(function (error) {
                console.log(error);
                setLoading(false);
                console.log('DO')
            })
            .then(function () {
                // always executed
            }); 
        } else {
            setNombre('');
            setApellidos('');
            setProvincia('');
            setCanton('');
            setDistrito('');
        }
    }, [cedula, props.cedula]);
  
    const requestCedula = e => {
      var value = e.target.value;
      setCedula(e.target.value);
    }

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (cedula.length > 0) {
        try {
          var path = "ingresos/"+props.customerId+"/"+props.userId;
          await setDoc(doc(db, path, String(Date.now())), {
            id: parseInt(cedula),
            cedula: cedula,
            nombre: nombre,
            apellidos: apellidos,
            provincia:provincia,
            canton: canton,
            distrito: distrito,
            motivo: motivo,
            destino: destino,
            email: email,
            telefono: telefono,
            placaVehiculo: placaVehiculo,
            descripcionVehiculo: descripcionVehiculo,
            notas: notas,
            time: Timestamp.now()
          });
    
          console.log('Success');

          setModalVisible(true);
          setTimeout(() => {
            setModalVisible(false);
          }, 2000);
      
        } catch (error) {
          console.log(error);
          setErrorMessage('Error al ingresar la informacion a la base de datos.');
        }  
      } else {
        setErrorMessage('Debes ingresar un numero de identificacion.');
        console.log('Debes ingresar un numero de identificacion.');
      
      }
      e.target.reset();
    }

    const handleReset = (e) => {
      console.log('resetear');
      setCedula('');
      setNombre('');
      setApellidos('');
      setProvincia('');
      setCanton('');
      setDistrito('');
      setMotivo('');
      setDestino('');
      setEmail('');
      setTelefono('');
      setPlacaVehiculo('');
      setDescripcionVehiculo('');
      setNotas('');
      setErrorMessage('');
    }

    return(
        <div className='page'>

        {
          modalVisible ? 
          <Modal cedula={props.cedula} nombre={props.nombre} apellidos={props.apellidos} /> :
          null
        }

        <h1>Avanzado</h1>
  
        <h5>Persona</h5>

        <form id='avanzado-form' onSubmit={handleSubmit} onReset={handleReset}>
          <section className='avanzado-section'>
            <div className='input-container'>
              <input className='input-normal' id="input-cedula" type="text" value={cedula} onChange={requestCedula}/>
              <label className='input-label' htmlFor='input-cedula'>Cédula</label>
            </div>
    
            <div className='input-container'>
              <input className='input-normal' id="input-nombre" type="text" value={nombre} onChange={e => {setNombre(e.target.value)}}/>
              <label className='input-label' htmlFor='input-nombre'>Nombre</label>
            </div>
    
            <div className='input-container'>
              <input className='input-normal' id="input-apellidos" type="text" value={apellidos} onChange={e => {setApellidos(e.target.value)}}/>
              <label className='input-label' htmlFor='input-apellidos'>Apellidos</label>
            </div>
    
            <div className='input-container'>
              <input className='input-normal' id="input-provincia" type="text" value={provincia} onChange={e => {setProvincia(e.target.value)}}/>
              <label className='input-label' htmlFor='input-provincia'>Provincia</label>
            </div>
    
            <div className='input-container'>
              <input className='input-normal' id="input-canton" type="text" value={canton} onChange={e => {setCanton(e.target.value)}}/>
              <label className='input-label' htmlFor='input-canton'>Canton</label>
            </div>
    
            <div className='input-container'>
              <input className='input-normal' id="input-distrito" type="text" value={distrito} onChange={e => {setDistrito(e.target.value)}}/>
              <label className='input-label' htmlFor='input-distrito'>Distrito</label>
            </div>
          </section>
    
          <h5>Sobre la visita</h5>

          <section className='avanzado-section'>
            <div className='input-container'>
              <input className='input-normal' id="input-valor" type="text" value={motivo} onChange={e => {setMotivo(e.target.value)}}/>
              <label className='input-label' htmlFor='input-valor'>Motivo de visita</label>
            </div>
    
            <select name="destino" id="input-destino" value={destino} onChange={e => {setDestino(e.target.value)}}>
              <option value="">-- Seleciona un destino ---</option>
              <option value="PRESIDENCIA">Presidencia</option>
              <option value="TESORERIA">Tesoreria</option>
              <option value="SECRETARIA">Secretaria</option>
              <option value="COMEDOR">Comedor</option>
            </select>
          </section>
    
          <h5>Contacto</h5>
    
          <section className='avanzado-section'>
            <div className='input-container'>
              <input className='input-normal' id="input-email" type="email" value={email} onChange={e => {setEmail(e.target.value)}}/>
              <label className='input-label' htmlFor='input-email'>Email</label>
            </div>
    
            <div className='input-container'>
              <input className='input-normal' id="input-telefono" type="text" value={telefono} onChange={e => {setTelefono(e.target.value)}}/>
              <label className='input-label' htmlFor='input-telefono'>Telefono</label>
            </div>
          </section>
    
          <h5>Vehículo</h5>
    
          <section className='avanzado-section'>
            <div className='input-container'>
              <input className='input-normal' id="input-placaVehiculo" type="text" value={placaVehiculo} onChange={e => {setPlacaVehiculo(e.target.value)}}/>
              <label className='input-label' htmlFor='input-placaVehiculo'>Número de placa</label>
            </div>
    
            <div className='input-container'>
              <input className='input-normal' id="input-descripcionVehiculo" type="text" value={descripcionVehiculo} onChange={e => {setDescripcionVehiculo(e.target.value)}}/>
              <label className='input-label' htmlFor='input-descripcionVehiculo'>Descripción del vehículo</label>
            </div>
          </section>
    
          <h5>Notas</h5>
    
          <section className='avanzado-section'>
            <div className='input-container'>
              <input className='input-normal' id="input-notas" type="text" value={notas} onChange={e => {setNotas(e.target.value)}}/>
              <label className='input-label' htmlFor='input-notas'>Notas adicionales</label>
            </div>
          </section>

          <p style={{color: 'var(--error)'}}>{errorMessage}</p>
    
          {/* <div style={{display: 'flex', justifyContent: 'end', gap: '1rem', borderTop: '1px solid var(--outline)', paddingTop: '1.5rem', marginTop: '2rem'}}>
            <button className='button-tonal' type='reset'>Cancelar</button>
            <button className='button-filled' type='submit'>Enviar</button>
          </div> */}

          <button className='small-fab' type='reset'><span className="material-icons-round">restart_alt</span></button>

          <button className='fab' type='submit'>
            <span className="material-icons-round">send</span>
            Registrar</button>
        </form>
  

  
      </div>
    );
    
}

function Modal (props) {
  return(
    <div id="quickpass-modal" className='quickpass-modal'>
      <div id="quickpass-modal-content" className='quickpass-modal-content'>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1rem', gap: '1rem'}}>
          <span className="material-icons-round">done</span>
          <h2>Ingreso exitoso</h2>
        </div>
      </div>
    </div>
  );
}
