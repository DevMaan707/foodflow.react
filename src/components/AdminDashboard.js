import React, { useState } from "react";
import {
  Users,
  BarChart,
  CheckCircle,
  Trash2,
  AlertCircle,
  Bell,
  User,
  Heart,
} from "lucide-react";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("analytics");

  const users = [
    {
      id: 1,
      name: "Donor: Green Garden Restaurant",
      role: "donor",
      joined: "2 days ago",
    },
    {
      id: 2,
      name: "Receiver: Hope Foundation NGO",
      role: "receiver",
      joined: "3 days ago",
    },
    {
      id: 3,
      name: "Donor: Sweet Dreams Bakery",
      role: "donor",
      joined: "5 days ago",
    },
  ];

  const stats = {
    totalDonors: 24,
    totalReceivers: 30,
    totalPosts: 112,
    totalRequests: 68,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Heart className="h-8 w-8 text-green-600 mr-3" />
              <h1 className="text-xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <Bell className="h-6 w-6 text-gray-600 cursor-pointer" />
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 bg-green-600 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
                <span className="text-sm font-medium">Admin</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Navigation Tabs */}
        <div className="flex space-x-8 border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab("analytics")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "analytics"
                ? "border-green-500 text-green-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Analytics
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "users"
                ? "border-green-500 text-green-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Users
          </button>
        </div>

        {/* Analytics Overview */}
        {activeTab === "analytics" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-700">
                Total Donors
              </h3>
              <p className="text-3xl font-bold text-green-600 mt-2">
                {stats.totalDonors}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-700">
                Total Receivers
              </h3>
              <p className="text-3xl font-bold text-green-600 mt-2">
                {stats.totalReceivers}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-700">
                Food Posts
              </h3>
              <p className="text-3xl font-bold text-green-600 mt-2">
                {stats.totalPosts}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-700">Requests</h3>
              <p className="text-3xl font-bold text-green-600 mt-2">
                {stats.totalRequests}
              </p>
            </div>
          </div>
        )}

        {/* Users Management */}
        {activeTab === "users" && (
          <div className="bg-white rounded-lg shadow-sm divide-y">
            {users.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-4 hover:bg-gray-50"
              >
                <div>
                  <h3 className="font-semibold text-gray-900">{user.name}</h3>
                  <p className="text-sm text-gray-600 capitalize">
                    Role: {user.role} • Joined: {user.joined}
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <button className="text-red-600 hover:underline text-sm">
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
