'use client';

import React, { useState } from 'react';
import {
  Bold, Italic, Heading1, Heading2, Heading3, Quote, List, ListOrdered,
  AlignLeft, AlignCenter, AlignRight, Link as LinkIcon, Image as ImageIcon,
  Plus, Trash2, ArrowUp, ArrowDown, Layout, Table as TableIcon, Code,
  Eye, Edit3, Layers, Sparkles, Check, ChevronRight, AlertCircle, FileText
} from 'lucide-react';
import { ImageUploader } from './ImageUploader';

export interface CmsBlock {
  id: string;
  type: 'heading' | 'text' | 'image' | 'split_image_text' | 'banner' | 'quote' | 'callout' | 'table' | 'custom_html';
  headingLevel?: 'h1' | 'h2' | 'h3';
  content?: string;
  align?: 'left' | 'center' | 'right';
  imageUrl?: string;
  caption?: string;
  imagePosition?: 'left' | 'right';
  bannerTitle?: string;
  bannerSubtitle?: string;
  quoteAuthor?: string;
  calloutType?: 'info' | 'tip' | 'warning';
  tableHeaders?: string[];
  tableRows?: string[][];
}

interface CmsSectionBuilderProps {
  blocks: CmsBlock[];
  onChange: (blocks: CmsBlock[]) => void;
}

