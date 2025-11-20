import { useState } from 'react';
import { Plus, Search, Edit, Trash2, Package } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

interface InventoryItem {
  id: number;
  name: string;
  sku: string;
  category: string;
  quantity: number;
  price: number;
  supplier: string;
  status: 'En Stock' | 'Bajo Stock' | 'Agotado';
}

const initialInventory: InventoryItem[] = [
  { id: 1, name: 'Anillo de Diamante Solitario', sku: 'ANL-001', category: 'Anillos', quantity: 5, price: 2500, supplier: 'DiamondCo', status: 'Bajo Stock' },
  { id: 2, name: 'Collar de Oro con Perlas', sku: 'COL-002', category: 'Collares', quantity: 8, price: 1800, supplier: 'GoldSupply', status: 'En Stock' },
  { id: 3, name: 'Aretes de Diamante', sku: 'ART-003', category: 'Aretes', quantity: 3, price: 3200, supplier: 'DiamondCo', status: 'Bajo Stock' },
  { id: 4, name: 'Pulsera de Plata', sku: 'PUL-004', category: 'Pulseras', quantity: 12, price: 450, supplier: 'SilverCraft', status: 'En Stock' },
  { id: 5, name: 'Anillo de Esmeralda', sku: 'ANL-005', category: 'Anillos', quantity: 0, price: 3500, supplier: 'GemStone Inc', status: 'Agotado' },
];

export function InventoryManager() {
  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    sku: '',
    category: '',
    quantity: 0,
    price: 0,
    supplier: '',
  });

  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddItem = () => {
    const status: 'En Stock' | 'Bajo Stock' | 'Agotado' = 
      newItem.quantity === 0 ? 'Agotado' : 
      newItem.quantity < 5 ? 'Bajo Stock' : 'En Stock';

    setInventory([
      ...inventory,
      {
        id: inventory.length + 1,
        ...newItem,
        status,
      }
    ]);
    setIsAddDialogOpen(false);
    setNewItem({
      name: '',
      sku: '',
      category: '',
      quantity: 0,
      price: 0,
      supplier: '',
    });
  };

  const handleDeleteItem = (id: number) => {
    setInventory(inventory.filter(item => item.id !== id));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'En Stock':
        return 'bg-green-100 text-green-800';
      case 'Bajo Stock':
        return 'bg-yellow-100 text-yellow-800';
      case 'Agotado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl dark:text-white">Gestión de Inventario</h2>
          <p className="text-gray-600 dark:text-gray-400">Administra el stock de tus productos</p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Agregar Producto
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Productos</p>
              <p className="text-2xl">{inventory.length}</p>
            </div>
            <Package className="w-8 h-8 text-purple-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">En Stock</p>
              <p className="text-2xl text-green-600">
                {inventory.filter(i => i.status === 'En Stock').length}
              </p>
            </div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Bajo Stock</p>
              <p className="text-2xl text-yellow-600">
                {inventory.filter(i => i.status === 'Bajo Stock').length}
              </p>
            </div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Agotado</p>
              <p className="text-2xl text-red-600">
                {inventory.filter(i => i.status === 'Agotado').length}
              </p>
            </div>
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          </div>
        </Card>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Buscar por nombre, SKU o categoría..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Inventory Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>SKU</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Cantidad</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead>Proveedor</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInventory.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.sku}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>${item.price.toLocaleString()}</TableCell>
                <TableCell>{item.supplier}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(item.status)} variant="secondary">
                    {item.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteItem(item.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Add Item Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar Nuevo Producto</DialogTitle>
            <DialogDescription>
              Ingresa los detalles del nuevo producto al inventario
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="sku">SKU</Label>
              <Input
                id="sku"
                value={newItem.sku}
                onChange={(e) => setNewItem({ ...newItem, sku: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category">Categoría</Label>
              <Select
                value={newItem.category}
                onValueChange={(value) => setNewItem({ ...newItem, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Anillos">Anillos</SelectItem>
                  <SelectItem value="Collares">Collares</SelectItem>
                  <SelectItem value="Aretes">Aretes</SelectItem>
                  <SelectItem value="Pulseras">Pulseras</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="quantity">Cantidad</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={newItem.quantity}
                  onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="price">Precio</Label>
                <Input
                  id="price"
                  type="number"
                  value={newItem.price}
                  onChange={(e) => setNewItem({ ...newItem, price: parseFloat(e.target.value) || 0 })}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="supplier">Proveedor</Label>
              <Input
                id="supplier"
                value={newItem.supplier}
                onChange={(e) => setNewItem({ ...newItem, supplier: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddItem}>Agregar Producto</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}