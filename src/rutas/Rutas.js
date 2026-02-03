import React from 'react'
import { Routes, Route, BrowserRouter } from 'react-router-dom'
import { Caso01} from '../componentes/Caso01'
import { Formulario } from '../componentes/Formulario'
import { SinBeneficio } from '../componentes/SinBeneficio'

export const Rutas = () => {
  return (
    <BrowserRouter>
      <Routes>
         <Route path="" element={<Formulario />} />
        <Route path="/caso01" element={<Caso01 />} />
          <Route path="/sinbeneficio" element={<SinBeneficio />} />
      </Routes>
    </BrowserRouter>


  )
}
