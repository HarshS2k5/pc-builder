import { AdminMonetizationDashboard } from '@/components/admin/AdminMonetizationDashboard'
import Link from 'next/link'
import { ShieldCheck, ArrowLeft } from 'lucide-react'

export const metadata = {
  title: 'Admin Monetization & Retailer Desk | RigCraft',
  robots: 'noindex, nofollow',
}

export default function AdminPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
      <AdminMonetizationDashboard />
    </div>
  )
}
