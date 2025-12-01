import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, BarChart, Bar, CartesianGrid,
  XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';

// DATOS OFICIALES PERÍODO 2021-2024 (Fuente: Tabla 10, pp. 71-75)
const totalesOficiales = [
  { year: 2021, total: 170744 },
  { year: 2022, total: 162585 },
  { year: 2023, total: 168172 },
  { year: 2024, total: 174968 }
];

// Variaciones anuales 2021-2024
const variaciones = [
  { year: '2021→2022', valor: -8159, tipo: 'disminucion' },
  { year: '2022→2023', valor: 5587, tipo: 'aumento' },
  { year: '2023→2024', valor: 6796, tipo: 'aumento' }
];

// Personal por categoría 2021-2024
const categoriasPorAno = [
  { year: 2021, oficiales: 7517, suboficiales: 66, ejecutivo: 129709, agentes: 259, noUniformados: 4121, estudiantes: 8231, patrulleros: 20841 },
  { year: 2022, oficiales: 7501, suboficiales: 39, ejecutivo: 132636, agentes: 210, noUniformados: 4344, estudiantes: 4682, patrulleros: 13173 },
  { year: 2023, oficiales: 7500, suboficiales: 39, ejecutivo: 132595, agentes: 209, noUniformados: 4343, estudiantes: 4682, patrulleros: 18804 },
  { year: 2024, oficiales: 7365, suboficiales: 9, ejecutivo: 123926, agentes: 130, noUniformados: 4617, estudiantes: 11522, patrulleros: 27399 }
];

