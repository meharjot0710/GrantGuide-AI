"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import ProtectedRoute from "../../components/ProtectedRoute"
import axios from "axios"
import { useAuth } from "../../hooks/useAuth"

const initialState = {
  name: '',
  userType: '',
  region: '',
  country: '',
  preferredLanguage: '',
  interests: [],
  goals: '',
  domainFocus: '',
  projectStage: '',
  hasPrototype: false,
  grantTypeNeeded: [],
  techStack: [],
};

const interestOptions = ['AI', 'Cloud Computing', 'Skilling', 'Accessibility'];
const grantTypeOptions = ['Skilling', 'Certification', 'Mentorship'];
const techStackOptions = ['Python', 'Azure', 'ML'];

export default function OnboardingPage() {
  const [formData, setFormData] = useState(initialState)
  const [submitting, setSubmitting] = useState(false)
  const router = useRouter()
  const { getUserInfo } = useAuth();

  useEffect(() => {
    async function checkProfile() {
      const user = await getUserInfo();
      if (user && user.profileCompleted) {
        router.push('/dashboard');
      }
    }
    checkProfile();
  }, [getUserInfo, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleArrayChange = (field: string, value: string) => {
    setFormData((prev) => {
      const arr = prev[field as keyof typeof prev] as string[];
      if (arr.includes(value)) {
        return { ...prev, [field]: arr.filter((v) => v !== value) };
      } else {
        return { ...prev, [field]: [...arr, value] };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/user/update-info', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      router.push('/profile');
    } catch (err) {
      alert('Failed to update profile.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Complete Your Profile</CardTitle>
            <CardDescription>Tell us about yourself to get personalized grant recommendations</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="userType">User Type</Label>
                  <Input
                    id="userType"
                    name="userType"
                    value={formData.userType}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="region">Region</Label>
                  <Input
                    id="region"
                    name="region"
                    value={formData.region}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="preferredLanguage">Preferred Language</Label>
                <Input
                  id="preferredLanguage"
                  name="preferredLanguage"
                  value={formData.preferredLanguage}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Interests</Label>
                <div className="grid grid-cols-2 gap-2">
                  {interestOptions.map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`interest-${option}`}
                        checked={formData.interests.includes(option)}
                        onChange={() => handleArrayChange('interests', option)}
                      />
                      <Label htmlFor={`interest-${option}`}>{option}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="goals">Goals</Label>
                <Textarea
                  id="goals"
                  name="goals"
                  value={formData.goals}
                  onChange={handleChange}
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="domainFocus">Domain Focus</Label>
                <Input
                  id="domainFocus"
                  name="domainFocus"
                  value={formData.domainFocus}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="projectStage">Project Stage</Label>
                <Input
                  id="projectStage"
                  name="projectStage"
                  value={formData.projectStage}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="hasPrototype"
                    checked={formData.hasPrototype}
                    onChange={() => setFormData(prev => ({ ...prev, hasPrototype: !prev.hasPrototype }))}
                  />
                  <Label htmlFor="hasPrototype">Has Prototype</Label>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Grant Type Needed</Label>
                <div className="grid grid-cols-2 gap-2">
                  {grantTypeOptions.map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`grant-${option}`}
                        checked={formData.grantTypeNeeded.includes(option)}
                        onChange={() => handleArrayChange('grantTypeNeeded', option)}
                      />
                      <Label htmlFor={`grant-${option}`}>{option}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Tech Stack</Label>
                <div className="grid grid-cols-2 gap-2">
                  {techStackOptions.map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`tech-${option}`}
                        checked={formData.techStack.includes(option)}
                        onChange={() => handleArrayChange('techStack', option)}
                      />
                      <Label htmlFor={`tech-${option}`}>{option}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={submitting} className="w-full">
                  {submitting ? 'Saving...' : 'Complete Profile'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  )
} 