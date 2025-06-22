import React, { useRef, useState } from 'react';
import { Upload, Image as ImageIcon, X, Camera, AlertCircle, Loader, Sparkles } from 'lucide-react';

interface ImageUploadProps {
  onImageUpload: (file: File) => void;
  onImageSearch: (imageData: string) => void;
  isProcessing?: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ 
  onImageUpload, 
  onImageSearch, 
  isProcessing = false 
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [extractedInfo, setExtractedInfo] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileUpload = (file: File) => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target?.result as string;
        setUploadedImage(imageData);
        
        // Simulate OCR extraction
        setTimeout(() => {
          setExtractedInfo(['iPhone 15 Pro', '128GB', 'Titanio Natural', 'Apple']);
        }, 1000);
        
        onImageUpload(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const handleSearch = () => {
    if (uploadedImage) {
      onImageSearch(uploadedImage);
    }
  };

  const handleRemove = () => {
    setUploadedImage(null);
    setExtractedInfo([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {!uploadedImage ? (
        <div
          className={`relative border-2 border-dashed rounded-3xl p-12 text-center transition-all cursor-pointer
                     ${dragActive 
                       ? 'border-red-500 bg-red-50 scale-105' 
                       : 'border-gray-300 hover:border-red-400 hover:bg-gray-50'
                     }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={openFileDialog}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleInputChange}
            className="hidden"
          />
          
          <div className="flex flex-col items-center space-y-6">
            <div className="bg-gradient-to-br from-red-100 to-orange-100 p-6 rounded-2xl">
              {isProcessing ? (
                <Loader className="animate-spin h-12 w-12 text-red-600" />
              ) : (
                <Camera className="h-12 w-12 text-red-600" />
              )}
            </div>
            
            <div className="max-w-md">
              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                Búsqueda visual inteligente
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Sube una foto del producto que buscas y nuestro sistema de IA extraerá automáticamente 
                la información para encontrar las mejores ofertas.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  type="button"
                  disabled={isProcessing}
                  className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600
                           text-white rounded-xl hover:shadow-lg transition-all transform hover:scale-105
                           disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Upload className="h-5 w-5" />
                  <span>{isProcessing ? 'Procesando...' : 'Subir imagen'}</span>
                </button>
                
                <div className="text-sm text-gray-500">
                  JPG, PNG, WebP hasta 10MB
                </div>
              </div>
            </div>

            {/* OCR Technology Notice */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-2xl p-6 mt-8 max-w-2xl">
              <div className="flex items-start space-x-4">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Sparkles className="h-6 w-6 text-blue-600" />
                </div>
                <div className="text-sm">
                  <h4 className="font-semibold text-blue-800 mb-2">Tecnología OCR Avanzada</h4>
                  <p className="text-blue-700 leading-relaxed">
                    Nuestro sistema utiliza reconocimiento óptico de caracteres (OCR) y análisis de imágenes 
                    con IA para identificar productos, marcas, modelos y características técnicas automáticamente.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                      Reconocimiento de texto
                    </span>
                    <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs">
                      Detección de productos
                    </span>
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                      Análisis de marcas
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
          <div className="relative">
            <img
              src={uploadedImage}
              alt="Producto subido"
              className="w-full h-80 object-cover"
            />
            <button
              onClick={handleRemove}
              className="absolute top-6 right-6 p-3 bg-white rounded-full shadow-lg hover:bg-gray-50
                       transition-colors"
            >
              <X className="h-6 w-6 text-gray-600" />
            </button>
            
            {isProcessing && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="bg-white rounded-2xl p-6 text-center">
                  <Loader className="animate-spin h-8 w-8 text-red-600 mx-auto mb-3" />
                  <p className="text-gray-700 font-medium">Analizando imagen...</p>
                </div>
              </div>
            )}
          </div>
          
          <div className="p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <Sparkles className="h-5 w-5 text-purple-600 mr-2" />
                  Información extraída
                </h3>
                
                {extractedInfo.length > 0 ? (
                  <div className="space-y-2">
                    {extractedInfo.map((info, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-gray-700">{info}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 text-gray-500">
                    <Loader className="animate-spin h-4 w-4" />
                    <span>Extrayendo información...</span>
                  </div>
                )}
              </div>
              
              <div className="flex flex-col justify-center">
                <h4 className="text-lg font-semibold text-gray-800 mb-3">
                  ¿Listo para buscar?
                </h4>
                <p className="text-gray-600 mb-6">
                  Buscaremos este producto en Amazon.es, MediaMarkt, PCComponentes y El Corte Inglés
                </p>
                
                <button
                  onClick={handleSearch}
                  disabled={isProcessing || extractedInfo.length === 0}
                  className="flex items-center justify-center space-x-2 px-8 py-4 bg-gradient-to-r 
                           from-red-600 to-orange-600 text-white rounded-xl hover:shadow-lg 
                           transition-all transform hover:scale-105 disabled:opacity-50 
                           disabled:cursor-not-allowed disabled:transform-none"
                >
                  <ImageIcon className="h-5 w-5" />
                  <span>Buscar producto</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;