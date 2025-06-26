"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert } from '@/components/ui/alert';
import { Upload, FileText, CheckCircle, XCircle, Loader2, User, Briefcase, GraduationCap, Award, Globe, Zap, Target, TrendingUp, ArrowRight } from 'lucide-react';

interface ResumeAnalysis {
  analysisId?: string;
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
    confidence: number;
  };
  education: Array<{
    degree: string;
    institution: string;
    year: string;
    location: string;
    confidence: number;
  }>;
  workExperience: Array<{
    title: string;
    company: string;
    startDate: string;
    endDate: string;
    location: string;
    responsibilities: string[];
    confidence: number;
  }>;
  skills: {
    technical: string[];
    soft: string[];
    languages: Array<string | { language: string; proficiency: string }>;
    confidence: number;
  };
  certifications: Array<{
    name: string;
    issuer: string;
    year: string;
    confidence: number;
  }>;
  summary: {
    professionalSummary: string;
    careerLevel: string;
    industries: string[];
    confidence: number;
  };
  canadianMarketAnalysis?: {
    overallRelevance: 'High' | 'Medium' | 'Low';
    strengthsForCanadianMarket: string[];
    potentialChallenges: string[];
    recommendedImprovements: string[];
    targetIndustries: string[];
    salaryRangeEstimate: string;
    confidence: number;
  };
  positionRecommendations?: {
    position: string;
    successProbability: number;
    reasons: string[];
    skillMatch: number;
    salaryRange: string;
    marketDemand: string;
    immigrantFriendly: boolean;
    requiredSkills: string[];
    skillGaps: string[];
    confidence: number;
  }[];
  metadata?: {
    processedAt: string;
    originalFileName: string;
    processingMethod: 'direct_pdf' | 'text_extraction';
    apiVersion: string;
  };
}

interface PositionRecommendation {
  title: string;
  matchScore: number;
  successProbability: number;
  salaryRange: string;
  description: string;
  requiredSkills: string[];
  matchingSkills: string[];
  skillGaps: string[];
  marketDemand: string;
  growthPotential: string;
  immigrantFriendly: boolean;
  detailedAnalysis: {
    strengthsMatch: string[];
    potentialConcerns: string[];
    recommendedPreparation: string[];
  };
}

