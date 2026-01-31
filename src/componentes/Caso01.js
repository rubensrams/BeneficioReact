import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom';

export const Caso01 = () => {

    const navegar = useNavigate();
    const location = useLocation();
    
    // Recibir los parámetros del state (formulario) y datos de la API
    const { 
        nombre,        // Datos que vienen del backend:
        numeroCredito,
        fechaCongelacion,
        saldoAntes,
        saldoDespues,
        fechaAplicacion
    } = location.state || {};

   const regresar = () => {
           navegar('/');  
    }

  return (

   <section className="">
			<div className="container">
				<div className="row justify-content-center">
					<div className="col-12 mb-2 text-center">
						<h3><div className="bold rojo mt-5">¡Felicidades {nombre}! </div></h3>
						<h5 className="">
							<div>Además de que tu crédito <span className="bold">{numeroCredito || '******7085'}</span> fue congelado en {fechaCongelacion || 'noviembre 2024'}, ahora gracias al programa:</div>
						</h5>
					</div>
					<div className="col-9 col-md-3">
						<img className="img-fluid" src="/imas/logo-solucion-integral.png" alt="Solución Integral"/>
					</div>
					<div className="col-12 mt-5">
						<div className="row justify-content-center">
							<div className="col-12 col-md-6 col-lg-5">
								<div className="card h-100">
									<div className="card-header text-center fondo-azul-medio">
										<p className="mb-0">
											Condiciones
											<span className="bold"> antes </span>
											de
											<br/>la aplicación de Solución Integral
										</p>
									</div>
									<div className="card-body fondo-azul-claro">
										<table width="100%" border="0" cellspacing="0"
											cellpadding="0">
											<tbody>
												<tr>
													<td className="text-left">Saldo</td>
													<td><div className="text-right bold">$ {saldoAntes || '439,586.03'}</div></td>
												</tr>
											</tbody>
										</table>
									</div>
								</div>
							</div>
							<div className="col-12 col-md-6 col-lg-5 mt-3 mt-md-0">
								<div className="card h-100">
									<div className="card-header text-center fondo-azul-medio">
										<p className="mb-0">
											Condiciones
											<span className="bold"> después </span>
											de
											<br/>la aplicación de Solución Integral
										</p>
									</div>
									<div className="card-body fondo-azul-claro">
										<table width="100%" border="0" cellspacing="0"
											cellpadding="0">
											<tbody>
												<tr>
													<td className="text-left">
														Saldo
													</td>
													<td><div className="text-right bold">$ {saldoDespues || '438,373.96'}</div></td>
												</tr>
											</tbody>
										</table>

									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="col-12 text-center mt-4">
						<p>
							<label className="rojo-claro">{`Fecha de Aplicación: ${fechaAplicacion || '01/01/2024'}`}</label>
						</p>
					</div>
					<div className="col-12 text-center mt-2  ">
						<p className="fuente-montserrat_css">
							Para conocer los siguientes pasos, y obtener tu Carta de
							Instrucción de Cancelación de Hipoteca, ingresa a
							<a style={{textDecoration: 'underline'}} href="https://micuenta.infonavit.org.mx/"
								target="_blank">Mi Cuenta Infonavit</a>
							, sección Mi Crédito.
						</p>
					</div>
					<div className="row justify-content-center mt-3">
						<div>
							<input type='button' onClick={regresar} value="Regresar"
								className="btn boton-blanco-borde-rojo btn-block mt-3 mt-md-0" />
						</div>
					</div>
					<div className="col-12 mt-4">
						<hr />
					</div>
				</div>
			</div>
		</section>
  )
}
