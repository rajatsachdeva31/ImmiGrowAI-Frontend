"use client";

import React, { useState } from 'react';
import AIFeaturesPanel from '@/components/ai/AIFeaturesPanel';
import ResumeAnalysisList from '@/components/ai/ResumeAnalysisList';
import ResumeAnalysisDetail from '@/components/ai/ResumeAnalysisDetail';
import { Button } from '@/components/ui/button';
import { FileText, Grid3x3 } from 'lucide-react';

interface ResumeAnalysis {
  id: string;
  originalFileName: string;
  createdAt: string;
  personalInfo: {
    name: string;
    email: string;
    phone?: string;
    location?: string;
  };
  skills: string[];
  workExperience: Array<{
    company: string;
    position: string;
    duration: string;
    description: string;
  }>;
  education: Array<{
    institution: string;
    degree: string;
    year: string;
  }>;
  canadianMarketAnalysis: {
    overallScore: number;
    strengths: string[];
    improvementAreas: string[];
    recommendations: string[];
  };
  confidenceScores: {
    overall: number;
    personalInfo: number;
    skills: number;
    workExperience: number;
    education: number;
  };
  metadata: {
    processingMethod: string;
    fileSize: number;
  };
}

export default function AIPage() {
  const [currentView, setCurrentView] = useState<'features' | 'analyses' | 'detail'>('analyses');
  const [selectedAnalysis, setSelectedAnalysis] = useState<ResumeAnalysis | null>(null);

  const handleAnalysisSelect = (analysis: ResumeAnalysis) => {
    setSelectedAnalysis(analysis);
    setCurrentView('detail');
  };

  const handleBackToList = () => {
    setSelectedAnalysis(null);
    setCurrentView('analyses');
  };

  const handleBackToFeatures = () => {
    setCurrentView('features');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                AI Career Assistant
              </h1>
              <p className="text-xl text-gray-600">
                {currentView === 'analyses' && 'Your resume analysis history'}
                {currentView === 'detail' && 'Detailed resume analysis'}
                {currentView === 'features' && 'Accelerate your career journey in Canada with our AI-powered tools'}
              </p>
            </div>
            
            {/* View Toggle Buttons */}
            <div className="flex space-x-2">
              <Button
                onClick={() => setCurrentView('analyses')}
                variant={currentView === 'analyses' || currentView === 'detail' ? 'default' : 'outline'}
                className="flex items-center space-x-2"
              >
                <FileText className="w-4 h-4" />
                <span>Resume Analyses</span>
              </Button>
              <Button
                onClick={handleBackToFeatures}
                variant={currentView === 'features' ? 'default' : 'outline'}
                className="flex items-center space-x-2"
              >
                <Grid3x3 className="w-4 h-4" />
                <span>All Features</span>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Content based on current view */}
        {currentView === 'features' && <AIFeaturesPanel />}
        
        {currentView === 'analyses' && (
          <ResumeAnalysisList onAnalysisSelect={handleAnalysisSelect} />
        )}
        
        {currentView === 'detail' && selectedAnalysis && (
          <ResumeAnalysisDetail 
            analysis={selectedAnalysis} 
            onBack={handleBackToList}
          />
        )}
      </div>
    </div>
  );
} 