import { useState } from 'react';
import { AlertTriangle, MessageSquare, Clock, CheckCircle, XCircle, FileText, Filter, Search, User, Store } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';

interface Incident {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  createdAt: string;
  updatedAt: string;
  storeName: string;
  storeEmail: string;
  comments: Comment[];
}

interface Comment {
  id: string;
  text: string;
  author: string;
  isAdmin: boolean;
  timestamp: string;
}

export function AdminIncidentManager() {
  const [selectedIncident, setSelectedIncident] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'all' | 'pending'>('pending');

  const [incidents, setIncidents] = useState<Incident[]>([
    {
      id: 'INC-001',
      title: 'Anillo con defecto de fabricación',
      description:
        'El anillo de oro 18k presenta una irregularidad en el acabado. El cliente lo ha reportado y solicita cambio.',
      category: 'Producto Defectuoso',
      priority: 'high',
      status: 'in-progress',
      createdAt: '2025-12-01 09:30',
      updatedAt: '2025-12-01 14:20',
      storeName: 'Joyería Centro',
      storeEmail: 'store@email.com',
      comments: [
        {
          id: '1',
          text: 'He contactado al proveedor, están revisando el caso.',
          author: 'Joyería Centro',
          isAdmin: false,
          timestamp: '2025-12-01 10:15',
        },
        {
          id: '2',
          text: 'Hemos recibido tu reporte. Estamos coordinando el reemplazo del producto.',
          author: 'Admin - Departamento de Calidad',
          isAdmin: true,
          timestamp: '2025-12-01 14:20',
        },
      ],
    },
    {
      id: 'INC-002',
      title: 'Retraso en entrega de pedido #PED-005',
      description: 'El pedido solicitado hace 2 semanas aún no ha llegado a la tienda.',
      category: 'Problema de Entrega',
      priority: 'medium',
      status: 'open',
      createdAt: '2025-11-30 16:45',
      updatedAt: '2025-11-30 16:45',
      storeName: 'Joyería Plaza',
      storeEmail: 'plazastore@email.com',
      comments: [],
    },
    {
      id: 'INC-003',
      title: 'Discrepancia en factura de compra',
      description:
        'La factura del mes pasado muestra un cargo adicional que no corresponde a nuestros pedidos.',
      category: 'Error en Facturación',
      priority: 'medium',
      status: 'resolved',
      createdAt: '2025-11-28 11:20',
      updatedAt: '2025-11-29 15:30',
      storeName: 'Joyería Centro',
      storeEmail: 'store@email.com',
      comments: [
        {
          id: '2',
          text: 'Se ha corregido el error y se emitirá nota de crédito.',
          author: 'Admin - Departamento de Contabilidad',
          isAdmin: true,
          timestamp: '2025-11-29 15:30',
        },
      ],
    },
    {
      id: 'INC-004',
      title: 'Sistema de punto de venta presenta errores',
      description: 'El sistema se cierra inesperadamente al procesar pagos con tarjeta.',
      category: 'Sistema/Tecnología',
      priority: 'high',
      status: 'open',
      createdAt: '2025-12-01 08:00',
      updatedAt: '2025-12-01 08:00',
      storeName: 'Joyería Norte',
      storeEmail: 'nortestore@email.com',
      comments: [],
    },
    {
      id: 'INC-005',
      title: 'Cliente insatisfecho con atención',
      description: 'Un cliente reportó mala atención por parte de un empleado. Solicito capacitación.',
      category: 'Atención al Cliente',
      priority: 'low',
      status: 'closed',
      createdAt: '2025-11-25 14:30',
      updatedAt: '2025-11-27 10:00',
      storeName: 'Joyería Plaza',
      storeEmail: 'plazastore@email.com',
      comments: [
        {
          id: '3',
          text: 'Hemos programado una sesión de capacitación en atención al cliente para el próximo mes.',
          author: 'Admin - Recursos Humanos',
          isAdmin: true,
          timestamp: '2025-11-27 10:00',
        },
      ],
    },
  ]);

  const handleAddComment = (incidentId: string) => {
    if (!newComment.trim()) return;

    setIncidents(
      incidents.map((incident) => {
        if (incident.id === incidentId) {
          const comment: Comment = {
            id: Date.now().toString(),
            text: newComment,
            author: 'Admin - Soporte',
            isAdmin: true,
            timestamp: new Date().toLocaleString(),
          };
          return {
            ...incident,
            comments: [...incident.comments, comment],
            updatedAt: new Date().toLocaleString(),
          };
        }
        return incident;
      })
    );

    setNewComment('');
  };

  const handleUpdateStatus = (incidentId: string, newStatus: Incident['status']) => {
    setIncidents(
      incidents.map((incident) => {
        if (incident.id === incidentId) {
          const comment: Comment = {
            id: Date.now().toString(),
            text: `Estado cambiado a: ${getStatusLabel(newStatus)}`,
            author: 'Sistema',
            isAdmin: true,
            timestamp: new Date().toLocaleString(),
          };
          return {
            ...incident,
            status: newStatus,
            comments: [...incident.comments, comment],
            updatedAt: new Date().toLocaleString(),
          };
        }
        return incident;
      })
    );
  };

  const handleUpdatePriority = (incidentId: string, newPriority: Incident['priority']) => {
    setIncidents(
      incidents.map((incident) => {
        if (incident.id === incidentId) {
          const comment: Comment = {
            id: Date.now().toString(),
            text: `Prioridad cambiada a: ${getPriorityLabel(newPriority)}`,
            author: 'Sistema',
            isAdmin: true,
            timestamp: new Date().toLocaleString(),
          };
          return {
            ...incident,
            priority: newPriority,
            comments: [...incident.comments, comment],
            updatedAt: new Date().toLocaleString(),
          };
        }
        return incident;
      })
    );
  };

  const filteredIncidents = incidents.filter((incident) => {
    const matchesSearch =
      incident.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.storeName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || incident.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || incident.priority === filterPriority;
    const matchesViewMode =
      viewMode === 'all' ||
      (viewMode === 'pending' && (incident.status === 'open' || incident.status === 'in-progress'));

    return matchesSearch && matchesStatus && matchesPriority && matchesViewMode;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300';
      case 'medium':
        return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300';
      case 'low':
        return 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300';
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300';
      case 'in-progress':
        return 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300';
      case 'resolved':
        return 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300';
      case 'closed':
        return 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300';
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'open':
        return 'Abierta';
      case 'in-progress':
        return 'En Progreso';
      case 'resolved':
        return 'Resuelta';
      case 'closed':
        return 'Cerrada';
      default:
        return status;
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'Alta';
      case 'medium':
        return 'Media';
      case 'low':
        return 'Baja';
      default:
        return priority;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <Clock className="w-4 h-4" />;
      case 'in-progress':
        return <AlertTriangle className="w-4 h-4" />;
      case 'resolved':
        return <CheckCircle className="w-4 h-4" />;
      case 'closed':
        return <XCircle className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const selectedIncidentData = incidents.find((inc) => inc.id === selectedIncident);

  const stats = {
    total: incidents.length,
    open: incidents.filter((inc) => inc.status === 'open').length,
    inProgress: incidents.filter((inc) => inc.status === 'in-progress').length,
    resolved: incidents.filter((inc) => inc.status === 'resolved').length,
    highPriority: incidents.filter((inc) => inc.priority === 'high').length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl dark:text-white">Gestión de Incidencias</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Gestiona y responde incidencias reportadas por las tiendas asociadas
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <FileText className="w-5 h-5 text-purple-600 dark:text-purple-300" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
              <p className="text-xl">{stats.total}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Clock className="w-5 h-5 text-blue-600 dark:text-blue-300" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Abiertas</p>
              <p className="text-xl">{stats.open}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-purple-600 dark:text-purple-300" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">En Progreso</p>
              <p className="text-xl">{stats.inProgress}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-300" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Resueltas</p>
              <p className="text-xl">{stats.resolved}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-300" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Alta Prioridad</p>
              <p className="text-xl">{stats.highPriority}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* View Mode Toggle */}
      <div className="flex gap-2">
        <Button
          variant={viewMode === 'pending' ? 'default' : 'outline'}
          onClick={() => setViewMode('pending')}
        >
          Pendientes ({stats.open + stats.inProgress})
        </Button>
        <Button
          variant={viewMode === 'all' ? 'default' : 'outline'}
          onClick={() => setViewMode('all')}
        >
          Todas las Incidencias
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label className="flex items-center gap-2 mb-2">
              <Search className="w-4 h-4" />
              Buscar
            </Label>
            <Input
              placeholder="Buscar por ID, título o tienda..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <Label className="flex items-center gap-2 mb-2">
              <Filter className="w-4 h-4" />
              Estado
            </Label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="all">Todos los estados</option>
              <option value="open">Abierta</option>
              <option value="in-progress">En Progreso</option>
              <option value="resolved">Resuelta</option>
              <option value="closed">Cerrada</option>
            </select>
          </div>
          <div>
            <Label className="flex items-center gap-2 mb-2">
              <Filter className="w-4 h-4" />
              Prioridad
            </Label>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="all">Todas las prioridades</option>
              <option value="high">Alta</option>
              <option value="medium">Media</option>
              <option value="low">Baja</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Incidents List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {filteredIncidents.length === 0 ? (
            <Card className="p-12 text-center">
              <AlertTriangle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                No se encontraron incidencias con los filtros seleccionados
              </p>
            </Card>
          ) : (
            filteredIncidents.map((incident) => (
              <Card
                key={incident.id}
                className={`p-6 cursor-pointer transition-all ${
                  selectedIncident === incident.id
                    ? 'border-2 border-purple-600 shadow-lg'
                    : 'hover:shadow-md'
                }`}
                onClick={() => setSelectedIncident(incident.id)}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-medium">{incident.title}</h3>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {incident.id}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                      {incident.description}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Store className="w-4 h-4" />
                      <span>{incident.storeName}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  <span
                    className={`px-2 py-1 rounded text-xs flex items-center gap-1 ${getStatusColor(
                      incident.status
                    )}`}
                  >
                    {getStatusIcon(incident.status)}
                    {getStatusLabel(incident.status)}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs ${getPriorityColor(incident.priority)}`}>
                    Prioridad {getPriorityLabel(incident.priority)}
                  </span>
                  <span className="px-2 py-1 rounded text-xs bg-gray-100 dark:bg-gray-800">
                    {incident.category}
                  </span>
                </div>

                <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                  <span>Creada: {incident.createdAt}</span>
                  {incident.comments.length > 0 && (
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-3 h-3" />
                      {incident.comments.length} comentarios
                    </span>
                  )}
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Incident Details */}
        <div>
          {selectedIncidentData ? (
            <Card className="p-6 sticky top-24">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">{selectedIncidentData.title}</h3>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span
                      className={`px-2 py-1 rounded text-xs flex items-center gap-1 ${getStatusColor(
                        selectedIncidentData.status
                      )}`}
                    >
                      {getStatusIcon(selectedIncidentData.status)}
                      {getStatusLabel(selectedIncidentData.status)}
                    </span>
                    <span
                      className={`px-2 py-1 rounded text-xs ${getPriorityColor(
                        selectedIncidentData.priority
                      )}`}
                    >
                      {getPriorityLabel(selectedIncidentData.priority)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {selectedIncidentData.description}
                  </p>
                  <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm space-y-1">
                    <div className="flex items-center gap-2">
                      <Store className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">{selectedIncidentData.storeName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600 dark:text-gray-400">
                        {selectedIncidentData.storeEmail}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="border-t dark:border-gray-700 pt-4">
                  <h4 className="text-sm font-medium mb-2">Cambiar Estado</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant={selectedIncidentData.status === 'open' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleUpdateStatus(selectedIncidentData.id, 'open')}
                    >
                      Abierta
                    </Button>
                    <Button
                      variant={selectedIncidentData.status === 'in-progress' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleUpdateStatus(selectedIncidentData.id, 'in-progress')}
                    >
                      En Progreso
                    </Button>
                    <Button
                      variant={selectedIncidentData.status === 'resolved' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleUpdateStatus(selectedIncidentData.id, 'resolved')}
                    >
                      Resuelta
                    </Button>
                    <Button
                      variant={selectedIncidentData.status === 'closed' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleUpdateStatus(selectedIncidentData.id, 'closed')}
                    >
                      Cerrada
                    </Button>
                  </div>
                </div>

                <div className="border-t dark:border-gray-700 pt-4">
                  <h4 className="text-sm font-medium mb-2">Cambiar Prioridad</h4>
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      variant={selectedIncidentData.priority === 'low' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleUpdatePriority(selectedIncidentData.id, 'low')}
                    >
                      Baja
                    </Button>
                    <Button
                      variant={selectedIncidentData.priority === 'medium' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleUpdatePriority(selectedIncidentData.id, 'medium')}
                    >
                      Media
                    </Button>
                    <Button
                      variant={selectedIncidentData.priority === 'high' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleUpdatePriority(selectedIncidentData.id, 'high')}
                    >
                      Alta
                    </Button>
                  </div>
                </div>

                <div className="border-t dark:border-gray-700 pt-4">
                  <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Comunicación ({selectedIncidentData.comments.length})
                  </h4>
                  <div className="space-y-3 mb-3 max-h-60 overflow-y-auto">
                    {selectedIncidentData.comments.map((comment) => (
                      <div
                        key={comment.id}
                        className={`p-3 rounded-lg text-sm ${
                          comment.isAdmin
                            ? 'bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800'
                            : 'bg-gray-50 dark:bg-gray-800'
                        }`}
                      >
                        <p className="mb-1">{comment.text}</p>
                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                          <span className="font-medium">{comment.author}</span>
                          <span>{comment.timestamp}</span>
                        </div>
                      </div>
                    ))}
                    {selectedIncidentData.comments.length === 0 && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                        No hay comentarios aún
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Textarea
                      placeholder="Escribe una respuesta a la tienda..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      rows={3}
                    />
                    <Button
                      className="w-full"
                      onClick={() => handleAddComment(selectedIncidentData.id)}
                      disabled={!newComment.trim()}
                    >
                      Enviar Respuesta
                    </Button>
                  </div>
                </div>

                <div className="border-t dark:border-gray-700 pt-4 text-xs text-gray-500 dark:text-gray-400">
                  <p>Creada: {selectedIncidentData.createdAt}</p>
                  <p>Actualizada: {selectedIncidentData.updatedAt}</p>
                  <p>Categoría: {selectedIncidentData.category}</p>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="p-12 text-center sticky top-24">
              <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                Selecciona una incidencia para ver los detalles y gestionar
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
