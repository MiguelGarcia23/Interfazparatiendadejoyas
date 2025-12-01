import { useState } from 'react';
import { 
  Users, 
  ShoppingBag, 
  TrendingUp, 
  DollarSign,
  Package,
  Star,
  Calendar,
  Eye
} from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

// Mock data - En producción esto vendría de la base de datos
const salesData = [
  { mes: 'Ene', ventas: 45000, clientes: 120 },
  { mes: 'Feb', ventas: 52000, clientes: 145 },
  { mes: 'Mar', ventas: 48000, clientes: 135 },
  { mes: 'Abr', ventas: 61000, clientes: 165 },
  { mes: 'May', ventas: 55000, clientes: 150 },
  { mes: 'Jun', ventas: 67000, clientes: 180 },
  { mes: 'Jul', ventas: 72000, clientes: 195 },
  { mes: 'Ago', ventas: 69000, clientes: 185 },
  { mes: 'Sep', ventas: 78000, clientes: 210 },
  { mes: 'Oct', ventas: 84000, clientes: 225 },
  { mes: 'Nov', ventas: 91000, clientes: 245 },
  { mes: 'Dic', ventas: 105000, clientes: 280 },
];

const categoryData = [
  { nombre: 'Anillos', valor: 35 },
  { nombre: 'Collares', valor: 25 },
  { nombre: 'Aretes', valor: 20 },
  { nombre: 'Pulseras', valor: 15 },
  { nombre: 'Otros', valor: 5 },
];

const topProducts = [
  { id: 1, nombre: 'Anillo de Compromiso Diamante', ventas: 145, ingresos: 725000 },
  { id: 2, nombre: 'Collar Oro Blanco Perlas', ventas: 132, ingresos: 528000 },
  { id: 3, nombre: 'Aretes Esmeralda', ventas: 128, ingresos: 512000 },
  { id: 4, nombre: 'Pulsera Plata 925', ventas: 115, ingresos: 345000 },
  { id: 5, nombre: 'Anillo Oro Rosa', ventas: 98, ingresos: 392000 },
];

const customerSegments = [
  { segmento: 'VIP', cantidad: 45, porcentaje: 15 },
  { segmento: 'Frecuente', cantidad: 98, porcentaje: 32 },
  { segmento: 'Ocasional', cantidad: 127, porcentaje: 42 },
  { segmento: 'Nuevo', cantidad: 35, porcentaje: 11 },
];

const COLORS = ['#9333ea', '#ec4899', '#f59e0b', '#10b981', '#6366f1'];

