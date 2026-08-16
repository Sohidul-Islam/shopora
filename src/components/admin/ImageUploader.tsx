'use client';

import { useState, useRef, useCallback } from 'react';
import { Upload, X, ImageIcon, Loader2, Link as LinkIcon, Plus } from 'lucide-react';
import { useStore } from '../../store/useStore';

interface ImageUploaderProps {
  /** The upload target folder: 'products' | 'categories' | 'brands' | 'banners' */
  folder?: 'products' | 'categories' | 'brands' | 'banners';
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
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [directUrl, setDirectUrl] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (file: File) => {
    setError('');
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      const token = useStore.getState().sessionToken;
      const res = await fetch('/api/admin/upload', { 
        method: 'POST', 
        body: formData,
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
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

  const handleAttachUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!directUrl.trim()) return;
    onUploaded(directUrl.trim());
    setDirectUrl('');
    setShowUrlInput(false);
  };

  if (compact) {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400">{label}</label>
          <button
            type="button"
            onClick={() => setShowUrlInput(!showUrlInput)}
            className="text-[10px] text-purple-600 dark:text-purple-400 font-bold hover:underline"
          >
            {showUrlInput ? 'Use Device File' : 'Paste Direct URL'}
          </button>
        </div>

        {showUrlInput ? (
          <form onSubmit={handleAttachUrl} className="flex items-center space-x-2">
            <input
              type="text"
              value={directUrl}
              onChange={(e) => setDirectUrl(e.target.value)}
              placeholder="Paste image URL (https://...)"
              className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2 text-xs text-slate-900 dark:text-white"
            />
            <button
              type="submit"
              className="px-3 py-2 bg-purple-650 text-white font-bold rounded-xl text-xs"
            >
              Attach
            </button>
          </form>
        ) : (
          <div className="flex items-center space-x-3">
            {/* Preview */}
            <div className="w-16 h-16 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center overflow-hidden shrink-0">
              {currentUrl ? (
                <img src={currentUrl} alt="preview" className="w-full h-full object-cover" />
              ) : (
                <ImageIcon className="w-6 h-6 text-slate-400 dark:text-slate-600" />
              )}
            </div>
            {/* Upload button */}
            <div className="flex-1 space-y-1.5">
              <button
                type="button"
                disabled={uploading}
                onClick={() => inputRef.current?.click()}
                className="flex items-center space-x-2 px-3 py-2 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white transition disabled:opacity-50"
              >
                {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                <span>{uploading ? 'Uploading...' : 'Choose File'}</span>
              </button>
              {currentUrl && onRemove && (
                <button type="button" onClick={onRemove} className="flex items-center space-x-1 text-[10px] text-rose-500 dark:text-rose-400 hover:text-rose-600 transition">
                  <X className="w-3 h-3" />
                  <span>Remove</span>
                </button>
              )}
              <p className="text-[10px] text-slate-500 dark:text-slate-600">Device File or Image Link</p>
              {error && <p className="text-[10px] text-rose-500 dark:text-rose-400">{error}</p>}
            </div>
          </div>
        )}
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleChange} />
      </div>
    );
  }

  // Full drop zone mode
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400">{label}</label>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-[10px] text-purple-600 dark:text-purple-400 font-bold hover:underline"
        >
          {showUrlInput ? 'Upload Device File' : 'Paste Image URL Link'}
        </button>
      </div>

      {showUrlInput ? (
        <form onSubmit={handleAttachUrl} className="flex items-center space-x-2">
          <input
            type="text"
            value={directUrl}
            onChange={(e) => setDirectUrl(e.target.value)}
            placeholder="Enter image URL link (e.g. https://images.unsplash.com/...)"
            className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs text-slate-900 dark:text-white"
          />
          <button
            type="submit"
            className="px-4 py-3 bg-purple-650 text-white font-bold rounded-xl text-xs"
          >
            Attach Link
          </button>
        </form>
      ) : (
        <div
          onClick={() => !uploading && inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`
            relative border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all
            ${dragOver ? 'border-purple-500 bg-purple-500/5' : 'border-slate-300 dark:border-slate-800 hover:border-purple-400 bg-white dark:bg-slate-950/50'}
            ${uploading ? 'opacity-70 pointer-events-none' : ''}
          `}
        >
          {uploading ? (
            <div className="flex flex-col items-center space-y-2">
              <Loader2 className="w-7 h-7 text-purple-600 animate-spin" />
              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Uploading device image...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-2">
              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center">
                <Upload className="w-5 h-5 text-slate-500" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-300">Click or drag & drop device file</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-600 mt-0.5">JPEG, PNG, WebP, GIF — max 5MB</p>
              </div>
            </div>
          )}
        </div>
      )}
      {error && <p className="text-[10px] text-rose-500 dark:text-rose-400 font-semibold">{error}</p>}
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleChange} />
    </div>
  );
}

