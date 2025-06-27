"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { CheckCircle2, Clock, User, Activity, Target, TrendingUp } from "lucide-react"

export default function UserDashboard() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    setLoading(true)
    try {
      const res = await axios.get("http://localhost:3000/api/user/tasks", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      setTasks(res.data)
    } catch (err) {
      console.error("Fetch tasks error:", err.response?.data || err.message)
    } finally {
      setLoading(false)
    }
  }

  const markCompleted = async (id) => {
    try {
      await axios.patch(
        `http://localhost:3000/api/user/tasks/${id}`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } },
      )
      fetchTasks()
    } catch (err) {
      console.error("Mark complete error:", err.response?.data || err.message)
    }
  }

  const completedTasks = tasks.filter((task) => task.status === "completed").length
  const pendingTasks = tasks.filter((task) => task.status === "pending").length
  const completionRate = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0

  const TaskSkeleton = () => (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-6 w-20" />
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-8 w-24" />
        </div>
      </div>
    </Card>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Target className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Task Dashboard</h1>
                <p className="text-sm text-gray-500">Manage your assigned tasks</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-blue-600 border-blue-200">
                <Activity className="h-3 w-3 mr-1" />
                Active User
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Total Tasks</p>
                  <p className="text-3xl font-bold">{loading ? "..." : tasks.length}</p>
                </div>
                <Target className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Completed</p>
                  <p className="text-3xl font-bold">{loading ? "..." : completedTasks}</p>
                </div>
                <CheckCircle2 className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">Completion Rate</p>
                  <p className="text-3xl font-bold">{loading ? "..." : `${completionRate}%`}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tasks Section */}
        <Card className="shadow-lg">
          <CardHeader className="bg-white border-b">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold text-gray-900">Your Tasks</CardTitle>
                <CardDescription className="text-gray-600 mt-1">Tasks assigned by your manager</CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                  <Clock className="h-3 w-3 mr-1" />
                  {pendingTasks} Pending
                </Badge>
                <Badge variant="secondary" className="bg-green-50 text-green-700">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  {completedTasks} Completed
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {loading ? (
              <div className="space-y-6">
                {[...Array(3)].map((_, i) => (
                  <TaskSkeleton key={i} />
                ))}
              </div>
            ) : tasks.length === 0 ? (
              <div className="text-center py-12">
                <Target className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks assigned</h3>
                <p className="text-gray-500">You're all caught up! New tasks will appear here when assigned.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {tasks.map((task) => (
                  <Card
                    key={task._id}
                    className={`transition-all duration-200 hover:shadow-md border-l-4 ${
                      task.status === "completed"
                        ? "border-l-green-500 bg-green-50/30"
                        : "border-l-blue-500 bg-white hover:bg-slate-50"
                    }`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3
                              className={`text-lg font-semibold ${
                                task.status === "completed" ? "text-gray-600 line-through" : "text-gray-900"
                              }`}
                            >
                              {task.title}
                            </h3>
                            <Badge
                              variant={task.status === "completed" ? "default" : "secondary"}
                              className={
                                task.status === "completed"
                                  ? "bg-green-100 text-green-800 hover:bg-green-100"
                                  : "bg-orange-100 text-orange-800 hover:bg-orange-100"
                              }
                            >
                              {task.status === "completed" ? (
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                              ) : (
                                <Clock className="h-3 w-3 mr-1" />
                              )}
                              {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                            </Badge>
                          </div>
                          <p
                            className={`text-gray-600 mb-4 leading-relaxed ${
                              task.status === "completed" ? "opacity-75" : ""
                            }`}
                          >
                            {task.description}
                          </p>
                          <div className="flex items-center text-sm text-gray-500">
                            <User className="h-4 w-4 mr-2" />
                            <span>
                              Assigned by: {task.createdBy.firstName} {task.createdBy.lastName}
                            </span>
                          </div>
                        </div>
                        {task.status === "pending" && (
                          <Button
                            onClick={() => markCompleted(task._id)}
                            className="ml-4 bg-green-600 hover:bg-green-700 text-white"
                            size="sm"
                          >
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            Mark Complete
                          </Button>
                        )}
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
