import { Button, Col, Row, FloatingLabel } from "react-bootstrap";
import Form from 'react-bootstrap/Form';
import { useForm } from "react-hook-form";
import axios from 'axios';
import Toast from 'react-bootstrap/Toast';
import { useContext, useState } from "react";
import { FerrisWheelSpinnerOverlay } from 'react-spinner-overlay';
import { AuthContext } from "../utils/AuthContext";
import jwt_decode from "jwt-decode";
import NavBar from "../components/Navbar";


function Login(){

    const apiBaseUrl = process.env.NODE_ENV.toLowerCase() === 'development' ?  
    process.env.REACT_APP_API_BASE_URL_DEV: process.env.REACT_APP_API_BASE_PROD;

    const { register, handleSubmit, reset, formState: {errors} } = useForm({
        criteriaMode: "all",
    });

    const [toast, setToast] = useState({show:false, message:'', bg:'default'});

    const [loading, setLoading] = useState(false);

    const closeToast = ()=>{setToast({show:false, message:'', bg:'default'})};

    const {updateUser} = useContext(AuthContext);

    const onSubmit = async (data)=>{
        setLoading(true);
        axios.post(`${apiBaseUrl}/users/login`, data)
        .then(responseReg=>{

            setLoading(false);
            localStorage.setItem('token', responseReg.data.data.token);
            setToast({show:true, message:responseReg.data.message, bg:'success'});

            const {id, name} = jwt_decode(responseReg.data.data.token);
            updateUser({id, name});

            reset();

        })
        .catch(err=>{
            setLoading(false);
            setToast({show:true, message:err.response.data.message, bg:'danger'});
        });
        
    };


    return (
        <>
            <NavBar></NavBar>
            <Row>
                <Col className="col-md-6 col-sm-12  mx-auto">
                    <Form className="my-5" onSubmit={handleSubmit(onSubmit)}>
                        <h4 className="text-center mb-5">LOGIN</h4>
                        <Toast bg={toast.bg} onClose={closeToast} className="w-100 my-3 text-white"  show={toast.show} animation={true}>
                            <Toast.Header>
                                <p className="mx-auto"></p>
                            </Toast.Header>
                            <Toast.Body>{toast.message}</Toast.Body>
                        </Toast>
                        <FloatingLabel label="Email" className="mb-3" controlId="email">
                            <Form.Control {...register("email", {
                                required: 'Email is required.',       
                                validate: {
                                    maxLength: (v) =>
                                    v.length <= 50 || "The email should have at most 50 characters.",
                                    matchPattern: (v) =>
                                    /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
                                    "Email address must be a valid address.",
                                }})}
                            isInvalid={errors.email}
                            type="email" placeholder="Email" 
                            formNoValidate={true}/>
                            {errors.email ? <small className="text-danger">{errors.email.message}</small>:null}
                        </FloatingLabel>

                        <FloatingLabel label="Password" className="mb-3" controlId="password">
                            <Form.Control formNoValidate={true} {...register("password", {required: 'Password is required.'})} type="password" placeholder="Password" isInvalid={errors.password} />
                            {errors.password ? <small className="text-danger">{errors.password.message}</small>:null}
                        </FloatingLabel>
                        <div className="d-grid">
                            <Button variant="secondary" type="submit" size="md">
                                Submit
                            </Button>
                        </div>                    
                    </Form>
                </Col>
            </Row>
            <FerrisWheelSpinnerOverlay loading={loading}　size={28} />
        </>    );
}

export default Login;