import React from "react";

const HistorialAsistencia = () => {
    const historial = [
        {fecha: '23 Oct 2025', entrada: '08:00 AM', salida: '05:00 PM', tardanza: 'A tiempo', justificacion: '-'},
        {fecha: '22 Oct 2025', entrada: '08:15 AM', salida: '05:10 PM', tardanza: '15 min', justificacion: 'Trafico'},
        {fecha: '21 Oct 2025', entrada: '08:00 AM', salida: '05:00 PM', tardanza: 'A tiempo', justificacion: '-'},
        {fecha: '20 Oct 2025', entrada: 'Con Clase', salida: '-', tardanza: 'A tiempo', justificacion: 'Clases Programadas'},
        {fecha: '19 Oct 2025', entrada: '08:05 AM', salida: '05:00 PM', tardanza: '5 min', justificacion: '-'},
        {fecha: '18 Oct 2025', entrada: '08:00 AM', salida: '05:00 PM', tardanza: 'A tiempo', justificacion: '-'},
        {fecha: '17 Oct 2025', entrada: '08:00 AM', salida: '04:30 PM', tardanza: 'A tiempo', justificacion: '-'},
    ];
    return (
        <div className="bg-white border border-gray-300 rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Historial de Asistencia (Últimos 7 días)</h3>
            <table className="w-full"> 
                <thead>
                    <tr className="border-b border-gray-300">
                        <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">Fecha</th>
                        <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">Hora de Entrada</th>
                        <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">Hora de Salida</th>
                        <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">Tardanza (min)</th>
                        <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">Justificación</th>
                    </tr>
                </thead>
                <tbody>
                    {historial.map((item, index) => (
                        <tr key={index} className='border-b border-gray-200'>
                            <td className='py-3 px-2 text-sm'>{item.fecha}</td>
                            <td className='py-3 px-2 text-sm'>{item.entrada}</td>
                            <td className='py-3 px-2 text-sm'>{item.salida}</td>
                            <td className='py-3 px-2 text-sm'>{item.tardanza}</td>
                            <td className='py-3 px-2 text-sm'>{item.justificacion}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};                                                                                                                              

export default HistorialAsistencia;
