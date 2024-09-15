import React from "react"; import { Link } from 'react-router-dom';
 import navimage from '../images/haeder.png';
 import '../Styles/Navbar.css';
export default function Navbar() {
    return (<div> <nav className="navbar navbar-expand-lg bg-light"> <div className="container-fluid"> <Link className="navbar-brand " to="/"> <img src={navimage} alt="Nav Logo" className="image" /> </Link> <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation" > <span className="navbar-toggler-icon"></span> </button> <div className="collapse navbar-collapse text" id="navbarSupportedContent"> <ul className="navbar-nav me-auto mb-2 mb-lg-0"> <li className="nav-item"> <Link className="nav-link navText" aria-current="page" to="/Working"> Services </Link> </li> <li className="nav-item"> <Link className="nav-link navText" to="/Working"> Attorneys </Link> </li>

        <li className="nav-item">
            <Link className="nav-link navText" to="/Working">
                Pricing
            </Link>
        </li>

        <li className="nav-item navText">
            <Link className="nav-link" to="/Working">
                Resources
            </Link>
        </li>

        <li className="nav-item navText">
            <Link className="nav-link" to="/Working">
                Support
            </Link>
        </li>
    </ul>
        <form className="container-fluid justify-content-start">
            <button className="btn btn-outline-success me-2 mainButton" type="button">Apply For TradeMark</button>

        </form>
    </div>
    </div>
    </nav>
    </div>
    );
}