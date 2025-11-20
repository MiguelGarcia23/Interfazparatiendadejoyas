import { useState } from 'react';
import { ShoppingCart, LogOut, Gem, Moon, Sun } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ClientEcommerce } from './ClientEcommerce';
import { CartCheckout } from './CartCheckout';
import { useTheme } from '../contexts/ThemeContext';

interface ClientDashboardProps {
  onLogout: () => void;
  userName?: string;
}

export function ClientDashboard({ onLogout, userName = 'Cliente' }: ClientDashboardProps) {
  const [showCart, setShowCart] = useState(false);
  const [cartItems, setCartItems] = useState<number[]>([]);
  const { theme, toggleTheme } = useTheme();

  const handleAddToCart = (productId: number) => {
    setCartItems([...cartItems, productId]);
  };

  const handleRemoveFromCart = (index: number) => {
    setCartItems(cartItems.filter((_, i) => i !== index));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

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
                <p className="text-sm text-gray-600 dark:text-gray-400">Joyería Exclusiva</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={showCart ? "default" : "outline"}
                onClick={() => setShowCart(!showCart)}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Carrito
                {cartItems.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {cartItems.length}
                  </Badge>
                )}
              </Button>
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

      {/* Main Content */}
      <main className="p-6">
        {showCart ? (
          <CartCheckout
            cartItems={cartItems}
            onRemoveItem={handleRemoveFromCart}
            onClearCart={handleClearCart}
            onBackToShop={() => setShowCart(false)}
          />
        ) : (
          <ClientEcommerce onAddToCart={handleAddToCart} />
        )}
      </main>
    </div>
  );
}
