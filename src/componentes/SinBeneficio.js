import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom';


export const SinBeneficio = () => {

    const navegar = useNavigate();
   
   const regresar = () => {
           navegar('/');  
    }

  return (

   <section className="">
			<div className="container">
				<div className="row justify-content-center">
					<div className="col-9 col-md-3">
						<img className="img-fluid" src="./imas/logo-solucion-integral.png" alt="Solución Integral"/>
					</div>

					<div className="col-12 text-center mt-4">
						<p className="mt-4">
							Entra o regístrate en
							<a target="_blank" style={{textDecoration: 'underline'}} href="https://micuenta.infonavit.org.mx/"> Mi Cuenta Infonavit </a>
							para conocer más sobre los productos y servicios disponibles para
							ti
						</p>
						<p>Si tienes dudas puedes consultar:</p>
						<p className="mb-0">
							<a style={{textDecoration: 'underline'}} href="https://micuenta.infonavit.org.mx/registro"
								target="_blank">Cómo registrarte en Mi Cuenta Infonavit</a>
						</p>
						<p>
							<a style={{textDecoration: 'underline'}} href="https://micuenta.infonavit.org.mx/cambio-contrasenia" target="_blank">Cómo recuperar tu
								contraseña</a>
						</p>
					</div>
					<div className="row justify-content-center">
						<div>
							<input type='button' onClick={regresar} value="Regresar"
								className="btn boton-blanco-borde-rojo btn-block mt-3 mt-md-0" />
						</div>
					</div>
					<div className="col-12 mt-4">
						<hr/>
					</div>
				</div>
			</div>
		</section>
  )
}
