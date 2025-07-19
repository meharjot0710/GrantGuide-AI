"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, User, Camera, Menu, X } from "lucide-react"
import ProtectedRoute from "../../components/ProtectedRoute"
import { useAuth } from "../../hooks/useAuth"

export default function ApplicationsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout } = useAuth();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white shadow-sm border-b px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">G</span>
            </div>
            <span className="ml-2 text-xl font-bold">GrantGuide AI</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden"
          >
            {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </Button>
        </div>

        <div className="flex">
          {/* Sidebar */}
          <div className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-sm border-r transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}>
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">G</span>
                  </div>
                  <span className="ml-2 text-xl font-bold">GrantGuide AI</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(false)}
                  className="lg:hidden"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <nav className="px-4 space-y-2">
              <Link 
                href="/dashboard" 
                className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                onClick={() => setSidebarOpen(false)}
              >
                <LayoutDashboard className="w-5 h-5 mr-3" />
                Dashboard
              </Link>
              <Link 
                href="/profile" 
                className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                onClick={() => setSidebarOpen(false)}
              >
                <User className="w-5 h-5 mr-3" />
                Account
              </Link>
              <Link 
                href="/applications" 
                className="flex items-center px-4 py-2 text-gray-900 bg-gray-100 rounded-lg"
                onClick={() => setSidebarOpen(false)}
              >
                <User className="w-5 h-5 mr-3" />
                My Applications
              </Link>
            </nav>
            <div className="px-4 mt-6">
              <Button variant="destructive" className="w-full" onClick={logout}>
                Logout
              </Button>
            </div>
          </div>

          {/* Overlay for mobile */}
          {sidebarOpen && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          
        </div>
      </div>
    </ProtectedRoute>
  )
}
