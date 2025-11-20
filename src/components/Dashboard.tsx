import { useState } from 'react';
import { 
  ShoppingCart, 
  Image, 
  Share2, 
  Package, 
  ShoppingBag, 
  LogOut,
  Gem,
  Moon,
  Sun
} from 'lucide-react';
import { Button } from './ui/button';
import { AdminEcommerce } from './AdminEcommerce';
import { MediaEditor } from './MediaEditor';
import { SocialMediaCreator } from './SocialMediaCreator';
import { InventoryManager } from './InventoryManager';
import { OrderRequest } from './OrderRequest';
import { useTheme } from '../contexts/ThemeContext';

interface DashboardProps {
  onLogout: () => void;
}

type ActiveModule = 'ecommerce' | 'media-editor' | 'social-media' | 'inventory' | 'orders';

export function Dashboard({ onLogout }: DashboardProps) {
  const [activeModule, setActiveModule] = useState<ActiveModule>('ecommerce');
  const { theme, toggleTheme } = useTheme();

  const modules = [
    { id: 'ecommerce' as const, name: 'E-Commerce', icon: ShoppingCart },
    { id: 'media-editor' as const, name: 'Editor Multimedia', icon: Image },
    { id: 'social-media' as const, name: 'Redes Sociales', icon: Share2 },
    { id: 'inventory' as const, name: 'Inventario', icon: Package },
    { id: 'orders' as const, name: 'Pedidos', icon: ShoppingBag },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl">
                <Gem className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl dark:text-white">Nicole Albagli</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">Sistema de Gestión</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={toggleTheme}>
                {theme === 'light' ? (
                  <Moon className="w-4 h-4" />
                ) : (
                  <Sun className="w-4 h-4" />
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

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 min-h-[calc(100vh-73px)] sticky top-[73px]">
          <nav className="p-4 space-y-2">
            {modules.map((module) => {
              const Icon = module.icon;
              return (
                <button
                  key={module.id}
                  onClick={() => setActiveModule(module.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeModule === module.id
                      ? 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{module.name}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {activeModule === 'ecommerce' && <AdminEcommerce />}
          {activeModule === 'media-editor' && <MediaEditor />}
          {activeModule === 'social-media' && <SocialMediaCreator />}
          {activeModule === 'inventory' && <InventoryManager />}
          {activeModule === 'orders' && <OrderRequest />}
        </main>
      </div>
    </div>
  );
}