"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const AIFeaturesPanel = () => {
  const [expandedCard, setExpandedCard] = useState(null);

  const features = [
    {
      id: 'resume',
      title: 'Resume Analysis',
      description: 'AI-powered resume analysis and auto-fill',
      icon: '📄',
      color: 'border-blue-200 bg-blue-50',
      benefits: ['Extract work experience', 'Identify skills', 'Canadian market analysis'],
      route: '/dashboard/user/ai/resume'
    },
    {
      id: 'profile',
      title: 'Career Profile Generator',
      description: 'Generate tailored career profiles with position recommendations',
      icon: '🎯',
      color: 'border-green-200 bg-green-50',
      benefits: ['Position recommendations', 'Success probability analysis', 'Enhanced profile generation'],
      route: '/dashboard/user/ai/career-profile'
    },
    {
      id: 'mentors',
      title: 'Find Mentors',
      description: 'AI-powered mentor matching',
      icon: '👥',
      color: 'border-purple-200 bg-purple-50',
      benefits: ['Industry experts', 'Cultural guidance', 'Career advice'],
      route: '/dashboard/user/ai/mentors'
    },
    {
      id: 'coaching',
      title: 'AI Career Coach',
      description: 'Personalized career guidance',
      icon: '💬',
      color: 'border-orange-200 bg-orange-50',
      benefits: ['Interview prep', 'Skill development', 'Networking tips'],
      route: '/dashboard/user/ai/coaching'
    },
    {
      id: 'jobs',
      title: 'Job Discovery',
      description: 'Find matching job opportunities',
      icon: '🔍',
      color: 'border-cyan-200 bg-cyan-50',
      benefits: ['Smart matching', 'Compatibility scores', 'Job alerts'],
      route: '/dashboard/user/ai/jobs'
    },
    {
      id: 'skills',
      title: 'Skill Gap Analysis',
      description: 'Identify and bridge skill gaps',
      icon: '📈',
      color: 'border-yellow-200 bg-yellow-50',
      benefits: ['Gap identification', 'Learning path', 'Progress tracking'],
      route: '/dashboard/user/ai/skills'
    }
  ];

  const toggleCard = (id) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-3">
        <h2 className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-2">
          ✨ AI Career Assistant
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Leverage AI-powered tools to accelerate your career growth in Canada. 
          Get personalized insights, find mentors, and navigate your professional journey with confidence.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature) => (
          <Card 
            key={feature.id} 
            className={`cursor-pointer transition-all hover:shadow-lg ${feature.color} ${
              expandedCard === feature.id ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => toggleCard(feature.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{feature.icon}</span>
                  <div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                    <Badge variant="secondary" className="text-xs">
                      {feature.id === 'profile' || feature.id === 'resume' ? 'Available' : 'Coming Soon'}
                    </Badge>
                  </div>
                </div>
              </div>
              <CardDescription className="text-sm">
                {feature.description}
              </CardDescription>
            </CardHeader>
            
            {expandedCard === feature.id && (
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm">Features:</h4>
                  <ul className="space-y-1">
                    {feature.benefits.map((benefit, index) => (
                      <li key={index} className="text-sm flex items-center gap-2">
                        <span className="text-green-500">✓</span>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                  <Button 
                    size="sm" 
                    className="w-full mt-3"
                    disabled={feature.id !== 'profile' && feature.id !== 'resume'}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (feature.id === 'profile' || feature.id === 'resume') {
                        window.location.href = feature.route;
                      }
                    }}
                  >
                    {feature.id === 'profile' || feature.id === 'resume' ? 'Get Started' : 'Coming Soon'}
                  </Button>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-2">🚀 Get Started</h3>
        <p className="text-blue-800 text-sm mb-4">
          Begin your AI-powered career journey by uploading your resume for analysis, 
          or generate a tailored career profile with position recommendations.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button 
            onClick={() => window.location.href = '/dashboard/user/ai/resume'}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Upload Resume
          </Button>
          <Button 
            onClick={() => window.location.href = '/dashboard/user/ai/career-profile'}
            className="bg-green-600 hover:bg-green-700"
          >
            Career Profile
          </Button>
          <Button 
            variant="outline" 
            disabled
            className="border-blue-600 text-blue-600"
          >
            More Features Coming Soon
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AIFeaturesPanel; 