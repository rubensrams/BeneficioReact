import React from 'react'
import { Routes, Route, BrowserRouter } from 'react-router-dom'
import { Caso01} from '../componentes/Caso01'
import { Formulario } from '../componentes/Formulario'

export const Rutas = () => {
  return (
    <BrowserRouter>
      <Routes>
         <Route path="" element={<Formulario />} />
        <Route path="/caso01" element={<Caso01 />} />
      </Routes>
    </BrowserRouter>


  )
}
