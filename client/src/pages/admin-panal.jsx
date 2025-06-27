"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Shield,
  Users,
  Server,
  Database,
  AlertTriangle,
  Settings,
  LogOut,
  Trash2,
  UserCheck,
} from "lucide-react"

export default function AdminPanel() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [userCount, setUserCount] = useState(null)

  useEffect(() => {
    fetchUsers()
    fetchUserCount()
  }, [])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem("token")
      const { data } = await axios.get("http://localhost:3000/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      })
      const normalizedUsers = Array.isArray(data)
        ? data
        : Array.isArray(data.users)
        ? data.users
        : []
      setUsers(normalizedUsers)
    } catch (err) {
      console.error("Error fetching users:", err.response?.data || err.message)
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return
    try {
      const token = localStorage.getItem("token")
      await axios.delete(`http://localhost:3000/api/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      fetchUsers()
    } catch (err) {
      console.error("Error deleting user:", err.response?.data || err.message)
    }
  }

  const updateRole = async (id, role) => {
    try {
      const token = localStorage.getItem("token")
      await axios.patch(
        `http://localhost:3000/api/admin/users/${id}`,
        { role },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      fetchUsers()
    } catch (err) {
      console.error("Error updating role:", err.response?.data || err.message)
    }
  }

  const fetchUserCount = async () => {
    try {
      const token = localStorage.getItem("token")
      const res = await axios.get("http://localhost:3000/api/admin/stats/users/count", {
        headers: { Authorization: `Bearer ${token}` },
      })
      setUserCount(res.data?.totalUsers || 0)
    } catch (e) {
      console.error("Fetch user count error:", e.response?.data || e.message)
    }
  }

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800 border-red-200"
      case "manager":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <nav className="bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg mr-3">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Admin Panel
                </h1>
                <p className="text-xs text-gray-500">System Management</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm" className="border-gray-200 hover:bg-gray-50 bg-transparent">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Link to="/">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-red-200 text-red-600 hover:bg-red-50 bg-transparent"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* System Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-white" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{userCount ?? "Loading..."}</div>
              <p className="text-xs">+12% from last month</p>
            </CardContent>
          </Card>
        </div>

        {/* User Management Table */}
        <Card className="shadow-xl bg-white">
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <CardDescription>Manage roles and delete accounts</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-center">Loading users...</p>
            ) : users.length === 0 ? (
              <p className="text-center">No users found.</p>
            ) : (
              <table className="w-full border mt-4">
                <thead>
                  <tr className="bg-gray-100 text-sm">
                    <th className="p-2 text-left">Name</th>
                    <th className="p-2 text-left">Email</th>
                    <th className="p-2 text-left">Role</th>
                    <th className="p-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id} className="border-t">
                      <td className="p-2">{u.firstName} {u.lastName}</td>
                      <td className="p-2">{u.email}</td>
                      <td className="p-2">
                        <select
                          className={`rounded px-2 py-1 text-sm border ${getRoleBadgeColor(u.role)}`}
                          value={u.role}
                          onChange={(e) => updateRole(u._id, e.target.value)}
                        >
                          {['admin', 'manager', 'user'].map(r => (
                            <option key={r} value={r}>{r}</option>
                          ))}
                        </select>
                      </td>
                      <td className="p-2">
                        <Button variant="destructive" size="sm" onClick={() => deleteUser(u._id)}>
                          <Trash2 className="h-4 w-4 mr-1" /> Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
