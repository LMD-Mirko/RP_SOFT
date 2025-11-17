import React from 'react';

const ResumenAsistencia = () => {
    return(
        <div className='bg-white border border-gray-300 rounded-lg p-6 mb-6'>
            <h3 className='text-lg font-semibold mb-4'>Resumen de Asitencias - Hoy</h3>
            <div className='grid grid-cols-5 gap-4'>
                <div>
                    <p className='text-sm text-gray-600 mb-1'>Estado</p>
                    <p className='font-semibold'>Presente</p>
                </div>
                <div>
                    <p className='text-sm text-gray-600 mb-1'>Entrada</p>
                    <p className='font-semibold'>8:00 AM</p>
                </div>
                <div>
                    <p className='text-sm text-gray-600 mb-1'>Salida</p>
                    <p className='font-semibold'>5:00 PM</p>
                </div>
                <div>
                    <p className='text-sm text-gray-600 mb-1'>Tardanza</p>
                    <p className='font-semibold'> 0 min</p>
                </div>
                <div>
                    <p className='text-sm text-gray-600 mb-1'>Horas trabajadas</p>
                    <p className='font-semibold'>8h</p>
                </div>
            </div>
        </div>
    );
};

export default ResumenAsistencia;
