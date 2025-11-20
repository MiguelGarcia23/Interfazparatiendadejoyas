import { useState } from 'react';
import { Search, Filter, ShoppingCart, Eye } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter } from './ui/card';
import { Badge } from './ui/badge';
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
  stock: number;
  image: string;
  description: string;
}

const products: Product[] = [
  {
    id: 1,
    name: 'Anillo de Diamante Solitario',
    price: 2500,
    category: 'Anillos',
    stock: 5,
    image: 'https://images.unsplash.com/photo-1638382874010-aa4e76fe267d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBqZXdlbHJ5JTIwcmluZ3N8ZW58MXx8fHwxNzYzNTI5OTc5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Elegante anillo con diamante solitario de 1 quilate en oro blanco de 18k'
  },
  {
    id: 2,
    name: 'Collar de Oro con Perlas',
    price: 1800,
    category: 'Collares',
    stock: 8,
    image: 'https://images.unsplash.com/photo-1611012756377-05e2e4269fa3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xkJTIwbmVja2xhY2UlMjBqZXdlbHJ5fGVufDF8fHx8MTc2MzU3NjUxNnww&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Hermoso collar de oro amarillo de 18k con perlas cultivadas'
  },
  {
    id: 3,
    name: 'Aretes de Diamante',
    price: 3200,
    category: 'Aretes',
    stock: 3,
    image: 'https://images.unsplash.com/photo-1588444650733-d0767b753fc8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWFtb25kJTIwZWFycmluZ3N8ZW58MXx8fHwxNzYzNDg1NjI2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Aretes de diamantes con engaste de oro blanco, diseño clásico'
  },
  {
    id: 4,
    name: 'Pulsera de Plata',
    price: 450,
    category: 'Pulseras',
    stock: 12,
    image: 'https://images.unsplash.com/photo-1676291055501-286c48bb186f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaWx2ZXIlMjBicmFjZWxldHxlbnwxfHx8fDE3NjM1MDU2MTd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Pulsera artesanal de plata 925 con detalles entrelazados'
  },
];

export function Ecommerce() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<number[]>([]);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToCart = (productId: number) => {
    setCart([...cart, productId]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl dark:text-white">Catálogo de Productos</h2>
          <p className="text-gray-600 dark:text-gray-400">Gestiona y visualiza tu catálogo de joyas</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">
            <ShoppingCart className="w-4 h-4 mr-1" />
            {cart.length} items
          </Badge>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter className="w-4 h-4 mr-2" />
          Filtros
        </Button>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-square overflow-hidden bg-gray-100">
              <ImageWithFallback
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <CardContent className="p-4">
              <Badge variant="outline" className="mb-2">{product.category}</Badge>
              <h3 className="mb-2">{product.name}</h3>
              <div className="flex items-center justify-between">
                <span className="text-purple-600">${product.price.toLocaleString()}</span>
                <span className="text-sm text-gray-500">Stock: {product.stock}</span>
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0 flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setSelectedProduct(product)}
              >
                <Eye className="w-4 h-4 mr-2" />
                Ver
              </Button>
              <Button
                className="flex-1"
                onClick={() => addToCart(product.id)}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Agregar
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Product Detail Dialog */}
      <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedProduct?.name}</DialogTitle>
            <DialogDescription>{selectedProduct?.category}</DialogDescription>
          </DialogHeader>
          {selectedProduct && (
            <div className="grid grid-cols-2 gap-6">
              <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
                <ImageWithFallback
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Precio</p>
                  <p className="text-2xl text-purple-600">${selectedProduct.price.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Disponibilidad</p>
                  <p>{selectedProduct.stock} unidades en stock</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Descripción</p>
                  <p className="text-gray-700">{selectedProduct.description}</p>
                </div>
                <Button className="w-full" onClick={() => addToCart(selectedProduct.id)}>
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Agregar al Carrito
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}