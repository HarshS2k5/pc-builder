'use client'

import React, { useState, useEffect } from 'react'
import {
  MonetizationSettings,
  SponsoredPlacement,
  RetailerConfig,
} from '@/types/pc-builder'
import {
  Lock,
  ShieldCheck,
  Check,
  Plus,
  Trash2,
  Save,
  BarChart3,
  ExternalLink,
  DollarSign,
  Layers,
  AlertCircle,
  Eye,
} from 'lucide-react'

export function AdminMonetizationDashboard() {
  const [adminKey, setAdminKey] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [activeTab, setActiveTab] = useState<'retailers' | 'sponsored' | 'analytics'>('retailers')

  const [settings, setSettings] = useState<MonetizationSettings | null>(null)
  const [sponsoredList, setSponsoredList] = useState<SponsoredPlacement[]>([])
  const [analyticsData, setAnalyticsData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  // Form for new sponsored placement
  const [newSponsor, setNewSponsor] = useState({
    componentId: 'cpu-r7-7800x3d',
    category: 'cpu',
    sponsorName: '',
    badgeLabel: 'Featured Partner',
    destinationUrl: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    isActive: true,
    disclaimer: 'Sponsored product placement.',
  })

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')

    try {
      const res = await fetch(`/api/admin/monetization?key=${encodeURIComponent(adminKey.trim())}`)
      if (res.ok) {
        const json = await res.json()
        setSettings(json.settings)
        setIsAuthenticated(true)
        sessionStorage.setItem('rigcraft_admin_key', adminKey.trim())
        fetchAnalytics(adminKey.trim())
      } else {
        setErrorMsg('Invalid admin credentials. Please try again.')
      }
    } catch {
      setErrorMsg('Failed to connect to admin API.')
    } finally {
      setLoading(false)
    }
  }

  const fetchAnalytics = async (key: string) => {
    try {
      const res = await fetch(`/api/analytics/events?key=${encodeURIComponent(key)}`)
      if (res.ok) {
        const json = await res.json()
        setAnalyticsData(json.data)
      }
    } catch {
      // Ignore
    }
  }

  useEffect(() => {
    const saved = sessionStorage.getItem('rigcraft_admin_key')
    if (saved) {
      setAdminKey(saved)
      fetch(`/api/admin/monetization?key=${encodeURIComponent(saved)}`)
        .then((r) => (r.ok ? r.json() : null))
        .then((json) => {
          if (json?.settings) {
            setSettings(json.settings)
            setIsAuthenticated(true)
            fetchAnalytics(saved)
          }
        })
        .catch(() => {})
    }
  }, [])

  const handleSaveSettings = async () => {
    if (!settings) return
    setLoading(true)
    setSaveSuccess(false)
    setErrorMsg('')

    try {
      const res = await fetch('/api/admin/monetization', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: adminKey,
          settings,
          sponsored: sponsoredList,
        }),
      })

      if (res.ok) {
        setSaveSuccess(true)
        setTimeout(() => setSaveSuccess(false), 3000)
      } else {
        setErrorMsg('Failed to save settings.')
      }
    } catch {
      setErrorMsg('Connection error saving settings.')
    } finally {
      setLoading(false)
    }
  }

  const handleRetailerTagChange = (id: string, tagValue: string) => {
    if (!settings) return
    setSettings({
      ...settings,
      retailers: settings.retailers.map((r) =>
        r.id === id ? { ...r, affiliateTagValue: tagValue } : r
      ),
    })
  }

  const handleRetailerToggle = (id: string, isEnabled: boolean) => {
    if (!settings) return
    setSettings({
      ...settings,
      retailers: settings.retailers.map((r) =>
        r.id === id ? { ...r, isEnabled } : r
      ),
    })
  }

  const handleAddSponsored = () => {
    if (!newSponsor.sponsorName.trim() || !newSponsor.destinationUrl.trim()) {
      alert('Please enter sponsor name and destination URL.')
      return
    }

    const item: SponsoredPlacement = {
      id: `sp-${Date.now()}`,
      componentId: newSponsor.componentId,
      category: newSponsor.category as any,
      sponsorName: newSponsor.sponsorName,
      badgeLabel: newSponsor.badgeLabel,
      placementSlot: 'builder-featured',
      destinationUrl: newSponsor.destinationUrl,
      startDate: newSponsor.startDate,
      endDate: newSponsor.endDate,
      isActive: newSponsor.isActive,
      disclaimer: newSponsor.disclaimer,
    }

    setSponsoredList([...sponsoredList, item])
    setNewSponsor({
      ...newSponsor,
      sponsorName: '',
      destinationUrl: '',
    })
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 rounded-3xl bg-[#12141a] border border-white/10 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#00ff88]/10 text-[#00ff88] mx-auto flex items-center justify-center">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tight">
            Monetization Desk
          </h2>
          <p className="text-xs text-gray-400">
            Protected management area for affiliate networks and sponsored products
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-mono uppercase text-gray-400 font-bold block mb-1.5">
              Admin Access Key
            </label>
            <input
              type="password"
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
              placeholder="Enter admin secret key..."
              className="w-full bg-[#181c26] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#00ff88]"
              required
            />
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary text-xs font-bold py-3 flex items-center justify-center gap-2 shadow-lg shadow-[#00ff88]/20"
          >
            <span>{loading ? 'Authenticating...' : 'Unlock Admin Desk'}</span>
          </button>
        </form>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <span className="text-xs font-mono font-bold uppercase text-[#00ff88] bg-[#00ff88]/10 px-2.5 py-0.5 rounded-full border border-[#00ff88]/20">
            Authenticated Admin Desk
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight mt-1">
            Monetization &amp; Retailer Portal
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {saveSuccess && (
            <span className="text-xs text-[#00ff88] font-bold flex items-center gap-1 font-mono">
              <Check className="w-4 h-4" /> Saved!
            </span>
          )}
          <button
            onClick={handleSaveSettings}
            disabled={loading}
            className="btn-primary text-xs font-bold py-2 px-4 flex items-center gap-1.5 shadow-md shadow-[#00ff88]/20"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save All Changes</span>
          </button>
          <button
            onClick={() => {
              sessionStorage.removeItem('rigcraft_admin_key')
              setIsAuthenticated(false)
            }}
            className="btn-secondary text-xs font-bold py-2 px-3"
          >
            Lock
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2">
        <button
          onClick={() => setActiveTab('retailers')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'retailers'
              ? 'bg-[#00ff88] text-black'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          Affiliate Retailers &amp; Tags
        </button>
        <button
          onClick={() => setActiveTab('sponsored')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'sponsored'
              ? 'bg-[#00ff88] text-black'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          Sponsored Placements ({sponsoredList.length})
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'analytics'
              ? 'bg-[#00ff88] text-black'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          Outbound Click Telemetry
        </button>
      </div>

      {/* TAB 1: RETAILERS */}
      {activeTab === 'retailers' && settings && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-xs text-gray-300">
            Configure partner tags for hardware stores. When users click "Check Price", RigCraft appends these tags automatically without modifying code.
          </div>

          <div className="divide-y divide-white/10 border border-white/10 rounded-2xl overflow-hidden bg-[#12141a]">
            {settings.retailers.map((ret) => (
              <div
                key={ret.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{ret.name}</span>
                    <span className="text-[10px] font-mono text-gray-400 bg-white/5 px-1.5 rounded">
                      {ret.region}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 font-mono block mt-0.5">
                    {ret.baseUrl} &bull; Parameter: <code className="text-[#00d4ff]">{ret.affiliateTagParam}</code>
                  </span>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="flex-1 sm:w-60">
                    <input
                      type="text"
                      value={ret.affiliateTagValue}
                      onChange={(e) => handleRetailerTagChange(ret.id, e.target.value)}
                      placeholder="Affiliate Tag / Store ID..."
                      className="w-full bg-[#181c26] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-[#00ff88]"
                    />
                  </div>

                  <label className="flex items-center gap-1.5 text-xs text-gray-300 cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={ret.isEnabled}
                      onChange={(e) => handleRetailerToggle(ret.id, e.target.checked)}
                      className="rounded accent-[#00ff88]"
                    />
                    <span>Active</span>
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: SPONSORED PLACEMENTS */}
      {activeTab === 'sponsored' && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-xs text-gray-300">
            Legitimate sponsor placements only. Always labeled "Featured Partner" or "Sponsored Choice". Never faked or disguised as organic benchmarks.
          </div>

          {/* Add Form */}
          <div className="p-6 rounded-3xl bg-[#12141a] border border-white/10 space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Add Verified Sponsor Placement
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="text-gray-400 font-mono block mb-1">Sponsor / Brand Name</label>
                <input
                  type="text"
                  value={newSponsor.sponsorName}
                  onChange={(e) => setNewSponsor({ ...newSponsor, sponsorName: e.target.value })}
                  placeholder="e.g. Corsair, ASUS, DeepCool..."
                  className="w-full bg-[#181c26] border border-white/10 rounded-xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="text-gray-400 font-mono block mb-1">Destination URL</label>
                <input
                  type="url"
                  value={newSponsor.destinationUrl}
                  onChange={(e) => setNewSponsor({ ...newSponsor, destinationUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full bg-[#181c26] border border-white/10 rounded-xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="text-gray-400 font-mono block mb-1">Badge Label</label>
                <input
                  type="text"
                  value={newSponsor.badgeLabel}
                  onChange={(e) => setNewSponsor({ ...newSponsor, badgeLabel: e.target.value })}
                  placeholder="Featured Partner"
                  className="w-full bg-[#181c26] border border-white/10 rounded-xl p-2.5 text-white"
                />
              </div>
            </div>

            <button
              onClick={handleAddSponsored}
              className="btn-primary text-xs font-bold py-2.5 px-4 flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Placement</span>
            </button>
          </div>

          {/* List */}
          <div className="space-y-3">
            {sponsoredList.length === 0 ? (
              <div className="p-8 rounded-2xl bg-white/5 border border-white/5 text-center text-xs text-gray-500">
                No active sponsor placements configured. System remains 100% organic.
              </div>
            ) : (
              sponsoredList.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-[#12141a] border border-white/10 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-white text-sm">{item.sponsorName}</span>
                    <span className="text-[10px] text-gray-400 font-mono block mt-0.5">
                      {item.destinationUrl} &bull; {item.startDate} to {item.endDate}
                    </span>
                  </div>

                  <button
                    onClick={() => setSponsoredList(sponsoredList.filter((s) => s.id !== item.id))}
                    className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 3: ANALYTICS TELEMETRY */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-[#12141a] border border-white/10">
              <span className="text-[10px] font-mono uppercase text-gray-400 block font-bold">
                Check Price Clicks
              </span>
              <div className="text-3xl font-black text-[#00ff88] font-mono mt-1">
                {analyticsData?.summary?.check_price_clicked || 0}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#12141a] border border-white/10">
              <span className="text-[10px] font-mono uppercase text-gray-400 block font-bold">
                Builds Configured
              </span>
              <div className="text-3xl font-black text-white font-mono mt-1">
                {analyticsData?.summary?.build_created || 0}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#12141a] border border-white/10">
              <span className="text-[10px] font-mono uppercase text-gray-400 block font-bold">
                Comparisons Viewed
              </span>
              <div className="text-3xl font-black text-[#00d4ff] font-mono mt-1">
                {analyticsData?.summary?.comparison_viewed || 0}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#12141a] border border-white/10">
              <span className="text-[10px] font-mono uppercase text-gray-400 block font-bold">
                Recommendations Run
              </span>
              <div className="text-3xl font-black text-purple-400 font-mono mt-1">
                {analyticsData?.summary?.recommendation_generated || 0}
              </div>
            </div>
          </div>

          {/* Retailer Clicks Breakdown */}
          <div className="p-6 rounded-3xl bg-[#12141a] border border-white/10 space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Retailer Click Attribution
            </h4>
            {analyticsData?.retailerClicks && Object.keys(analyticsData.retailerClicks).length > 0 ? (
              <div className="space-y-2">
                {Object.entries(analyticsData.retailerClicks).map(([ret, count]) => (
                  <div key={ret} className="flex justify-between text-xs py-1.5 border-b border-white/5">
                    <span className="text-gray-300 font-bold">{ret}</span>
                    <span className="font-mono text-[#00ff88] font-bold">{String(count)} clicks</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-500">
                Zero clicks recorded yet. Outbound telemetry will appear here as users engage with "Check Price" buttons.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