// Multi-image gallery manager (supporting both existing product & creation pending images)
interface ProductImageGalleryProps {
  productId?: string | null;
  images: Array<{ id: string; url: string; sortOrder?: number }>;
  onRefresh?: () => void;
  onAddPendingUrl?: (url: string) => void;
  onRemovePendingUrl?: (url: string) => void;
}

export function ProductImageGallery({
  productId,
  images,
  onRefresh,
  onAddPendingUrl,
  onRemovePendingUrl,
}: ProductImageGalleryProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [directUrl, setDirectUrl] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleAddUrl = async (url: string) => {
    setError('');
    if (!productId) {
      // Pending mode for Add Product
      onAddPendingUrl?.(url);
      return;
    }

    setUploading(true);
    const token = useStore.getState().sessionToken;
    try {
      const linkRes = await fetch(`/api/admin/products/${productId}/images`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ url }),
      });
      const linkData = await linkRes.json();
      if (!linkData.success) throw new Error(linkData.error);
      onRefresh?.();
    } catch (err: any) {
      setError(err.message || 'Linking image failed');
    } finally {
      setUploading(false);
    }
  };

  const uploadAndLink = async (file: File) => {
    setError('');
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'products');
      const token = useStore.getState().sessionToken;
      const uploadRes = await fetch('/api/admin/upload', { 
        method: 'POST', 
        body: formData,
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const uploadData = await uploadRes.json();
      if (!uploadData.success) throw new Error(uploadData.error);

      await handleAddUrl(uploadData.url);
    } catch (err: any) {
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleAddDirectUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!directUrl.trim()) return;
    await handleAddUrl(directUrl.trim());
    setDirectUrl('');
    setShowUrlInput(false);
  };

  const deleteImage = async (img: { id: string; url: string }) => {
    if (!confirm('Remove this image?')) return;
    if (!productId) {
      onRemovePendingUrl?.(img.url);
      return;
    }

    const token = useStore.getState().sessionToken;
    try {
      const res = await fetch(`/api/admin/products/${productId}/images/${img.id}`, { 
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      onRefresh?.();
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
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Product Photo Gallery ({images.length})</label>
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setShowUrlInput(!showUrlInput)}
            className="flex items-center space-x-1 text-[11px] font-bold text-purple-600 dark:text-purple-400 hover:underline"
          >
            <LinkIcon className="w-3 h-3" />
            <span>{showUrlInput ? 'Use Device Upload' : 'Add Image URL Link'}</span>
          </button>
          <button
            type="button"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-purple-650 text-white rounded-xl text-[11px] font-bold transition disabled:opacity-50 shadow-sm"
          >
            {uploading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />}
            <span>{uploading ? 'Uploading...' : 'Upload Device File'}</span>
          </button>
        </div>
      </div>

      {showUrlInput && (
        <form onSubmit={handleAddDirectUrl} className="flex items-center space-x-2 p-2 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800">
          <input
            type="text"
            value={directUrl}
            onChange={(e) => setDirectUrl(e.target.value)}
            placeholder="Paste image URL link (e.g. https://images.unsplash.com/...)"
            className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-xs text-slate-900 dark:text-white"
          />
          <button
            type="submit"
            className="px-3 py-2 bg-purple-650 text-white font-bold rounded-lg text-xs"
          >
            Attach Link
          </button>
        </form>
      )}

      {images.length === 0 ? (
        <div
          onClick={() => !uploading && inputRef.current?.click()}
          className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center cursor-pointer hover:border-slate-400 dark:hover:border-slate-600 transition"
        >
          <ImageIcon className="w-8 h-8 text-slate-400 dark:text-slate-700 mx-auto mb-2" />
          <p className="text-xs text-slate-500 font-semibold">No images uploaded yet — click to pick device file or enter image URL</p>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-2">
          {images.map((img, idx) => (
            <div key={img.id || idx} className="relative group rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 aspect-square">
              <img src={img.url} alt={`Product image ${idx + 1}`} className="w-full h-full object-cover" />
              {idx === 0 && (
                <span className="absolute top-1 left-1 text-[9px] bg-purple-650 text-white px-1.5 py-0.5 rounded font-bold shadow-sm">PRIMARY</span>
              )}
              <button
                type="button"
                onClick={() => deleteImage(img)}
                className="absolute top-1 right-1 p-1 bg-black/60 hover:bg-rose-500 rounded-lg opacity-0 group-hover:opacity-100 transition-all text-white"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
          {/* Add tile */}
          <div
            onClick={() => !uploading && inputRef.current?.click()}
            className="rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-purple-400 flex items-center justify-center cursor-pointer transition aspect-square"
          >
            {uploading ? <Loader2 className="w-5 h-5 text-slate-400 animate-spin" /> : <Upload className="w-5 h-5 text-slate-400" />}
          </div>
        </div>
      )}
      {error && <p className="text-[10px] text-rose-500 font-semibold">{error}</p>}
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleChange} />
    </div>
  );
}
