'use client';

import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Folder, FolderOpen, Plus, Edit, Trash, Image as ImageIcon, Eye, EyeOff } from 'lucide-react';

interface CategoryNode {
  id: string;
  name: string;
  slug: string;
  parentId?: string | null;
  iconUrl?: string | null;
  bannerUrl?: string | null;
  visible?: boolean;
  featured?: boolean;
}

interface CmsCategoryTreeProps {
  categories: CategoryNode[];
  onAddCategory: (parentId?: string) => void;
  onEditCategory: (category: CategoryNode) => void;
  onDeleteCategory: (id: string) => void;
}

export default function CmsCategoryTree({
  categories,
  onAddCategory,
  onEditCategory,
  onDeleteCategory,
}: CmsCategoryTreeProps) {
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpandedIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const rootCategories = categories.filter(c => !c.parentId);
  const getSubcategories = (parentId: string) => categories.filter(c => c.parentId === parentId);

  return (
    <div className="space-y-4 bg-white dark:bg-[#0c0d15] border border-black/10 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <h3 className="text-base font-black font-display text-slate-900 dark:text-white">CMS & Catalogue Hierarchy</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Manage parent categories, sub-categories, icons, and visibility.</p>
        </div>
        <button
          onClick={() => onAddCategory()}
          className="py-2 px-3.5 bg-purple-650 dark:bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl transition inline-flex items-center space-x-1.5 shadow-md shadow-purple-650/20"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Root Category</span>
        </button>
      </div>

      <div className="space-y-2">
        {rootCategories.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 dark:bg-slate-900/40 rounded-2xl">
            <p className="text-xs text-slate-500 font-semibold">No categories registered yet.</p>
          </div>
        ) : (
          rootCategories.map((root) => {
            const subs = getSubcategories(root.id);
            const isExpanded = expandedIds[root.id] ?? true;

            return (
              <div key={root.id} className="border border-slate-200 dark:border-slate-800/80 rounded-2xl overflow-hidden">
                {/* Root Node Row */}
                <div className="flex items-center justify-between p-3 bg-slate-50/80 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-900 transition">
                  <div className="flex items-center space-x-3">
                    {subs.length > 0 ? (
                      <button
                        onClick={() => toggleExpand(root.id)}
                        className="p-1 text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
                      >
                        {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                      </button>
                    ) : (
                      <span className="w-6" />
                    )}

                    {root.iconUrl ? (
                      <img src={root.iconUrl} alt={root.name} className="w-6 h-6 rounded-lg object-cover" />
                    ) : (
                      <Folder className="w-5 h-5 text-purple-500" />
                    )}

                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-xs text-slate-900 dark:text-white">{root.name}</span>
                        <span className="font-mono text-[10px] text-slate-400">/{root.slug}</span>
                        {root.featured && (
                          <span className="px-1.5 py-0.2 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded text-[9px] font-black">
                            FEATURED
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-500 font-semibold">{subs.length} sub-categories</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onAddCategory(root.id)}
                      title="Add Sub-category"
                      className="px-2.5 py-1 bg-purple-500/10 hover:bg-purple-500 text-purple-600 dark:text-purple-400 hover:text-white rounded-lg text-[10px] font-bold transition inline-flex items-center space-x-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Sub-category</span>
                    </button>
                    <button
                      onClick={() => onEditCategory(root)}
                      className="p-1.5 bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-purple-600 rounded-lg transition"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteCategory(root.id)}
                      className="p-1.5 bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white rounded-lg transition"
                    >
                      <Trash className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Sub-categories List */}
                {isExpanded && subs.length > 0 && (
                  <div className="divide-y divide-slate-100 dark:divide-slate-800/40 bg-white dark:bg-[#0c0d15] pl-8">
                    {subs.map(sub => (
                      <div key={sub.id} className="flex items-center justify-between p-2.5 hover:bg-slate-50 dark:hover:bg-slate-900/30 transition">
                        <div className="flex items-center space-x-2.5">
                          <span className="text-slate-300 dark:text-slate-700">↳</span>
                          {sub.iconUrl ? (
                            <img src={sub.iconUrl} alt={sub.name} className="w-5 h-5 rounded-md object-cover" />
                          ) : (
                            <Folder className="w-4 h-4 text-blue-500" />
                          )}
                          <div>
                            <span className="font-semibold text-xs text-slate-800 dark:text-slate-200">{sub.name}</span>
                            <span className="font-mono text-[10px] text-slate-400 ml-2">/{sub.slug}</span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-1.5">
                          <button
                            onClick={() => onEditCategory(sub)}
                            className="p-1 text-slate-400 hover:text-purple-600 dark:hover:text-white transition"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteCategory(sub.id)}
                            className="p-1 text-rose-400 hover:text-rose-600 transition"
                          >
                            <Trash className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
