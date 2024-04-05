import './QuickPass.css';
import loadingGif from '../assets/loading.gif';

export default function QuickPass (props) {
    return(
      <div className='page quickpass'>
        <h1>Quick Pass</h1>
  
        <p>Puedes acercar tu cédula al escaner.</p>
  
        <div className='quickpass-circle'>
          
          {
            props.loading ? 
            <img src={loadingGif} height='128px' /> :
            <span className="material-icons-round" style={{fontSize: '56px', transform: 'rotate(90deg)'}}>document_scanner</span>
          }
        </div>
  
        {
          props.loading ? 
          <h3>Consultando...</h3> :
          <div style={{display: 'flex'}}>
            {
              props.scanReady ? 
              <h3>Escaner listo<span className="material-icons-round" style={{color: 'var(--tertiary)', marginLeft: '0.5rem'}}>done</span></h3> :
              <h3>Debes conectar un escaner<span className="material-icons-round" style={{color: 'var(--tertiary)', marginLeft: '0.5rem'}}>cable</span></h3>
            }
          </div>
  
        }
  
        <p style={{color: 'var(--error)'}}>{props.errorMessage}</p>
  
  
        {
          props.modalVisible ? 
          <Modal cedula={props.cedula} nombre={props.nombre} apellidos={props.apellidos} /> :
          null
        }
  
        
      </div>
    );
  }

  function Modal (props) {
    return(
      <div id="quickpass-modal" className='quickpass-modal'>
        <div id="quickpass-modal-content" className='quickpass-modal-content'>
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1rem', gap: '1rem'}}>
            <span className="material-icons-round">done</span>
            <h2><small>Bienvenido/a,</small> {props.nombre}</h2>
          </div>
  
          {/* <p>Ingreso realizado exitosamente</p> */}
  
          {/* <h3>{props.apellidos}</h3>
          <p>{props.cedula}</p> */}
        </div>
      </div>
    );
  }
  