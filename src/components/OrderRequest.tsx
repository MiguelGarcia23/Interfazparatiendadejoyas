import { useState } from 'react';
import { Plus, Calendar, Trash2, Send } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { Badge } from './ui/badge';

interface OrderItem {
  id: number;
  product: string;
  quantity: number;
  price: number;
}

interface Order {
  id: number;
  supplier: string;
  date: string;
  status: 'Pendiente' | 'Procesando' | 'Enviado' | 'Recibido';
  items: OrderItem[];
  total: number;
}

const mockOrders: Order[] = [
  {
    id: 1,
    supplier: 'DiamondCo',
    date: '2025-11-15',
    status: 'Procesando',
    items: [
      { id: 1, product: 'Diamantes 1ct', quantity: 10, price: 5000 },
    ],
    total: 50000,
  },
  {
    id: 2,
    supplier: 'GoldSupply',
    date: '2025-11-10',
    status: 'Recibido',
    items: [
      { id: 1, product: 'Oro 18k (100g)', quantity: 5, price: 3000 },
    ],
    total: 15000,
  },
];

export function OrderRequest() {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [newOrder, setNewOrder] = useState({
    supplier: '',
    notes: '',
  });
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [currentItem, setCurrentItem] = useState({
    product: '',
    quantity: 0,
    price: 0,
  });

  const addItemToOrder = () => {
    if (currentItem.product && currentItem.quantity > 0 && currentItem.price > 0) {
      setOrderItems([
        ...orderItems,
        {
          id: orderItems.length + 1,
          ...currentItem,
        },
      ]);
      setCurrentItem({ product: '', quantity: 0, price: 0 });
    }
  };

  const removeItemFromOrder = (id: number) => {
    setOrderItems(orderItems.filter(item => item.id !== id));
  };

  const calculateTotal = () => {
    return orderItems.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  };

  const submitOrder = () => {
    if (newOrder.supplier && orderItems.length > 0) {
      const order: Order = {
        id: orders.length + 1,
        supplier: newOrder.supplier,
        date: new Date().toISOString().split('T')[0],
        status: 'Pendiente',
        items: orderItems,
        total: calculateTotal(),
      };
      setOrders([order, ...orders]);
      setIsCreatingOrder(false);
      setNewOrder({ supplier: '', notes: '' });
      setOrderItems([]);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pendiente':
        return 'bg-yellow-100 text-yellow-800';
      case 'Procesando':
        return 'bg-blue-100 text-blue-800';
      case 'Enviado':
        return 'bg-purple-100 text-purple-800';
      case 'Recibido':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl dark:text-white">Gestión de Pedidos</h2>
          <p className="text-gray-600 dark:text-gray-400">Solicita nuevos pedidos a proveedores</p>
        </div>
        <Button onClick={() => setIsCreatingOrder(!isCreatingOrder)}>
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Pedido
        </Button>
      </div>

      {isCreatingOrder && (
        <Card>
          <CardHeader>
            <CardTitle>Crear Nuevo Pedido</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Order Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="supplier">Proveedor</Label>
                <Select
                  value={newOrder.supplier}
                  onValueChange={(value) => setNewOrder({ ...newOrder, supplier: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona proveedor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DiamondCo">DiamondCo</SelectItem>
                    <SelectItem value="GoldSupply">GoldSupply</SelectItem>
                    <SelectItem value="SilverCraft">SilverCraft</SelectItem>
                    <SelectItem value="GemStone Inc">GemStone Inc</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Fecha de Pedido</Label>
                <div className="flex items-center gap-2 px-3 py-2 border rounded-md bg-gray-50">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span>{new Date().toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Add Items */}
            <div className="space-y-4">
              <h3>Agregar Productos</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="product">Producto</Label>
                  <Input
                    id="product"
                    placeholder="Nombre del producto"
                    value={currentItem.product}
                    onChange={(e) => setCurrentItem({ ...currentItem, product: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantity">Cantidad</Label>
                  <Input
                    id="quantity"
                    type="number"
                    placeholder="0"
                    value={currentItem.quantity || ''}
                    onChange={(e) => setCurrentItem({ ...currentItem, quantity: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Precio Unitario</Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="0"
                    value={currentItem.price || ''}
                    onChange={(e) => setCurrentItem({ ...currentItem, price: parseFloat(e.target.value) || 0 })}
                  />
                </div>
              </div>
              <Button variant="outline" onClick={addItemToOrder}>
                <Plus className="w-4 h-4 mr-2" />
                Agregar Item
              </Button>
            </div>

            {/* Items List */}
            {orderItems.length > 0 && (
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Producto</TableHead>
                      <TableHead>Cantidad</TableHead>
                      <TableHead>Precio Unit.</TableHead>
                      <TableHead>Subtotal</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orderItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.product}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>${item.price.toLocaleString()}</TableCell>
                        <TableCell>${(item.quantity * item.price).toLocaleString()}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItemFromOrder(item.id)}
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={3}></TableCell>
                      <TableCell>
                        <p className="text-lg">Total: ${calculateTotal().toLocaleString()}</p>
                      </TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            )}

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Notas Adicionales</Label>
              <Textarea
                id="notes"
                placeholder="Instrucciones especiales, detalles de entrega, etc."
                rows={3}
                value={newOrder.notes}
                onChange={(e) => setNewOrder({ ...newOrder, notes: e.target.value })}
              />
            </div>

            {/* Actions */}
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setIsCreatingOrder(false)}>
                Cancelar
              </Button>
              <Button onClick={submitOrder} disabled={!newOrder.supplier || orderItems.length === 0}>
                <Send className="w-4 h-4 mr-2" />
                Enviar Pedido
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Orders List */}
      <Card>
        <CardHeader>
          <CardTitle>Historial de Pedidos</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Proveedor</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>#{order.id}</TableCell>
                  <TableCell>{order.supplier}</TableCell>
                  <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                  <TableCell>{order.items.length} productos</TableCell>
                  <TableCell>${order.total.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(order.status)} variant="secondary">
                      {order.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}