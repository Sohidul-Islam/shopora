'use client';

import { useState, useRef, useCallback } from 'react';
import { Upload, X, ImageIcon, Loader2 } from 'lucide-react';

interface ImageUploaderProps {
  /** The upload target folder: 'products' | 'categories' | 'brands' */
  folder?: 'products' | 'categories' | 'brands';
  /** Current image URL (for single-image mode) */
  currentUrl?: string;
  /** Callback when upload succeeds — returns the public URL */
  onUploaded: (url: string) => void;
  /** Label text */
  label?: string;
  /** Whether to show remove button */
  onRemove?: () => void;
  /** compact single-image mode (category icon, brand logo) */
  compact?: boolean;
}

export function ImageUploader({
  folder = 'products',
  currentUrl,
  onUploaded,
  label = 'Upload Image',
  onRemove,
  compact = false,
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (file: File) => {
    setError('');
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
      const data = await res.json();

      if (!data.success) throw new Error(data.error || 'Upload failed');
      onUploaded(data.url);
    } catch (err: any) {
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  }, [folder, onUploaded]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = '';
  };

  if (compact) {
    return (
      <div className="space-y-2">
        <label className="block text-xs font-semibold text-slate-400">{label}</label>
        <div className="flex items-center space-x-3">
          {/* Preview */}
          <div className="w-16 h-16 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center overflow-hidden shrink-0">
            {currentUrl ? (
              <img src={currentUrl} alt="preview" className="w-full h-full object-cover" />
            ) : (
              <ImageIcon className="w-6 h-6 text-slate-600" />
            )}
          </div>
          {/* Upload button */}
          <div className="flex-1 space-y-1.5">
            <button
              type="button"
              disabled={uploading}
              onClick={() => inputRef.current?.click()}
              className="flex items-center space-x-2 px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-bold text-slate-300 hover:text-white transition disabled:opacity-50"
            >
              {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
              <span>{uploading ? 'Uploading...' : 'Choose File'}</span>
            </button>
            {currentUrl && onRemove && (
              <button type="button" onClick={onRemove} className="flex items-center space-x-1 text-[10px] text-rose-400 hover:text-rose-300 transition">
                <X className="w-3 h-3" />
                <span>Remove</span>
              </button>
            )}
            <p className="text-[10px] text-slate-600">JPEG, PNG, WebP — max 5MB</p>
            {error && <p className="text-[10px] text-rose-400">{error}</p>}
          </div>
        </div>
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleChange} />
      </div>
    );
  }

  // Full drop zone mode (for product gallery)
  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold text-slate-400">{label}</label>
      <div
        onClick={() => !uploading && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all
          ${dragOver ? 'border-blue-500 bg-blue-500/5' : 'border-slate-800 hover:border-slate-600 bg-slate-950/50'}
          ${uploading ? 'opacity-70 pointer-events-none' : ''}
        `}
      >
        {uploading ? (
          <div className="flex flex-col items-center space-y-2">
            <Loader2 className="w-7 h-7 text-blue-400 animate-spin" />
            <p className="text-xs text-slate-400 font-semibold">Uploading image...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-2">
            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center">
              <Upload className="w-5 h-5 text-slate-500" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-300">Click or drag & drop to upload</p>
              <p className="text-[10px] text-slate-600 mt-0.5">JPEG, PNG, WebP, GIF — max 5MB</p>
            </div>
          </div>
        )}
      </div>
      {error && <p className="text-[10px] text-rose-400 font-semibold">{error}</p>}
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleChange} />
    </div>
  );
}

// Multi-image gallery manager (for product images)
interface ProductImageGalleryProps {
  productId: string;
  images: Array<{ id: string; url: string; sortOrder: number }>;
  onRefresh: () => void;
}

export function ProductImageGallery({ productId, images, onRefresh }: ProductImageGalleryProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadAndLink = async (file: File) => {
    setError('');
    setUploading(true);
    try {
      // Step 1: Upload file
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'products');
      const uploadRes = await fetch('/api/admin/upload', { method: 'POST', body: formData });
      const uploadData = await uploadRes.json();
      if (!uploadData.success) throw new Error(uploadData.error);

      // Step 2: Link to product
      const linkRes = await fetch(`/api/admin/products/${productId}/images`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: uploadData.url }),
      });
      const linkData = await linkRes.json();
      if (!linkData.success) throw new Error(linkData.error);

      onRefresh();
    } catch (err: any) {
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const deleteImage = async (imageId: string) => {
    if (!confirm('Remove this image?')) return;
    try {
      const res = await fetch(`/api/admin/products/${productId}/images/${imageId}`, { method: 'DELETE' });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      onRefresh();
    } catch (err: any) {
      setError(err.message || 'Delete failed');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadAndLink(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-slate-400">Product Images ({images.length})</label>
        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-[11px] font-bold text-slate-300 hover:text-white transition disabled:opacity-50"
        >
          {uploading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />}
          <span>{uploading ? 'Uploading...' : 'Add Image'}</span>
        </button>
      </div>

      {images.length === 0 ? (
        <div
          onClick={() => !uploading && inputRef.current?.click()}
          className="border-2 border-dashed border-slate-800 rounded-2xl p-8 text-center cursor-pointer hover:border-slate-600 transition"
        >
          <ImageIcon className="w-8 h-8 text-slate-700 mx-auto mb-2" />
          <p className="text-xs text-slate-500">No images yet — click to upload the first one</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          {images.map((img, idx) => (
            <div key={img.id} className="relative group rounded-xl overflow-hidden bg-slate-900 border border-slate-800 aspect-square">
              <img src={img.url} alt={`Product image ${idx + 1}`} className="w-full h-full object-cover" />
              {idx === 0 && (
                <span className="absolute top-1 left-1 text-[9px] bg-blue-600 text-white px-1.5 py-0.5 rounded font-bold">PRIMARY</span>
              )}
              <button
                type="button"
                onClick={() => deleteImage(img.id)}
                className="absolute top-1 right-1 p-1 bg-black/60 hover:bg-rose-500 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
              >
                <X className="w-3 h-3 text-white" />
              </button>
            </div>
          ))}
          {/* Add more tile */}
          <div
            onClick={() => !uploading && inputRef.current?.click()}
            className="rounded-xl border-2 border-dashed border-slate-800 hover:border-slate-600 flex items-center justify-center cursor-pointer transition aspect-square"
          >
            {uploading ? <Loader2 className="w-5 h-5 text-slate-600 animate-spin" /> : <Upload className="w-5 h-5 text-slate-600" />}
          </div>
        </div>
      )}

      {error && <p className="text-[10px] text-rose-400 font-semibold">{error}</p>}
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleChange} />
    </div>
  );
}
