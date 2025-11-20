import { useState, useRef, useEffect } from 'react';
import { Upload, Download, RotateCw, Crop, Sliders, Image as ImageIcon, Video, Play, Pause, SkipBack, SkipForward, Plus, Trash2, Type, Subtitles, FileImage, X } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Label } from './ui/label';
import { Slider } from './ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';

type MediaType = 'image' | 'video' | null;
type EffectType = 'none' | 'grayscale' | 'sepia' | 'vintage' | 'vibrant';

interface TextOverlay {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  color: string;
  startTime: number;
  endTime: number;
}

interface ImageOverlay {
  id: string;
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
  startTime: number;
  endTime: number;
}

interface Subtitle {
  id: string;
  text: string;
  startTime: number;
  endTime: number;
}

export function MediaEditor() {
  const [mediaType, setMediaType] = useState<MediaType>(null);
  const [image, setImage] = useState<string | null>(null);
  const [video, setVideo] = useState<string | null>(null);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [currentEffect, setCurrentEffect] = useState<EffectType>('none');
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoSpeed, setVideoSpeed] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(0);
  
  // Overlays
  const [textOverlays, setTextOverlays] = useState<TextOverlay[]>([]);
  const [imageOverlays, setImageOverlays] = useState<ImageOverlay[]>([]);
  const [subtitles, setSubtitles] = useState<Subtitle[]>([]);
  
  // UI State
  const [selectedTab, setSelectedTab] = useState('adjust');
  const [newText, setNewText] = useState('');
  const [newTextColor, setNewTextColor] = useState('#ffffff');
  const [newTextSize, setNewTextSize] = useState(32);
  const [newSubtitleText, setNewSubtitleText] = useState('');
  const [newSubtitleStart, setNewSubtitleStart] = useState(0);
  const [newSubtitleEnd, setNewSubtitleEnd] = useState(2);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageOverlayInputRef = useRef<HTMLInputElement>(null);
  const gifInputRef = useRef<HTMLInputElement>(null);
  const animationFrameRef = useRef<number>();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      const isVideo = file.type.startsWith('video/');
      
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (isVideo) {
          setVideo(result);
          setImage(null);
          setMediaType('video');
        } else {
          setImage(result);
          setVideo(null);
          setMediaType('image');
        }
        resetFilters();
      };
      reader.readAsDataURL(file);
    }
  };

  const getFilterString = () => {
    let filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;
    
    switch (currentEffect) {
      case 'grayscale':
        filter += ' grayscale(100%)';
        break;
      case 'sepia':
        filter += ' sepia(100%)';
        break;
      case 'vintage':
        filter += ' sepia(50%) contrast(110%) brightness(90%)';
        break;
      case 'vibrant':
        filter += ' saturate(150%) contrast(110%)';
        break;
    }
    
    return filter;
  };

  const drawOverlays = (ctx: CanvasRenderingContext2D, time: number) => {
    // Draw text overlays
    textOverlays.forEach(overlay => {
      if (time >= overlay.startTime && time <= overlay.endTime) {
        ctx.save();
        ctx.font = `${overlay.fontSize}px Arial`;
        ctx.fillStyle = overlay.color;
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.strokeText(overlay.text, overlay.x, overlay.y);
        ctx.fillText(overlay.text, overlay.x, overlay.y);
        ctx.restore();
      }
    });

    // Draw image overlays
    imageOverlays.forEach(overlay => {
      if (time >= overlay.startTime && time <= overlay.endTime) {
        const img = new Image();
        img.src = overlay.src;
        ctx.drawImage(img, overlay.x, overlay.y, overlay.width, overlay.height);
      }
    });

    // Draw subtitles
    const activeSubtitle = subtitles.find(sub => time >= sub.startTime && time <= sub.endTime);
    if (activeSubtitle) {
      ctx.save();
      ctx.font = '24px Arial';
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 3;
      ctx.textAlign = 'center';
      const x = ctx.canvas.width / 2;
      const y = ctx.canvas.height - 50;
      ctx.strokeText(activeSubtitle.text, x, y);
      ctx.fillText(activeSubtitle.text, x, y);
      ctx.restore();
    }
  };

  const applyImageFilters = () => {
    if (!image || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      const isRotated90 = rotation === 90 || rotation === 270;
      canvas.width = isRotated90 ? img.height : img.width;
      canvas.height = isRotated90 ? img.width : img.height;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();

      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.translate(-img.width / 2, -img.height / 2);

      ctx.filter = getFilterString();
      ctx.drawImage(img, 0, 0);
      ctx.restore();

      // Draw overlays for images
      drawOverlays(ctx, 0);
    };
    img.src = image;
  };

  const applyVideoFilters = () => {
    if (!video || !videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const videoElement = videoRef.current;
    
    if (!ctx) return;

    const renderFrame = () => {
      if (!videoElement.paused && !videoElement.ended) {
        const time = videoElement.currentTime;
        
        // Check if within trim range
        if (time < trimStart || (trimEnd > 0 && time > trimEnd)) {
          if (time < trimStart) {
            videoElement.currentTime = trimStart;
          } else if (trimEnd > 0 && time > trimEnd) {
            videoElement.pause();
            setIsPlaying(false);
            videoElement.currentTime = trimStart;
            return;
          }
        }

        const isRotated90 = rotation === 90 || rotation === 270;
        canvas.width = isRotated90 ? videoElement.videoHeight : videoElement.videoWidth;
        canvas.height = isRotated90 ? videoElement.videoWidth : videoElement.videoHeight;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();

        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.translate(-videoElement.videoWidth / 2, -videoElement.videoHeight / 2);

        ctx.filter = getFilterString();
        ctx.drawImage(videoElement, 0, 0);
        ctx.restore();

        // Draw overlays
        drawOverlays(ctx, time);

        setCurrentTime(time);
        animationFrameRef.current = requestAnimationFrame(renderFrame);
      }
    };

    renderFrame();
  };

  useEffect(() => {
    if (mediaType === 'image') {
      applyImageFilters();
    }
  }, [image, brightness, contrast, saturation, rotation, currentEffect, textOverlays, imageOverlays]);

  useEffect(() => {
    if (mediaType === 'video' && videoRef.current) {
      const videoElement = videoRef.current;
      
      const handleLoadedMetadata = () => {
        setDuration(videoElement.duration);
        setTrimEnd(videoElement.duration);
      };

      const handleTimeUpdate = () => {
        if (!isPlaying) {
          const canvas = canvasRef.current;
          const ctx = canvas?.getContext('2d');
          if (ctx && canvas) {
            const isRotated90 = rotation === 90 || rotation === 270;
            canvas.width = isRotated90 ? videoElement.videoHeight : videoElement.videoWidth;
            canvas.height = isRotated90 ? videoElement.videoWidth : videoElement.videoHeight;

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.save();

            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.rotate((rotation * Math.PI) / 180);
            ctx.translate(-videoElement.videoWidth / 2, -videoElement.videoHeight / 2);

            ctx.filter = getFilterString();
            ctx.drawImage(videoElement, 0, 0);
            ctx.restore();

            drawOverlays(ctx, videoElement.currentTime);
          }
          setCurrentTime(videoElement.currentTime);
        }
      };

      videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);
      videoElement.addEventListener('timeupdate', handleTimeUpdate);

      return () => {
        videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
        videoElement.removeEventListener('timeupdate', handleTimeUpdate);
      };
    }
  }, [video, brightness, contrast, saturation, rotation, currentEffect, textOverlays, imageOverlays, subtitles, isPlaying]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = videoSpeed;
    }
  }, [videoSpeed]);

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = mediaType === 'video' ? 'edited-video-frame.png' : 'edited-image.png';
    link.href = canvasRef.current.toDataURL();
    link.click();
  };

  const resetFilters = () => {
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
    setRotation(0);
    setCurrentEffect('none');
    setVideoSpeed(1);
    setTextOverlays([]);
    setImageOverlays([]);
    setSubtitles([]);
    setTrimStart(0);
    setTrimEnd(duration || 0);
  };

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      } else {
        if (videoRef.current.currentTime < trimStart) {
          videoRef.current.currentTime = trimStart;
        }
        videoRef.current.play();
        applyVideoFilters();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (seconds: number) => {
    if (videoRef.current) {
      const newTime = Math.max(trimStart, Math.min(trimEnd || duration, videoRef.current.currentTime + seconds));
      videoRef.current.currentTime = newTime;
    }
  };

  const handleTimelineSeek = (value: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = value;
      setCurrentTime(value);
    }
  };

  const applyEffect = (effect: EffectType) => {
    setCurrentEffect(effect);
  };

  const addTextOverlay = () => {
    if (!newText) return;
    
    const overlay: TextOverlay = {
      id: Date.now().toString(),
      text: newText,
      x: 50,
      y: 100,
      fontSize: newTextSize,
      color: newTextColor,
      startTime: mediaType === 'video' ? currentTime : 0,
      endTime: mediaType === 'video' ? Math.min(currentTime + 5, trimEnd) : Infinity
    };
    
    setTextOverlays([...textOverlays, overlay]);
    setNewText('');
  };

  const removeTextOverlay = (id: string) => {
    setTextOverlays(textOverlays.filter(overlay => overlay.id !== id));
  };

  const handleImageOverlayUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        const overlay: ImageOverlay = {
          id: Date.now().toString(),
          src: result,
          x: 100,
          y: 100,
          width: 150,
          height: 150,
          startTime: mediaType === 'video' ? currentTime : 0,
          endTime: mediaType === 'video' ? Math.min(currentTime + 5, trimEnd) : Infinity
        };
        setImageOverlays([...imageOverlays, overlay]);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImageOverlay = (id: string) => {
    setImageOverlays(imageOverlays.filter(overlay => overlay.id !== id));
  };

  const addSubtitle = () => {
    if (!newSubtitleText) return;
    
    const subtitle: Subtitle = {
      id: Date.now().toString(),
      text: newSubtitleText,
      startTime: newSubtitleStart,
      endTime: newSubtitleEnd
    };
    
    setSubtitles([...subtitles, subtitle]);
    setNewSubtitleText('');
    setNewSubtitleStart(currentTime);
    setNewSubtitleEnd(Math.min(currentTime + 2, trimEnd));
  };

  const removeSubtitle = (id: string) => {
    setSubtitles(subtitles.filter(subtitle => subtitle.id !== id));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl dark:text-white">Editor Multimedia</h2>
        <p className="text-gray-600 dark:text-gray-400">Edita imágenes y videos de tus productos con herramientas avanzadas</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Canvas Area */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h3>Vista Previa</h3>
                {mediaType && (
                  <span className="text-sm px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded">
                    {mediaType === 'video' ? 'Video' : 'Imagen'}
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleRotate} disabled={!mediaType}>
                  <RotateCw className="w-4 h-4 mr-2" />
                  Rotar
                </Button>
                <Button variant="outline" size="sm" onClick={resetFilters} disabled={!mediaType}>
                  Resetear
                </Button>
                <Button size="sm" onClick={handleDownload} disabled={!mediaType}>
                  <Download className="w-4 h-4 mr-2" />
                  Descargar
                </Button>
              </div>
            </div>

            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 min-h-[400px] flex flex-col items-center justify-center">
              {!mediaType ? (
                <div className="text-center">
                  <div className="flex gap-4 justify-center mb-4">
                    <ImageIcon className="w-16 h-16 text-gray-400" />
                    <Video className="w-16 h-16 text-gray-400" />
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">No hay imagen o video cargado</p>
                  <Button onClick={() => fileInputRef.current?.click()}>
                    <Upload className="w-4 h-4 mr-2" />
                    Cargar Imagen o Video
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="w-full flex flex-col items-center">
                  <canvas
                    ref={canvasRef}
                    className="max-w-full max-h-[500px] rounded-lg shadow-lg"
                  />
                  {mediaType === 'video' && (
                    <div className="mt-4 w-full max-w-2xl space-y-3">
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSeek(-5)}
                        >
                          <SkipBack className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={handlePlayPause}
                          size="sm"
                        >
                          {isPlaying ? (
                            <><Pause className="w-4 h-4 mr-2" /> Pausar</>
                          ) : (
                            <><Play className="w-4 h-4 mr-2" /> Reproducir</>
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSeek(5)}
                        >
                          <SkipForward className="w-4 h-4" />
                        </Button>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {formatTime(currentTime)} / {formatTime(duration)}
                        </span>
                      </div>
                      
                      {/* Timeline */}
                      <div className="space-y-2">
                        <Label>Línea de Tiempo</Label>
                        <Slider
                          value={[currentTime]}
                          onValueChange={(value) => handleTimelineSeek(value[0])}
                          min={0}
                          max={duration}
                          step={0.1}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Velocidad: {videoSpeed}x</Label>
                        <Slider
                          value={[videoSpeed]}
                          onValueChange={(value) => setVideoSpeed(value[0])}
                          min={0.25}
                          max={2}
                          step={0.25}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
              {video && (
                <video
                  ref={videoRef}
                  src={video}
                  className="hidden"
                  onEnded={() => setIsPlaying(false)}
                />
              )}
            </div>
          </Card>

          {/* Trim Controls for Video */}
          {mediaType === 'video' && (
            <Card className="p-6">
              <h3 className="mb-4">Recortar Video</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Inicio: {formatTime(trimStart)}</Label>
                  <Slider
                    value={[trimStart]}
                    onValueChange={(value) => {
                      const newStart = Math.min(value[0], trimEnd - 0.1);
                      setTrimStart(newStart);
                      if (videoRef.current && videoRef.current.currentTime < newStart) {
                        videoRef.current.currentTime = newStart;
                      }
                    }}
                    min={0}
                    max={duration}
                    step={0.1}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Fin: {formatTime(trimEnd)}</Label>
                  <Slider
                    value={[trimEnd]}
                    onValueChange={(value) => {
                      const newEnd = Math.max(value[0], trimStart + 0.1);
                      setTrimEnd(newEnd);
                      if (videoRef.current && videoRef.current.currentTime > newEnd) {
                        videoRef.current.currentTime = newEnd;
                      }
                    }}
                    min={0}
                    max={duration}
                    step={0.1}
                  />
                </div>
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm text-blue-800 dark:text-blue-300">
                    Duración del clip: {formatTime(trimEnd - trimStart)}
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Controls Panel */}
        <div className="space-y-4">
          <Card className="p-6">
            <h3 className="mb-4">Herramientas</h3>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start" disabled>
                <Crop className="w-4 h-4 mr-2" />
                Recortar Imagen
              </Button>
              <Button variant="outline" className="w-full justify-start" disabled>
                <Sliders className="w-4 h-4 mr-2" />
                Filtros Avanzados
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-4 h-4 mr-2" />
                Cargar Nuevo Archivo
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          </Card>

          <Card className="p-6">
            <Tabs value={selectedTab} onValueChange={setSelectedTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="adjust">Ajustes</TabsTrigger>
                <TabsTrigger value="effects">Efectos</TabsTrigger>
              </TabsList>
              <TabsContent value="adjust" className="space-y-6 pt-4">
                <div className="space-y-2">
                  <Label>Brillo: {brightness}%</Label>
                  <Slider
                    value={[brightness]}
                    onValueChange={(value) => setBrightness(value[0])}
                    min={0}
                    max={200}
                    step={1}
                    disabled={!mediaType}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Contraste: {contrast}%</Label>
                  <Slider
                    value={[contrast]}
                    onValueChange={(value) => setContrast(value[0])}
                    min={0}
                    max={200}
                    step={1}
                    disabled={!mediaType}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Saturación: {saturation}%</Label>
                  <Slider
                    value={[saturation]}
                    onValueChange={(value) => setSaturation(value[0])}
                    min={0}
                    max={200}
                    step={1}
                    disabled={!mediaType}
                  />
                </div>
              </TabsContent>
              <TabsContent value="effects" className="space-y-2 pt-4">
                <Button 
                  variant={currentEffect === 'none' ? 'default' : 'outline'} 
                  className="w-full"
                  onClick={() => applyEffect('none')}
                  disabled={!mediaType}
                >
                  Sin Efecto
                </Button>
                <Button 
                  variant={currentEffect === 'grayscale' ? 'default' : 'outline'} 
                  className="w-full"
                  onClick={() => applyEffect('grayscale')}
                  disabled={!mediaType}
                >
                  Blanco y Negro
                </Button>
                <Button 
                  variant={currentEffect === 'sepia' ? 'default' : 'outline'} 
                  className="w-full"
                  onClick={() => applyEffect('sepia')}
                  disabled={!mediaType}
                >
                  Sepia
                </Button>
                <Button 
                  variant={currentEffect === 'vintage' ? 'default' : 'outline'} 
                  className="w-full"
                  onClick={() => applyEffect('vintage')}
                  disabled={!mediaType}
                >
                  Vintage
                </Button>
                <Button 
                  variant={currentEffect === 'vibrant' ? 'default' : 'outline'} 
                  className="w-full"
                  onClick={() => applyEffect('vibrant')}
                  disabled={!mediaType}
                >
                  Vibrante
                </Button>
              </TabsContent>
            </Tabs>
          </Card>

          {/* Text Overlay */}
          <Card className="p-6">
            <h3 className="mb-4 flex items-center gap-2">
              <Type className="w-4 h-4" />
              Añadir Texto
            </h3>
            <div className="space-y-3">
              <Input
                placeholder="Escribe el texto..."
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                disabled={!mediaType}
              />
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs">Color</Label>
                  <Input
                    type="color"
                    value={newTextColor}
                    onChange={(e) => setNewTextColor(e.target.value)}
                    disabled={!mediaType}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Tamaño: {newTextSize}px</Label>
                  <Slider
                    value={[newTextSize]}
                    onValueChange={(value) => setNewTextSize(value[0])}
                    min={16}
                    max={72}
                    step={2}
                    disabled={!mediaType}
                  />
                </div>
              </div>
              <Button onClick={addTextOverlay} className="w-full" disabled={!mediaType || !newText}>
                <Plus className="w-4 h-4 mr-2" />
                Agregar Texto
              </Button>
              
              {textOverlays.length > 0 && (
                <div className="space-y-2 mt-4">
                  <Label className="text-xs">Textos añadidos:</Label>
                  {textOverlays.map(overlay => (
                    <div key={overlay.id} className="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-800 rounded">
                      <span className="text-sm truncate flex-1">{overlay.text}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeTextOverlay(overlay.id)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>

          {/* Image/GIF Overlay */}
          <Card className="p-6">
            <h3 className="mb-4 flex items-center gap-2">
              <FileImage className="w-4 h-4" />
              Añadir Imagen/GIF
            </h3>
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => imageOverlayInputRef.current?.click()}
                disabled={!mediaType}
              >
                <Upload className="w-4 h-4 mr-2" />
                Cargar Imagen/GIF
              </Button>
              <input
                ref={imageOverlayInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageOverlayUpload}
                className="hidden"
              />
              
              {imageOverlays.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-xs">Imágenes añadidas:</Label>
                  {imageOverlays.map((overlay, index) => (
                    <div key={overlay.id} className="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-800 rounded">
                      <span className="text-sm">Imagen {index + 1}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeImageOverlay(overlay.id)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>

          {/* Subtitles */}
          {mediaType === 'video' && (
            <Card className="p-6">
              <h3 className="mb-4 flex items-center gap-2">
                <Subtitles className="w-4 h-4" />
                Subtítulos
              </h3>
              <div className="space-y-3">
                <Textarea
                  placeholder="Texto del subtítulo..."
                  value={newSubtitleText}
                  onChange={(e) => setNewSubtitleText(e.target.value)}
                  rows={2}
                />
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label className="text-xs">Inicio (s)</Label>
                    <Input
                      type="number"
                      value={newSubtitleStart}
                      onChange={(e) => setNewSubtitleStart(parseFloat(e.target.value))}
                      min={0}
                      max={duration}
                      step={0.1}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Fin (s)</Label>
                    <Input
                      type="number"
                      value={newSubtitleEnd}
                      onChange={(e) => setNewSubtitleEnd(parseFloat(e.target.value))}
                      min={0}
                      max={duration}
                      step={0.1}
                    />
                  </div>
                </div>
                <Button onClick={addSubtitle} className="w-full" disabled={!newSubtitleText}>
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar Subtítulo
                </Button>
                
                {subtitles.length > 0 && (
                  <div className="space-y-2 mt-4">
                    <Label className="text-xs">Subtítulos añadidos:</Label>
                    {subtitles.map(subtitle => (
                      <div key={subtitle.id} className="p-2 bg-gray-100 dark:bg-gray-800 rounded space-y-1">
                        <div className="flex items-start justify-between">
                          <span className="text-sm flex-1">{subtitle.text}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeSubtitle(subtitle.id)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                        <p className="text-xs text-gray-500">
                          {formatTime(subtitle.startTime)} - {formatTime(subtitle.endTime)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