export default function ResumeUploadPage() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [generatingProfile, setGeneratingProfile] = useState(false);
  const [positionRecommendations, setPositionRecommendations] = useState([]);
  const [showPositionSelection, setShowPositionSelection] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (selectedFile) => {
    setError('');
    
    // Validate file type
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png'];
    if (!allowedTypes.includes(selectedFile.type)) {
      setError('Please upload a PDF, DOCX, JPG, or PNG file');
      return;
    }
    
    // Validate file size (10MB - Enhanced with Gemini API)
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }
    
    setFile(selectedFile);
  };

  const uploadResume = async () => {
    if (!file) return;
    
    setUploading(true);
    setError('');
    
    try {
      const formData = new FormData();
      formData.append('resume', file);
      
      const token = localStorage.getItem('token');
      console.log('Uploading to:', `${process.env.NEXT_PUBLIC_API_URL}api/protected/ai-local/resume/upload`);
      console.log('Token available:', !!token);
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/protected/ai-local/resume/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const textResponse = await response.text();
        console.error('Non-JSON response:', textResponse);
        setError(`Server returned non-JSON response. Status: ${response.status}`);
        return;
      }
      
      const result = await response.json();
      console.log('Response result:', result);
      
      if (result.success) {
        setAnalysis(result.data.analysis);
      } else {
        setError(result.message || 'Failed to analyze resume');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError(`Upload failed: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const generateCareerProfile = async () => {
    setGeneratingProfile(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/protected/ai-local/career-profile/position-recommendations`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          resumeAnalysis: analysis
        })
      });
      
      const result = await response.json();
      if (result.success) {
        setPositionRecommendations(result.data.positions || []);
        setShowPositionSelection(true);
      } else {
        setError(result.message || 'Failed to generate position recommendations');
      }
    } catch (err) {
      console.error('Career profile generation error:', err);
      setError('Failed to generate career recommendations');
    } finally {
      setGeneratingProfile(false);
    }
  };

  const selectCareerPath = async (position) => {
    setSelectedPosition(position);
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/protected/ai-local/career-profile/enhanced-profile`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          targetPosition: position,
          resumeAnalysis: analysis
        })
      });
      
      const result = await response.json();
      if (result.success) {
        // Redirect to career profile page with the generated data
        window.location.href = '/dashboard/user/ai/career-profile';
      } else {
        setError('Failed to generate enhanced profile');
      }
    } catch (err) {
      console.error('Enhanced profile generation error:', err);
      setError('Failed to generate enhanced profile');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Resume Analysis
          </h1>
          <p className="text-gray-600">
            Upload your resume for AI-powered analysis and insights tailored for the Canadian job market
          </p>
        </div>

        {!analysis ? (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload Your Resume
              </CardTitle>
              <CardDescription>
                Supported formats: PDF, DOCX, JPG, PNG (Max 10MB) • Enhanced with Gemini Developer API
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert className="mb-4 border-red-200 bg-red-50">
                  <XCircle className="h-4 w-4 text-red-500" />
                  <div className="text-red-700">{error}</div>
                </Alert>
              )}
              
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                {file ? (
                  <div className="space-y-4">
                    <FileText className="h-12 w-12 mx-auto text-green-500" />
                    <div>
                      <p className="font-medium text-gray-900">{file.name}</p>
                      <p className="text-sm text-gray-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <div className="flex gap-2 justify-center">
                      <Button 
                        onClick={uploadResume} 
                        disabled={uploading}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        {uploading ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Analyzing...
                          </>
                        ) : (
                          'Analyze Resume'
                        )}
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setFile(null)}
                        disabled={uploading}
                      >
                        Choose Different File
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Upload className="h-12 w-12 mx-auto text-gray-400" />
                    <div>
                      <p className="text-lg font-medium text-gray-900">
                        Drag and drop your resume here
                      </p>
                      <p className="text-gray-500">or</p>
                    </div>
                    <label>
                      <Button variant="outline" asChild>
                        <span className="cursor-pointer">
                          Browse Files
                        </span>
                      </Button>
                      <input
                        type="file"
                        className="hidden"
                        accept=".pdf,.docx,.jpg,.jpeg,.png"
                        onChange={(e) => e.target.files && handleFileSelect(e.target.files[0])}
                      />
                    </label>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <div className="text-green-700">
                Resume analyzed successfully! Here are your results:
              </div>
            </Alert>

            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Personal Information
                  <Badge variant="secondary">
                    {Math.round((analysis.personalInfo?.confidence || 0) * 100)}% confidence
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-medium">{analysis.personalInfo?.name || 'Not detected'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{analysis.personalInfo?.email || 'Not detected'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium">{analysis.personalInfo?.phone || 'Not detected'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-medium">{analysis.personalInfo?.location || 'Not detected'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Canadian Market Analysis - ALWAYS SHOW */}
            <Card className="border-2 border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-red-600" />
                  Canadian Market Analysis
                  <Badge variant="secondary" className="bg-red-100 text-red-700">
                    🇨🇦 Powered by Gemini AI
                  </Badge>
                </CardTitle>
                <CardDescription>
                  AI-powered analysis of your resume's compatibility with the Canadian job market
                </CardDescription>
              </CardHeader>
              <CardContent>
                {analysis.canadianMarketAnalysis ? (
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Market Relevance</p>
                      <Badge 
                        variant={
                          analysis.canadianMarketAnalysis.overallRelevance === 'High' ? 'default' :
                          analysis.canadianMarketAnalysis.overallRelevance === 'Medium' ? 'secondary' : 'outline'
                        }
                        className={`${
                          analysis.canadianMarketAnalysis.overallRelevance === 'High' ? 'bg-green-100 text-green-800' :
                          analysis.canadianMarketAnalysis.overallRelevance === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}
                      >
                        {analysis.canadianMarketAnalysis.overallRelevance} Relevance
                      </Badge>
                    </div>
                    
                    {analysis.canadianMarketAnalysis.strengthsForCanadianMarket?.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Canadian Market Strengths</p>
                        <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                          {analysis.canadianMarketAnalysis.strengthsForCanadianMarket.map((strength, index) => (
                            <li key={index}>{strength}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {analysis.canadianMarketAnalysis.potentialChallenges?.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Potential Challenges</p>
                        <ul className="list-disc list-inside space-y-1 text-sm text-red-600">
                          {analysis.canadianMarketAnalysis.potentialChallenges.map((challenge, index) => (
                            <li key={index}>{challenge}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {analysis.canadianMarketAnalysis.recommendedImprovements?.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Recommended Improvements</p>
                        <ul className="list-disc list-inside space-y-1 text-sm text-blue-600">
                          {analysis.canadianMarketAnalysis.recommendedImprovements.map((improvement, index) => (
                            <li key={index}>{improvement}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {analysis.canadianMarketAnalysis.targetIndustries?.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Target Industries in Canada</p>
                        <div className="flex flex-wrap gap-2">
                          {analysis.canadianMarketAnalysis.targetIndustries.map((industry, index) => (
                            <Badge key={index} variant="outline" className="bg-blue-50">
                              {industry}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {analysis.canadianMarketAnalysis.salaryRangeEstimate && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Estimated Salary Range (CAD)</p>
                        <Badge variant="secondary" className="bg-green-100 text-green-700">
                          {analysis.canadianMarketAnalysis.salaryRangeEstimate}
                        </Badge>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Globe className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500 mb-2">Canadian Market Analysis will be generated with your resume analysis</p>
                    <p className="text-sm text-gray-400">Upload a resume to see tailored insights for the Canadian job market</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Skills */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Skills
                  <Badge variant="secondary">
                    {Math.round((analysis.skills?.confidence || 0) * 100)}% confidence
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Technical Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {analysis.skills?.technical?.map((skill, index) => (
                        <Badge key={index} variant="outline">{skill}</Badge>
                      )) || <p className="text-gray-500">No technical skills detected</p>}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Soft Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {analysis.skills?.soft?.map((skill, index) => (
                        <Badge key={index} variant="outline" className="bg-blue-50">{skill}</Badge>
                      )) || <p className="text-gray-500">No soft skills detected</p>}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Languages</p>
                    <div className="flex flex-wrap gap-2">
                      {analysis.skills?.languages?.map((lang, index) => (
                        <Badge key={index} variant="outline" className="bg-green-50">
                          {typeof lang === 'string' ? lang : `${lang.language} (${lang.proficiency})`}
                        </Badge>
                      )) || <p className="text-gray-500">No languages detected</p>}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Work Experience */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Work Experience
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analysis.workExperience?.length > 0 ? (
                    analysis.workExperience.map((exp, index) => (
                      <div key={index} className="border-l-4 border-blue-500 pl-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{exp.title}</h4>
                            <p className="text-gray-600">{exp.company}</p>
                          </div>
                          <Badge variant="secondary">
                            {Math.round((exp.confidence || 0) * 100)}% confidence
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500">{exp.startDate} - {exp.endDate}</p>
                        <p className="text-sm text-gray-600 mt-1">{exp.location}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No work experience detected</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Education */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Education
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analysis.education?.length > 0 ? (
                    analysis.education.map((edu, index) => (
                      <div key={index} className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{edu.degree}</h4>
                          <p className="text-gray-600">{edu.institution}</p>
                          <p className="text-sm text-gray-500">{edu.year} • {edu.location}</p>
                        </div>
                        <Badge variant="secondary">
                          {Math.round((edu.confidence || 0) * 100)}% confidence
                        </Badge>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No education detected</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Position Recommendations Modal */}
            {showPositionSelection && (
              <Card className="border-2 border-green-200 bg-green-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-green-600" />
                    Recommended Career Paths
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      Choose Your Path
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    Select a career path to generate your personalized career profile and development plan
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {positionRecommendations.map((position, index) => (
                      <div key={index} className="border rounded-lg p-4 bg-white hover:bg-gray-50 transition-colors">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-semibold text-lg">{position.title}</h4>
                            <p className="text-gray-600 text-sm">{position.description}</p>
                          </div>
                          <div className="text-right">
                            <Badge variant="secondary" className="mb-1">
                              {Math.round(position.successProbability)}% Success Rate
                            </Badge>
                            <p className="text-sm text-gray-500">{position.salaryRange}</p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-sm font-medium text-gray-700 mb-1">Matching Skills</p>
                            <div className="flex flex-wrap gap-1">
                              {position.matchingSkills?.slice(0, 3).map((skill, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs bg-green-50">
                                  {skill}
                                </Badge>
                              ))}
                              {position.matchingSkills?.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{position.matchingSkills.length - 3} more
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700 mb-1">Skill Gaps</p>
                            <div className="flex flex-wrap gap-1">
                              {position.skillGaps?.slice(0, 2).map((gap, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs bg-red-50">
                                  {gap}
                                </Badge>
                              ))}
                              {position.skillGaps?.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                  +{position.skillGaps.length - 2} more
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-4">
                            <Badge variant={position.immigrantFriendly ? 'default' : 'secondary'} className="text-xs">
                              {position.immigrantFriendly ? '🇨🇦 Immigrant Friendly' : 'Standard Requirements'}
                            </Badge>
                            <span className="text-sm text-gray-600">
                              <TrendingUp className="h-4 w-4 inline mr-1" />
                              {position.growthPotential}
                            </span>
                          </div>
                          <Button 
                            onClick={() => selectCareerPath(position)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Select This Path
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 pt-4 border-t">
                    <Button 
                      variant="outline" 
                      onClick={() => setShowPositionSelection(false)}
                      className="w-full"
                    >
                      Back to Resume Analysis
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Processing Method & Improvements */}
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-blue-600" />
                  Enhanced Processing with Gemini API
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Processing Method</p>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      {analysis.metadata?.processingMethod === 'direct_pdf' ? '📄 Direct PDF Reading' : '📝 Text Extraction'}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">API Version</p>
                    <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                      {analysis.metadata?.apiVersion || 'gemini-1.5-flash'}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Processing Speed</p>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      ⚡ 67x Faster
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">File Size Limit</p>
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                      📁 Up to 10MB
                    </Badge>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-white rounded-lg border">
                  <p className="text-xs text-gray-600">
                    <strong>🎯 Key Improvements:</strong> Direct PDF processing, 1000 requests/minute (vs 15 previously), 
                    enhanced Canadian job market analysis, better confidence scoring, and no intermediate file conversion needed.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            {!showPositionSelection && (
              <div className="flex gap-4">
                <Button 
                  onClick={generateCareerProfile}
                  disabled={generatingProfile}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {generatingProfile ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating Career Paths...
                    </>
                  ) : (
                    <>
                      <Target className="h-4 w-4 mr-2" />
                      Generate Career Profile
                    </>
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setFile(null);
                    setAnalysis(null);
                    setError('');
                    setShowPositionSelection(false);
                    setPositionRecommendations([]);
                  }}
                >
                  Upload Another Resume
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 