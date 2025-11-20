import { useState } from 'react';
import { ArrowLeft, Trash2, CreditCard, ShoppingBag } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { ImageWithFallback } from './figma/ImageWithFallback';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
}

const products: Product[] = [
  {
    id: 1,
    name: 'Anillo de Diamante Solitario',
    price: 2500,
    category: 'Anillos',
    image: 'https://images.unsplash.com/photo-1638382874010-aa4e76fe267d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBqZXdlbHJ5JTIwcmluZ3N8ZW58MXx8fHwxNzYzNTI5OTc5fDA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: 2,
    name: 'Collar de Oro con Perlas',
    price: 1800,
    category: 'Collares',
    image: 'https://images.unsplash.com/photo-1611012756377-05e2e4269fa3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xkJTIwbmVja2xhY2UlMjBqZXdlbHJ5fGVufDF8fHx8MTc2MzU3NjUxNnww&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: 3,
    name: 'Aretes de Diamante',
    price: 3200,
    category: 'Aretes',
    image: 'https://images.unsplash.com/photo-1588444650733-d0767b753fc8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWFtb25kJTIwZWFycmluZ3N8ZW58MXx8fHwxNzYzNDg1NjI2fDA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: 4,
    name: 'Pulsera de Plata',
    price: 450,
    category: 'Pulseras',
    image: 'https://images.unsplash.com/photo-1676291055501-286c48bb186f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaWx2ZXIlMjBicmFjZWxldHxlbnwxfHx8fDE3NjM1MDU2MTd8MA&ixlib=rb-4.1.0&q=80&w=1080',
  },
];

interface CartCheckoutProps {
  cartItems: number[];
  onRemoveItem: (index: number) => void;
  onClearCart: () => void;
  onBackToShop: () => void;
}

export function CartCheckout({ cartItems, onRemoveItem, onClearCart, onBackToShop }: CartCheckoutProps) {
  const [showCheckout, setShowCheckout] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  const cartProducts = cartItems.map(id => products.find(p => p.id === id)!);
  const subtotal = cartProducts.reduce((sum, product) => sum + product.price, 0);
  const shipping = cartItems.length > 0 ? 50 : 0;
  const tax = subtotal * 0.19; // 19% IVA
  const total = subtotal + shipping + tax;

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    setOrderComplete(true);
    setTimeout(() => {
      onClearCart();
      setOrderComplete(false);
      setShowCheckout(false);
      onBackToShop();
    }, 3000);
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <Button variant="ghost" onClick={onBackToShop} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a la tienda
        </Button>
        <Card className="p-12 text-center">
          <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="mb-2">Tu carrito está vacío</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Agrega algunos productos para comenzar tu compra
          </p>
          <Button onClick={onBackToShop}>Explorar Catálogo</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <Button variant="ghost" onClick={onBackToShop} className="mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Continuar Comprando
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Carrito de Compras ({cartItems.length} items)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cartProducts.map((product, index) => (
                <div key={index} className="flex gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    <ImageWithFallback
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4>{product.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{product.category}</p>
                    <p className="text-purple-600 dark:text-purple-400 mt-1">
                      ${product.price.toLocaleString()}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemoveItem(index)}
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Resumen del Pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                  <span>${subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Envío</span>
                  <span>${shipping.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">IVA (19%)</span>
                  <span>${tax.toLocaleString()}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span>Total</span>
                  <span className="text-purple-600 dark:text-purple-400">${total.toLocaleString()}</span>
                </div>
              </div>
              <Button className="w-full" onClick={() => setShowCheckout(true)}>
                <CreditCard className="w-4 h-4 mr-2" />
                Proceder al Pago
              </Button>
              <Button variant="outline" className="w-full" onClick={onClearCart}>
                Vaciar Carrito
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Checkout Dialog */}
      <Dialog open={showCheckout} onOpenChange={setShowCheckout}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Finalizar Compra</DialogTitle>
            <DialogDescription>Completa tus datos para realizar el pedido</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCheckout} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre Completo</Label>
              <Input id="name" placeholder="Juan Pérez" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="juan@email.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono</Label>
              <Input id="phone" type="tel" placeholder="+56 9 1234 5678" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Dirección de Envío</Label>
              <Input id="address" placeholder="Calle Principal 123" required />
            </div>
            <Separator />
            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Total a Pagar</p>
              <p className="text-2xl text-purple-600 dark:text-purple-400">${total.toLocaleString()}</p>
            </div>
            <Button type="submit" className="w-full">
              Confirmar Pedido
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Order Complete Dialog */}
      <Dialog open={orderComplete} onOpenChange={setOrderComplete}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">¡Pedido Realizado!</DialogTitle>
          </DialogHeader>
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              Tu pedido ha sido procesado exitosamente
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              Recibirás un email de confirmación pronto
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