export function AdminStatistics() {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');

  const statsCards = [
    {
      title: 'Total Clientes',
      value: '2,845',
      change: '+12.5%',
      icon: Users,
      color: 'purple',
      description: 'vs. mes anterior'
    },
    {
      title: 'Ventas Totales',
      value: '$105,000',
      change: '+18.2%',
      icon: DollarSign,
      color: 'green',
      description: 'vs. mes anterior'
    },
    {
      title: 'Productos Vendidos',
      value: '1,248',
      change: '+8.4%',
      icon: ShoppingBag,
      color: 'blue',
      description: 'vs. mes anterior'
    },
    {
      title: 'Productos en Stock',
      value: '458',
      change: '-3.2%',
      icon: Package,
      color: 'orange',
      description: 'vs. mes anterior'
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl dark:text-white">Estadísticas y Análisis</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Panel de control con métricas clave del negocio
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={timeRange === 'week' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeRange('week')}
          >
            Semana
          </Button>
          <Button
            variant={timeRange === 'month' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeRange('month')}
          >
            Mes
          </Button>
          <Button
            variant={timeRange === 'year' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeRange('year')}
          >
            Año
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          const isPositive = stat.change.startsWith('+');
          
          return (
            <Card key={index} className="p-6 dark:bg-gray-800 dark:border-gray-700">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{stat.title}</p>
                  <p className="text-2xl mt-2 dark:text-white">{stat.value}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <TrendingUp 
                      className={`w-4 h-4 ${
                        isPositive ? 'text-green-600' : 'text-red-600'
                      }`} 
                    />
                    <span 
                      className={`text-sm ${
                        isPositive ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {stat.change}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-500">
                      {stat.description}
                    </span>
                  </div>
                </div>
                <div className={`p-3 rounded-lg bg-${stat.color}-100 dark:bg-${stat.color}-900/20`}>
                  <Icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Charts Section */}
      <Tabs defaultValue="ventas" className="space-y-4">
        <TabsList className="dark:bg-gray-800">
          <TabsTrigger value="ventas">Ventas</TabsTrigger>
          <TabsTrigger value="clientes">Clientes</TabsTrigger>
          <TabsTrigger value="productos">Productos</TabsTrigger>
        </TabsList>

        <TabsContent value="ventas" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Ventas Mensuales */}
            <Card className="p-6 dark:bg-gray-800 dark:border-gray-700">
              <h3 className="text-lg mb-4 dark:text-white">Ventas Mensuales</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="mes" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1f2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px'
                    }}
                    labelStyle={{ color: '#f3f4f6' }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="ventas" 
                    stroke="#9333ea" 
                    strokeWidth={2}
                    name="Ventas ($)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            {/* Distribución por Categoría */}
            <Card className="p-6 dark:bg-gray-800 dark:border-gray-700">
              <h3 className="text-lg mb-4 dark:text-white">Distribución por Categoría</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ nombre, valor }) => `${nombre} (${valor}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="valor"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1f2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Top Productos */}
          <Card className="p-6 dark:bg-gray-800 dark:border-gray-700">
            <h3 className="text-lg mb-4 dark:text-white">Productos Más Vendidos</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400">Producto</th>
                    <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400">Ventas</th>
                    <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400">Ingresos</th>
                    <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400">Tendencia</th>
                  </tr>
                </thead>
                <tbody>
                  {topProducts.map((product, index) => (
                    <tr 
                      key={product.id} 
                      className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/20">
                            <span className="text-sm text-purple-600 dark:text-purple-400">#{index + 1}</span>
                          </div>
                          <span className="dark:text-gray-200">{product.nombre}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 dark:text-gray-300">{product.ventas}</td>
                      <td className="py-3 px-4 dark:text-gray-300">
                        ${product.ingresos.toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1 text-green-600">
                          <TrendingUp className="w-4 h-4" />
                          <span className="text-sm">+{(Math.random() * 20).toFixed(1)}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="clientes" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Crecimiento de Clientes */}
            <Card className="p-6 dark:bg-gray-800 dark:border-gray-700">
              <h3 className="text-lg mb-4 dark:text-white">Crecimiento de Clientes</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="mes" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1f2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px'
                    }}
                    labelStyle={{ color: '#f3f4f6' }}
                  />
                  <Legend />
                  <Bar dataKey="clientes" fill="#ec4899" name="Nuevos Clientes" />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* Segmentación de Clientes */}
            <Card className="p-6 dark:bg-gray-800 dark:border-gray-700">
              <h3 className="text-lg mb-4 dark:text-white">Segmentación de Clientes</h3>
              <div className="space-y-4 mt-6">
                {customerSegments.map((segment, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm dark:text-gray-300">{segment.segmento}</span>
                      <span className="text-sm dark:text-gray-400">
                        {segment.cantidad} ({segment.porcentaje}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all"
                        style={{ 
                          width: `${segment.porcentaje}%`,
                          backgroundColor: COLORS[index]
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Métricas de Clientes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-6 dark:bg-gray-800 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-2">
                <Star className="w-5 h-5 text-yellow-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Clientes VIP</span>
              </div>
              <p className="text-2xl dark:text-white">45</p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                Compras promedio: $15,000
              </p>
            </Card>

            <Card className="p-6 dark:bg-gray-800 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-2">
                <Calendar className="w-5 h-5 text-blue-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Tasa de Retención</span>
              </div>
              <p className="text-2xl dark:text-white">78.5%</p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                +5.2% vs. mes anterior
              </p>
            </Card>

            <Card className="p-6 dark:bg-gray-800 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-2">
                <Eye className="w-5 h-5 text-purple-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Valor Promedio</span>
              </div>
              <p className="text-2xl dark:text-white">$3,850</p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                Por transacción
              </p>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="productos" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Rendimiento por Categoría */}
            <Card className="p-6 dark:bg-gray-800 dark:border-gray-700">
              <h3 className="text-lg mb-4 dark:text-white">Rendimiento por Categoría</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart 
                  data={categoryData}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis type="number" stroke="#9ca3af" />
                  <YAxis dataKey="nombre" type="category" stroke="#9ca3af" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1f2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px'
                    }}
                    labelStyle={{ color: '#f3f4f6' }}
                  />
                  <Bar dataKey="valor" fill="#9333ea" name="Participación (%)" />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* Inventario */}
            <Card className="p-6 dark:bg-gray-800 dark:border-gray-700">
              <h3 className="text-lg mb-4 dark:text-white">Estado del Inventario</h3>
              <div className="space-y-4 mt-6">
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-green-800 dark:text-green-300">Stock Saludable</span>
                    <span className="text-sm text-green-900 dark:text-green-200">342 productos</span>
                  </div>
                </div>
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-yellow-800 dark:text-yellow-300">Stock Bajo</span>
                    <span className="text-sm text-yellow-900 dark:text-yellow-200">89 productos</span>
                  </div>
                </div>
                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-red-800 dark:text-red-300">Sin Stock</span>
                    <span className="text-sm text-red-900 dark:text-red-200">27 productos</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Métricas de Productos */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-6 dark:bg-gray-800 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Productos</p>
              <p className="text-2xl mt-2 dark:text-white">458</p>
              <p className="text-sm text-green-600 mt-1">+12 este mes</p>
            </Card>

            <Card className="p-6 dark:bg-gray-800 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400">Valor del Inventario</p>
              <p className="text-2xl mt-2 dark:text-white">$1.2M</p>
              <p className="text-sm text-blue-600 mt-1">Total acumulado</p>
            </Card>

            <Card className="p-6 dark:bg-gray-800 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400">Rotación Promedio</p>
              <p className="text-2xl mt-2 dark:text-white">45 días</p>
              <p className="text-sm text-purple-600 mt-1">-5 días vs. anterior</p>
            </Card>

            <Card className="p-6 dark:bg-gray-800 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400">Tasa de Conversión</p>
              <p className="text-2xl mt-2 dark:text-white">12.8%</p>
              <p className="text-sm text-green-600 mt-1">+2.3% vs. anterior</p>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
