import { useState } from 'react';
import { Package, Plus, Minus, ShoppingCart, Search, Filter } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  image: string;
}

interface CartItem extends Product {
  quantity: number;
}

export function StoreProductRequest() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [notes, setNotes] = useState('');
  const [showCart, setShowCart] = useState(false);

  const categories = ['Todos', 'Anillos', 'Collares', 'Aretes', 'Pulseras', 'Relojes'];

  const products: Product[] = [
    {
      id: '1',
      name: 'Anillo de Oro 18k con Diamante',
      category: 'Anillos',
      price: 1250,
      stock: 15,
      image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=300&h=300&fit=crop',
    },
    {
      id: '2',
      name: 'Collar de Plata con Zafiro',
      category: 'Collares',
      price: 680,
      stock: 22,
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=300&h=300&fit=crop',
    },
    {
      id: '3',
      name: 'Aretes de Diamante',
      category: 'Aretes',
      price: 2100,
      stock: 8,
      image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=300&h=300&fit=crop',
    },
    {
      id: '4',
      name: 'Pulsera de Oro Blanco',
      category: 'Pulseras',
      price: 890,
      stock: 12,
      image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=300&h=300&fit=crop',
    },
    {
      id: '5',
      name: 'Reloj de Lujo para Mujer',
      category: 'Relojes',
      price: 3500,
      stock: 5,
      image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=300&h=300&fit=crop',
    },
    {
      id: '6',
      name: 'Anillo de Compromiso',
      category: 'Anillos',
      price: 4200,
      stock: 6,
      image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300&h=300&fit=crop',
    },
    {
      id: '7',
      name: 'Collar de Perlas',
      category: 'Collares',
      price: 1150,
      stock: 18,
      image: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=300&h=300&fit=crop',
    },
    {
      id: '8',
      name: 'Aretes de Esmeralda',
      category: 'Aretes',
      price: 1800,
      stock: 10,
      image: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=300&h=300&fit=crop',
    },
  ];

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || product.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const addToCart = (product: Product) => {
    const existingItem = cart.find((item) => item.id === product.id);
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity === 0) {
      removeFromCart(productId);
    } else {
      setCart(
        cart.map((item) =>
          item.id === productId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleSubmitRequest = () => {
    if (cart.length === 0) {
      alert('Por favor, agrega productos a tu solicitud');
      return;
    }
    
    alert(`Solicitud enviada exitosamente!\n\nProductos: ${getTotalItems()}\nTotal: $${getTotalPrice().toLocaleString()}\n\nRecibirás una confirmación pronto.`);
    setCart([]);
    setNotes('');
    setShowCart(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl dark:text-white">Solicitar Productos</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Selecciona los productos que necesitas para tu tienda
          </p>
        </div>
        <Button onClick={() => setShowCart(!showCart)} className="relative">
          <ShoppingCart className="w-4 h-4 mr-2" />
          Carrito ({getTotalItems()})
          {cart.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {getTotalItems()}
            </span>
          )}
        </Button>
      </div>

      {showCart && (
        <Card className="p-6 border-2 border-purple-200 dark:border-purple-800">
          <h3 className="mb-4 flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Carrito de Solicitud
          </h3>
          {cart.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">
              No hay productos en el carrito
            </p>
          ) : (
            <>
              <div className="space-y-3 mb-4">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        ${item.price.toLocaleString()} c/u
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="w-12 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="font-medium w-24 text-right">
                      ${(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t dark:border-gray-700 pt-4 space-y-4">
                <div>
                  <Label>Notas adicionales (opcional)</Label>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Agrega cualquier nota o instrucción especial para tu solicitud..."
                    rows={3}
                  />
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Total de productos: {getTotalItems()}
                    </p>
                    <p className="text-2xl">
                      Total: ${getTotalPrice().toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setCart([])}>
                      Limpiar Carrito
                    </Button>
                    <Button onClick={handleSubmitRequest}>
                      Enviar Solicitud
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </Card>
      )}

      {/* Filters */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="flex items-center gap-2 mb-2">
              <Search className="w-4 h-4" />
              Buscar Producto
            </Label>
            <Input
              placeholder="Buscar por nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <Label className="flex items-center gap-2 mb-2">
              <Filter className="w-4 h-4" />
              Categoría
            </Label>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={
                    selectedCategory === (category === 'Todos' ? 'all' : category.toLowerCase())
                      ? 'default'
                      : 'outline'
                  }
                  size="sm"
                  onClick={() =>
                    setSelectedCategory(category === 'Todos' ? 'all' : category.toLowerCase())
                  }
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => {
          const inCart = cart.find((item) => item.id === product.id);
          return (
            <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4 space-y-3">
                <div>
                  <p className="text-xs text-purple-600 dark:text-purple-400">
                    {product.category}
                  </p>
                  <h3 className="font-medium">{product.name}</h3>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-xl">${product.price.toLocaleString()}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Stock: {product.stock}
                  </p>
                </div>
                <Button
                  className="w-full"
                  onClick={() => addToCart(product)}
                  variant={inCart ? 'outline' : 'default'}
                >
                  {inCart ? (
                    <>
                      <Package className="w-4 h-4 mr-2" />
                      En Carrito ({inCart.quantity})
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Agregar al Carrito
                    </>
                  )}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">
            No se encontraron productos que coincidan con tu búsqueda
          </p>
        </div>
      )}
    </div>
  );
}