export default function CmsSectionBuilder({ blocks, onChange }: CmsSectionBuilderProps) {
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

  const addBlock = (type: CmsBlock['type']) => {
    const newBlock: CmsBlock = {
      id: crypto.randomUUID(),
      type,
      headingLevel: 'h2',
      content: '',
      align: 'left',
      imageUrl: '',
      caption: '',
      imagePosition: 'right',
      calloutType: 'info',
      tableHeaders: ['Feature', 'Specification', 'Details'],
      tableRows: [
        ['Display', '6.7" Super Retina XDR', 'OLED display with ProMotion'],
        ['Chip', 'A17 Pro Chip', '6-core CPU, 6-core GPU'],
      ],
    };
    const updated = [...blocks, newBlock];
    onChange(updated);
    setSelectedBlockId(newBlock.id);
  };

  const updateBlock = (id: string, updates: Partial<CmsBlock>) => {
    onChange(blocks.map(b => (b.id === id ? { ...b, ...updates } : b)));
  };

  const removeBlock = (id: string) => {
    onChange(blocks.filter(b => b.id !== id));
    if (selectedBlockId === id) setSelectedBlockId(null);
  };

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === blocks.length - 1)) return;
    const newBlocks = [...blocks];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const temp = newBlocks[index];
    newBlocks[index] = newBlocks[targetIndex];
    newBlocks[targetIndex] = temp;
    onChange(newBlocks);
  };

  // Helper for applying formatting tags into textareas
  const applyTextFormat = (blockId: string, tagStart: string, tagEnd: string = tagStart) => {
    const block = blocks.find(b => b.id === blockId);
    if (!block) return;
    const current = block.content || '';
    const formatted = `${current}${tagStart}selected text${tagEnd}`;
    updateBlock(blockId, { content: formatted });
  };

  // Table manipulation helpers
  const addTableRow = (blockId: string) => {
    const block = blocks.find(b => b.id === blockId);
    if (!block || !block.tableRows) return;
    const colCount = block.tableHeaders?.length || 3;
    const newRow = Array(colCount).fill('Sample Cell');
    updateBlock(blockId, { tableRows: [...block.tableRows, newRow] });
  };

  const removeTableRow = (blockId: string, rowIndex: number) => {
    const block = blocks.find(b => b.id === blockId);
    if (!block || !block.tableRows) return;
    updateBlock(blockId, { tableRows: block.tableRows.filter((_, i) => i !== rowIndex) });
  };

  const addTableColumn = (blockId: string) => {
    const block = blocks.find(b => b.id === blockId);
    if (!block || !block.tableHeaders || !block.tableRows) return;
    const newHeaders = [...block.tableHeaders, `Header ${block.tableHeaders.length + 1}`];
    const newRows = block.tableRows.map(row => [...row, 'Data']);
    updateBlock(blockId, { tableHeaders: newHeaders, tableRows: newRows });
  };

  const removeTableColumn = (blockId: string, colIndex: number) => {
    const block = blocks.find(b => b.id === blockId);
    if (!block || !block.tableHeaders || !block.tableRows || block.tableHeaders.length <= 1) return;
    const newHeaders = block.tableHeaders.filter((_, i) => i !== colIndex);
    const newRows = block.tableRows.map(row => row.filter((_, i) => i !== colIndex));
    updateBlock(blockId, { tableHeaders: newHeaders, tableRows: newRows });
  };

  return (
    <div className="space-y-6">
      {/* Header Controls & Mode Switch */}
      <div className="flex items-center justify-between bg-slate-50 dark:bg-[#0f111a] p-3 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center space-x-2">
          <span className="p-2 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-xl">
            <Layers className="w-4 h-4" />
          </span>
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">CMS Block Section Builder</h4>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">Design articles using flexible content sections & tables.</p>
          </div>
        </div>

        <div className="flex items-center space-x-1 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('editor')}
            className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center space-x-1.5 ${
              activeTab === 'editor'
                ? 'bg-purple-650 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Section Editor</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center space-x-1.5 ${
              activeTab === 'preview'
                ? 'bg-purple-650 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Live Preview</span>
          </button>
        </div>
      </div>

      {activeTab === 'editor' ? (
        <div className="space-y-6">
          {/* Add Component Palette */}
          <div className="space-y-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Add Content Component Section</span>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
              <button
                type="button"
                onClick={() => addBlock('text')}
                className="p-2.5 bg-slate-50 hover:bg-purple-50 dark:bg-slate-900 dark:hover:bg-purple-900/20 border border-slate-200 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-700 rounded-xl text-left transition flex items-center space-x-2 text-xs font-bold text-slate-700 dark:text-slate-300"
              >
                <FileText className="w-4 h-4 text-purple-500" />
                <span>Text Block</span>
              </button>
              <button
                type="button"
                onClick={() => addBlock('heading')}
                className="p-2.5 bg-slate-50 hover:bg-purple-50 dark:bg-slate-900 dark:hover:bg-purple-900/20 border border-slate-200 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-700 rounded-xl text-left transition flex items-center space-x-2 text-xs font-bold text-slate-700 dark:text-slate-300"
              >
                <Heading2 className="w-4 h-4 text-blue-500" />
                <span>Heading</span>
              </button>
              <button
                type="button"
                onClick={() => addBlock('image')}
                className="p-2.5 bg-slate-50 hover:bg-purple-50 dark:bg-slate-900 dark:hover:bg-purple-900/20 border border-slate-200 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-700 rounded-xl text-left transition flex items-center space-x-2 text-xs font-bold text-slate-700 dark:text-slate-300"
              >
                <ImageIcon className="w-4 h-4 text-emerald-500" />
                <span>Single Image</span>
              </button>
              <button
                type="button"
                onClick={() => addBlock('split_image_text')}
                className="p-2.5 bg-slate-50 hover:bg-purple-50 dark:bg-slate-900 dark:hover:bg-purple-900/20 border border-slate-200 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-700 rounded-xl text-left transition flex items-center space-x-2 text-xs font-bold text-slate-700 dark:text-slate-300"
              >
                <Layout className="w-4 h-4 text-amber-500" />
                <span>Image + Text</span>
              </button>
              <button
                type="button"
                onClick={() => addBlock('banner')}
                className="p-2.5 bg-slate-50 hover:bg-purple-50 dark:bg-slate-900 dark:hover:bg-purple-900/20 border border-slate-200 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-700 rounded-xl text-left transition flex items-center space-x-2 text-xs font-bold text-slate-700 dark:text-slate-300"
              >
                <Sparkles className="w-4 h-4 text-rose-500" />
                <span>Hero Banner</span>
              </button>
              <button
                type="button"
                onClick={() => addBlock('quote')}
                className="p-2.5 bg-slate-50 hover:bg-purple-50 dark:bg-slate-900 dark:hover:bg-purple-900/20 border border-slate-200 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-700 rounded-xl text-left transition flex items-center space-x-2 text-xs font-bold text-slate-700 dark:text-slate-300"
              >
                <Quote className="w-4 h-4 text-indigo-500" />
                <span>Pull Quote</span>
              </button>
              <button
                type="button"
                onClick={() => addBlock('callout')}
                className="p-2.5 bg-slate-50 hover:bg-purple-50 dark:bg-slate-900 dark:hover:bg-purple-900/20 border border-slate-200 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-700 rounded-xl text-left transition flex items-center space-x-2 text-xs font-bold text-slate-700 dark:text-slate-300"
              >
                <AlertCircle className="w-4 h-4 text-orange-500" />
                <span>Callout Box</span>
              </button>
              <button
                type="button"
                onClick={() => addBlock('table')}
                className="p-2.5 bg-slate-50 hover:bg-purple-50 dark:bg-slate-900 dark:hover:bg-purple-900/20 border border-slate-200 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-700 rounded-xl text-left transition flex items-center space-x-2 text-xs font-bold text-slate-700 dark:text-slate-300"
              >
                <TableIcon className="w-4 h-4 text-teal-500" />
                <span>Data Table</span>
              </button>
              <button
                type="button"
                onClick={() => addBlock('custom_html')}
                className="p-2.5 bg-slate-50 hover:bg-purple-50 dark:bg-slate-900 dark:hover:bg-purple-900/20 border border-slate-200 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-700 rounded-xl text-left transition flex items-center space-x-2 text-xs font-bold text-slate-700 dark:text-slate-300"
              >
                <Code className="w-4 h-4 text-slate-500" />
                <span>Raw HTML</span>
              </button>
            </div>
          </div>

          {/* Active Blocks List */}
          {blocks.length === 0 ? (
            <div className="p-8 text-center bg-slate-50/50 dark:bg-slate-900/30 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl space-y-3">
              <p className="text-xs text-slate-500 font-semibold">No content components added yet. Click an item above to add your first article section.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {blocks.map((block, idx) => (
                <div
                  key={block.id}
                  className={`bg-white dark:bg-[#0c0d15] border rounded-3xl p-5 space-y-4 transition shadow-sm ${
                    selectedBlockId === block.id
                      ? 'border-purple-500 ring-1 ring-purple-500/30'
                      : 'border-slate-200 dark:border-slate-800'
                  }`}
                  onClick={() => setSelectedBlockId(block.id)}
                >
                  {/* Block Header Controls */}
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-[11px] font-mono font-bold text-slate-400 dark:text-slate-500">#{idx + 1}</span>
                      <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-extrabold uppercase bg-purple-500/10 text-purple-600 dark:text-purple-400">
                        {block.type.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <div className="flex items-center space-x-1">
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); moveBlock(idx, 'up'); }}
                        disabled={idx === 0}
                        className="p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); moveBlock(idx, 'down'); }}
                        disabled={idx === blocks.length - 1}
                        className="p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); removeBlock(block.id); }}
                        className="p-1.5 text-rose-500 hover:text-rose-600 rounded-lg hover:bg-rose-500/10"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Block Type Editor Forms */}
                  {block.type === 'heading' && (
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Level:</label>
                        {(['h1', 'h2', 'h3'] as const).map(lvl => (
                          <button
                            key={lvl}
                            type="button"
                            onClick={() => updateBlock(block.id, { headingLevel: lvl })}
                            className={`px-3 py-1 text-xs font-black rounded-lg border uppercase transition ${
                              block.headingLevel === lvl
                                ? 'bg-purple-650 text-white border-purple-650'
                                : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                            }`}
                          >
                            {lvl}
                          </button>
                        ))}
                      </div>
                      <input
                        type="text"
                        value={block.content || ''}
                        onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                        placeholder="Enter section heading text..."
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs text-slate-900 dark:text-white font-bold focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  )}

                  {block.type === 'text' && (
                    <div className="space-y-2">
                      {/* Formatting Toolbar */}
                      <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                        <button type="button" onClick={() => applyTextFormat(block.id, '<b>', '</b>')} className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-slate-600 dark:text-slate-400"><Bold className="w-3.5 h-3.5" /></button>
                        <button type="button" onClick={() => applyTextFormat(block.id, '<i>', '</i>')} className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-slate-600 dark:text-slate-400"><Italic className="w-3.5 h-3.5" /></button>
                        <button type="button" onClick={() => applyTextFormat(block.id, '<blockquote>', '</blockquote>')} className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-slate-600 dark:text-slate-400"><Quote className="w-3.5 h-3.5" /></button>
                        <button type="button" onClick={() => applyTextFormat(block.id, '<ul><li>', '</li></ul>')} className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-slate-600 dark:text-slate-400"><List className="w-3.5 h-3.5" /></button>
                        <button type="button" onClick={() => applyTextFormat(block.id, '<ol><li>', '</li></ol>')} className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-slate-600 dark:text-slate-400"><ListOrdered className="w-3.5 h-3.5" /></button>
                        <div className="h-4 w-px bg-slate-300 dark:bg-slate-700 mx-1" />
                        <button type="button" onClick={() => updateBlock(block.id, { align: 'left' })} className={`p-1.5 rounded ${block.align === 'left' ? 'bg-purple-500/20 text-purple-600' : 'text-slate-400'}`}><AlignLeft className="w-3.5 h-3.5" /></button>
                        <button type="button" onClick={() => updateBlock(block.id, { align: 'center' })} className={`p-1.5 rounded ${block.align === 'center' ? 'bg-purple-500/20 text-purple-600' : 'text-slate-400'}`}><AlignCenter className="w-3.5 h-3.5" /></button>
                        <button type="button" onClick={() => updateBlock(block.id, { align: 'right' })} className={`p-1.5 rounded ${block.align === 'right' ? 'bg-purple-500/20 text-purple-600' : 'text-slate-400'}`}><AlignRight className="w-3.5 h-3.5" /></button>
                      </div>

                      <textarea
                        rows={4}
                        value={block.content || ''}
                        onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                        placeholder="Write article body paragraph text or HTML markup..."
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 leading-relaxed"
                      />
                    </div>
                  )}

                  {block.type === 'image' && (
                    <div className="space-y-3">
                      <ImageUploader
                        folder="products"
                        compact
                        label="Upload Article Image"
                        currentUrl={block.imageUrl}
                        onUploaded={(url: string) => updateBlock(block.id, { imageUrl: url })}
                        onRemove={() => updateBlock(block.id, { imageUrl: '' })}
                      />
                      <input
                        type="text"
                        value={block.caption || ''}
                        onChange={(e) => updateBlock(block.id, { caption: e.target.value })}
                        placeholder="Image caption / description..."
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white"
                      />
                    </div>
                  )}

                  {block.type === 'split_image_text' && (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Image Side:</label>
                        <button
                          type="button"
                          onClick={() => updateBlock(block.id, { imagePosition: 'left' })}
                          className={`px-3 py-1 text-xs font-bold rounded-lg border transition ${
                            block.imagePosition === 'left' ? 'bg-purple-650 text-white' : 'bg-slate-50 dark:bg-slate-900 text-slate-600'
                          }`}
                        >
                          Left
                        </button>
                        <button
                          type="button"
                          onClick={() => updateBlock(block.id, { imagePosition: 'right' })}
                          className={`px-3 py-1 text-xs font-bold rounded-lg border transition ${
                            block.imagePosition === 'right' ? 'bg-purple-650 text-white' : 'bg-slate-50 dark:bg-slate-900 text-slate-600'
                          }`}
                        >
                          Right
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <ImageUploader
                          folder="products"
                          compact
                          label="Section Image"
                          currentUrl={block.imageUrl}
                          onUploaded={(url: string) => updateBlock(block.id, { imageUrl: url })}
                          onRemove={() => updateBlock(block.id, { imageUrl: '' })}
                        />
                        <textarea
                          rows={4}
                          value={block.content || ''}
                          onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                          placeholder="Text description alongside image..."
                          className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>
                  )}

                  {block.type === 'banner' && (
                    <div className="space-y-3">
                      <ImageUploader
                        folder="banners"
                        compact
                        label="Hero Banner Image"
                        currentUrl={block.imageUrl}
                        onUploaded={(url: string) => updateBlock(block.id, { imageUrl: url })}
                        onRemove={() => updateBlock(block.id, { imageUrl: '' })}
                      />
                      <input
                        type="text"
                        value={block.bannerTitle || ''}
                        onChange={(e) => updateBlock(block.id, { bannerTitle: e.target.value })}
                        placeholder="Banner Headline Title..."
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white font-bold"
                      />
                      <input
                        type="text"
                        value={block.bannerSubtitle || ''}
                        onChange={(e) => updateBlock(block.id, { bannerSubtitle: e.target.value })}
                        placeholder="Banner Subtitle..."
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white"
                      />
                    </div>
                  )}

                  {block.type === 'quote' && (
                    <div className="space-y-3">
                      <textarea
                        rows={2}
                        value={block.content || ''}
                        onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                        placeholder="Quote text content..."
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs text-slate-900 dark:text-white italic"
                      />
                      <input
                        type="text"
                        value={block.quoteAuthor || ''}
                        onChange={(e) => updateBlock(block.id, { quoteAuthor: e.target.value })}
                        placeholder="Author / Attribution (e.g. Steve Jobs)"
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white"
                      />
                    </div>
                  )}

                  {block.type === 'callout' && (
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Box Style:</label>
                        {(['info', 'tip', 'warning'] as const).map(ct => (
                          <button
                            key={ct}
                            type="button"
                            onClick={() => updateBlock(block.id, { calloutType: ct })}
                            className={`px-3 py-1 text-xs font-bold uppercase rounded-lg border transition ${
                              block.calloutType === ct ? 'bg-purple-650 text-white' : 'bg-slate-50 dark:bg-slate-900 text-slate-600'
                            }`}
                          >
                            {ct}
                          </button>
                        ))}
                      </div>
                      <textarea
                        rows={2}
                        value={block.content || ''}
                        onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                        placeholder="Callout text message..."
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs text-slate-900 dark:text-white"
                      />
                    </div>
                  )}

                  {/* Interactive Table Builder */}
                  {block.type === 'table' && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-extrabold uppercase text-[10px] text-slate-400">Interactive Data Table</span>
                        <div className="flex items-center space-x-2">
                          <button
                            type="button"
                            onClick={() => addTableColumn(block.id)}
                            className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-purple-500 hover:text-white rounded-lg font-bold text-[11px] transition"
                          >
                            + Column
                          </button>
                          <button
                            type="button"
                            onClick={() => addTableRow(block.id)}
                            className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-purple-500 hover:text-white rounded-lg font-bold text-[11px] transition"
                          >
                            + Row
                          </button>
                        </div>
                      </div>

                      <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-2xl">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead className="bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-bold">
                            <tr>
                              {(block.tableHeaders || []).map((th, cIdx) => (
                                <th key={cIdx} className="p-2 border-b border-slate-200 dark:border-slate-800">
                                  <div className="flex items-center justify-between space-x-1">
                                    <input
                                      type="text"
                                      value={th}
                                      onChange={(e) => {
                                        const newHeaders = [...(block.tableHeaders || [])];
                                        newHeaders[cIdx] = e.target.value;
                                        updateBlock(block.id, { tableHeaders: newHeaders });
                                      }}
                                      className="bg-transparent font-bold text-xs text-purple-600 dark:text-purple-400 focus:outline-none w-full"
                                    />
                                    {(block.tableHeaders || []).length > 1 && (
                                      <button
                                        type="button"
                                        onClick={() => removeTableColumn(block.id, cIdx)}
                                        className="text-rose-400 hover:text-rose-600 text-[10px] font-bold p-1"
                                      >
                                        ×
                                      </button>
                                    )}
                                  </div>
                                </th>
                              ))}
                              <th className="p-2 w-8"></th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                            {(block.tableRows || []).map((row, rIdx) => (
                              <tr key={rIdx}>
                                {row.map((cell, cIdx) => (
                                  <td key={cIdx} className="p-2 border-r border-slate-100 dark:border-slate-800/40">
                                    <input
                                      type="text"
                                      value={cell}
                                      onChange={(e) => {
                                        const newRows = [...(block.tableRows || [])];
                                        newRows[rIdx][cIdx] = e.target.value;
                                        updateBlock(block.id, { tableRows: newRows });
                                      }}
                                      className="bg-transparent text-xs text-slate-800 dark:text-slate-200 focus:outline-none w-full"
                                    />
                                  </td>
                                ))}
                                <td className="p-2 text-center">
                                  <button
                                    type="button"
                                    onClick={() => removeTableRow(block.id, rIdx)}
                                    className="text-rose-400 hover:text-rose-600 text-[11px] font-bold"
                                  >
                                    <Trash2 className="w-3.5 h-3.5 inline" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {block.type === 'custom_html' && (
                    <textarea
                      rows={4}
                      value={block.content || ''}
                      onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                      placeholder="Insert custom HTML code / embed widget..."
                      className="w-full bg-slate-900 text-emerald-400 font-mono text-xs border border-slate-800 rounded-xl p-3 focus:outline-none"
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Storefront Live Article Preview */
        <div className="bg-white dark:bg-[#0c0d15] border border-black/10 dark:border-slate-800 rounded-3xl p-6 sm:p-10 space-y-8 shadow-xl">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-purple-600 dark:text-purple-400">Live Article Render Preview</span>
          </div>

          {blocks.map((block) => (
            <div key={block.id}>
              {block.type === 'heading' && (
                <div className="pt-2">
                  {block.headingLevel === 'h1' && <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">{block.content || 'Heading Title'}</h1>}
                  {block.headingLevel === 'h2' && <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{block.content || 'Section Title'}</h2>}
                  {block.headingLevel === 'h3' && <h3 className="text-xl font-bold text-slate-900 dark:text-white">{block.content || 'Sub-section Title'}</h3>}
                </div>
              )}

              {block.type === 'text' && (
                <div
                  className="text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed space-y-3"
                  style={{ textAlign: block.align || 'left' }}
                  dangerouslySetInnerHTML={{ __html: block.content || '<p>Paragraph text content...</p>' }}
                />
              )}

              {block.type === 'image' && block.imageUrl && (
                <div className="space-y-2">
                  <div className="aspect-video w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
                    <img src={block.imageUrl} alt={block.caption || 'Article image'} className="w-full h-full object-cover" />
                  </div>
                  {block.caption && <p className="text-xs text-center text-slate-500 dark:text-slate-400 italic">{block.caption}</p>}
                </div>
              )}

              {block.type === 'split_image_text' && (
                <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 items-center`}>
                  {block.imagePosition === 'left' && (
                    <div className="aspect-video rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
                      <img src={block.imageUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600'} alt="Split section" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: block.content || 'Text content...' }} />
                  {block.imagePosition === 'right' && (
                    <div className="aspect-video rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
                      <img src={block.imageUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600'} alt="Split section" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              )}

              {block.type === 'banner' && (
                <div className="relative rounded-3xl overflow-hidden aspect-[21/9] bg-slate-900 flex items-center justify-center p-6 text-center text-white">
                  {block.imageUrl && <img src={block.imageUrl} alt="Banner" className="absolute inset-0 w-full h-full object-cover opacity-50" />}
                  <div className="relative z-10 space-y-2">
                    <h2 className="text-2xl sm:text-4xl font-black">{block.bannerTitle || 'Hero Banner Headline'}</h2>
                    <p className="text-sm opacity-90">{block.bannerSubtitle || 'Banner Subtitle text...'}</p>
                  </div>
                </div>
              )}

              {block.type === 'quote' && (
                <blockquote className="p-6 bg-purple-50 dark:bg-purple-950/20 border-l-4 border-purple-650 rounded-r-2xl space-y-2">
                  <p className="text-base font-bold italic text-slate-900 dark:text-white">"{block.content || 'Quote text...'}"</p>
                  {block.quoteAuthor && <footer className="text-xs font-semibold text-purple-600 dark:text-purple-400">— {block.quoteAuthor}</footer>}
                </blockquote>
              )}

              {block.type === 'callout' && (
                <div className={`p-4 rounded-2xl border flex items-start space-x-3 text-xs ${
                  block.calloutType === 'warning' ? 'bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-300' :
                  block.calloutType === 'tip' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300' :
                  'bg-blue-500/10 border-blue-500/30 text-blue-700 dark:text-blue-300'
                }`}>
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div dangerouslySetInnerHTML={{ __html: block.content || 'Callout message...' }} />
                </div>
              )}

              {block.type === 'table' && (
                <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-2xl">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white font-extrabold uppercase">
                      <tr>
                        {(block.tableHeaders || []).map((th, i) => (
                          <th key={i} className="p-3 border-b border-slate-200 dark:border-slate-800">{th}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                      {(block.tableRows || []).map((row, rIdx) => (
                        <tr key={rIdx}>
                          {row.map((cell, cIdx) => (
                            <td key={cIdx} className="p-3 text-slate-700 dark:text-slate-300">{cell}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {block.type === 'custom_html' && (
                <div dangerouslySetInnerHTML={{ __html: block.content || '' }} />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
