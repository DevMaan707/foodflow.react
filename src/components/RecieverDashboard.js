import React, { useState, useEffect } from "react";
import {
  Search,
  MapPin,
  Clock,
  Users,
  Heart,
  Filter,
  Bell,
  User,
  Settings,
  LogOut,
  Send,
  Calendar,
  Star,
} from "lucide-react";

const API_BASE = "http://localhost:6069/api";
const ReceiverDashboard = () => {
  const [activeTab, setActiveTab] = useState("browse");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [notifications, setNotifications] = useState(3);
  const [myRequests, setMyRequests] = useState([]);

  // Mock data for food posts
  const [foodPosts, setFoodPosts] = useState([]);

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const res = await fetch(`${API_BASE}/foods`);
        const data = await res.json();
        setFoodPosts(data);
      } catch (error) {
        console.error("Failed to fetch foods:", error);
      }
    };

    fetchFoods();
  }, []);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await fetch(`${API_BASE}/foods/requests/my`);
        const data = await res.json();
        setMyRequests(data);
      } catch (error) {
        console.error("Failed to fetch requests:", error);
      }
    };

    fetchRequests();
  }, []);

  const filteredPosts = foodPosts.filter((post) => {
    const donorName = post.donor?.name || ""; // safely access donor name
    const category = post.category || ""; // fallback if category is missing

    const matchesSearch =
      post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donorName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      filterCategory === "all" || category === filterCategory;

    return matchesSearch && matchesCategory;
  });

  const handleSendRequest = async (postId, message, quantity) => {
    try {
      const res = await fetch(`${API_BASE}/foods/${postId}/request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          requester: "665f4cbd2ec4e59e2a257a9a", // replace with real user ID or auth token logic later
          quantityRequested: quantity,
          message: message,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        // Refresh requests list after sending
        setMyRequests((prev) => [
          {
            id: data.request._id,
            postTitle: data.request.food.title,
            donor:
              data.request.donor.organizationName ||
              `${data.request.donor.firstName} ${data.request.donor.lastName}`,
            status: data.request.status,
            requestedAt: "Just now",
            quantity: data.request.quantityRequested,
            message: data.request.message,
          },
          ...prev,
        ]);
      } else {
        console.error("Request failed:", data.message);
      }
    } catch (error) {
      console.error("Error sending request:", error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const RequestModal = ({ post, onClose, onSend }) => {
    const [message, setMessage] = useState("");
    const [requestedQuantity, setRequestedQuantity] = useState("");

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
          <h3 className="text-lg font-semibold mb-4">Request Food Item</h3>
          <div className="mb-4">
            <h4 className="font-medium">{post.title}</h4>
            <p className="text-sm text-gray-600">From: {post.donor}</p>
            <p className="text-sm text-gray-600">Available: {post.quantity}</p>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Quantity Needed
            </label>
            <input
              type="text"
              value={requestedQuantity}
              onChange={(e) => setRequestedQuantity(e.target.value)}
              placeholder="e.g., 5kg, 10 items"
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Message to Donor
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell the donor about your organization and how you'll use the food..."
              rows="3"
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => {
                if (message.trim() && requestedQuantity.trim()) {
                  onSend(post.id, message, requestedQuantity);
                  onClose();
                }
              }}
              className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
            >
              Send Request
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  const [selectedPost, setSelectedPost] = useState(null);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Heart className="h-8 w-8 text-green-600 mr-3" />
              <h1 className="text-xl font-bold text-gray-900">FoodShare</h1>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <Bell className="h-6 w-6 text-gray-600 cursor-pointer" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {notifications}
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 bg-green-600 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
                <span className="text-sm font-medium">NGO Name</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Navigation Tabs */}
        <div className="flex space-x-8 border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab("browse")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "browse"
                ? "border-green-500 text-green-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Browse Food Posts
          </button>
          <button
            onClick={() => setActiveTab("requests")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "requests"
                ? "border-green-500 text-green-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            My Requests
          </button>
          <button
            onClick={() => setActiveTab("profile")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "profile"
                ? "border-green-500 text-green-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Profile & Settings
          </button>
        </div>

        {/* Browse Food Posts Tab */}
        {activeTab === "browse" && (
          <div>
            {/* Search and Filter Section */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search food posts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div className="flex gap-2">
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="all">All Categories</option>
                    <option value="vegetables">Vegetables</option>
                    <option value="bakery">Bakery Items</option>
                    <option value="cooked">Cooked Meals</option>
                    <option value="canned">Canned Food</option>
                  </select>
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </button>
                </div>
              </div>
            </div>

            {/* Food Posts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="h-48 bg-gray-200 relative">
                    <div className="absolute top-3 left-3 bg-green-600 text-white px-2 py-1 rounded text-xs font-medium">
                      {post.category}
                    </div>
                    {post.verified && (
                      <div className="absolute top-3 right-3 bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium">
                        Verified
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-lg">{post.title}</h3>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600 ml-1">
                          {post.rating}
                        </span>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {post.description}
                    </p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <User className="h-4 w-4 mr-2" />
                        {post.donor}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        {post.location} • {post.distance}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="h-4 w-4 mr-2" />
                        Expires in {post.expiryTime}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="h-4 w-4 mr-2" />
                        Quantity: {post.quantity}
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">
                        {post.postedTime}
                      </span>
                      <button
                        onClick={() => setSelectedPost(post)}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center text-sm"
                      >
                        <Send className="h-4 w-4 mr-1" />
                        Request
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* My Requests Tab */}
        {activeTab === "requests" && (
          <div>
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b">
                <h2 className="text-lg font-semibold">My Food Requests</h2>
                <p className="text-gray-600">
                  Track your food donation requests
                </p>
              </div>

              <div className="divide-y">
                {myRequests.map((request) => (
                  <div key={request.id} className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-lg mb-1">
                          {request.postTitle}
                        </h3>
                        <p className="text-gray-600 text-sm mb-2">
                          From: {request.donor}
                        </p>
                        <p className="text-gray-700 text-sm mb-3">
                          "{request.message}"
                        </p>

                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>Quantity: {request.quantity}</span>
                          <span>•</span>
                          <span>{request.requestedAt}</span>
                        </div>
                      </div>

                      <div className="ml-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}
                        >
                          {request.status.charAt(0).toUpperCase() +
                            request.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Profile & Settings Tab */}
        {activeTab === "profile" && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">
                Organization Profile
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Organization Name
                  </label>
                  <input
                    type="text"
                    defaultValue="Hope Foundation NGO"
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Contact Person
                  </label>
                  <input
                    type="text"
                    defaultValue="Sarah Johnson"
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    defaultValue="contact@hopefoundation.org"
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    defaultValue="+1 (555) 123-4567"
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">
                    Address
                  </label>
                  <textarea
                    rows="2"
                    defaultValue="123 Community Street, Downtown, City 12345"
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">
                    Organization Description
                  </label>
                  <textarea
                    rows="3"
                    defaultValue="We are a non-profit organization dedicated to fighting hunger in our community..."
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
              </div>
              <div className="mt-6">
                <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors">
                  Update Profile
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">
                Notification Preferences
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>New food posts in your area</span>
                  <input type="checkbox" defaultChecked className="toggle" />
                </div>
                <div className="flex items-center justify-between">
                  <span>Request status updates</span>
                  <input type="checkbox" defaultChecked className="toggle" />
                </div>
                <div className="flex items-center justify-between">
                  <span>Weekly digest</span>
                  <input type="checkbox" className="toggle" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Request Modal */}
      {selectedPost && (
        <RequestModal
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
          onSend={handleSendRequest}
        />
      )}
    </div>
  );
};

export default ReceiverDashboard;
