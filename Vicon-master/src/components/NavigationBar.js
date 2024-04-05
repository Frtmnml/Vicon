import './NavigationBar.css';

import { Link, Routes, Route, useLocation, Outlet, useMatch, useResolvedPath } from "react-router-dom";

export default function NagivationBar () {
    return(
        <nav>
            <div className='nav-surface-tint'>

            <CustomLink  to="/" label={'Quick Pass'} icon={'update'}/>

            <CustomLink to="/avanzado" label={'Ingreso avanzado'} icon={'post_add'}/>

            <CustomLink to="/ingresos" label={'Últimos ingresos'} icon={'format_list_bulleted'}/>

            </div>
        </nav>
    );
}

function CustomLink({ children, to, ...props }: LinkProps) {
    let resolved = useResolvedPath(to);
    let match = useMatch({ path: resolved.pathname, end: true });
  
    return (
        <Link className='nav-item' style={{ background: match ? "var(--surface-tint-elevation-2)" : null }}
          to={to}
          {...props}
        >
          <div className={ match ? 'nav-item-active-indicator' : 'nav-item-active-indicator nav-item-inactive-indicator' }>
            <span className="material-icons-round">{props.icon}</span>
          </div>
          <small>{props.label}</small>
        </Link>
    );
  }