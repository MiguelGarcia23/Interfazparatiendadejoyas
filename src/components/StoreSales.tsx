import { useState } from 'react';
import { DollarSign, ShoppingBag, User, CreditCard, Printer, Receipt, Calendar } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';

interface SaleItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

interface Sale {
  id: string;
  date: string;
  customerName: string;
  items: SaleItem[];
  total: number;
  paymentMethod: string;
  status: 'completed' | 'pending';
}

export function StoreSales() {
  const [activeTab, setActiveTab] = useState<'new' | 'history'>('new');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [notes, setNotes] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [saleItems, setSaleItems] = useState<SaleItem[]>([]);

  const products = [
    { id: '1', name: 'Anillo de Oro 18k con Diamante', price: 1250 },
    { id: '2', name: 'Collar de Plata con Zafiro', price: 680 },
    { id: '3', name: 'Aretes de Diamante', price: 2100 },
    { id: '4', name: 'Pulsera de Oro Blanco', price: 890 },
    { id: '5', name: 'Reloj de Lujo para Mujer', price: 3500 },
    { id: '6', name: 'Anillo de Compromiso', price: 4200 },
    { id: '7', name: 'Collar de Perlas', price: 1150 },
    { id: '8', name: 'Aretes de Esmeralda', price: 1800 },
  ];

  const salesHistory: Sale[] = [
    {
      id: 'SALE-001',
      date: '2025-12-01 14:30',
      customerName: 'María González',
      items: [
        { id: '1', productId: '1', productName: 'Anillo de Oro 18k con Diamante', quantity: 1, price: 1250 },
      ],
      total: 1250,
      paymentMethod: 'Tarjeta de Crédito',
      status: 'completed',
    },
    {
      id: 'SALE-002',
      date: '2025-12-01 10:15',
      customerName: 'Carlos Ruiz',
      items: [
        { id: '2', productId: '2', productName: 'Collar de Plata con Zafiro', quantity: 1, price: 680 },
        { id: '3', productId: '3', productName: 'Aretes de Diamante', quantity: 1, price: 2100 },
      ],
      total: 2780,
      paymentMethod: 'Efectivo',
      status: 'completed',
    },
    {
      id: 'SALE-003',
      date: '2025-11-30 16:45',
      customerName: 'Ana Martínez',
      items: [
        { id: '4', productId: '5', productName: 'Reloj de Lujo para Mujer', quantity: 1, price: 3500 },
      ],
      total: 3500,
      paymentMethod: 'Transferencia',
      status: 'completed',
    },
  ];

  const addItemToSale = () => {
    if (!selectedProduct) {
      alert('Por favor selecciona un producto');
      return;
    }

    const product = products.find((p) => p.id === selectedProduct);
    if (!product) return;

    const existingItem = saleItems.find((item) => item.productId === selectedProduct);
    if (existingItem) {
      setSaleItems(
        saleItems.map((item) =>
          item.productId === selectedProduct
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      );
    } else {
      const newItem: SaleItem = {
        id: Date.now().toString(),
        productId: product.id,
        productName: product.name,
        quantity,
        price: product.price,
      };
      setSaleItems([...saleItems, newItem]);
    }

    setSelectedProduct('');
    setQuantity(1);
  };

  const removeItem = (itemId: string) => {
    setSaleItems(saleItems.filter((item) => item.id !== itemId));
  };

  const getTotal = () => {
    return saleItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleCompleteSale = () => {
    if (saleItems.length === 0) {
      alert('Por favor agrega productos a la venta');
      return;
    }

    if (!customerName) {
      alert('Por favor ingresa el nombre del cliente');
      return;
    }

    alert(
      `Venta completada exitosamente!\n\nCliente: ${customerName}\nTotal: $${getTotal().toLocaleString()}\nMétodo de pago: ${
        paymentMethod === 'cash' ? 'Efectivo' : paymentMethod === 'card' ? 'Tarjeta' : 'Transferencia'
      }\n\nSe ha generado el recibo.`
    );

    // Reset form
    setCustomerName('');
    setCustomerEmail('');
    setCustomerPhone('');
    setPaymentMethod('cash');
    setNotes('');
    setSaleItems([]);
  };

  const printReceipt = (sale: Sale) => {
    alert(`Imprimiendo recibo de venta ${sale.id}...`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl dark:text-white">Vender Producto</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Registra ventas en tu tienda y genera recibos
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b dark:border-gray-700">
        <button
          onClick={() => setActiveTab('new')}
          className={`px-4 py-2 border-b-2 transition-colors ${
            activeTab === 'new'
              ? 'border-purple-600 text-purple-600 dark:text-purple-400'
              : 'border-transparent text-gray-600 dark:text-gray-400'
          }`}
        >
          Nueva Venta
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2 border-b-2 transition-colors ${
            activeTab === 'history'
              ? 'border-purple-600 text-purple-600 dark:text-purple-400'
              : 'border-transparent text-gray-600 dark:text-gray-400'
          }`}
        >
          Historial de Ventas
        </button>
      </div>

      {activeTab === 'new' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sale Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <h3 className="mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                Información del Cliente
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Nombre del Cliente *</Label>
                  <Input
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Nombre completo"
                  />
                </div>
                <div>
                  <Label>Teléfono</Label>
                  <Input
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="(000) 000-0000"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label>Correo Electrónico</Label>
                  <Input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="cliente@email.com"
                  />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="mb-4 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" />
                Productos
              </h3>
              
              {/* Add Product */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="md:col-span-2">
                  <Label>Seleccionar Producto</Label>
                  <select
                    value={selectedProduct}
                    onChange={(e) => setSelectedProduct(e.target.value)}
                    className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                  >
                    <option value="">Selecciona un producto...</option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name} - ${product.price.toLocaleString()}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label>Cantidad</Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    />
                    <Button onClick={addItemToSale}>Agregar</Button>
                  </div>
                </div>
              </div>

              {/* Sale Items */}
              {saleItems.length === 0 ? (
                <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                  No hay productos agregados a la venta
                </p>
              ) : (
                <div className="space-y-2">
                  {saleItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium">{item.productName}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          ${item.price.toLocaleString()} × {item.quantity}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <p className="font-medium">
                          ${(item.price * item.quantity).toLocaleString()}
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                        >
                          Eliminar
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            <Card className="p-6">
              <h3 className="mb-4">Notas Adicionales</h3>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Agrega notas sobre la venta (opcional)..."
                rows={3}
              />
            </Card>
          </div>

          {/* Summary */}
          <div className="space-y-6">
            <Card className="p-6 sticky top-24">
              <h3 className="mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Resumen de Venta
              </h3>

              <div className="space-y-4">
                <div>
                  <Label>Método de Pago</Label>
                  <div className="grid grid-cols-1 gap-2 mt-2">
                    <button
                      onClick={() => setPaymentMethod('cash')}
                      className={`p-3 border rounded-lg text-left transition-colors ${
                        paymentMethod === 'cash'
                          ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20'
                          : 'border-gray-300 dark:border-gray-600'
                      }`}
                    >
                      <DollarSign className="w-4 h-4 inline mr-2" />
                      Efectivo
                    </button>
                    <button
                      onClick={() => setPaymentMethod('card')}
                      className={`p-3 border rounded-lg text-left transition-colors ${
                        paymentMethod === 'card'
                          ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20'
                          : 'border-gray-300 dark:border-gray-600'
                      }`}
                    >
                      <CreditCard className="w-4 h-4 inline mr-2" />
                      Tarjeta
                    </button>
                    <button
                      onClick={() => setPaymentMethod('transfer')}
                      className={`p-3 border rounded-lg text-left transition-colors ${
                        paymentMethod === 'transfer'
                          ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20'
                          : 'border-gray-300 dark:border-gray-600'
                      }`}
                    >
                      <Receipt className="w-4 h-4 inline mr-2" />
                      Transferencia
                    </button>
                  </div>
                </div>

                <div className="border-t dark:border-gray-700 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                    <span>${getTotal().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Impuestos (0%)</span>
                    <span>$0</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t dark:border-gray-700">
                    <span className="font-medium">Total</span>
                    <span className="text-2xl font-medium text-purple-600 dark:text-purple-400">
                      ${getTotal().toLocaleString()}
                    </span>
                  </div>
                </div>

                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleCompleteSale}
                  disabled={saleItems.length === 0}
                >
                  <Receipt className="w-4 h-4 mr-2" />
                  Completar Venta
                </Button>
              </div>
            </Card>
          </div>
        </div>
      ) : (
        /* Sales History */
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {salesHistory.length} ventas registradas
            </p>
            <Button variant="outline">
              <Calendar className="w-4 h-4 mr-2" />
              Filtrar por Fecha
            </Button>
          </div>

          {salesHistory.map((sale) => (
            <Card key={sale.id} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-medium">Venta {sale.id}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{sale.date}</p>
                  <p className="text-sm mt-1">Cliente: {sale.customerName}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-medium text-green-600 dark:text-green-400">
                    ${sale.total.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{sale.paymentMethod}</p>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                {sale.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between text-sm p-2 bg-gray-50 dark:bg-gray-800 rounded"
                  >
                    <span>
                      {item.productName} × {item.quantity}
                    </span>
                    <span>${(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => printReceipt(sale)}>
                  <Printer className="w-4 h-4 mr-2" />
                  Imprimir Recibo
                </Button>
                <Button variant="outline" size="sm">
                  Ver Detalles
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