// DATOS COMPLETOS 2021-2024 DE TODAS LAS UNIDADES
const unidadesDetalladas = {
  // METROPOLITANAS
  MEBOG: { 
    nombre: 'Bogotá',
    serie: [18835, 17733, 16745, 16746],
    mayorValor: { año: 2021, valor: 18835 },
    menorValor: { año: 2023, valor: 16745 },
    mayorAumento: { año: 2024, valor: 1 },
    mayorCaida: { año: 2022, valor: -1102 },
    cambioNeto: -2089,
    tipo: 'metropolitana'
  },
  MECAL: { 
    nombre: 'Cali',
    serie: [6993, 6459, 6334, 6335],
    mayorValor: { año: 2021, valor: 6993 },
    menorValor: { año: 2023, valor: 6334 },
    mayorAumento: { año: 2024, valor: 1 },
    mayorCaida: { año: 2022, valor: -534 },
    cambioNeto: -658,
    tipo: 'metropolitana'
  },
  MEVAL: { 
    nombre: 'Medellín',
    serie: [8304, 8098, 8012, 8013],
    mayorValor: { año: 2021, valor: 8304 },
    menorValor: { año: 2023, valor: 8012 },
    mayorAumento: { año: 2024, valor: 1 },
    mayorCaida: { año: 2022, valor: -206 },
    cambioNeto: -291,
    tipo: 'metropolitana'
  },
  MEBAR: { 
    nombre: 'Barranquilla',
    serie: [4591, 5041, 5591, 5592],
    mayorValor: { año: 2024, valor: 5592 },
    menorValor: { año: 2021, valor: 4591 },
    mayorAumento: { año: 2023, valor: 550 },
    mayorCaida: { año: 2022, valor: 0 },
    cambioNeto: 1001,
    tipo: 'metropolitana'
  },
  MECAR: { 
    nombre: 'Cartagena',
    serie: [2911, 2840, 3206, 3207],
    mayorValor: { año: 2024, valor: 3207 },
    menorValor: { año: 2022, valor: 2840 },
    mayorAumento: { año: 2023, valor: 366 },
    mayorCaida: { año: 2022, valor: -71 },
    cambioNeto: 296,
    tipo: 'metropolitana'
  },
  MEVIL: { 
    nombre: 'Villavicencio',
    serie: [2334, 2256, 2403, 2404],
    mayorValor: { año: 2024, valor: 2404 },
    menorValor: { año: 2022, valor: 2256 },
    mayorAumento: { año: 2023, valor: 147 },
    mayorCaida: { año: 2022, valor: -78 },
    cambioNeto: 70,
    tipo: 'metropolitana'
  },
  MEPER: { 
    nombre: 'Pereira',
    serie: [2103, 1904, 1989, 1990],
    mayorValor: { año: 2021, valor: 2103 },
    menorValor: { año: 2022, valor: 1904 },
    mayorAumento: { año: 2023, valor: 85 },
    mayorCaida: { año: 2022, valor: -199 },
    cambioNeto: -113,
    tipo: 'metropolitana'
  },
  METIB: { 
    nombre: 'Ibagué',
    serie: [1965, 2016, 2209, 2210],
    mayorValor: { año: 2024, valor: 2210 },
    menorValor: { año: 2021, valor: 1965 },
    mayorAumento: { año: 2023, valor: 193 },
    mayorCaida: { año: 2022, valor: 51 },
    cambioNeto: 245,
    tipo: 'metropolitana'
  },
  MEMAZ: { 
    nombre: 'Manizales',
    serie: [1534, 1377, 1546, 1547],
    mayorValor: { año: 2024, valor: 1547 },
    menorValor: { año: 2022, valor: 1377 },
    mayorAumento: { año: 2023, valor: 169 },
    mayorCaida: { año: 2022, valor: -157 },
    cambioNeto: 13,
    tipo: 'metropolitana'
  },
  MESAN: { 
    nombre: 'Santa Marta',
    serie: [2108, 2189, 2364, 2365],
    mayorValor: { año: 2024, valor: 2365 },
    menorValor: { año: 2021, valor: 2108 },
    mayorAumento: { año: 2023, valor: 175 },
    mayorCaida: { año: 2022, valor: 81 },
    cambioNeto: 257,
    tipo: 'metropolitana'
  },
  MEMOT: { 
    nombre: 'Montería',
    serie: [1968, 1951, 2263, 2264],
    mayorValor: { año: 2024, valor: 2264 },
    menorValor: { año: 2022, valor: 1951 },
    mayorAumento: { año: 2023, valor: 312 },
    mayorCaida: { año: 2022, valor: -17 },
    cambioNeto: 296,
    tipo: 'metropolitana'
  },

  // DEPARTAMENTALES
  DEANT: { 
    nombre: 'Antioquia',
    serie: [4986, 5039, 4861, 4862],
    mayorValor: { año: 2022, valor: 5039 },
    menorValor: { año: 2023, valor: 4861 },
    mayorAumento: { año: 2022, valor: 53 },
    mayorCaida: { año: 2023, valor: -178 },
    cambioNeto: -124,
    tipo: 'departamental'
  },
  DEVAL: { 
    nombre: 'Valle',
    serie: [5039, 5018, 4673, 4674],
    mayorValor: { año: 2021, valor: 5039 },
    menorValor: { año: 2023, valor: 4673 },
    mayorAumento: { año: 2022, valor: -21 },
    mayorCaida: { año: 2023, valor: -345 },
    cambioNeto: -365,
    tipo: 'departamental'
  },
  DENAR: { 
    nombre: 'Nariño',
    serie: [2907, 2909, 2583, 2584],
    mayorValor: { año: 2022, valor: 2909 },
    menorValor: { año: 2023, valor: 2583 },
    mayorAumento: { año: 2022, valor: 2 },
    mayorCaida: { año: 2023, valor: -326 },
    cambioNeto: -323,
    tipo: 'departamental'
  },
  DECAU: { 
    nombre: 'Cauca',
    serie: [2205, 2242, 2116, 2117],
    mayorValor: { año: 2022, valor: 2242 },
    menorValor: { año: 2023, valor: 2116 },
    mayorAumento: { año: 2022, valor: 37 },
    mayorCaida: { año: 2023, valor: -126 },
    cambioNeto: -88,
    tipo: 'departamental'
  },
  DECES: { 
    nombre: 'Cesar',
    serie: [2903, 2817, 2903, 2904],
    mayorValor: { año: 2024, valor: 2904 },
    menorValor: { año: 2022, valor: 2817 },
    mayorAumento: { año: 2023, valor: 86 },
    mayorCaida: { año: 2022, valor: -86 },
    cambioNeto: 1,
    tipo: 'departamental'
  },
  DEBOL: { 
    nombre: 'Bolívar',
    serie: [1618, 1626, 1524, 1525],
    mayorValor: { año: 2022, valor: 1626 },
    menorValor: { año: 2023, valor: 1524 },
    mayorAumento: { año: 2022, valor: 8 },
    mayorCaida: { año: 2023, valor: -102 },
    cambioNeto: -93,
    tipo: 'departamental'
  },
  DEGUA: { 
    nombre: 'Guaviare',
    serie: [1961, 1926, 2103, 2104],
    mayorValor: { año: 2024, valor: 2104 },
    menorValor: { año: 2022, valor: 1926 },
    mayorAumento: { año: 2023, valor: 177 },
    mayorCaida: { año: 2022, valor: -35 },
    cambioNeto: 143,
    tipo: 'departamental'
  },
  DEATA: { 
    nombre: 'Atlántico',
    serie: [1676, 1796, 1651, 1652],
    mayorValor: { año: 2022, valor: 1796 },
    menorValor: { año: 2023, valor: 1651 },
    mayorAumento: { año: 2022, valor: 120 },
    mayorCaida: { año: 2023, valor: -145 },
    cambioNeto: -24,
    tipo: 'departamental'
  },

  // DIRECCIONES NACIONALES
  DIJIN: { 
    nombre: 'Investigación Criminal',
    serie: [2385, 2406, 2386, 2387],
    mayorValor: { año: 2022, valor: 2406 },
    menorValor: { año: 2021, valor: 2385 },
    mayorAumento: { año: 2022, valor: 21 },
    mayorCaida: { año: 2023, valor: -20 },
    cambioNeto: 2,
    tipo: 'direccion'
  },
  DIPOL: { 
    nombre: 'Inteligencia Policial',
    serie: [1607, 1743, 1492, 1493],
    mayorValor: { año: 2022, valor: 1743 },
    menorValor: { año: 2023, valor: 1492 },
    mayorAumento: { año: 2022, valor: 136 },
    mayorCaida: { año: 2023, valor: -251 },
    cambioNeto: -114,
    tipo: 'direccion'
  },
  DISEC: { 
    nombre: 'Seguridad Ciudadana',
    serie: [2690, 1999, 537, 538],
    mayorValor: { año: 2021, valor: 2690 },
    menorValor: { año: 2023, valor: 537 },
    mayorAumento: { año: 2022, valor: -691 },
    mayorCaida: { año: 2023, valor: -1462 },
    cambioNeto: -2152,
    tipo: 'direccion'
  },
  DICAR: { 
    nombre: 'Carabineros',
    serie: [2171, 2172, 2171, 2172],
    mayorValor: { año: 2022, valor: 2172 },
    menorValor: { año: 2021, valor: 2171 },
    mayorAumento: { año: 2022, valor: 1 },
    mayorCaida: { año: 2023, valor: -1 },
    cambioNeto: 1,
    tipo: 'direccion'
  }
};

