import { useEffect, useState } from 'react';
import { Link, Routes, Route, useLocation } from "react-router-dom";
import axios from 'axios';
import './App.css';
// ASSETS
import logo from './assets/logo.png';
// ROUTES
import Avanzado from './routes/Avanzado';
import QuickPass from './routes/QuickPass';
import Ingresos from './routes/Ingresos';
import Settings from './routes/Settings';
// COMPONENTS
import NavigationBar from './components/NavigationBar';
import './firebaseInit';
import { doc, setDoc, getDoc, getFirestore, Timestamp } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
const db = getFirestore();


export default function App() {
  // USER
  const [authState, setAuthState] = useState(null);
  const [userId, setUserId] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [userActive, setUserActive] = useState(null);
  const [client, setClient] = useState('');
  const [deviceLocation, setDeviceLocation] = useState('');
  // 
  const [active, setActive] = useState(true);
  // DATA DISPLAY
  const [cedula, setCedula] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [nombre, setNombre] = useState('');
  // DEBUG
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [scanReady, setScanReady] = useState(true);
  //
  const [modalVisible, setModalVisible] = useState(false);

  let location = useLocation();

  useEffect(() => {
    setCedula('');
    setApellidos('');
    setNombre('');
  }, [location]);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const uid = user.uid;
        setAuthState(true);
        setUserId(uid);
        console.log('Sesion iniciada con: ', uid);

        const docRef = doc(db, "usuarios", uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          var data = docSnap.data();
          setClient(data.client);
          setCustomerId(data.customerId);
          setUserActive(data.active);
          setDeviceLocation(data.location);
          console.log("Document data:", docSnap.data());

          if ("serial" in navigator) {
            // 'The Web Serial API is supported.'
            async function fetchData () {
              let ports = await navigator.serial.getPorts();
      
              if (ports.length > 0) {
                var port = ports[0];
        
                await port.open({ baudRate: 9600 });
          
                console.log(port.getInfo());
          
                read(port, data.customerId, uid);
              } else {
                setScanReady(false);
              }
        
      
            }
        
            fetchData();
      
            navigator.serial.addEventListener('connect', async e => {
              var port = e.target;
        
              await port.open({ baudRate: 9600 });
      
              setScanReady(true);
      
              read(port, data.customerId, uid);
      
            });
            
            navigator.serial.addEventListener('disconnect', e => {
              console.log(e.target);
              setScanReady(false);
            });
      
          } else {
            alert('Este navegador no es compatible, por favor usa Chrome, Mozilla o Edge');
          }

        } else {
          console.log("No such document!");
        }

      } else {
        console.log('User is signed out.');
        setAuthState(false);
      }
    });
  }, []);

    // const sc505 = {
  //   usbProductId: 42151,
  //   usbVendorId: 1317
  // }

  const read = async (port , cId, uId) => {
    console.log(cId, uId);
      var ready = true;
      while (port.readable) {
        const reader = port.readable.getReader();
        try {

          var arr = [];
          var full


          while (true) {
            const { value, done } = await reader.read();
            if (done) {
              console.log('|reader| has been canceled.');
              break;
            }
            var arrayValue = Array.from(value);
            var sufix = JSON.stringify(arrayValue.slice(-2));
            var referenceSufix = JSON.stringify([13, 10]);
            arrayValue.forEach(element => {
              arr.push(element);
            });

            
            if (sufix === referenceSufix && ready) {
              console.log('Final de la cedula');
              setErrorMessage('');
              ready = false;

              // setScanReady(false);
              setTimeout(() => {
                ready = true;
                // setScanReady(true);
                // setModalVisible(false);
              }, 3000);

              var xorKey = [0x27, 0x30, 0x04, 0xA0, 0x00, 0x0F, 0x93, 0x12, 0xA0, 0xD1, 0x33, 0xE0, 0x03,  0xD0, 0x00, 0xDf, 0x00];

              var result = ""; 
              var i = 0;
              var j = 0;
              for (i, j; i  < arr.length; i++, j++) {
                if (j === 17){ j = 0; }
                result += String.fromCharCode(xorKey[j] ^ arr[i]);
              }

              setCedula(result.substring(0,9));
              setApellidos(result.substring(9,35).replace(/\0/g, '') + " " + result.substring(35,61).replace(/\0/g, ''));
              setNombre(result.substring(61,91).replace(/\0/g, ''));

              if (window.location.pathname === "/") {
                try {
                  setTimeout(() => {
                    setModalVisible(false);
                  }, 3000);
                  setLoading(true);
                  //var url = 'http://localhost:8080/';
                  // var url ='https://padron.riffraff.digital/';
                  var url ='https://padron.anep.app/';
                  const response = await axios.get(url, {params: {cedula: result.substring(0,9)} });
                  var path = "ingresos/"+cId+"/"+uId;
                  await setDoc(doc(db, path, String(Date.now())), {
                    nombre: result.substring(61,91).replace(/\0/g, ''),
                    apellidos: result.substring(9,35).replace(/\0/g, '') + " " + result.substring(35,61).replace(/\0/g, ''),
                    id: parseInt(result.substring(0,9)),
                    cedula: result.substring(0,9),
                    time: Timestamp.now(),
                    provincia: response.data.provincia,
                    canton: response.data.canton,
                    distrito: response.data.distrito
                  });

                  setLoading(false);
            
                  console.log('Success');

                  setCedula('');

                  setModalVisible(true);

                  setTimeout(() => { setModalVisible(false); }, 3000);
              
                } catch (error) {
                  console.log('No Success', error);
                  setErrorMessage('Hubo un error');
                  setLoading(false);
                }
              }

              arr = [];


            } else if (sufix === referenceSufix && !ready) {
              console.log('No listo aun, vuelve a intentarlo');

              arr = [];
            }

          }
        } catch (error) {
          console.log(error);
        } finally {
          reader.releaseLock();
        }
      }
  }

  return (
    <main className="App">

      <header>
        <div className='header-surface-tint'>

          <img src={logo} height='40px' />

          <p className='subtitle'>Sistema de Registro de Visitantes</p>

          <Link className='header-link-item' to="/settings">
            <span className="material-icons-round">settings</span>
          </Link>
        </div>
      </header>

      <NavigationBar />

      <Routes>
        <Route path="/" element={
            <QuickPass
              cedula={cedula}
              nombre={nombre}
              apellidos={apellidos}
              errorMessage={errorMessage}
              scanReady={scanReady}
              modalVisible={modalVisible}
              loading={loading}
              userId={userId}
              customerId={customerId}
            />
          }>
        </Route>
        <Route path="avanzado" element={
          <Avanzado
            cedula={cedula}
            nombre={nombre}
            apellidos={apellidos}
            errorMessage={errorMessage}
            scanReady={scanReady}
            userId={userId}
            customerId={customerId}
          />
        }/>
        <Route path="ingresos" element={
          <Ingresos
            userId={userId}
            customerId={customerId}
          />
        }/>
        <Route path="settings" element={
          <Settings 
            authState={authState} 
            client={client}
            deviceLocation={deviceLocation}
          />
          }/>
      </Routes>

      <p>{errorMessage}</p>

    </main>
  );
}