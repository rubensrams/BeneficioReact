import React from 'react'
import './PanelCarga.css'

export const PanelCarga = ({ mensaje = "Consultando Información..." }) => {
    return (
        <div className="modal-overlay">
            <div className="loading-container">
                <div className="spinner-wrapper">
                    <div className="spinner">
                        <div className="spinner-sector spinner-sector-1"></div>
                        <div className="spinner-sector spinner-sector-2"></div>
                        <div className="spinner-sector spinner-sector-3"></div>
                    </div>
                    <div className="spinner-inner"></div>
                </div>
                <p className="loading-text">{mensaje}</p>
                <div className="loading-dots">
                    <span className="dot"></span>
                    <span className="dot"></span>
                    <span className="dot"></span>
                </div>
            </div>
        </div>
    )
}
