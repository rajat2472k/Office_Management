"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Users, CheckCircle, Clock, User, Mail, FileText, Target, Loader2 } from "lucide-react"

export default function ManagerPanel() {
  const [users, setUsers] = useState([])
  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [assignedTo, setAssignedTo] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUsers()
    fetchTasks()
  }, [])

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/manager/users", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      setUsers(res.data)
    } catch (e) {
      console.error("Fetch users error:", e.response?.data || e.message)
    }
  }

  const fetchTasks = async () => {
    setLoading(true)
    try {
      const res = await axios.get("http://localhost:3000/api/manager/tasks", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      setTasks(res.data)
    } catch (e) {
      console.error("Fetch tasks error:", e.response?.data || e.message)
    } finally {
      setLoading(false)
    }
  }

  const handleAssignTask = async () => {
    if (!title || !assignedTo) {
      return alert("Title and user are required")
    }
    try {
      await axios.post(
        "http://localhost:3000/api/manager/tasks",
        { title, description, assignedTo },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      )
      setTitle("")
      setDescription("")
      setAssignedTo("")
      fetchTasks()
    } catch (e) {
      console.error("Assign task error:", e.response?.data || e.message)
    }
  }

  const handleUpdateStatus = async (taskId, status) => {
    try {
      await axios.patch(
        `http://localhost:3000/api/manager/tasks/${taskId}`,
        { status },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      )
      fetchTasks() // Refresh after update
    } catch (e) {
      console.error("Update status error:", e.response?.data || e.message)
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Completed
          </Badge>
        )
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        )
      default:
        return (
          <Badge variant="secondary">
            <Clock className="w-3 h-3 mr-1" />
            {status}
          </Badge>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Manager Dashboard
          </h1>
          <p className="text-gray-600 text-lg">Manage tasks and track team progress</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Total Users</p>
                  <p className="text-3xl font-bold">{users.length}</p>
                </div>
                <Users className="w-8 h-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Completed Tasks</p>
                  <p className="text-3xl font-bold">{tasks.filter((t) => t.status === "completed").length}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100 text-sm font-medium">Pending Tasks</p>
                  <p className="text-3xl font-bold">{tasks.filter((t) => t.status === "pending").length}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Task Creation Form */}
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-t-lg">
            <div className="flex items-center space-x-2">
              <Plus className="w-6 h-6" />
              <div>
                <CardTitle className="text-xl">Assign New Task</CardTitle>
                <CardDescription className="text-indigo-100">Create and assign a task to a team member</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700 flex items-center">
                  <Target className="w-4 h-4 mr-2" />
                  Task Title
                </Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter task title..."
                  className="border-2 border-gray-200 focus:border-indigo-500 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700 flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  Assign To
                </Label>
                <Select value={assignedTo} onValueChange={setAssignedTo}>
                  <SelectTrigger className="border-2 border-gray-200 focus:border-indigo-500 transition-colors">
                    <SelectValue placeholder="Select a team member" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((u) => (
                      <SelectItem key={u._id} value={u._id}>
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4" />
                          <span>
                            {u.firstName} {u.lastName}
                          </span>
                          <span className="text-gray-500">({u.email})</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="lg:col-span-2 space-y-2">
                <Label className="text-sm font-semibold text-gray-700 flex items-center">
                  <FileText className="w-4 h-4 mr-2" />
                  Description
                </Label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the task in detail..."
                  className="border-2 border-gray-200 focus:border-indigo-500 transition-colors min-h-[100px]"
                />
              </div>

              <div className="lg:col-span-2">
                <Button
                  onClick={handleAssignTask}
                  className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-3 rounded-lg shadow-lg transition-all duration-200 transform hover:scale-[1.02]"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Assign Task
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Task List */}
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-t-lg">
            <div className="flex items-center space-x-2">
              <FileText className="w-6 h-6" />
              <div>
                <CardTitle className="text-xl">All Assigned Tasks</CardTitle>
                <CardDescription className="text-slate-200">Tasks created and managed by you</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                <span className="ml-3 text-gray-600 font-medium">Loading tasks...</span>
              </div>
            ) : tasks.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg font-medium">No tasks assigned yet</p>
                <p className="text-gray-400">Create your first task using the form above</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {tasks.map((t) => (
                  <Card
                    key={t._id}
                    className="border-2 border-gray-100 hover:border-indigo-200 transition-all duration-200 hover:shadow-md"
                  >
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-800 mb-2">{t.title}</h3>
                            <p className="text-gray-600 leading-relaxed">{t.description}</p>
                          </div>
                          <div className="ml-4">{getStatusBadge(t.status)}</div>
                        </div>

                        <div className="flex items-center space-x-2 text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
                          <User className="w-4 h-4" />
                          <span className="font-medium">Assigned to:</span>
                          <span className="font-semibold text-gray-700">
                            {t.assignedTo?.firstName} {t.assignedTo?.lastName}
                          </span>
                          <Mail className="w-4 h-4 ml-2" />
                          <span>({t.assignedTo?.email})</span>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-semibold text-gray-700">Status:</span>
                            {getStatusBadge(t.status)}
                          </div>

                          <Select value={t.status} onValueChange={(newStatus) => handleUpdateStatus(t._id, newStatus)}>
                            <SelectTrigger className="w-40 border-2 border-gray-200 focus:border-indigo-500 transition-colors">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">
                                <div className="flex items-center">
                                  <Clock className="w-4 h-4 mr-2 text-yellow-500" />
                                  Pending
                                </div>
                              </SelectItem>
                              <SelectItem value="completed">
                                <div className="flex items-center">
                                  <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                                  Completed
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
