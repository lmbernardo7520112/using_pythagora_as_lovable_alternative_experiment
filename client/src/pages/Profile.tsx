import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Camera, Star, Calendar, MapPin, Edit, Save, X } from "lucide-react";
import { useToast } from "../hooks/useToast";

export function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    bio: 'Digital nomad and travel enthusiast. I love exploring new places and meeting new people. I have been hosting for over 3 years and enjoy providing great experiences for my guests.',
    location: 'San Francisco, CA',
    languages: ['English', 'Spanish', 'French'],
    joinDate: '2021-03-15',
    profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'
  });

  const { toast } = useToast();

  const handleSave = () => {
    console.log('Saving profile data:', profileData);
    setIsEditing(false);
    toast({
      title: "Success",
      description: "Profile updated successfully",
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data here if needed
  };

  const stats = {
    totalBookings: 24,
    totalReviews: 18,
    averageRating: 4.8,
    responseRate: 98,
    properties: 3
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600 mt-1">
            Manage your personal information and preferences
          </p>
        </div>
        {!isEditing && (
          <Button
            onClick={() => setIsEditing(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="lg:col-span-1 bg-white/90 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-6 text-center">
            <div className="relative inline-block mb-4">
              <Avatar className="h-32 w-32">
                <AvatarImage src={profileData.profilePicture} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-4xl">
                  {profileData.fullName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <Button
                  size="sm"
                  className="absolute bottom-0 right-0 rounded-full h-8 w-8 p-0"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              )}
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              {profileData.fullName}
            </h2>
            <p className="text-gray-600 mb-2">{profileData.email}</p>

            <div className="flex items-center justify-center text-gray-600 mb-4">
              <MapPin className="h-4 w-4 mr-1" />
              <span className="text-sm">{profileData.location}</span>
            </div>

            <div className="flex items-center justify-center text-gray-600 mb-4">
              <Calendar className="h-4 w-4 mr-1" />
              <span className="text-sm">
                Member since {new Date(profileData.joinDate).getFullYear()}
              </span>
            </div>

            <div className="flex justify-center space-x-2 mb-4">
              {profileData.languages.map((language) => (
                <Badge key={language} variant="secondary">
                  {language}
                </Badge>
              ))}
            </div>

            <div className="flex items-center justify-center">
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400 mr-1" />
              <span className="font-semibold">{stats.averageRating}</span>
              <span className="text-gray-500 ml-1">({stats.totalReviews} reviews)</span>
            </div>
          </CardContent>
        </Card>

        {/* Profile Details */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="personal" className="space-y-6">
            <TabsList>
              <TabsTrigger value="personal">Personal Info</TabsTrigger>
              <TabsTrigger value="stats">Statistics</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
            </TabsList>

            <TabsContent value="personal">
              <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Personal Information
                    {isEditing && (
                      <div className="flex space-x-2">
                        <Button
                          onClick={handleSave}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <Save className="h-4 w-4 mr-2" />
                          Save
                        </Button>
                        <Button
                          onClick={handleCancel}
                          size="sm"
                          variant="outline"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Cancel
                        </Button>
                      </div>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        value={profileData.fullName}
                        onChange={(e) => setProfileData(prev => ({ ...prev, fullName: e.target.value }))}
                        disabled={!isEditing}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                        disabled={!isEditing}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={profileData.phone}
                        onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                        disabled={!isEditing}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={profileData.location}
                        onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                        disabled={!isEditing}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <textarea
                      id="bio"
                      value={profileData.bio}
                      onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                      disabled={!isEditing}
                      rows={4}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="stats">
              <div className="grid gap-4 md:grid-cols-2">
                <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg">Hosting Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Properties</span>
                      <span className="font-semibold">{stats.properties}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Bookings</span>
                      <span className="font-semibold">{stats.totalBookings}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Response Rate</span>
                      <span className="font-semibold">{stats.responseRate}%</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg">Reviews</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Reviews</span>
                      <span className="font-semibold">{stats.totalReviews}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Average Rating</span>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                        <span className="font-semibold">{stats.averageRating}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="preferences">
              <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Email Notifications</Label>
                    <div className="mt-2 space-y-2">
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" defaultChecked />
                        <span className="text-sm">Booking requests</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" defaultChecked />
                        <span className="text-sm">Messages</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" />
                        <span className="text-sm">Marketing emails</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <Label>Privacy Settings</Label>
                    <div className="mt-2 space-y-2">
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" defaultChecked />
                        <span className="text-sm">Show profile to other users</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" defaultChecked />
                        <span className="text-sm">Allow contact from guests</span>
                      </label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}