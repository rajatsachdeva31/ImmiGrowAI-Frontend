"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  User, 
  Users, 
  MessageCircle, 
  Search, 
  TrendingUp, 
  Globe,
  Upload,
  Sparkles,
  CheckCircle,
  Clock,
  Star
} from 'lucide-react';

const AIFeatures = () => {
  const [activeFeature, setActiveFeature] = useState('resume');

  const features = [
    {
      id: 'resume',
      title: 'Resume Analysis',
      description: 'AI-powered resume analysis and auto-fill',
      icon: FileText,
      color: 'bg-blue-100 text-blue-600',
      status: 'available'
    },
    {
      id: 'profile',
      title: 'Career Profile',
      description: 'Generate comprehensive career profile',
      icon: User,
      color: 'bg-green-100 text-green-600',
      status: 'available'
    },
    {
      id: 'mentors',
      title: 'Find Mentors',
      description: 'AI-powered mentor matching',
      icon: Users,
      color: 'bg-purple-100 text-purple-600',
      status: 'available'
    },
    {
      id: 'coaching',
      title: 'AI Career Coach',
      description: 'Personalized career guidance',
      icon: MessageCircle,
      color: 'bg-orange-100 text-orange-600',
      status: 'available'
    },
    {
      id: 'jobs',
      title: 'Job Discovery',
      description: 'Find matching job opportunities',
      icon: Search,
      color: 'bg-cyan-100 text-cyan-600',
      status: 'available'
    },
    {
      id: 'skills',
      title: 'Skill Gap Analysis',
      description: 'Identify and bridge skill gaps',
      icon: TrendingUp,
      color: 'bg-yellow-100 text-yellow-600',
      status: 'available'
    },
    {
      id: 'cultural',
      title: 'Cultural Integration',
      description: 'Workplace culture guidance',
      icon: Globe,
      color: 'bg-pink-100 text-pink-600',
      status: 'available'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <Badge variant="default" className="text-green-700 bg-green-100">Available</Badge>;
      case 'coming-soon':
        return <Badge variant="secondary">Coming Soon</Badge>;
      default:
        return <Badge variant="outline">Available</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Sparkles className="h-8 w-8 text-blue-600" />
        <h2 className="text-3xl font-bold text-gray-900">AI Career Assistant</h2>
      </div>
      
      <p className="text-gray-600">
        Leverage AI-powered tools to accelerate your career growth in Canada. 
        Get personalized insights, find mentors, and navigate your professional journey with confidence.
      </p>

      <Tabs value={activeFeature} onValueChange={setActiveFeature} className="space-y-6">
        <TabsList className="grid grid-cols-4 lg:grid-cols-7 gap-2">
          {features.map((feature) => (
            <TabsTrigger
              key={feature.id}
              value={feature.id}
              className="flex flex-col items-center gap-1 py-3 px-2 data-[state=active]:bg-blue-50"
            >
              <feature.icon className="h-4 w-4" />
              <span className="text-xs font-medium">{feature.title.split(' ')[0]}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Resume Analysis Tab */}
        <TabsContent value="resume" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                Resume Analysis & Auto-Fill
              </CardTitle>
              <CardDescription>
                Upload your resume for AI-powered analysis and automatic profile completion
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-sm text-gray-600 mb-2">
                  Drag and drop your resume here, or click to browse
                </p>
                <p className="text-xs text-gray-500">
                  Supports PDF, DOCX, JPG, PNG (max 5MB)
                </p>
                <Button className="mt-4">Choose File</Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-sm">Extract work experience</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-sm">Identify skills & qualifications</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-sm">Canadian market analysis</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Career Profile Tab */}
        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-green-600" />
                Career Profile Generation
              </CardTitle>
              <CardDescription>
                Create a comprehensive career profile tailored for the Canadian market
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Your profile will include:</h4>
                <ul className="space-y-1 text-sm">
                  <li>• Professional summary optimized for Canadian employers</li>
                  <li>• Skills categorization and market alignment</li>
                  <li>• Career objectives and target industries</li>
                  <li>• Skill gap analysis and improvement roadmap</li>
                </ul>
              </div>
              <Button className="w-full">
                Generate Career Profile
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Mentor Matching Tab */}
        <TabsContent value="mentors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-600" />
                AI Mentor Matching
              </CardTitle>
              <CardDescription>
                Connect with experienced professionals who can guide your career journey
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-semibold">Find Mentors</h4>
                  <p className="text-sm text-gray-600">
                    AI matches you with mentors based on your industry, experience level, 
                    and cultural background.
                  </p>
                  <Button>Browse Mentors</Button>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold">Become a Mentor</h4>
                  <p className="text-sm text-gray-600">
                    Help newcomers by sharing your experience and knowledge.
                  </p>
                  <Button variant="outline">Register as Mentor</Button>
                </div>
              </div>
              
              <div className="border rounded-lg p-4">
                <h5 className="font-semibold mb-2">Matching Criteria:</h5>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Industry Experience</Badge>
                  <Badge variant="secondary">Cultural Background</Badge>
                  <Badge variant="secondary">Language Skills</Badge>
                  <Badge variant="secondary">Career Level</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Coaching Tab */}
        <TabsContent value="coaching" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-orange-600" />
                AI Career Coaching
              </CardTitle>
              <CardDescription>
                Get personalized career advice and guidance powered by AI
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-orange-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Ask your AI coach:</h4>
                <ul className="space-y-1 text-sm">
                  <li>• How to prepare for interviews in Canada?</li>
                  <li>• What skills should I develop for my target role?</li>
                  <li>• How to network effectively in my industry?</li>
                  <li>• What are the salary expectations for my role?</li>
                </ul>
              </div>
              <div className="border rounded-lg p-4">
                <textarea 
                  placeholder="Ask your career question here..."
                  className="w-full h-24 resize-none border-0 focus:outline-none"
                />
                <div className="flex justify-between items-center pt-2">
                  <span className="text-xs text-gray-500">Press Enter to send</span>
                  <Button size="sm">Send</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Job Discovery Tab */}
        <TabsContent value="jobs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5 text-cyan-600" />
                AI Job Discovery
              </CardTitle>
              <CardDescription>
                Find job opportunities that match your skills and career goals
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-4">
                  <h4 className="font-semibold mb-2">Recent Matches</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Software Developer</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-500" />
                        <span className="text-xs">92%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Data Analyst</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-500" />
                        <span className="text-xs">87%</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-3">
                    View All Matches
                  </Button>
                </Card>
                
                <Card className="p-4">
                  <h4 className="font-semibold mb-2">Job Alerts</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Get notified when new opportunities match your profile
                  </p>
                  <Button size="sm" className="w-full">
                    Set Up Alerts
                  </Button>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Skills Gap Tab */}
        <TabsContent value="skills" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-yellow-600" />
                Skill Gap Analysis
              </CardTitle>
              <CardDescription>
                Identify skills gaps and get personalized learning recommendations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Analysis includes:</h4>
                <ul className="space-y-1 text-sm">
                  <li>• Current skills vs. market requirements</li>
                  <li>• Skill gap identification and prioritization</li>
                  <li>• Learning resources and certification recommendations</li>
                  <li>• Progress tracking and milestone setting</li>
                </ul>
              </div>
              <Button className="w-full">Start Skill Analysis</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Cultural Integration Tab */}
        <TabsContent value="cultural" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-pink-600" />
                Cultural Integration Support
              </CardTitle>
              <CardDescription>
                Navigate Canadian workplace culture with confidence
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Workplace Culture</h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• Communication styles</li>
                    <li>• Meeting etiquette</li>
                    <li>• Professional relationships</li>
                    <li>• Work-life balance</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Industry Insights</h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• Sector-specific norms</li>
                    <li>• Networking practices</li>
                    <li>• Career progression paths</li>
                    <li>• Professional development</li>
                  </ul>
                </div>
              </div>
              <Button className="w-full">Get Cultural Guidance</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIFeatures; 