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
import { LayoutDashboard, User, Camera } from "lucide-react"
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
  const { logout } = useAuth();

  useEffect(() => {
    async function fetchProfile() {
      const token = localStorage.getItem('token');
      if (!token) return setLoading(false);
      try {
        const res = await axios.get('http://localhost:5000/api/user/get-info', {
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
      await axios.post('http://localhost:5000/api/user/update-info', profileData, {
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
      <div className="min-h-screen bg-gray-50 flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-sm border-r">
          <div className="p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">G</span>
              </div>
              <span className="ml-2 text-xl font-bold">GrantGuide AI</span>
            </div>
          </div>
          <nav className="px-4 space-y-2">
            <Link href="/dashboard" className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              <LayoutDashboard className="w-5 h-5 mr-3" />
              Dashboard
            </Link>
            <Link href="/profile" className="flex items-center px-4 py-2 text-gray-900 bg-gray-100 rounded-lg">
              <User className="w-5 h-5 mr-3" />
              Account
            </Link>
          </nav>
          <div className="px-4 mt-6">
            <Button variant="destructive" className="w-full" onClick={logout}>
              Logout
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Profile Settings</h1>
            {loading ? (
              <div className="text-center py-10">Loading...</div>
            ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Profile Picture Section */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Picture</CardTitle>
                    <CardDescription>Update your organization's profile image</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center">
                    <Avatar className="w-32 h-32 mb-4">
                      <AvatarImage src="/placeholder.svg?height=128&width=128" />
                      <AvatarFallback className="text-2xl">BM</AvatarFallback>
                    </Avatar>
                    <Button variant="outline" className="w-full bg-transparent">
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
                    <CardTitle>Organization Information</CardTitle>
                    <CardDescription>Update your organization details</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Organization Name</Label>
                          <Input
                            id="name"
                            value={profileData.name}
                            onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={profileData.email}
                            onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="organizationType">Organization Type</Label>
                          <Input
                            id="organizationType"
                            value={profileData.organizationType}
                            onChange={(e) => setProfileData({ ...profileData, organizationType: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="location">Location</Label>
                          <Input
                            id="location"
                            value={profileData.location}
                            onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="contactPerson">Contact Person</Label>
                          <Input
                            id="contactPerson"
                            value={profileData.contactPerson}
                            onChange={(e) => setProfileData({ ...profileData, contactPerson: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phoneNumber">Phone Number</Label>
                          <Input
                            id="phoneNumber"
                            value={profileData.phoneNumber}
                            onChange={(e) => setProfileData({ ...profileData, phoneNumber: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="website">Website</Label>
                          <Input
                            id="website"
                            value={profileData.website}
                            onChange={(e) => setProfileData({ ...profileData, website: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="foundedYear">Founded Year</Label>
                          <Input
                            id="foundedYear"
                            value={profileData.foundedYear}
                            onChange={(e) => setProfileData({ ...profileData, foundedYear: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">Organization Description</Label>
                        <Textarea
                          id="description"
                          value={profileData.description}
                          onChange={(e) => setProfileData({ ...profileData, description: e.target.value })}
                          rows={4}
                        />
                      </div>

                      <div className="flex justify-end space-x-4">
                        <Button variant="outline" type="button">Cancel</Button>
                        <Button type="submit" disabled={submitting}>
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
    </ProtectedRoute>
  )
}
