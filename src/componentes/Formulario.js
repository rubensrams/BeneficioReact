import React, { useState, useRef } from 'react';
import Captcha from './Captcha';
import InputFecha from './InputFecha';
import { useNavigate } from 'react-router-dom';
import { ServicioBenefico } from '../servicios/ServicioBenefico';

export const Formulario = () => {
   
    const captchaRef = useRef(null);
    const [aceptoPrivacidad, setAceptoPrivacidad] = useState(false);
    const [opcionSeleccionada, setOpcionSeleccionada] = useState(null);
    
    // Estados para los inputs
    const [nombre, setNombre] = useState('');
    const [fecha, setFecha] = useState('');
    const [nss, setNss] = useState('');
    const [credito, setCredito] = useState('');
    
    // Estados para mensajes de error específicos
    const [errorInputs, setErrorInputs] = useState('');
    const [errorPrivacidad, setErrorPrivacidad] = useState('');
    const [errorCaptcha, setErrorCaptcha] = useState('');
    const [errorFecha, setErrorFecha] = useState(false);
    
    // Estados para la API
    const [cargando, setCargando] = useState(false);
    const [errorApi, setErrorApi] = useState('');


    const navegar = useNavigate();

    const handleRadioChange = (opcion) => {
        setOpcionSeleccionada(opcion);
        setErrorInputs('');
    };

    const handleSubmit = () => {
        // Limpiar errores previos
        setErrorInputs('');
        setErrorPrivacidad('');
        setErrorCaptcha('');

        // 1. Validar que se haya seleccionado una opción
        if (!opcionSeleccionada) {
            setErrorInputs('Debes completar los datos');
            return false;
        }

        // 2. Validar el campo habilitado según la opción seleccionada
        if (opcionSeleccionada === '1' && (!nombre.trim() || !fecha.trim())) {
            setErrorInputs('Debes completar los datos');
            return false;
        }
        // 2.1 Validar que la fecha tenga el formato completo dd/mm/aaaa
        if (opcionSeleccionada === '1' && fecha.length !== 10) {
            setErrorInputs('La fecha debe tener el formato dd/mm/aaaa');
            return false;
        }
        // 2.2 Validar que la fecha sea válida si la opción es nombre+fecha
        if (opcionSeleccionada === '1' && errorFecha) {
            setErrorInputs('La fecha ingresada no es válida');
            return false;
        }
        if (opcionSeleccionada === '2' && !nss.trim()) {
            setErrorInputs('Debes escribir el Nss');
            return false;
        }
        if (opcionSeleccionada === '3' && !credito.trim()) {
            setErrorInputs('Debes escribir el Crédito');
            return false;
        }

        // 3. Validar aviso de privacidad
        if (!aceptoPrivacidad) {
            setErrorPrivacidad('Debes aceptar el Aviso de Privacidad');
            return false;
        }

        // 4. Validar captcha
        const isCaptchaValid = captchaRef.current?.verify();
        if (!isCaptchaValid) {
            setErrorCaptcha('Captcha inválido. Intenta de nuevo.');
            return false;
        }

        // Si todo es válido, retornar true
        return true;
       
    };

    const consultarBeneficio = async (e) => {
        e.preventDefault();
        
        // Solo navegar si todas las validaciones pasan
        const esValido = handleSubmit();
        if (!esValido) {
            return;
        }
        
        setCargando(true);
        setErrorApi('');
        
        try {
            let datosRespuesta;
            
                datosRespuesta = await ServicioBenefico.consultarWSBeneficioDesa(
                    opcionSeleccionada,
                    nombre,
                    fecha,
                    nss,
                    credito
                )
                
            // Navegar a Caso01 con los datos de la respuesta del backend
            navegar('/caso01', {
                state: datosRespuesta
            });
            
        } catch (error) {
                console.error('Error completo:', error);
                setErrorApi('Error al consultar el beneficio. Por favor intenta nuevamente.');
            
        } finally {
            setCargando(false);
        }
    }



    return (
        <form onSubmit={consultarBeneficio}>
            <section>
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-12 text-center">
                            <h5 className="bold rojo mt-1">Llena cualquiera de estos datos</h5>
                        </div>
                    </div>
                    <div className="row justify-content-center mt-4">
                        <div className="col-11 col-md-10 col-lg-7">
                            <div className="card fondo-gris">
                                <div className="card-body">
                                    <div className="form-check">
                                        <input 
                                            className="form-check-input option-radio" 
                                            type="radio" 
                                            name="opcion" 
                                            id="radio-nombre" 
                                            value="1"
                                            onChange={() => handleRadioChange('1')}
                                            
                                        />
                                        <label className="form-check-label" htmlFor="radio-nombre">
                                            Nombre completo y fecha de nacimiento
                                        </label>
                                        <div className="row">
                                            <div className="col-12 col-md-9">
                                                <input 
                                                    type="text" 
                                                    className="form-control mt-2 option-input" 
                                                    id="input1" 
                                                    placeholder="Escribe tu nombre completo" 
                                                    disabled={opcionSeleccionada !== '1'}
                                                    value={nombre}
                                                    onChange={(e) => {
                                                        setNombre(e.target.value);
                                                        setErrorInputs('');
                                                    }}
   
                                                />
                                            </div>
                                            <div className="col-12 col-md-3">
                                                <InputFecha
                                                    className="form-control mt-2 option-input" 
                                                    id="inputfecha" 
                                                    placeholder="dd/mm/aaaa" 
                                                    disabled={opcionSeleccionada !== '1'}
                                                    value={fecha}
                                                    onChange={(valorFormateado) => {
                                                        setFecha(valorFormateado);
                                                        setErrorInputs('');
                                                        setErrorFecha(false);
                                                    }}
                                                    onError={setErrorFecha}

                                                />
                                                {errorFecha && opcionSeleccionada === '1' && (
                                                    <p style={{ fontFamily: 'Arial', fontSize: '12px', fontWeight: 'bold', color: 'red', marginTop: '5px', marginBottom: 0 }}>Fecha inválida</p>
                                                )}
                                            </div>
                                        </div>
                                        {opcionSeleccionada === '1' && errorInputs && (
                                            <p style={{ fontFamily: 'Arial', fontSize: '12px', fontWeight: 'bold', color: 'red', marginTop: '5px', marginBottom: 0 }}>{errorInputs}</p>
                                        )}
                                    </div></div>
                            </div>
                            <div className="card fondo-gris mt-4">
                                <div className="card-body">
                                    <div className="form-check mt-3">
                                        <input 
                                            className="form-check-input option-radio" 
                                            type="radio" 
                                            name="opcion" 
                                            id="radio-NSS" 
                                            value="2"
                                            onChange={() => handleRadioChange('2')}
                                        />
                                        <label className="form-check-label" htmlFor="radio-NSS">
                                            Número de Seguridad Social (NSS)<span className="rojo">*</span>
                                        </label>
                                        <input 
                                            type="text" 
                                            className="form-control mt-2 option-input" 
                                            id="input2" 
                                            placeholder="Ingresa tu número de Seguridad Social (11 dígitos)" 
                                            disabled={opcionSeleccionada !== '2'}
                                            value={nss}
                                            onChange={(e) => {
                                                setNss(e.target.value);
                                                setErrorInputs('');
                                            }}

                                        />
                                        {opcionSeleccionada === '2' && errorInputs && (
                                            <p style={{ fontFamily: 'Arial', fontSize: '12px', fontWeight: 'bold', color: 'red', marginTop: '5px', marginBottom: 0 }}>{errorInputs}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="card fondo-gris mt-4">
                                <div className="card-body">
                                    <div className="form-check mt-3">
                                        <input 
                                            className="form-check-input option-radio" 
                                            type="radio" 
                                            name="opcion" 
                                            id="radio-n-credito" 
                                            value="3"
                                            onChange={() => handleRadioChange('3')}
                                        />
                                        <label className="form-check-label" htmlFor="radio-n-credito">
                                            Número de Crédito<span className="rojo">*</span>
                                        </label>
                                        <input 
                                            type="text" 
                                            className="form-control mt-2 option-input" 
                                            id="input3" 
                                            placeholder="Ingresa tu número de Crédito (10 dígitos)" 
                                            disabled={opcionSeleccionada !== '3'}
                                            value={credito}
                                            onChange={(e) => {
                                                setCredito(e.target.value);
                                                setErrorInputs('');
                                            }}
                                        />
                                        {opcionSeleccionada === '3' && errorInputs && (
                                            <p style={{ fontFamily: 'Arial', fontSize: '12px', fontWeight: 'bold', color: 'red', marginTop: '5px', marginBottom: 0 }}>{errorInputs}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row justify-content-center">
                        <div className="col-12 col-md-5 mt-4 text-center">
                            <div className="form-check">
                                <label className="form-check-label">
                                    <input 
                                        type="checkbox" 
                                        className="form-check-input" 
                                        checked={aceptoPrivacidad}
                                        onChange={(e) => {
                                            setAceptoPrivacidad(e.target.checked);
                                            setErrorPrivacidad('');
                                        }}
                                    />He leído y acepto el <a style={{ textDecoration: 'underline' }} href="">Aviso de Privacidad</a>
                                </label>
                            </div>
                            {errorPrivacidad && (
                                <p style={{ fontFamily: 'Arial', fontSize: '12px', fontWeight: 'bold', color: 'red', marginTop: '5px', marginBottom: 0 }}>{errorPrivacidad}</p>
                            )}
                        </div>
                        <div className="col-12 mt-4 d-flex flex-column align-items-center">
                            <Captcha ref={captchaRef} />
                            {errorCaptcha && (
                                <p style={{ fontFamily: 'Arial', fontSize: '12px', fontWeight: 'bold', color: 'red', marginTop: '5px', marginBottom: 0 }}>{errorCaptcha}</p>
                            )}
                        </div>
                    </div>
                    {errorApi && (
                        <div className="row justify-content-center">
                            <div className="col-10 col-md-7 text-center">
                                    <p style={{ fontFamily: 'Arial', fontSize: '12px', fontWeight: 'bold', color: 'red', marginTop: '5px', marginBottom: 0 }}>{errorApi}</p>
                            </div>
                        </div>
                    )}
                    <div className="row mt-2 mb-4 justify-content-center">
                        {!opcionSeleccionada && errorInputs && (
                            <div className="col-12 text-center mb-2">
                                <p style={{ fontFamily: 'Arial', fontSize: '12px', fontWeight: 'bold', color: 'red', marginTop: '5px', marginBottom: 0 }}>{errorInputs}</p>
                            </div>
                        )}
                        <div className="col-10 col-md-3">
                            <button 
                                type="submit" 
                                className="btn btn-danger button-rojo btn-block mt-4"
                                disabled={cargando}
                            >
                                {cargando ? 'Buscando...' : 'Buscar'}
                            </button>
                        </div>
                        <div className="col-12 mt-4">
                            <hr/>
                        </div>
                    </div>
                </div>
            </section>
        </form>

    );
};

