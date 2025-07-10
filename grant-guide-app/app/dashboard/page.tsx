"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { LayoutDashboard, User, MapPin, Building, CheckCircle, Calendar, Send, Bot } from "lucide-react"
import { useAuth } from "../../hooks/useAuth"
import axios from "axios"

export default function DashboardPage() {
  const [chatMessage, setChatMessage] = useState("")
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      sender: "bot",
      message:
        "Yes, a Permanent Account Number (PAN) card is required for this grant application. Make sure to include a copy in your submission.",
    },
  ])
  const [userName, setUserName] = useState('');
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      const token = localStorage.getItem('token');
      if (!token) return setLoadingUser(false);
      try {
        const res = await axios.get('http://localhost:5000/api/user/get-info', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserName(res.data.user.name || '');
      } catch (err) {
        // Optionally handle error
      } finally {
        setLoadingUser(false);
      }
    }
    fetchUser();
  }, []);

  const { logout } = useAuth();

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      setChatMessages([
        ...chatMessages,
        {
          id: chatMessages.length + 1,
          sender: "user",
          message: chatMessage,
        },
      ])
      setChatMessage("")
    }
  }

  return (
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
          <Link href="/dashboard" className="flex items-center px-4 py-2 text-gray-900 bg-gray-100 rounded-lg">
            <LayoutDashboard className="w-5 h-5 mr-3" />
            Dashboard
          </Link>
          <Link href="/profile" className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
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
      <div className="flex-1 flex">
        {/* Dashboard Content */}
        <div className="flex-1 p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Hi{loadingUser ? '...' : userName ? `, ${userName}!` : '!' }
            </h1>
            <p className="text-gray-600 mb-6">Here's what we found for you today</p>

            <div className="flex items-center space-x-6 mb-8">
              <div className="flex items-center">
                <MapPin className="w-5 h-5 text-gray-500 mr-2" />
                <span className="text-gray-700">Rajasthan</span>
              </div>
              <div className="flex items-center">
                <Building className="w-5 h-5 text-gray-500 mr-2" />
                <span className="text-gray-700">Education NGO</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                <span className="text-green-700">Eligibility confirmed</span>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Top 3 Grants Eligible For</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                    <div className="w-6 h-6 bg-white rounded"></div>
                  </div>
                  <CardTitle>AI for Accessibility</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center mb-4">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    <span className="text-green-700 text-sm">You're eligible</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>Deadline: Mar 15, 2024</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center mb-4">
                    <div className="w-6 h-6 bg-white rounded"></div>
                  </div>
                  <CardTitle>TechSpark</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center mb-4">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    <span className="text-green-700 text-sm">You're eligible</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 mb-4">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>Deadline: Apr. 4, 2024</span>
                  </div>
                  <Button className="w-full bg-yellow-400 hover:bg-yellow-500 text-black">Apply Now</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4">
                    <span className="text-white font-bold">M</span>
                  </div>
                  <CardTitle>Microsoft Global Skills Initiative</CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge variant="destructive" className="mb-4">
                    Deadline in 3 days
                  </Badge>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>Apr. 14, 2024</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Overview</h2>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <span className="text-red-600 font-medium">Deadline in 5 days</span>
                  <span className="text-gray-600">Apr. 14, 2024</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Chat Sidebar */}
        <div className="w-80 bg-white border-l shadow-sm">
          <div className="p-4 border-b">
            <h3 className="text-lg font-semibold">AI Assistant</h3>
          </div>

          <div className="flex-1 p-4">
            <div className="mb-4">
              <div className="flex items-center mb-2">
                <Avatar className="w-8 h-8 mr-2">
                  <AvatarFallback className="bg-blue-600 text-white">
                    <Bot className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium">GrantBot</span>
              </div>

              <div className="space-y-4">
                {chatMessages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-xs p-3 rounded-lg ${
                        msg.sender === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      {msg.message}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-auto">
              <div className="flex space-x-2">
                <Input
                  placeholder="Ask GrantBot..."
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                />
                <Button size="sm" onClick={handleSendMessage}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>

              <Button variant="outline" className="w-full mt-2 text-sm bg-transparent">
                Generate Email to Microsoft Contact
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
