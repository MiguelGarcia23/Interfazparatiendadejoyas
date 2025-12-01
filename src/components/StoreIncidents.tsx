import { useState } from 'react';
import { AlertTriangle, Plus, MessageSquare, Clock, CheckCircle, XCircle, FileText } from 'lucide-react';
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
  comments: Comment[];
}

interface Comment {
  id: string;
  text: string;
  author: string;
  timestamp: string;
}

export function StoreIncidents() {
  const [activeTab, setActiveTab] = useState<'new' | 'list'>('list');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [selectedIncident, setSelectedIncident] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');

  const categories = [
    'Producto Defectuoso',
    'Problema de Entrega',
    'Error en Facturación',
    'Robo/Pérdida',
    'Sistema/Tecnología',
    'Atención al Cliente',
    'Otro',
  ];

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
      comments: [
        {
          id: '1',
          text: 'He contactado al proveedor, están revisando el caso.',
          author: 'Sistema',
          timestamp: '2025-12-01 10:15',
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
      comments: [
        {
          id: '2',
          text: 'Se ha corregido el error y se emitirá nota de crédito.',
          author: 'Departamento de Contabilidad',
          timestamp: '2025-11-29 15:30',
        },
      ],
    },
  ]);

  const handleSubmitIncident = () => {
    if (!title || !description || !category) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }

    const newIncident: Incident = {
      id: `INC-${String(incidents.length + 1).padStart(3, '0')}`,
      title,
      description,
      category,
      priority,
      status: 'open',
      createdAt: new Date().toLocaleString(),
      updatedAt: new Date().toLocaleString(),
      comments: [],
    };

    setIncidents([newIncident, ...incidents]);
    alert(`Incidencia ${newIncident.id} reportada exitosamente!\n\nRecibirás actualizaciones sobre su estado.`);

    // Reset form
    setTitle('');
    setDescription('');
    setCategory('');
    setPriority('medium');
    setActiveTab('list');
  };

  const handleAddComment = (incidentId: string) => {
    if (!newComment) return;

    setIncidents(
      incidents.map((incident) => {
        if (incident.id === incidentId) {
          const comment: Comment = {
            id: Date.now().toString(),
            text: newComment,
            author: 'Tu Tienda',
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl dark:text-white">Reportar Incidencia</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Gestiona y reporta problemas relacionados con tu tienda
          </p>
        </div>
        {activeTab === 'list' && (
          <Button onClick={() => setActiveTab('new')}>
            <Plus className="w-4 h-4 mr-2" />
            Nueva Incidencia
          </Button>
        )}
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Clock className="w-5 h-5 text-blue-600 dark:text-blue-300" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Abiertas</p>
              <p className="text-xl">
                {incidents.filter((inc) => inc.status === 'open').length}
              </p>
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
              <p className="text-xl">
                {incidents.filter((inc) => inc.status === 'in-progress').length}
              </p>
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
              <p className="text-xl">
                {incidents.filter((inc) => inc.status === 'resolved').length}
              </p>
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
              <p className="text-xl">
                {incidents.filter((inc) => inc.priority === 'high').length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {activeTab === 'new' ? (
        /* New Incident Form */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="p-6">
              <h3 className="mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Nueva Incidencia
              </h3>
              <div className="space-y-4">
                <div>
                  <Label>Título de la Incidencia *</Label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Breve descripción del problema"
                  />
                </div>

                <div>
                  <Label>Categoría *</Label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                  >
                    <option value="">Selecciona una categoría...</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label>Prioridad</Label>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    <button
                      onClick={() => setPriority('low')}
                      className={`p-3 border rounded-lg transition-colors ${
                        priority === 'low'
                          ? 'border-green-600 bg-green-50 dark:bg-green-900/20'
                          : 'border-gray-300 dark:border-gray-600'
                      }`}
                    >
                      Baja
                    </button>
                    <button
                      onClick={() => setPriority('medium')}
                      className={`p-3 border rounded-lg transition-colors ${
                        priority === 'medium'
                          ? 'border-yellow-600 bg-yellow-50 dark:bg-yellow-900/20'
                          : 'border-gray-300 dark:border-gray-600'
                      }`}
                    >
                      Media
                    </button>
                    <button
                      onClick={() => setPriority('high')}
                      className={`p-3 border rounded-lg transition-colors ${
                        priority === 'high'
                          ? 'border-red-600 bg-red-50 dark:bg-red-900/20'
                          : 'border-gray-300 dark:border-gray-600'
                      }`}
                    >
                      Alta
                    </button>
                  </div>
                </div>

                <div>
                  <Label>Descripción Detallada *</Label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe el problema con el mayor detalle posible..."
                    rows={6}
                  />
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleSubmitIncident} className="flex-1">
                    <Plus className="w-4 h-4 mr-2" />
                    Reportar Incidencia
                  </Button>
                  <Button variant="outline" onClick={() => setActiveTab('list')}>
                    Cancelar
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          <div>
            <Card className="p-6">
              <h3 className="mb-4">Consejos</h3>
              <div className="space-y-3 text-sm">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-blue-800 dark:text-blue-300">
                    Proporciona la mayor cantidad de detalles posible para resolver tu incidencia más rápido.
                  </p>
                </div>
                <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <p className="text-purple-800 dark:text-purple-300">
                    Si tienes evidencia (fotos, documentos), adjúntalos en los comentarios.
                  </p>
                </div>
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p className="text-green-800 dark:text-green-300">
                    Recibirás notificaciones sobre el progreso de tu incidencia.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      ) : (
        /* Incidents List */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {incidents.length === 0 ? (
              <Card className="p-12 text-center">
                <AlertTriangle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  No hay incidencias reportadas
                </p>
                <Button className="mt-4" onClick={() => setActiveTab('new')}>
                  Reportar Primera Incidencia
                </Button>
              </Card>
            ) : (
              incidents.map((incident) => (
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
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {incident.description}
                      </p>
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
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedIncidentData.description}
                    </p>
                  </div>

                  <div className="border-t dark:border-gray-700 pt-4">
                    <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      Comentarios ({selectedIncidentData.comments.length})
                    </h4>
                    <div className="space-y-3 mb-3 max-h-60 overflow-y-auto">
                      {selectedIncidentData.comments.map((comment) => (
                        <div
                          key={comment.id}
                          className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm"
                        >
                          <p className="mb-1">{comment.text}</p>
                          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                            <span>{comment.author}</span>
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
                    <div className="flex gap-2">
                      <Input
                        placeholder="Agregar comentario..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                      />
                      <Button
                        size="sm"
                        onClick={() => handleAddComment(selectedIncidentData.id)}
                        disabled={!newComment}
                      >
                        Enviar
                      </Button>
                    </div>
                  </div>

                  <div className="border-t dark:border-gray-700 pt-4 text-xs text-gray-500 dark:text-gray-400">
                    <p>Creada: {selectedIncidentData.createdAt}</p>
                    <p>Actualizada: {selectedIncidentData.updatedAt}</p>
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="p-12 text-center">
                <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  Selecciona una incidencia para ver los detalles
                </p>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
