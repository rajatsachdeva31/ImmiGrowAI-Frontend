'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Calendar, TrendingUp, Eye, Clock, AlertCircle } from 'lucide-react';

interface ResumeAnalysis {
  id: string;
  originalFileName: string;
  createdAt: string;
  personalInfo?: {
    name?: string;
    email?: string;
  };
  canadianMarketAnalysis?: {
    overallRelevance?: string;
    strengthsForCanadianMarket?: string[];
    potentialChallenges?: string[];
    recommendedImprovements?: string[];
    targetIndustries?: string[];
    confidence?: number;
  };
  confidenceScores?: {
    overall?: number;
  };
  metadata?: {
    processingMethod?: string;
    fileSize?: number;
  };
}

interface ResumeAnalysisListProps {
  onAnalysisSelect: (analysis: ResumeAnalysis) => void;
}

const ResumeAnalysisList: React.FC<ResumeAnalysisListProps> = ({ onAnalysisSelect }) => {
  const [analyses, setAnalyses] = useState<ResumeAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalyses();
  }, []);

  const fetchAnalyses = async () => {
    try {
      setLoading(true);
      
      // First try to get token from localStorage (Google login)
      let token = localStorage.getItem('token');
      console.log('🔐 Frontend - Token from localStorage:', token ? 'Yes' : 'No');
      
      // If no token in localStorage, try to get from cookie-based auth
      if (!token) {
        console.log('🔐 Frontend - Fetching token from cookie-based auth...');
        const tokenResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/token`, {
          credentials: "include",
        });
        
        if (tokenResponse.ok) {
          const tokenData = await tokenResponse.json();
          token = tokenData?.token;
          console.log('🔐 Frontend - Token from cookie auth:', token ? 'Yes' : 'No');
        }
      }
      
      if (!token) {
        setError('Please log in to view your resume analyses');
        console.error('❌ Frontend - No authentication token available');
        return;
      }
      
      console.log('🔐 Frontend - Using token length:', token?.length || 0);
      
      const response = await fetch('/api/ai/resume/analyses', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('📥 Frontend - Response status:', response.status);
      console.log('📥 Frontend - Response headers:', Object.fromEntries(response.headers.entries()));

      const result = await response.json();
      console.log('📥 Frontend - Response data:', result);
      
      if (result.success && result.data) {
        console.log('📊 Frontend - Sample analysis structure:', result.data[0]);
        console.log('📊 Frontend - Canadian market analysis:', result.data[0]?.canadianMarketAnalysis);
        setAnalyses(result.data);
      } else {
        console.error('❌ Frontend - API Error:', result.message);
        setError(result.message || 'Failed to fetch analyses');
      }
    } catch (err: any) {
      console.error('❌ Frontend - Fetch Error:', err);
      setError(err.message || 'Failed to fetch analyses');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-CA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatFileSize = (bytes: number) => {
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const toPercentage = (value: number) => {
    if (value <= 1) {
      return Math.round(value * 100);
    }
    return Math.round(value);
  };

  const getMarketRelevanceScore = (relevance?: string): number => {
    switch (relevance?.toLowerCase()) {
      case 'high': return 85;
      case 'medium': return 65;
      case 'low': return 35;
      default: return 0;
    }
  };

  const getScoreColor = (score: number) => {
    const percentage = toPercentage(score);
    if (percentage >= 80) return 'text-green-600 bg-green-50 border-green-200';
    if (percentage >= 60) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-4">
          <Clock className="w-8 h-8 animate-spin mx-auto text-blue-500" />
          <p className="text-gray-600">Loading your resume analyses...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900">Unable to Load Resume Analyses</h3>
          <p className="text-gray-600 mt-2">{error}</p>
          {error.includes('log in') && (
            <Button 
              onClick={() => window.location.href = '/login'}
              className="mt-4"
            >
              Go to Login
            </Button>
          )}
          <Button 
            variant="outline"
            onClick={() => {
              setError(null);
              fetchAnalyses();
            }}
            className="mt-2 ml-2"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (analyses.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 max-w-md mx-auto">
          <FileText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Resume Analyses Yet</h3>
          <p className="text-gray-600 mb-6">
            Upload your first resume to get started with AI-powered analysis and insights.
          </p>
          <Button onClick={() => window.location.href = '/dashboard/user/ai/resume'}>
            Upload Resume
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Your Resume Analyses</h2>
          <p className="text-gray-600">Click on any analysis to view detailed insights</p>
        </div>
        <Badge variant="secondary" className="text-sm">
          {analyses.length} {analyses.length === 1 ? 'Analysis' : 'Analyses'}
        </Badge>
      </div>

      <div className="grid gap-4">
        {analyses.map((analysis) => (
          <Card 
            key={analysis.id}
            className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:border-blue-300"
            onClick={() => onAnalysisSelect(analysis)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-gray-900">
                      {analysis.originalFileName}
                    </CardTitle>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(analysis.createdAt)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span>{formatFileSize(analysis.metadata?.fileSize || 0)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Badge variant="outline" className="text-xs">
                          {analysis.metadata?.processingMethod === 'direct_pdf' ? 'Direct PDF' : 'Text Extract'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
                <Button size="sm" variant="ghost" className="ml-2">
                  <Eye className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">
                      {analysis.personalInfo?.name || 'Name not extracted'}
                    </p>
                    <p className="text-sm text-gray-600">
                      {analysis.personalInfo?.email || 'Email not found'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className={`p-3 rounded-lg border ${getScoreColor(analysis.confidenceScores?.overall || 0)}`}>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Extraction Quality</span>
                      <TrendingUp className="w-4 h-4" />
                    </div>
                    <div className="text-lg font-bold mt-1">
                      {toPercentage(analysis.confidenceScores?.overall || 0)}%
                    </div>
                  </div>

                  <div className={`p-3 rounded-lg border ${getScoreColor(getMarketRelevanceScore(analysis.canadianMarketAnalysis?.overallRelevance))}`}>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Market Alignment</span>
                      <TrendingUp className="w-4 h-4" />
                    </div>
                    <div className="text-lg font-bold mt-1">
                      {getMarketRelevanceScore(analysis.canadianMarketAnalysis?.overallRelevance)}%
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="font-medium text-green-700">Strengths:</span>
                    <p className="text-gray-600 mt-1 line-clamp-2">
                      {analysis.canadianMarketAnalysis?.strengthsForCanadianMarket && Array.isArray(analysis.canadianMarketAnalysis.strengthsForCanadianMarket) 
                        ? analysis.canadianMarketAnalysis.strengthsForCanadianMarket.slice(0, 2).join(', ')
                        : 'No strengths available'}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-orange-700">Improve:</span>
                    <p className="text-gray-600 mt-1 line-clamp-2">
                      {analysis.canadianMarketAnalysis?.recommendedImprovements && Array.isArray(analysis.canadianMarketAnalysis.recommendedImprovements)
                        ? analysis.canadianMarketAnalysis.recommendedImprovements.slice(0, 2).join(', ')
                        : 'No improvement areas available'}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-100">
                  <Button 
                    size="sm" 
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      onAnalysisSelect(analysis);
                    }}
                  >
                    View Full Analysis
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">Ready for more insights?</h3>
              <p className="text-sm text-blue-700">
                Upload a new resume or enhance your existing analysis with additional features.
              </p>
            </div>
            <div className="flex space-x-2">
              <Button 
                size="sm"
                onClick={() => window.location.href = '/dashboard/user/ai/resume'}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Upload New Resume
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResumeAnalysisList; 