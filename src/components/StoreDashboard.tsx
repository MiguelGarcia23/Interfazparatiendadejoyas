import { useState } from 'react';
import { ShoppingCart, DollarSign, AlertTriangle, LogOut, Moon, Sun, Package } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { useTheme } from '../contexts/ThemeContext';
import { StoreProductRequest } from './StoreProductRequest';
import { StoreSales } from './StoreSales';
import { StoreIncidents } from './StoreIncidents';

interface StoreDashboardProps {
  onLogout: () => void;
}

type ActiveView = 'overview' | 'request' | 'sales' | 'incidents';

export function StoreDashboard({ onLogout }: StoreDashboardProps) {
  const [activeView, setActiveView] = useState<ActiveView>('overview');
  const { theme, toggleTheme } = useTheme();

  const menuItems = [
    { id: 'request' as ActiveView, label: 'Solicitar Productos', icon: Package },
    { id: 'sales' as ActiveView, label: 'Vender Producto', icon: DollarSign },
    { id: 'incidents' as ActiveView, label: 'Reportar Incidencia', icon: AlertTriangle },
  ];

  const renderContent = () => {
    switch (activeView) {
      case 'request':
        return <StoreProductRequest />;
      case 'sales':
        return <StoreSales />;
      case 'incidents':
        return <StoreIncidents />;
      default:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl dark:text-white">Panel de Tienda</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Gestiona tu tienda y ventas de joyería Nicole Albagli
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <Package className="w-6 h-6 text-blue-600 dark:text-blue-300" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Productos en Stock</p>
                    <p className="text-2xl">124</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                    <DollarSign className="w-6 h-6 text-green-600 dark:text-green-300" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Ventas del Mes</p>
                    <p className="text-2xl">$48,750</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-lg">
                    <AlertTriangle className="w-6 h-6 text-orange-600 dark:text-orange-300" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Incidencias Abiertas</p>
                    <p className="text-2xl">3</p>
                  </div>
                </div>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="mb-4">Acciones Rápidas</h3>
                <div className="space-y-3">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Button
                        key={item.id}
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => setActiveView(item.id)}
                      >
                        <Icon className="w-4 h-4 mr-2" />
                        {item.label}
                      </Button>
                    );
                  })}
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="mb-4">Últimas Ventas</h3>
                <div className="space-y-3">
                  {[
                    { id: 1, product: 'Anillo de Oro 18k', price: '$1,250', date: 'Hace 2 horas' },
                    { id: 2, product: 'Collar de Plata', price: '$680', date: 'Hace 5 horas' },
                    { id: 3, product: 'Aretes de Diamante', price: '$2,100', date: 'Hace 1 día' },
                  ].map((sale) => (
                    <div
                      key={sale.id}
                      className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      <div>
                        <p className="text-sm">{sale.product}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{sale.date}</p>
                      </div>
                      <p className="font-medium text-green-600 dark:text-green-400">
                        {sale.price}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            <Card className="p-6">
              <h3 className="mb-4">Productos Pendientes de Entrega</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b dark:border-gray-700">
                      <th className="text-left p-3">Pedido #</th>
                      <th className="text-left p-3">Productos</th>
                      <th className="text-left p-3">Cantidad</th>
                      <th className="text-left p-3">Estado</th>
                      <th className="text-left p-3">Fecha Estimada</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b dark:border-gray-800">
                      <td className="p-3">#PED-001</td>
                      <td className="p-3">Anillos Variados</td>
                      <td className="p-3">15 unidades</td>
                      <td className="p-3">
                        <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 rounded text-sm">
                          En Proceso
                        </span>
                      </td>
                      <td className="p-3">15 Dic 2025</td>
                    </tr>
                    <tr className="border-b dark:border-gray-800">
                      <td className="p-3">#PED-002</td>
                      <td className="p-3">Collares de Plata</td>
                      <td className="p-3">8 unidades</td>
                      <td className="p-3">
                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded text-sm">
                          Enviado
                        </span>
                      </td>
                      <td className="p-3">10 Dic 2025</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <ShoppingCart className="w-8 h-8 text-purple-600" />
              <div>
                <h1 className="text-2xl dark:text-white">Nicole Albagli</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">Portal de Tienda</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="rounded-full"
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </Button>
              <Button variant="outline" onClick={onLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 overflow-x-auto">
            <button
              onClick={() => setActiveView('overview')}
              className={`px-4 py-3 text-sm whitespace-nowrap border-b-2 transition-colors ${
                activeView === 'overview'
                  ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              Vista General
            </button>
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  className={`px-4 py-3 text-sm whitespace-nowrap border-b-2 transition-colors flex items-center gap-2 ${
                    activeView === item.id
                      ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                      : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>
    </div>
  );
}
