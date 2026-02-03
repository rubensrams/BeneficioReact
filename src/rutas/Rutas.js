import React from 'react'
import { Routes, Route, MemoryRouter } from 'react-router-dom'
import { Caso01} from '../componentes/Caso01'
import { Formulario } from '../componentes/Formulario'
import { SinBeneficio } from '../componentes/SinBeneficio'

export const Rutas = () => {
  return (
    <MemoryRouter initialEntries={['/']} initialIndex={0}>
      <Routes>
         <Route path="/" element={<Formulario />} />
        <Route path="/caso01" element={<Caso01 />} />
          <Route path="/sinbeneficio" element={<SinBeneficio />} />
      </Routes>
    </MemoryRouter>


  )
}
