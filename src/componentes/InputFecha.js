import React, { forwardRef } from 'react';

/**
 * InputFecha - Componente de input con máscara de fecha dd/mm/aaaa
 * Formatea automáticamente mientras el usuario escribe e inserta las barras
 * Valida que la fecha sea correcta
 */
const InputFecha = forwardRef(({ 
    value, 
    onChange, 
    onError, 
    disabled, 
    className, 
    placeholder = "dd/mm/aaaa",
    ...props 
}, ref) => {

    /**
     * Formatea el valor insertando / automáticamente
     * Limita a 10 caracteres (dd/mm/aaaa)
     */
    const formatearFecha = (texto) => {
        // Eliminar todo lo que no sea número
        const soloNumeros = texto.replace(/\D/g, '');
        
        // Limitar a 8 dígitos
        const limitado = soloNumeros.slice(0, 8);
        
        // Aplicar formato dd/mm/aaaa
        let formateado = '';
        
        if (limitado.length > 0) {
            formateado = limitado.slice(0, 2); // dd
        }
        if (limitado.length >= 3) {
            formateado += '/' + limitado.slice(2, 4); // mm
        }
        if (limitado.length >= 5) {
            formateado += '/' + limitado.slice(4, 8); // aaaa
        }
        
        return formateado;
    };

    /**
     * Valida que la fecha sea válida
     * Retorna true si es válida, false si no
     */
    const validarFecha = (fechaTexto) => {
        // Formato completo: dd/mm/aaaa (10 caracteres)
        if (fechaTexto.length !== 10) {
            return false;
        }

        const partes = fechaTexto.split('/');
        if (partes.length !== 3) {
            return false;
        }

        const dia = parseInt(partes[0], 10);
        const mes = parseInt(partes[1], 10);
        const anio = parseInt(partes[2], 10);

        // Validar rangos básicos
        if (mes < 1 || mes > 12) {
            return false;
        }

        if (dia < 1 || dia > 31) {
            return false;
        }

        // Validar año (rango razonable: 1900-2100)
        if (anio < 1900 || anio > 2100) {
            return false;
        }

        // Días por mes
        const diasPorMes = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

        // Ajustar febrero en años bisiestos
        if (mes === 2) {
            const esBisiesto = (anio % 4 === 0 && anio % 100 !== 0) || (anio % 400 === 0);
            diasPorMes[1] = esBisiesto ? 29 : 28;
        }

        // Validar día según el mes
        if (dia > diasPorMes[mes - 1]) {
            return false;
        }

        // Crear objeto Date y verificar que coincida
        const fecha = new Date(anio, mes - 1, dia);
        return fecha.getFullYear() === anio && 
               fecha.getMonth() === mes - 1 && 
               fecha.getDate() === dia;
    };

    const handleChange = (e) => {
        const valorFormateado = formatearFecha(e.target.value);
        
        // Llamar onChange con el valor formateado
        onChange(valorFormateado);

        // Validar solo cuando el formato está completo
        if (onError) {
            if (valorFormateado.length === 10) {
                const esValida = validarFecha(valorFormateado);
                onError(!esValida);
            } else {
                onError(false); // Reset error si aún no está completa
            }
        }
    };

    return (
        <input 
            type="text"
            ref={ref}
            value={value}
            onChange={handleChange}
            disabled={disabled}
            className={className}
            placeholder={placeholder}
            maxLength={10}
            {...props}
        />
    );
});

InputFecha.displayName = 'InputFecha';

export default InputFecha;
