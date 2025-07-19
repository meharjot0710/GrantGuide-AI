"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LayoutDashboard, User, Camera, Menu, X } from "lucide-react"
import ProtectedRoute from "../../components/ProtectedRoute"
import axios from "axios"
import { useAuth } from "../../hooks/useAuth"

export default function ProfilePage() {
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    organizationType: '',
    location: '',
    contactPerson: '',
    phoneNumber: '',
    website: '',
    foundedYear: '',
    description: '',
  })
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout } = useAuth();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://grantguide-ai.onrender.com';

  useEffect(() => {
    async function fetchProfile() {
      const token = localStorage.getItem('token');
      if (!token) return setLoading(false);
      try {
        const res = await axios.get(`${apiUrl}/api/user/get-info`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const user = res.data.user;
        setProfileData({
          name: user.name || '',
          email: user.email || '',
          organizationType: user.userType || '',
          location: user.region ? `${user.region}${user.country ? ', ' + user.country : ''}` : (user.country || ''),
          contactPerson: user.domainFocus || '',
          phoneNumber: user.phone || '',
          website: '',
          foundedYear: '',
          description: user.goals || '',
        });
      } catch (err) {
        // Optionally handle error
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const token = localStorage.getItem('token');
      const payload = {
        name: profileData.name,
        email: profileData.email,
        userType: profileData.organizationType,
        // Split location into region and country if possible
        region: profileData.location.split(',')[0]?.trim() || '',
        country: profileData.location.split(',')[1]?.trim() || '',
        domainFocus: profileData.contactPerson,
        phone: profileData.phoneNumber,
        website: profileData.website,
        foundedYear: profileData.foundedYear,
        goals: profileData.description,
      };
      await axios.post(`${apiUrl}/api/user/update-info`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Profile updated successfully!');
    } catch (err) {
      alert('Failed to update profile.');
    } finally {
      setSubmitting(false);
    }
  }

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
                className="flex items-center px-4 py-2 text-gray-900 bg-gray-100 rounded-lg"
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

          {/* Main Content */}
          <div className="flex-1 p-4 lg:p-8">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6 lg:mb-8">Profile Settings</h1>
              {loading ? (
                <div className="text-center py-10">Loading...</div>
              ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                {/* Profile Picture Section */}
                <div className="lg:col-span-1">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg lg:text-xl">Profile Picture</CardTitle>
                      <CardDescription className="text-sm lg:text-base">Update your organization's profile image</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center">
                      <Avatar className="w-24 h-24 lg:w-32 lg:h-32 mb-4">
                        <AvatarImage src="/Mehar.jpg?height=128&width=128" />
                        <AvatarFallback className="text-lg lg:text-2xl">BM</AvatarFallback>
                      </Avatar>
                      <Button variant="outline" className="w-full bg-transparent text-sm lg:text-base">
                        <Camera className="w-4 h-4 mr-2" />
                        Change Picture
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                {/* Profile Information */}
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg lg:text-xl">Organization Information</CardTitle>
                      <CardDescription className="text-sm lg:text-base">Update your organization details</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="name" className="text-sm lg:text-base">Organization Name</Label>
                            <Input
                              id="name"
                              value={profileData.name}
                              onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                              className="text-sm lg:text-base"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm lg:text-base">Email</Label>
                            <Input
                              id="email"
                              type="email"
                              value={profileData.email}
                              onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                              className="text-sm lg:text-base"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="organizationType" className="text-sm lg:text-base">Organization Type</Label>
                            <Input
                              id="organizationType"
                              value={profileData.organizationType}
                              onChange={(e) => setProfileData({ ...profileData, organizationType: e.target.value })}
                              className="text-sm lg:text-base"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="location" className="text-sm lg:text-base">Location</Label>
                            <Input
                              id="location"
                              value={profileData.location}
                              onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                              className="text-sm lg:text-base"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="contactPerson" className="text-sm lg:text-base">Contact Person</Label>
                            <Input
                              id="contactPerson"
                              value={profileData.contactPerson}
                              onChange={(e) => setProfileData({ ...profileData, contactPerson: e.target.value })}
                              className="text-sm lg:text-base"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="phoneNumber" className="text-sm lg:text-base">Phone Number</Label>
                            <Input
                              id="phoneNumber"
                              value={profileData.phoneNumber}
                              onChange={(e) => setProfileData({ ...profileData, phoneNumber: e.target.value })}
                              className="text-sm lg:text-base"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="website" className="text-sm lg:text-base">Website</Label>
                            <Input
                              id="website"
                              value={profileData.website}
                              onChange={(e) => setProfileData({ ...profileData, website: e.target.value })}
                              className="text-sm lg:text-base"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="foundedYear" className="text-sm lg:text-base">Founded Year</Label>
                            <Input
                              id="foundedYear"
                              value={profileData.foundedYear}
                              onChange={(e) => setProfileData({ ...profileData, foundedYear: e.target.value })}
                              className="text-sm lg:text-base"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="description" className="text-sm lg:text-base">Organization Description</Label>
                          <Textarea
                            id="description"
                            value={profileData.description}
                            onChange={(e) => setProfileData({ ...profileData, description: e.target.value })}
                            rows={4}
                            className="text-sm lg:text-base"
                          />
                        </div>

                        <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4">
                          <Button variant="outline" type="button" className="w-full sm:w-auto text-sm lg:text-base">Cancel</Button>
                          <Button type="submit" disabled={submitting} className="w-full sm:w-auto text-sm lg:text-base">
                            {submitting ? 'Saving...' : 'Save Changes'}
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                </div>
              </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