// Función para preparar datos de direcciones para gráfico
const prepararDatosDirecciones = () => {
  const años = [2021, 2022, 2023, 2024];
  const direcciones = ['DIJIN', 'DIPOL', 'DISEC', 'DICAR'];
  
  return años.map(año => {
    const dataPoint = { año };
    direcciones.forEach(dir => {
      const idx = año - 2021;
      if (unidadesDetalladas[dir] && unidadesDetalladas[dir].serie[idx] !== undefined) {
        dataPoint[dir] = unidadesDetalladas[dir].serie[idx];
      }
    });
    return dataPoint;
  });
};

// Datos para gráfico de direcciones
const datosDireccionesChart = prepararDatosDirecciones();

// Generar ranking de unidades
const generarRankingUnidades = () => {
  return Object.entries(unidadesDetalladas)
    .map(([sigla, data]) => ({
      sigla,
      nombre: data.nombre,
      cambio: data.cambioNeto,
      tipo: data.tipo
    }))
    .sort((a, b) => Math.abs(b.cambio) - Math.abs(a.cambio))
    .slice(0, 15);
};

const rankingUnidades = generarRankingUnidades();

export default function DashboardTalentoHumano() {
  const [vistaActiva, setVistaActiva] = useState('resumen');
  const [unidadSeleccionada, setUnidadSeleccionada] = useState('MEBOG');
  const [tipoFiltro, setTipoFiltro] = useState('todos');
  const [rankingFiltrado, setRankingFiltrado] = useState(rankingUnidades);
  const [direccionesFiltradas, setDireccionesFiltradas] = useState(['DIJIN', 'DIPOL', 'DISEC', 'DICAR']);

  // Calcular estadísticas clave para el período 2021-2024
  const totalInicial = totalesOficiales[0].total;
  const totalFinal = totalesOficiales[totalesOficiales.length - 1].total;
  const variacionTotal = totalFinal - totalInicial;
  const variacionPorcentaje = ((variacionTotal / totalInicial) * 100).toFixed(2);
  
  const mayorAumento = Math.max(...variaciones.filter(v => v.tipo === 'aumento').map(v => v.valor));
  const mayorDisminucion = Math.min(...variaciones.filter(v => v.tipo === 'disminucion').map(v => v.valor));

  // Filtrar unidades por tipo
  const unidadesFiltradas = Object.entries(unidadesDetalladas)
    .filter(([sigla, data]) => {
      if (tipoFiltro === 'todos') return true;
      return data.tipo === tipoFiltro;
    })
    .reduce((obj, [sigla, data]) => {
      obj[sigla] = data;
      return obj;
    }, {});

  // Efecto para actualizar ranking filtrado
  useEffect(() => {
    let filtrado = rankingUnidades;
    
    if (tipoFiltro !== 'todos') {
      filtrado = rankingUnidades.filter(item => {
        const unidad = unidadesDetalladas[item.sigla];
        return unidad && unidad.tipo === tipoFiltro;
      });
    }
    
    setRankingFiltrado(filtrado.slice(0, 10));
  }, [tipoFiltro]);

  // Encontrar unidades con mayor reducción
  const mayorReduccion = Object.entries(unidadesDetalladas)
    .filter(([_, data]) => data.cambioNeto < 0)
    .sort((a, b) => a[1].cambioNeto - b[1].cambioNeto)
    .slice(0, 3);

  // Encontrar unidades con mayor crecimiento
  const mayorCrecimiento = Object.entries(unidadesDetalladas)
    .filter(([_, data]) => data.cambioNeto > 0)
    .sort((a, b) => b[1].cambioNeto - a[1].cambioNeto)
    .slice(0, 3);

  // Encontrar unidades más estables
  const masEstables = Object.entries(unidadesDetalladas)
    .filter(([_, data]) => Math.abs(data.cambioNeto) <= 10)
    .sort((a, b) => Math.abs(a[1].cambioNeto) - Math.abs(b[1].cambioNeto))
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Actualizado */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            📊 Dashboard de Talento Humano - Policía Nacional 2021-2024
          </h1>
          <p className="text-gray-600 text-lg">
            Análisis Estratégico del Período - Todas las Unidades Operativas
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              🏙️ 11 Metropolitanas
            </span>
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
              🗺️ 8 Departamentos
            </span>
            <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
              🎯 4 Direcciones Nacionales
            </span>
            <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
              📈 Período: 2021-2024
            </span>
          </div>
        </div>

        {/* KPIs Principales Actualizados */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 border-l-4 border-blue-600">
            <h3 className="text-gray-500 text-xs md:text-sm font-semibold uppercase mb-2">Total 2024</h3>
            <p className="text-2xl md:text-3xl font-bold text-blue-600">
              {totalFinal.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-1">Funcionarios activos</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 border-l-4 border-green-600">
            <h3 className="text-gray-500 text-xs md:text-sm font-semibold uppercase mb-2">Mayor Aumento</h3>
            <p className="text-2xl md:text-3xl font-bold text-green-600">
              +{mayorAumento.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-1">2023→2024</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 border-l-4 border-red-600">
            <h3 className="text-gray-500 text-xs md:text-sm font-semibold uppercase mb-2">Mayor Disminución</h3>
            <p className="text-2xl md:text-3xl font-bold text-red-600">
              {mayorDisminucion.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-1">2021→2022</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 border-l-4 border-purple-600">
            <h3 className="text-gray-500 text-xs md:text-sm font-semibold uppercase mb-2">Variación 2021-2024</h3>
            <p className={`text-2xl md:text-3xl font-bold ${parseFloat(variacionPorcentaje) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {parseFloat(variacionPorcentaje) >= 0 ? '+' : ''}{variacionPorcentaje}%
            </p>
            <p className="text-xs text-gray-500 mt-1">+{variacionTotal.toLocaleString()}</p>
          </div>
        </div>

        {/* Filtros por Tipo */}
        <div className="mb-6">
          <div className="bg-white rounded-xl shadow-lg p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">🔍 Filtrar por Tipo de Unidad:</h3>
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'todos', label: '✅ Todos', color: 'gray', bgColor: 'bg-gray-100', textColor: 'text-gray-800', activeBg: 'bg-gray-600' },
                { id: 'metropolitana', label: '🏙️ Metropolitanas', color: 'blue', bgColor: 'bg-blue-100', textColor: 'text-blue-800', activeBg: 'bg-blue-600' },
                { id: 'departamental', label: '🗺️ Departamentos', color: 'green', bgColor: 'bg-green-100', textColor: 'text-green-800', activeBg: 'bg-green-600' },
                { id: 'direccion', label: '🎯 Direcciones Nacionales', color: 'purple', bgColor: 'bg-purple-100', textColor: 'text-purple-800', activeBg: 'bg-purple-600' }
              ].map(filtro => (
                <button
                  key={filtro.id}
                  onClick={() => setTipoFiltro(filtro.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${tipoFiltro === filtro.id
                      ? `${filtro.activeBg} text-white shadow-md`
                      : `${filtro.bgColor} ${filtro.textColor} hover:opacity-90`
                    }`}
                >
                  {filtro.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Navegación de Vistas Actualizada */}
        <div className="flex overflow-x-auto gap-2 mb-6 pb-2">
          {[
            { id: 'resumen', label: '📊 Resumen' },
            { id: 'tendencia', label: '📈 Tendencia' },
            { id: 'variaciones', label: '🔄 Variaciones' },
            { id: 'categorias', label: '👥 Categorías' },
            { id: 'unidades', label: '🏛️ Ranking' },
            { id: 'detalle', label: '🔍 Por Unidad' },
            { id: 'direcciones', label: '🎯 Direcciones' }
          ].map(vista => (
            <button
              key={vista.id}
              onClick={() => setVistaActiva(vista.id)}
              className={`flex-shrink-0 px-4 py-3 rounded-lg font-semibold whitespace-nowrap transition-all ${
                vistaActiva === vista.id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {vista.label}
            </button>
          ))}
        </div>

        {/* Vista: Resumen Ejecutivo CORREGIDO */}
        {vistaActiva === 'resumen' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">🎯 Hallazgos Clave 2021-2024</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Mayor Reducción */}
                <div className="bg-red-50 p-5 rounded-xl border-l-4 border-red-500">
                  <h3 className="font-bold text-red-800 text-lg mb-3">⚠️ Mayor Reducción</h3>
                  <div className="space-y-3">
                    {mayorReduccion.map(([sigla, data]) => (
                      <div key={sigla} className="bg-white p-3 rounded-lg shadow-sm">
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="font-semibold">{data.nombre}</span>
                            <div className="text-xs text-gray-500">
                              {data.tipo === 'direccion' ? '🎯 Dirección' : 
                               data.tipo === 'metropolitana' ? '🏙️ Metropolitana' : 
                               '🗺️ Departamento'}
                            </div>
                          </div>
                          <span className="text-red-600 font-bold text-lg">{data.cambioNeto}</span>
                        </div>
                        <div className="mt-2 text-sm text-gray-600">
                          De {data.serie[0].toLocaleString()} a {data.serie[3].toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mayor Crecimiento */}
                <div className="bg-green-50 p-5 rounded-xl border-l-4 border-green-500">
                  <h3 className="font-bold text-green-800 text-lg mb-3">📈 Mayor Crecimiento</h3>
                  <div className="space-y-3">
                    {mayorCrecimiento.map(([sigla, data]) => (
                      <div key={sigla} className="bg-white p-3 rounded-lg shadow-sm">
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="font-semibold">{data.nombre}</span>
                            <div className="text-xs text-gray-500">
                              {data.tipo === 'direccion' ? '🎯 Dirección' : 
                               data.tipo === 'metropolitana' ? '🏙️ Metropolitana' : 
                               '🗺️ Departamento'}
                            </div>
                          </div>
                          <span className="text-green-600 font-bold text-lg">+{data.cambioNeto}</span>
                        </div>
                        <div className="mt-2 text-sm text-gray-600">
                          De {data.serie[0].toLocaleString()} a {data.serie[3].toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Más Estables */}
                <div className="bg-blue-50 p-5 rounded-xl border-l-4 border-blue-500">
                  <h3 className="font-bold text-blue-800 text-lg mb-3">⚖️ Más Estables</h3>
                  <div className="space-y-3">
                    {masEstables.map(([sigla, data]) => (
                      <div key={sigla} className="bg-white p-3 rounded-lg shadow-sm">
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="font-semibold">{data.nombre}</span>
                            <div className="text-xs text-gray-500">
                              {data.tipo === 'direccion' ? '🎯 Dirección' : 
                               data.tipo === 'metropolitana' ? '🏙️ Metropolitana' : 
                               '🗺️ Departamento'}
                            </div>
                          </div>
                          <span className={`font-bold text-lg ${data.cambioNeto >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {data.cambioNeto >= 0 ? '+' : ''}{data.cambioNeto}
                          </span>
                        </div>
                        <div className="mt-2 text-xs text-gray-600">
                          Variación mínima (±10 funcionarios)
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Conclusiones Estratégicas */}
              <div className="mt-8 p-5 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl">
                <h3 className="font-bold text-indigo-800 text-lg mb-4">💡 Conclusiones Estratégicas 2021-2024</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <div className="bg-red-100 p-2 rounded-lg mr-3">
                        <span className="text-red-600 font-bold">▼</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">Reducción Crítica</h4>
                        <p className="text-sm text-gray-600">
                          <strong>DISEC</strong> perdió el 80% de su personal (2,690 → 538), 
                          evidenciando una reestructuración organizacional profunda.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-green-100 p-2 rounded-lg mr-3">
                        <span className="text-green-600 font-bold">▲</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">Crecimiento Regional</h4>
                        <p className="text-sm text-gray-600">
                          <strong>Barranquilla (+1,001)</strong> lidera el crecimiento, 
                          seguida por Cartagena y Montería, mostrando fortalecimiento en la región Caribe.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <div className="bg-blue-100 p-2 rounded-lg mr-3">
                        <span className="text-blue-600 font-bold">⚖️</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">Estabilidad Operativa</h4>
                        <p className="text-sm text-gray-600">
                          <strong>DIJIN y DICAR</strong> mantienen personal casi constante, 
                          confirmando su prioridad estratégica en investigación y control territorial.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-yellow-100 p-2 rounded-lg mr-3">
                        <span className="text-yellow-600 font-bold">🔄</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">Transformación Institucional</h4>
                        <p className="text-sm text-gray-600">
                          El período muestra una redistribución del talento humano 
                          de grandes ciudades hacia regiones estratégicas.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Vista: Tendencia Nacional 2021-2024 */}
        {vistaActiva === 'tendencia' && (
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              📈 Evolución Total del Talento Humano 2021-2024
            </h2>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={totalesOficiales}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="year" stroke="#666" />
                <YAxis stroke="#666" tickFormatter={(value) => value.toLocaleString()} />
                <Tooltip 
                  formatter={(value) => [value.toLocaleString(), 'Funcionarios']}
                  labelFormatter={(label) => `Año ${label}`}
                />
                <Line 
                  type="monotone" 
                  dataKey="total" 
                  stroke="#1d4ed8" 
                  strokeWidth={3}
                  name="Total Funcionarios"
                  dot={{ fill: '#1d4ed8', r: 6 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              {totalesOficiales.map((item, index) => (
                <div key={item.year} className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-sm text-blue-600 font-semibold">Año {item.year}</div>
                  <div className="text-2xl font-bold text-blue-800">{item.total.toLocaleString()}</div>
                  {index > 0 && (
                    <div className={`text-sm mt-1 ${item.total > totalesOficiales[index-1].total ? 'text-green-600' : 'text-red-600'}`}>
                      {item.total > totalesOficiales[index-1].total ? '▲ Aumento' : '▼ Disminución'} 
                      {' '}{Math.abs(item.total - totalesOficiales[index-1].total).toLocaleString()}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Vista: Variaciones Anuales CORREGIDA */}
        {vistaActiva === 'variaciones' && (
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              🔄 Variaciones Anuales 2021-2024
            </h2>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={variaciones}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis tickFormatter={(value) => value.toLocaleString()} />
                <Tooltip 
                  formatter={(value) => [value.toLocaleString(), 'Variación']}
                  labelFormatter={(label) => `Período: ${label}`}
                />
                <Bar dataKey="valor" name="Variación">
                  {variaciones.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.tipo === 'aumento' ? '#10b981' : '#ef4444'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
              <h4 className="font-bold text-yellow-800 mb-2">📌 Análisis de Variaciones</h4>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>• <strong>2021→2022:</strong> Reducción de 8,159 funcionarios (-4.8%)</li>
                <li>• <strong>2022→2023:</strong> Recuperación de 5,587 funcionarios (+3.4%)</li>
                <li>• <strong>2023→2024:</strong> Mayor aumento con 6,796 funcionarios (+4.0%)</li>
                <li>• <strong>Tendencia:</strong> Patrón en "V" con recuperación sostenida desde 2023</li>
              </ul>
            </div>
          </div>
        )}

        {/* Vista: Por Categoría CORREGIDA */}
        {vistaActiva === 'categorias' && (
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              👥 Distribución por Categoría 2021-2024
            </h2>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={categoriasPorAno}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis tickFormatter={(value) => value.toLocaleString()} />
                <Tooltip formatter={(value) => value.toLocaleString()} />
                <Legend />
                <Bar dataKey="ejecutivo" name="Nivel Ejecutivo" fill="#3b82f6" />
                <Bar dataKey="patrulleros" name="Patrulleros" fill="#10b981" />
                <Bar dataKey="oficiales" name="Oficiales" fill="#8b5cf6" />
                <Bar dataKey="estudiantes" name="Estudiantes" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-sm text-blue-600">Nivel Ejecutivo 2024</div>
                <div className="text-2xl font-bold text-blue-800">
                  {categoriasPorAno[3].ejecutivo.toLocaleString()}
                </div>
                <div className="text-xs text-gray-600">71% del total</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-sm text-green-600">Patrulleros 2024</div>
                <div className="text-2xl font-bold text-green-800">
                  {categoriasPorAno[3].patrulleros.toLocaleString()}
                </div>
                <div className="text-xs text-gray-600">+8,595 vs 2023</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-sm text-purple-600">Oficiales 2024</div>
                <div className="text-2xl font-bold text-purple-800">
                  {categoriasPorAno[3].oficiales.toLocaleString()}
                </div>
                <div className="text-xs text-gray-600">Liderazgo operativo</div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="text-sm text-yellow-600">Estudiantes 2024</div>
                <div className="text-2xl font-bold text-yellow-800">
                  {categoriasPorAno[3].estudiantes.toLocaleString()}
                </div>
                <div className="text-xs text-gray-600">+146% vs 2023</div>
              </div>
            </div>
          </div>
        )}

        {/* Vista: Ranking Unidades CORREGIDA */}
        {vistaActiva === 'unidades' && (
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              🏛️ Ranking de Unidades por Cambio Neto 2021-2024
              <span className="text-lg font-normal text-gray-600 ml-2">
                ({tipoFiltro === 'todos' ? 'Todas las unidades' : 
                  tipoFiltro === 'metropolitana' ? 'Metropolitanas' :
                  tipoFiltro === 'departamental' ? 'Departamentos' : 'Direcciones Nacionales'})
              </span>
            </h2>
            
            <ResponsiveContainer width="100%" height={500}>
              <BarChart 
                data={rankingFiltrado}
                layout="vertical"
                margin={{ top: 20, right: 30, left: 100, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  type="number" 
                  tickFormatter={(value) => Math.abs(value).toLocaleString()}
                  domain={['dataMin - 500', 'dataMax + 500']}
                />
                <YAxis 
                  dataKey="nombre" 
                  type="category" 
                  width={120}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip 
                  formatter={(value) => [`${value >= 0 ? '+' : ''}${value.toLocaleString()}`, 'Cambio Neto']}
                  labelFormatter={(label) => `Unidad: ${label}`}
                />
                <Bar dataKey="cambio" name="Cambio Neto 2021→2024">
                  {rankingFiltrado.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.cambio >= 0 ? '#10b981' : '#ef4444'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            
            <div className="mt-6 p-4 bg-indigo-50 rounded-lg">
              <h4 className="font-bold text-indigo-800 mb-2">📊 Interpretación del Ranking</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-semibold text-gray-700 mb-1">📈 Top Crecimiento:</h5>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {rankingFiltrado
                      .filter(item => item.cambio > 0)
                      .slice(0, 3)
                      .map(item => (
                        <li key={item.sigla}>
                          • {item.nombre}: <span className="text-green-600 font-semibold">+{item.cambio}</span>
                        </li>
                      ))}
                  </ul>
                </div>
                <div>
                  <h5 className="font-semibold text-gray-700 mb-1">📉 Mayor Reducción:</h5>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {rankingFiltrado
                      .filter(item => item.cambio < 0)
                      .slice(0, 3)
                      .map(item => (
                        <li key={item.sigla}>
                          • {item.nombre}: <span className="text-red-600 font-semibold">{item.cambio}</span>
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Vista: Análisis por Unidad CORREGIDA */}
        {vistaActiva === 'detalle' && (
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              🔍 Análisis Detallado por Unidad 2021-2024
            </h2>
            
            <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Seleccionar Unidad:
                </label>
                <select 
                  value={unidadSeleccionada}
                  onChange={(e) => setUnidadSeleccionada(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                >
                  <optgroup label="🏙️ Metropolitanas">
                    {Object.entries(unidadesDetalladas)
                      .filter(([_, data]) => data.tipo === 'metropolitana')
                      .map(([sigla, data]) => (
                        <option key={sigla} value={sigla}>
                          {sigla} - {data.nombre}
                        </option>
                      ))}
                  </optgroup>
                  <optgroup label="🗺️ Departamentos">
                    {Object.entries(unidadesDetalladas)
                      .filter(([_, data]) => data.tipo === 'departamental')
                      .map(([sigla, data]) => (
                        <option key={sigla} value={sigla}>
                          {sigla} - {data.nombre}
                        </option>
                      ))}
                  </optgroup>
                  <optgroup label="🎯 Direcciones Nacionales">
                    {Object.entries(unidadesDetalladas)
                      .filter(([_, data]) => data.tipo === 'direccion')
                      .map(([sigla, data]) => (
                        <option key={sigla} value={sigla}>
                          {sigla} - {data.nombre}
                        </option>
                      ))}
                  </optgroup>
                </select>
              </div>
              
              <div className="flex items-center">
                <div className={`px-4 py-3 rounded-lg w-full ${
                  unidadesDetalladas[unidadSeleccionada].tipo === 'metropolitana' ? 'bg-blue-50 text-blue-800 border-l-4 border-blue-500' :
                  unidadesDetalladas[unidadSeleccionada].tipo === 'departamental' ? 'bg-green-50 text-green-800 border-l-4 border-green-500' :
                  'bg-purple-50 text-purple-800 border-l-4 border-purple-500'
                }`}>
                  <div className="font-semibold flex items-center">
                    {unidadesDetalladas[unidadSeleccionada].tipo === 'metropolitana' ? '🏙️ Metropolitana' :
                     unidadesDetalladas[unidadSeleccionada].tipo === 'departamental' ? '🗺️ Departamento' :
                     '🎯 Dirección Nacional'}
                  </div>
                  <div className="text-sm opacity-80">Tipo de unidad operativa</div>
                </div>
              </div>
            </div>

            {/* Tarjeta de información de la unidad */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                {unidadesDetalladas[unidadSeleccionada].nombre} ({unidadSeleccionada})
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                <div className="bg-white rounded-lg p-4 shadow">
                  <p className="text-xs text-gray-500 uppercase mb-1">Total 2021</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {unidadesDetalladas[unidadSeleccionada].serie[0].toLocaleString()}
                  </p>
                </div>
                
                <div className="bg-white rounded-lg p-4 shadow">
                  <p className="text-xs text-gray-500 uppercase mb-1">Total 2024</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {unidadesDetalladas[unidadSeleccionada].serie[3].toLocaleString()}
                  </p>
                </div>

                <div className="bg-white rounded-lg p-4 shadow">
                  <p className="text-xs text-gray-500 uppercase mb-1">Cambio Neto</p>
                  <p className={`text-2xl font-bold ${unidadesDetalladas[unidadSeleccionada].cambioNeto >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {unidadesDetalladas[unidadSeleccionada].cambioNeto >= 0 ? '+' : ''}
                    {unidadesDetalladas[unidadSeleccionada].cambioNeto.toLocaleString()}
                  </p>
                </div>

                <div className="bg-white rounded-lg p-4 shadow">
                  <p className="text-xs text-gray-500 uppercase mb-1">Variación %</p>
                  <p className={`text-2xl font-bold ${unidadesDetalladas[unidadSeleccionada].cambioNeto >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {((unidadesDetalladas[unidadSeleccionada].cambioNeto / unidadesDetalladas[unidadSeleccionada].serie[0]) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>

            {/* Gráfica de línea de tendencia */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-700 mb-3">📊 Tendencia 2021-2024</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={[
                  { año: 2021, funcionarios: unidadesDetalladas[unidadSeleccionada].serie[0] },
                  { año: 2022, funcionarios: unidadesDetalladas[unidadSeleccionada].serie[1] },
                  { año: 2023, funcionarios: unidadesDetalladas[unidadSeleccionada].serie[2] },
                  { año: 2024, funcionarios: unidadesDetalladas[unidadSeleccionada].serie[3] }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="año" />
                  <YAxis tickFormatter={(value) => value.toLocaleString()} />
                  <Tooltip 
                    formatter={(value) => [value.toLocaleString(), 'Funcionarios']}
                    labelFormatter={(label) => `Año ${label}`}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="funcionarios" 
                    stroke="#7c3aed" 
                    strokeWidth={3}
                    dot={{ fill: '#7c3aed', r: 6 }}
                    name="Funcionarios"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* KPIs de años críticos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 rounded-xl p-6 border-l-4 border-blue-500">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-blue-800 text-lg">📈 Año con MÁS Personal</h3>
                  <span className="text-xs bg-blue-200 px-3 py-1 rounded-full font-semibold">
                    Año {unidadesDetalladas[unidadSeleccionada].mayorValor.año}
                  </span>
                </div>
                <p className="text-4xl font-bold text-blue-600">
                  {unidadesDetalladas[unidadSeleccionada].mayorValor.valor.toLocaleString()}
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  Pico máximo en el período 2021-2024
                </p>
              </div>

              <div className="bg-orange-50 rounded-xl p-6 border-l-4 border-orange-500">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-orange-800 text-lg">📉 Año con MENOS Personal</h3>
                  <span className="text-xs bg-orange-200 px-3 py-1 rounded-full font-semibold">
                    Año {unidadesDetalladas[unidadSeleccionada].menorValor.año}
                  </span>
                </div>
                <p className="text-4xl font-bold text-orange-600">
                  {unidadesDetalladas[unidadSeleccionada].menorValor.valor.toLocaleString()}
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  Valle mínimo en el período 2021-2024
                </p>
              </div>
            </div>

            {/* KPIs de variaciones interanuales */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="bg-green-50 rounded-xl p-6 border-l-4 border-green-500">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-green-800 text-lg">✅ Mayor Aumento Interanual</h3>
                  <span className="text-xs bg-green-200 px-3 py-1 rounded-full font-semibold">
                    {unidadesDetalladas[unidadSeleccionada].mayorAumento.año > 0 ? `Año ${unidadesDetalladas[unidadSeleccionada].mayorAumento.año}` : 'Sin aumento'}
                  </span>
                </div>
                <p className="text-4xl font-bold text-green-600">
                  {unidadesDetalladas[unidadSeleccionada].mayorAumento.valor > 0 ? '+' : ''}
                  {unidadesDetalladas[unidadSeleccionada].mayorAumento.valor.toLocaleString()}
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  Mayor crecimiento entre años consecutivos
                </p>
              </div>

              <div className="bg-red-50 rounded-xl p-6 border-l-4 border-red-500">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-red-800 text-lg">⚠️ Mayor Caída Interanual</h3>
                  <span className="text-xs bg-red-200 px-3 py-1 rounded-full font-semibold">
                    Año {unidadesDetalladas[unidadSeleccionada].mayorCaida.año}
                  </span>
                </div>
                <p className="text-4xl font-bold text-red-600">
                  {unidadesDetalladas[unidadSeleccionada].mayorCaida.valor.toLocaleString()}
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  Mayor reducción entre años consecutivos
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Nueva Vista: Direcciones Nacionales CORREGIDA */}
        {vistaActiva === 'direcciones' && (
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              🎯 Análisis de Direcciones Nacionales 2021-2024
            </h2>
            
            {/* Gráfica de líneas para direcciones nacionales */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-700 mb-4">📈 Tendencia de las Direcciones Nacionales</h3>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={datosDireccionesChart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="año" />
                  <YAxis tickFormatter={(value) => value.toLocaleString()} />
                  <Tooltip 
                    formatter={(value) => [value.toLocaleString(), 'Funcionarios']}
                    labelFormatter={(label) => `Año ${label}`}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="DIJIN" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    name="DIJIN - Investigación"
                    dot={{ r: 5 }}
                    activeDot={{ r: 8 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="DIPOL" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    name="DIPOL - Inteligencia"
                    dot={{ r: 5 }}
                    activeDot={{ r: 8 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="DISEC" 
                    stroke="#ef4444" 
                    strokeWidth={3}
                    name="DISEC - Seguridad"
                    dot={{ r: 5 }}
                    activeDot={{ r: 8 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="DICAR" 
                    stroke="#8b5cf6" 
                    strokeWidth={3}
                    name="DICAR - Carabineros"
                    dot={{ r: 5 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Análisis comparativo de direcciones */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-700 mb-4">📊 Comparativa de Direcciones</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {['DIJIN', 'DIPOL', 'DISEC', 'DICAR'].map(sigla => {
                  const data = unidadesDetalladas[sigla];
                  const variacionPorcentaje = ((data.cambioNeto / data.serie[0]) * 100).toFixed(1);
                  
                  return (
                    <div key={sigla} className={`rounded-xl p-4 border-l-4 ${
                      sigla === 'DISEC' ? 'bg-red-50 border-red-500' :
                      sigla === 'DIJIN' ? 'bg-blue-50 border-blue-500' :
                      sigla === 'DIPOL' ? 'bg-green-50 border-green-500' :
                      'bg-purple-50 border-purple-500'
                    }`}>
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-bold text-gray-800">{sigla}</h4>
                          <p className="text-sm text-gray-600">{data.nombre}</p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                          data.cambioNeto >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {data.cambioNeto >= 0 ? '+' : ''}{variacionPorcentaje}%
                        </span>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">2021</span>
                          <span className="font-semibold">{data.serie[0].toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">2024</span>
                          <span className="font-semibold">{data.serie[3].toLocaleString()}</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${data.cambioNeto >= 0 ? 'bg-green-500' : 'bg-red-500'}`}
                            style={{ 
                              width: `${Math.min(100, Math.abs(data.cambioNeto) / 30)}%` 
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Tabla de datos de direcciones nacionales */}
            <div className="mb-8 overflow-x-auto">
              <h3 className="text-lg font-bold text-gray-700 mb-4">📋 Datos Detallados por Año</h3>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dirección</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">2021</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">2022</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">2023</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">2024</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cambio Neto</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Variación %</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {Object.entries(unidadesDetalladas)
                    .filter(([_, data]) => data.tipo === 'direccion')
                    .map(([sigla, data]) => {
                      const cambioNeto = data.cambioNeto;
                      const variacionPorcentaje = ((cambioNeto / data.serie[0]) * 100).toFixed(1);
                      return (
                        <tr key={sigla} className="hover:bg-gray-50">
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="font-medium text-gray-900">{sigla}</div>
                            <div className="text-sm text-gray-500">{data.nombre}</div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{data.serie[0].toLocaleString()}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{data.serie[1].toLocaleString()}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{data.serie[2].toLocaleString()}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{data.serie[3].toLocaleString()}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">
                            <span className={`font-semibold ${cambioNeto >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {cambioNeto >= 0 ? '+' : ''}{cambioNeto.toLocaleString()}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">
                            <span className={`font-semibold ${cambioNeto >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {cambioNeto >= 0 ? '+' : ''}{variacionPorcentaje}%
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>

            {/* Análisis profundo de DISEC */}
            <div className="mt-8 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-6 border-l-4 border-red-500">
              <h3 className="font-bold text-red-800 text-lg mb-4">⚠️ Caso Especial: DISEC - Reestructuración Organizacional</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg shadow">
                  <div className="text-sm text-gray-500">Reducción Total</div>
                  <div className="text-2xl font-bold text-red-600">-2,152</div>
                  <div className="text-xs text-gray-600">Funcionarios (2021-2024)</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                  <div className="text-sm text-gray-500">Porcentaje</div>
                  <div className="text-2xl font-bold text-red-600">-80%</div>
                  <div className="text-xs text-gray-600">Del total inicial</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                  <div className="text-sm text-gray-500">Mayor caída anual</div>
                  <div className="text-2xl font-bold text-red-600">2022→2023</div>
                  <div className="text-xs text-gray-600">-1,462 funcionarios</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                  <div className="text-sm text-gray-500">Estado 2024</div>
                  <div className="text-2xl font-bold text-red-600">538</div>
                  <div className="text-xs text-gray-600">Funcionarios remanentes</div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-4 mb-4">
                <h4 className="font-semibold text-gray-800 mb-2">📋 Interpretación Estratégica:</h4>
                <p className="text-sm text-gray-700">
                  Esta reducción drástica del 80% <strong>no representa una pérdida de capacidad operativa</strong>, sino una 
                  <strong> reestructuración organizacional profunda</strong>. Las funciones de seguridad ciudadana que 
                  tradicionalmente manejaba DISEC han sido transferidas y reorganizadas bajo la nueva 
                  <strong> Jefatura Nacional del Servicio de Policía (JESEP)</strong>, mencionada en el Capítulo VIII 
                  del documento original. Este cambio refleja la modernización del modelo de servicio policial.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">🔍 Contexto Institucional:</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Parte del "Nuevo Modelo del Servicio de Policía"</li>
                    <li>• Centralización de mando y coordinación</li>
                    <li>• Optimización de recursos operativos</li>
                    <li>• Alineación con estándares internacionales</li>
                  </ul>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">🎯 Impacto Operativo:</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Mejora en la coordinación territorial</li>
                    <li>• Estandarización de protocolos</li>
                    <li>• Optimización de la cadena de mando</li>
                    <li>• Fortalecimiento de capacidades especializadas</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer Actualizado */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h3 className="font-bold text-gray-800 mb-4">📚 Fuentes Oficiales:</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>📄 Dirección de Talento Humano en Cifras.pdf (Policía Nacional de Colombia, 2024)</li>
            <li>📊 Tabla 7: Cantidad de policías por 100,000 habitantes (pág. 56)</li>
            <li>📈 Figura 32: Planta de personal por año (pág. 54)</li>
            <li>👥 Figura 33: Personal según categoría (pág. 55)</li>
            <li>🔄 Figura 34: Variación de planta de personal (pág. 56)</li>
            <li>🏛️ Tabla 10: Distribución por unidades operativas (págs. 71-75)</li>
          </ul>
          
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-700">
              <strong>📌 Nota Metodológica:</strong> Todos los datos corresponden al período 2021-2024. 
              Análisis de 23 unidades operativas (11 Metropolitanas, 8 Departamentos, 4 Direcciones Nacionales).
              Fuente primaria: Dirección de Talento Humano, Policía Nacional de Colombia.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}