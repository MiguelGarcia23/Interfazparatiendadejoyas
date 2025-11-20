import { useState } from 'react';
import { Instagram, Facebook, Twitter, Download, Plus } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';

interface Template {
  id: number;
  name: string;
  platform: string;
  size: string;
  bgColor: string;
}

const templates: Template[] = [
  { id: 1, name: 'Historia Instagram', platform: 'Instagram', size: '1080x1920', bgColor: 'from-purple-400 to-pink-400' },
  { id: 2, name: 'Post Instagram', platform: 'Instagram', size: '1080x1080', bgColor: 'from-blue-400 to-purple-400' },
  { id: 3, name: 'Post Facebook', platform: 'Facebook', size: '1200x630', bgColor: 'from-green-400 to-blue-400' },
  { id: 4, name: 'Tweet con Imagen', platform: 'Twitter', size: '1200x675', bgColor: 'from-cyan-400 to-blue-400' },
];

export function SocialMediaCreator() {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [caption, setCaption] = useState('');
  const [title, setTitle] = useState('');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl dark:text-white">Creador de Contenido para Redes Sociales</h2>
        <p className="text-gray-600 dark:text-gray-400">Crea publicaciones atractivas para tus redes sociales</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Preview Area */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3>Vista Previa</h3>
              <Button size="sm">
                <Download className="w-4 h-4 mr-2" />
                Descargar
              </Button>
            </div>

            <div className="bg-gray-100 rounded-lg p-8 min-h-[500px] flex items-center justify-center">
              {selectedTemplate ? (
                <div className={`w-full max-w-md bg-gradient-to-br ${selectedTemplate.bgColor} rounded-lg shadow-xl p-8 text-white`}>
                  <div className="space-y-4">
                    {title && <h2 className="text-3xl">{title}</h2>}
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-white/30 rounded-full"></div>
                        <div>
                          <p>Nicole Albagli</p>
                          <p className="text-sm opacity-80">{selectedTemplate.platform}</p>
                        </div>
                      </div>
                      <p className="text-sm">{caption || 'Escribe tu descripción aquí...'}</p>
                    </div>
                    <div className="flex gap-2 justify-end">
                      <Badge variant="secondary">{selectedTemplate.size}</Badge>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500">
                  <Plus className="w-16 h-16 mx-auto mb-4" />
                  <p>Selecciona una plantilla para comenzar</p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Controls Panel */}
        <div className="space-y-4">
          <Card className="p-6">
            <h3 className="mb-4">Plantillas</h3>
            <div className="space-y-2">
              {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => setSelectedTemplate(template)}
                  className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                    selectedTemplate?.id === template.id
                      ? 'border-purple-600 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {template.platform === 'Instagram' && <Instagram className="w-4 h-4" />}
                    {template.platform === 'Facebook' && <Facebook className="w-4 h-4" />}
                    {template.platform === 'Twitter' && <Twitter className="w-4 h-4" />}
                    <div>
                      <p className="text-sm">{template.name}</p>
                      <p className="text-xs text-gray-500">{template.size}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <Tabs defaultValue="content">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="content">Contenido</TabsTrigger>
                <TabsTrigger value="design">Diseño</TabsTrigger>
              </TabsList>
              <TabsContent value="content" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título</Label>
                  <Input
                    id="title"
                    placeholder="Título de la publicación"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="caption">Descripción</Label>
                  <Textarea
                    id="caption"
                    placeholder="Escribe tu descripción..."
                    rows={6}
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                  />
                  <p className="text-xs text-gray-500">{caption.length} caracteres</p>
                </div>
              </TabsContent>
              <TabsContent value="design" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Colores de Fondo</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="h-12 rounded-lg bg-gradient-to-br from-purple-400 to-pink-400 cursor-pointer border-2 border-purple-600"></div>
                    <div className="h-12 rounded-lg bg-gradient-to-br from-blue-400 to-purple-400 cursor-pointer border-2 border-transparent hover:border-gray-400"></div>
                    <div className="h-12 rounded-lg bg-gradient-to-br from-green-400 to-blue-400 cursor-pointer border-2 border-transparent hover:border-gray-400"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Elementos</Label>
                  <Button variant="outline" className="w-full justify-start">
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Imagen
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Texto
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  );
}