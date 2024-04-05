import { useEffect, useState } from 'react';
import csv from '../assets/csv.svg';
import '../firebaseInit';
import { getFirestore, where, collection, getDocs, orderBy, query } from "firebase/firestore";
const db = getFirestore();


export default function Ingresos (props) {
    const [ultimosIngresos, setUltimosIngresos] = useState([]);
    // DATE RANGE
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const request = async (query) => {
        const querySnapshot = await getDocs(query);
        var arr = [];
        querySnapshot.forEach((doc) => {
          var data = doc.data();
          var timeToDate = new Date(data.time.seconds * 1000);
  
          var nombre = (typeof data.nombre === 'undefined') ? '' : data.nombre;
          var apellidos = (typeof data.apellidos === 'undefined') ? '' : data.apellidos;
          var provincia = (typeof data.provincia === 'undefined') ? '' : data.provincia;
          var canton = (typeof data.canton === 'undefined') ? '' : data.canton;
          var distrito = (typeof data.distrito === 'undefined') ? '' : data.distrito;
          var motivo = (typeof data.motivo === 'undefined') ? '' : data.motivo;
          var destino = (typeof data.destino === 'undefined') ? '' : data.destino;
          var email = (typeof data.email === 'undefined') ? '' : data.email;
          var telefono = data.telefono ? data.telefono : '';
          var placaVehiculo = data.placaVehiculo ? data.placaVehiculo : '';
          var descripcionVehiculo = data.descripcionVehiculo ? data.descripcionVehiculo : '';
          var notas = data.notas ? data.notas : '';
  
          arr.push({
            key: doc.id,
            id: data.id,
            fecha: timeToDate.toLocaleDateString(),
            hora: timeToDate.toLocaleTimeString(),
            cedula: data.cedula,
            nombre: nombre,
            apellidos: apellidos,
            provincia: provincia,
            canton: canton,
            distrito: distrito,
            motivo: motivo,
            destino: destino,
            email: email,
            telefono: telefono,
            placaVehiculo: placaVehiculo,
            descripcionVehiculo: descripcionVehiculo,
            notas: notas
          });
        });
        setUltimosIngresos(arr);
        console.log(arr);
    }
  
    useEffect(() => {
      const fetchData = async () => {
                var d = new Date();
                d.setHours(d.getHours() - 12);
            var path = "ingresos/"+props.customerId+"/"+props.userId;
            const lastEntries = query(collection(db, path), where("time", '>', d), orderBy("time", 'desc'));
            request(lastEntries);
      }
      fetchData();
  
    }, []);

    const filter = () => {
        let start = new Date(startDate);
        let end = new Date(endDate);
        var path = "ingresos/"+props.customerId+"/"+props.userId;
        const range = query(collection(db, path), where("time", '>', start), where("time", '<', end), orderBy("time", 'desc'));
        request(range);
    }

  
    const generateCSV = () => {
  
        let csvContent = "data:text/csv;charset=utf-8,";
  
        ultimosIngresos.forEach((element, index) => {
            var objLength = Object.keys(element).length;
            var row = "";
  
            console.log(element);
  
            if (index === 0) {
                var header = Object.keys(element).join(';');
                csvContent +=  header + "\r\n";
            }
  
            var i = 0;
  
            for (const property in element) {
                i ++
                if (i !== objLength) {
                  row += element[property].toString() + ";";
                } else {
                  row += element[property].toString();
                }
                console.log(i, element[property].toString())
            }
  
            console.log(row);
  
            csvContent += row + "\r\n";
  
        });
  
        var encodedUri = encodeURI(csvContent);
        var link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "Reporte " + Date.now() + ".csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link); 
        // console.log(csvContent);
    }
  
    var list = ultimosIngresos.map(data => 
      <tbody key={data.key}>
        <tr>
          <td>{data.hora}</td>
          <td>{data.fecha}</td>
          <td>{data.cedula}</td>
          <td>{data.nombre}</td>
          <td>{data.apellidos}</td>
          <td>{data.provincia}</td>
          <td>{data.canton}</td>
          <td>{data.distrito}</td>
          <td>{data.motivo}</td>
          <td>{data.destino}</td>
          <td>{data.email}</td>
          <td>{data.telefono}</td>
          <td>{data.placaVehiculo}</td>
          <td>{data.descripcionVehiculo}</td>
          <td>{data.notas}</td>
        </tr>
      </tbody>
    )

    return(
      <div className='page'>
        <div className='ingresos-header'>
          <h1>Ingresos</h1>
          <button className='button-filled' onClick={generateCSV}><img height='24px' src={csv}></img>Descargar CSV</button>
        </div>
  
        <div className='ingresos-dates'>
  
          <label htmlFor="start">Fecha inicial:</label>
          <input type="date" id="start" name="trip-start" value={startDate} onChange={e => {setStartDate(e.target.value)}}/>
  
          <label htmlFor="end">Fecha final:</label>
          <input type="date" id="end" name="trip-end" value={endDate} onChange={e => {setEndDate(e.target.value)}}/>
  
          <button className='button-tonal' onClick={filter}>Generar reporte</button>
  
        </div>
  
        <div style={{overflowX: 'auto'}}>
          <table>
            <thead>
              <tr>
                <th>Hora</th>
                <th>Fecha <small>m/d/a</small></th>
                <th>Cedula</th>
                <th>Nombre</th>
                <th>Apellidos</th>
                <th>Provincia</th>
                <th>Canton</th>
                <th>Distrito</th>
                <th>Motivo</th>
                <th>Destino</th>
                <th>Email</th>
                <th>Telefono</th>
                <th>Placa Vehiculo</th>
                <th>Desc Vehiculo</th>
                <th>Notas</th>
              </tr>
            </thead>
            {list}
          </table>
        </div>
  
  
      </div>
    );
  }