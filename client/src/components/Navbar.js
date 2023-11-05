import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { NavLink } from 'react-router-dom';
import './Navbar.css';
import { useContext } from 'react';
import { AuthContext } from '../utils/AuthContext';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Notifications from './chat/Notifcations';

const  NavBar= () => {

    const {user, logoutUser} = useContext(AuthContext);

    return (
        <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary">
        <Container>
          <Navbar.Brand href="/">Chat Me</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Row className='mx-auto w-100 my-auto'>
              <Col>
                {user && <p className='text-center'>Logged in as <strong>{user?.name?.toUpperCase()}</strong></p>}
              </Col>
            </Row>
            <Nav className='ms-auto'>
              {
                user ? <>
                  <Notifications/>
                  <NavLink activeclassname='active' className="link" onClick={(()=>logoutUser())} to="/login">
                      Logout
                  </NavLink>
                </> : 
                <>
                  <NavLink activeclassname='active' className="me-4 link" to="/login">Login</NavLink>
                  <NavLink activeclassname='active' className="link" to="/register">
                    Register
                  </NavLink>
                </>
              }
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
     );
}
 
export default NavBar;