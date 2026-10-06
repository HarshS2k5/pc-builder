'use client'

import React, { useState, useEffect } from 'react'
import {
  SavedBuild,
  BuildParts,
  Currency,
} from '@/types/pc-builder'
import {
  getSavedBuilds,
  saveBuildToStorage,
  deleteSavedBuild,
  duplicateSavedBuild,
  exportBuildToMarkdown,
} from '@/lib/pc-builder/build-storage'
import { findComponentById } from '@/lib/pc-builder/components-data'
import { formatCurrency, calculateBuildPrice } from '@/lib/pc-builder/price-calculator'
import {
  FolderOpen,
  X,
  Trash2,
  Copy,
  Edit2,
  Check,
  Plus,
  Share2,
  FileText,
  Calendar,
} from 'lucide-react'

interface SavedBuildsModalProps {
  isOpen: boolean
  onClose: () => void
  currentBuild: BuildParts
  currency: Currency
  onLoadBuild: (parts: BuildParts) => void
}

export function SavedBuildsModal({
  isOpen,
  onClose,
  currentBuild,
  currency,
  onLoadBuild,
}: SavedBuildsModalProps) {
  const [savedBuilds, setSavedBuilds] = useState<SavedBuild[]>([])
  const [newBuildName, setNewBuildName] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [copiedMarkdown, setCopiedMarkdown] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setSavedBuilds(getSavedBuilds())
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleSaveCurrent = () => {
    if (!newBuildName.trim()) return
    const saved = saveBuildToStorage(newBuildName.trim(), currentBuild, currency)
    setSavedBuilds(getSavedBuilds())
    setNewBuildName('')
  }

  const handleDelete = (id: string) => {
    const updated = deleteSavedBuild(id)
    setSavedBuilds(updated)
  }

  const handleDuplicate = (id: string) => {
    duplicateSavedBuild(id)
    setSavedBuilds(getSavedBuilds())
  }

  const handleStartEdit = (b: SavedBuild) => {
    setEditingId(b.id)
    setEditName(b.name)
  }

  const handleSaveRename = (id: string) => {
    const builds = getSavedBuilds()
    const target = builds.find((b) => b.id === id)
    if (target && editName.trim()) {
      target.name = editName.trim()
      target.updatedAt = new Date().toISOString()
      localStorage.setItem('gamerank_techforge_saved_builds_v1', JSON.stringify(builds))
      setSavedBuilds(builds)
    }
    setEditingId(null)
  }

  const handleLoad = (b: SavedBuild) => {
    const parts: BuildParts = {}
    for (const [cat, id] of Object.entries(b.partIds)) {
      if (id) {
        const item = findComponentById(id)
        if (item) (parts as any)[cat] = item
      }
    }
    onLoadBuild(parts)
    onClose()
  }

  const handleExportMarkdownCurrent = () => {
    const md = exportBuildToMarkdown(currentBuild, currency)
    navigator.clipboard.writeText(md)
    setCopiedMarkdown(true)
    setTimeout(() => setCopiedMarkdown(false), 2000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-[#141414] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#1a1a1a]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00ff88]/10 border border-[#00ff88]/30 flex items-center justify-center text-[#00ff88]">
              <FolderOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Saved PC Builds</h2>
              <p className="text-xs text-gray-400">
                Store, rename, duplicate, and load your custom rigs locally
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Save Current Build Input */}
        <div className="p-4 px-6 border-b border-white/10 bg-[#111111] space-y-2">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
            Save Current Active Configuration
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newBuildName}
              onChange={(e) => setNewBuildName(e.target.value)}
              placeholder="e.g. My Next 1440p AM5 Battlestation..."
              className="flex-1 px-3.5 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00ff88]/50"
            />
            <button
              onClick={handleSaveCurrent}
              disabled={!newBuildName.trim()}
              className="px-4 py-2 bg-[#00ff88] disabled:opacity-40 disabled:hover:scale-100 hover:bg-[#00e87a] text-black font-bold text-xs rounded-xl transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Save Build
            </button>
          </div>
        </div>

        {/* Saved Builds List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {savedBuilds.length === 0 ? (
            <div className="py-12 text-center">
              <FolderOpen className="w-10 h-10 text-gray-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-300">No saved builds found</p>
              <p className="text-xs text-gray-500 mt-0.5">
                Save your active configuration above to recall it anytime.
              </p>
            </div>
          ) : (
            savedBuilds.map((b) => {
              const partCount = Object.values(b.partIds).filter(Boolean).length

              // Reconstruct price
              let buildTotal = 0
              for (const id of Object.values(b.partIds)) {
                if (id) {
                  const item = findComponentById(id)
                  if (item) {
                    buildTotal += currency === 'INR' ? item.priceInr : item.priceUsd
                  }
                }
              }

              return (
                <div
                  key={b.id}
                  className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      {editingId === b.id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="px-2 py-1 bg-white/10 border border-[#00ff88]/50 rounded-lg text-xs text-white focus:outline-none"
                          />
                          <button
                            onClick={() => handleSaveRename(b.id)}
                            className="p-1 text-[#00ff88] hover:bg-white/10 rounded"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-white truncate">{b.name}</h4>
                          <button
                            onClick={() => handleStartEdit(b)}
                            aria-label="Rename build"
                            className="text-gray-500 hover:text-gray-300"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}

                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-gray-400 mt-1">
                        <span>{partCount} Components</span>
                        <span>•</span>
                        <span className="font-mono text-[#00ff88] font-bold">
                          {formatCurrency(buildTotal, currency)}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 font-mono text-gray-500">
                          <Calendar className="w-3 h-3" />
                          {new Date(b.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => handleLoad(b)}
                        className="px-3 py-1.5 bg-[#00ff88] hover:bg-[#00e87a] text-black font-bold text-xs rounded-lg transition-colors"
                      >
                        Load Build
                      </button>

                      <button
                        onClick={() => handleDuplicate(b.id)}
                        title="Duplicate"
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDelete(b.id)}
                        title="Delete"
                        className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-white/10 bg-[#1a1a1a] flex items-center justify-between">
          <button
            onClick={handleExportMarkdownCurrent}
            className="flex items-center gap-1.5 text-xs text-gray-300 hover:text-[#00ff88] transition-colors"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{copiedMarkdown ? 'Copied Markdown to Clipboard!' : 'Export Current Build to Reddit/Markdown'}</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-white/10 hover:bg-white/15 text-white text-xs font-semibold rounded-xl transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
