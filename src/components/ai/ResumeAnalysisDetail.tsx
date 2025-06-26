"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, FileText, User, Mail, Phone, MapPin, Calendar, TrendingUp, Star, AlertCircle, CheckCircle, Briefcase, GraduationCap, Code, Languages, Target, ArrowRight, X, Loader2, Globe, Award, DollarSign, Search } from 'lucide-react';
import JobSearchModal from './JobSearchModal';

interface ResumeAnalysis {
  id: string;
  originalFileName: string;
  createdAt: string;
  personalInfo?: {
    name?: string;
    email?: string;
    phone?: string;
    location?: string;
    linkedin?: string;
    website?: string;
    confidence?: number;
  };
  skills?: {
    technical?: string[];
    soft?: string[];
    languages?: Array<{
      language: string;
      proficiency: string;
    }>;
    canadianWorkplaceRelevance?: string;
    confidence?: number;
  };
  workExperience?: Array<{
    title: string;
    company: string;
    startDate: string;
    endDate: string;
    location?: string;
    responsibilities?: string[];
    achievements?: string[];
    canadianRelevance?: string;
    confidence?: number;
  }>;
  education?: Array<{
    degree: string;
    institution: string;
    year: string;
    location?: string;
    gpa?: string;
    relevantCoursework?: string[];
    canadianEquivalency?: string;
    confidence?: number;
  }>;
  certifications?: Array<{
    name: string;
    issuer: string;
    year: string;
    expiryDate?: string;
    canadianRecognition?: string;
    confidence?: number;
  }>;
  projects?: Array<{
    name: string;
    description: string;
    technologies: string[];
    role: string;
    year: string;
    confidence?: number;
  }>;
  canadianMarketAnalysis?: {
    overallRelevance?: string;
    strengthsForCanadianMarket?: string[];
    potentialChallenges?: string[];
    recommendedImprovements?: string[];
    targetIndustries?: string[];
    salaryRangeEstimate?: string;
    confidence?: number;
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
  confidenceScores?: {
    overall?: number;
    dataExtraction?: number;
    marketAnalysis?: number;
  };
  metadata?: {
    processingMethod?: string;
    fileSize?: number;
    processedAt?: string;
    apiVersion?: string;
  };
}

interface PositionRecommendation {
  position: string;
  successProbability: number;
  reasons: string[];
  skillMatch: number;
  marketDemand: string;
  salaryRange: string;
  immigrantFriendly: boolean;
  requiredSkills: string[];
  recommendedActions: string[];
}

interface EnhancedProfile {
  optimized_profile?: {
    professional_title?: string;
    elevator_pitch?: string;
    value_proposition?: string;
    key_achievements?: string[];
  };
  skills_positioning?: {
    primary_skills?: Array<{
      skill: string;
      relevance_to_role: string;
      evidence: string;
      positioning_statement: string;
    }>;
    skill_development_plan?: Array<{
      skill: string;
      importance: string;
      learning_path: string;
      timeline: string;
      resources: string[];
    }>;
  };
  experience_repositioning?: {
    relevant_experience?: Array<{
      original_role: string;
      repositioned_as: string;
      key_transferable_elements: string[];
      success_metrics: string[];
      canadian_context: string;
    }>;
    project_highlights?: Array<{
      project: string;
      relevance: string;
      technologies_used: string[];
      impact: string;
      presentation_tip: string;
    }>;
  };
  application_strategy?: {
    resume_optimization?: {
      key_changes: string[];
      keywords_to_include: string[];
      sections_to_emphasize: string[];
      formatting_tips: string[];
    };
    cover_letter_strategy?: {
      opening_approach: string;
      key_points_to_address: string[];
      company_research_areas: string[];
      closing_strategy: string;
    };
    networking_approach?: {
      target_professionals: string[];
      conversation_starters: string[];
      value_you_bring: string[];
      follow_up_strategies: string[];
    };
  };
  interview_preparation?: {
    common_questions?: Array<{
      question: string;
      strategy: string;
      key_points: string[];
      example_answer_structure: string;
    }>;
    behavioral_examples?: Array<{
      situation: string;
      task: string;
      action: string;
      result: string;
      relevance: string;
    }>;
    technical_preparation?: {
      skills_to_demonstrate: string[];
      portfolio_items: string[];
      coding_challenges: string[];
      system_design_topics: string[];
    };
    cultural_fit_preparation?: {
      company_culture_research: string[];
      canadian_workplace_norms: string[];
      questions_to_ask: string[];
    };
  };
  "90_day_action_plan"?: {
    week_1_2?: string[];
    month_1?: string[];
    month_2?: string[];
    month_3?: string[];
    success_metrics?: string[];
  };
}

interface ResumeAnalysisDetailProps {
  analysis: ResumeAnalysis;
  onBack: () => void;
}

const ResumeAnalysisDetail: React.FC<ResumeAnalysisDetailProps> = ({ analysis, onBack }) => {
  // State for career profile generation
  const [showPositionModal, setShowPositionModal] = useState(false);
  const [positions, setPositions] = useState<PositionRecommendation[]>([]);
  const [loadingPositions, setLoadingPositions] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<PositionRecommendation | null>(null);
  const [enhancedProfile, setEnhancedProfile] = useState<EnhancedProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  
  // Job search modal state
  const [jobSearchModalOpen, setJobSearchModalOpen] = useState(false);
  const [jobSearchCareerPath, setJobSearchCareerPath] = useState<{ title: string; industry?: string } | null>(null);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatFileSize = (bytes: number) => {
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  // Convert decimal confidence scores to percentages
  const toPercentage = (decimal: number | undefined): number => {
    if (decimal === undefined || decimal === null) return 0;
    // If already a percentage (>1), return as is, otherwise multiply by 100
    return decimal > 1 ? Math.round(decimal) : Math.round(decimal * 100);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="w-5 h-5 text-green-600" />;
    if (score >= 60) return <AlertCircle className="w-5 h-5 text-yellow-600" />;
    return <AlertCircle className="w-5 h-5 text-red-600" />;
  };

  const getRelevanceColor = (relevance: string) => {
    switch (relevance?.toLowerCase()) {
      case 'high': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Safe accessors with defaults
  const personalInfo = analysis.personalInfo || {};
  const canadianMarketAnalysis = analysis.canadianMarketAnalysis || {};
  const confidenceScores = analysis.confidenceScores || {};
  const metadata = analysis.metadata || {};
  const skills = analysis.skills || {};
  const workExperience = Array.isArray(analysis.workExperience) ? analysis.workExperience : [];
  const education = Array.isArray(analysis.education) ? analysis.education : [];
  const certifications = Array.isArray(analysis.certifications) ? analysis.certifications : [];
  const projects = Array.isArray(analysis.projects) ? analysis.projects : [];

  // Default values for nested properties
  const strengthsForCanadianMarket = Array.isArray(canadianMarketAnalysis.strengthsForCanadianMarket) ? canadianMarketAnalysis.strengthsForCanadianMarket : [];
  const potentialChallenges = Array.isArray(canadianMarketAnalysis.potentialChallenges) ? canadianMarketAnalysis.potentialChallenges : [];
  const recommendedImprovements = Array.isArray(canadianMarketAnalysis.recommendedImprovements) ? canadianMarketAnalysis.recommendedImprovements : [];
  const targetIndustries = Array.isArray(canadianMarketAnalysis.targetIndustries) ? canadianMarketAnalysis.targetIndustries : [];

  // Get overall market relevance score
  const getMarketRelevanceScore = () => {
    const relevance = canadianMarketAnalysis.overallRelevance?.toLowerCase();
    switch (relevance) {
      case 'high': return 85;
      case 'medium': return 65;
      case 'low': return 35;
      default: return 0;
    }
  };

  // Helper functions for career profile generation
  const getScoreColorClass = (score: number) => {
    if (score >= 80) return 'border-green-500 bg-green-50';
    if (score >= 60) return 'border-yellow-500 bg-yellow-50';
    return 'border-red-500 bg-red-50';
  };

  const getDemandColor = (demand: string) => {
    switch (demand?.toLowerCase()) {
      case 'high': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Generate position recommendations
  const handleGenerateCareerProfile = async () => {
    // Use stored position recommendations if available
    if (analysis.positionRecommendations && analysis.positionRecommendations.length > 0) {
      const formattedPositions = analysis.positionRecommendations.map(pos => ({
        position: pos.position,
        successProbability: pos.successProbability,
        reasons: pos.reasons,
        skillMatch: pos.skillMatch,
        salaryRange: pos.salaryRange,
        marketDemand: pos.marketDemand,
        immigrantFriendly: pos.immigrantFriendly,
        requiredSkills: pos.requiredSkills,
        recommendedActions: pos.skillGaps?.map(gap => `Improve ${gap}`) || []
      }));
      setPositions(formattedPositions);
      setShowPositionModal(true);
      return;
    }

    // Use existing target industries from Canadian Market Analysis
    if (targetIndustries.length > 0) {
      const industryBasedPositions = targetIndustries.map((industry, index) => ({
        position: `${industry} Professional`,
        successProbability: 75 + (index * 5), // Slightly different scores for each
        reasons: [
          `Strong alignment with ${industry} sector`,
          'Canadian market demand for this industry',
          'Your skills match industry requirements'
        ],
        skillMatch: 80 - (index * 5), // Slightly decreasing skill match
        salaryRange: canadianMarketAnalysis.salaryRangeEstimate || '$60,000 - $85,000 CAD',
        marketDemand: index === 0 ? 'High' : index === 1 ? 'Medium-High' : 'Medium',
        immigrantFriendly: true,
        requiredSkills: skills.technical?.slice(0, 5) || ['Professional skills', 'Communication', 'Technical expertise'],
        recommendedActions: recommendedImprovements.slice(0, 3) || ['Gain Canadian work experience', 'Network within the industry', 'Obtain relevant certifications']
      }));
      
      setPositions(industryBasedPositions);
      setShowPositionModal(true);
      return;
    }

    // If no target industries or position recommendations available, show message
    alert('No career recommendations available. Please ensure your resume has been properly analyzed.');
  };

  // Generate enhanced profile for selected position
  const handleSelectPosition = async (position: PositionRecommendation) => {
    try {
      setSelectedPosition(position);
      setLoadingProfile(true);

      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/protected/ai-local/career-profile/enhanced-profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          targetPosition: position,
          resumeAnalysis: analysis
        })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Enhanced profile response:', data);
        // The backend returns enhancedProfile in data.data.enhancedProfile
        setEnhancedProfile(data.data?.enhancedProfile || data.enhancedProfile);
      } else {
        const errorText = await response.text();
        console.error('Failed to generate enhanced profile. Status:', response.status, 'Response:', errorText);
        alert('Failed to generate enhanced profile. Please try again.');
      }
    } catch (error) {
      console.error('Error generating enhanced profile:', error);
      alert('Error generating enhanced profile. Please try again.');
    } finally {
      setLoadingProfile(false);
    }
  };

  const closeModal = () => {
    setShowPositionModal(false);
    setPositions([]);
    setSelectedPosition(null);
    setEnhancedProfile(null);
    setLoadingPositions(false);
    setLoadingProfile(false);
  };

  // Job search handler
  const handleJobSearch = (position: PositionRecommendation) => {
    setJobSearchCareerPath({
      title: position.position,
      industry: undefined // You can extract industry from position if available
    });
    setJobSearchModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button onClick={onBack} variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to List
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
              <FileText className="w-6 h-6" />
              <span>{analysis.originalFileName}</span>
            </h2>
            <p className="text-gray-600">Analysis completed on {formatDate(analysis.createdAt)}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline">
            {formatFileSize(metadata.fileSize || 0)}
          </Badge>
          <Badge variant="secondary">
            {metadata.processingMethod === 'direct_pdf' ? 'Direct PDF' : 'Text Extract'}
          </Badge>
        </div>
      </div>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="w-5 h-5" />
            <span>Personal Information</span>
            <Badge variant="outline" className={getScoreColor(toPercentage(personalInfo.confidence))}>
              {toPercentage(personalInfo.confidence)}% confidence
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-gray-500" />
                <span className="font-medium">Name:</span>
                <span>{personalInfo.name || 'Not extracted'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-gray-500" />
                <span className="font-medium">Email:</span>
                <span>{personalInfo.email || 'Not found'}</span>
              </div>
              {personalInfo.linkedin && (
                <div className="flex items-center space-x-2">
                  <span className="font-medium">LinkedIn:</span>
                  <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {personalInfo.linkedin}
                  </a>
                </div>
              )}
            </div>
            <div className="space-y-3">
              {personalInfo.phone && (
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">Phone:</span>
                  <span>{personalInfo.phone}</span>
                </div>
              )}
              {personalInfo.location && (
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">Location:</span>
                  <span>{personalInfo.location}</span>
                </div>
              )}
              {personalInfo.website && (
                <div className="flex items-center space-x-2">
                  <span className="font-medium">Website:</span>
                  <a href={personalInfo.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {personalInfo.website}
                  </a>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Confidence Scores */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5" />
            <span>Extraction Confidence Scores</span>
          </CardTitle>
          <CardDescription>
            How confident our AI is about the extracted information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`p-4 rounded-lg border ${getScoreColor(toPercentage(confidenceScores.overall))}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Overall</span>
                {getScoreIcon(toPercentage(confidenceScores.overall))}
              </div>
              <div className="text-2xl font-bold">{toPercentage(confidenceScores.overall)}%</div>
            </div>
            <div className={`p-4 rounded-lg border ${getScoreColor(toPercentage(confidenceScores.dataExtraction))}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Data Extraction</span>
                {getScoreIcon(toPercentage(confidenceScores.dataExtraction))}
              </div>
              <div className="text-2xl font-bold">{toPercentage(confidenceScores.dataExtraction)}%</div>
            </div>
            <div className={`p-4 rounded-lg border ${getScoreColor(toPercentage(confidenceScores.marketAnalysis))}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Market Analysis</span>
                {getScoreIcon(toPercentage(confidenceScores.marketAnalysis))}
              </div>
              <div className="text-2xl font-bold">{toPercentage(confidenceScores.marketAnalysis)}%</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Canadian Market Analysis Card */}
      <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-green-800">
            <Globe className="w-6 h-6" />
            <span>Canadian Market Analysis</span>
          </CardTitle>
          <CardDescription className="text-green-700">
            How well your resume aligns with the Canadian job market
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className={`p-6 rounded-lg border ${getScoreColor(getMarketRelevanceScore())}`}>
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-semibold">Overall Market Relevance</span>
                <div className="flex items-center space-x-2">
                  <Badge className={getRelevanceColor(canadianMarketAnalysis.overallRelevance)}>
                    {canadianMarketAnalysis.overallRelevance || 'Not assessed'}
                  </Badge>
                  <div className="text-3xl font-bold">{getMarketRelevanceScore()}%</div>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-current h-2 rounded-full" 
                  style={{ width: `${getMarketRelevanceScore()}%` }}
                ></div>
              </div>
            </div>

            {canadianMarketAnalysis.salaryRangeEstimate && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Estimated Salary Range</h4>
                <p className="text-blue-700">{canadianMarketAnalysis.salaryRangeEstimate}</p>
              </div>
            )}

            {targetIndustries.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Target Industries</h4>
                <div className="flex flex-wrap gap-2">
                  {targetIndustries.map((industry, index) => (
                    <Badge key={index} variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                      {industry}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-green-700 mb-3 flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>Strengths for Canadian Market</span>
                </h4>
                {strengthsForCanadianMarket.length > 0 ? (
                  <ul className="space-y-2">
                    {strengthsForCanadianMarket.map((strength, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-sm text-gray-700">{strength}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500 italic">No strengths identified yet. Try uploading a more detailed resume.</p>
                )}
              </div>

              <div>
                <h4 className="font-semibold text-orange-700 mb-3 flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4" />
                  <span>Potential Challenges</span>
                </h4>
                {potentialChallenges.length > 0 ? (
                  <ul className="space-y-2">
                    {potentialChallenges.map((challenge, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-sm text-gray-700">{challenge}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500 italic">No potential challenges identified.</p>
                )}
              </div>
            </div>

            {recommendedImprovements.length > 0 && (
              <div>
                <h4 className="font-semibold text-blue-700 mb-3 flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4" />
                  <span>Recommended Improvements</span>
                </h4>
                <ul className="space-y-2">
                  {recommendedImprovements.map((improvement, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-sm text-gray-700">{improvement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Skills */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Code className="w-5 h-5" />
            <span>Extracted Skills</span>
            <Badge variant="outline" className={getScoreColor(toPercentage(skills.confidence))}>
              {toPercentage(skills.confidence)}% confidence
            </Badge>
          </CardTitle>
          <CardDescription>Skills identified from your resume</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {skills.canadianWorkplaceRelevance && (
              <div className="p-3 rounded-lg border">
                <span className="text-sm font-medium">Canadian Workplace Relevance: </span>
                <Badge className={getRelevanceColor(skills.canadianWorkplaceRelevance)}>
                  {skills.canadianWorkplaceRelevance}
                </Badge>
              </div>
            )}
            
            {Array.isArray(skills.technical) && skills.technical.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Technical Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {skills.technical.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {Array.isArray(skills.soft) && skills.soft.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Soft Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {skills.soft.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="bg-green-50 text-green-700 border-green-200">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {Array.isArray(skills.languages) && skills.languages.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center space-x-2">
                  <Languages className="w-4 h-4" />
                  <span>Languages</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {skills.languages.map((lang, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">{lang.language}</span>
                      <Badge variant="outline">{lang.proficiency}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Work Experience */}
      {workExperience.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Briefcase className="w-5 h-5" />
              <span>Work Experience</span>
            </CardTitle>
            <CardDescription>Professional experience extracted from your resume</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {workExperience.map((exp, index) => (
                <div key={index} className="border-l-4 border-blue-200 pl-4 py-3 bg-gray-50 rounded-r-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-900">{exp.title}</h4>
                      <p className="text-sm text-gray-600 font-medium">{exp.company}</p>
                      {exp.location && (
                        <p className="text-sm text-gray-500">{exp.location}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <Badge variant="outline">
                        {exp.startDate} - {exp.endDate || 'Present'}
                      </Badge>
                      {exp.canadianRelevance && (
                        <div className="mt-1">
                          <Badge className={getRelevanceColor(exp.canadianRelevance)}>
                            {exp.canadianRelevance} relevance
                          </Badge>
                        </div>
                      )}
                      <div className="mt-1">
                        <Badge variant="outline" className={getScoreColor(toPercentage(exp.confidence))}>
                          {toPercentage(exp.confidence)}% confidence
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  {Array.isArray(exp.responsibilities) && exp.responsibilities.length > 0 && (
                    <div className="mt-3">
                      <h5 className="font-medium text-gray-800 mb-2">Key Responsibilities:</h5>
                      <ul className="space-y-1">
                        {exp.responsibilities.map((resp, respIndex) => (
                          <li key={respIndex} className="flex items-start space-x-2">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-sm text-gray-700">{resp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {Array.isArray(exp.achievements) && exp.achievements.length > 0 && (
                    <div className="mt-3">
                      <h5 className="font-medium text-gray-800 mb-2">Key Achievements:</h5>
                      <ul className="space-y-1">
                        {exp.achievements.map((achievement, achIndex) => (
                          <li key={achIndex} className="flex items-start space-x-2">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-sm text-gray-700">{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Education */}
      {education.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <GraduationCap className="w-5 h-5" />
              <span>Education</span>
            </CardTitle>
            <CardDescription>Educational background extracted from your resume</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {education.map((edu, index) => (
                <div key={index} className="border-l-4 border-green-200 pl-4 py-3 bg-gray-50 rounded-r-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-900">{edu.degree}</h4>
                      <p className="text-sm text-gray-600">{edu.institution}</p>
                      {edu.location && (
                        <p className="text-sm text-gray-500">{edu.location}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <Badge variant="outline">{edu.year}</Badge>
                      {edu.gpa && (
                        <div className="mt-1">
                          <Badge variant="secondary">GPA: {edu.gpa}</Badge>
                        </div>
                      )}
                      {edu.canadianEquivalency && (
                        <div className="mt-1">
                          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                            {edu.canadianEquivalency}
                          </Badge>
                        </div>
                      )}
                      <div className="mt-1">
                        <Badge variant="outline" className={getScoreColor(toPercentage(edu.confidence))}>
                          {toPercentage(edu.confidence)}% confidence
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  {Array.isArray(edu.relevantCoursework) && edu.relevantCoursework.length > 0 && (
                    <div className="mt-3">
                      <h5 className="font-medium text-gray-800 mb-2">Relevant Coursework:</h5>
                      <div className="flex flex-wrap gap-1">
                        {edu.relevantCoursework.map((course, courseIndex) => (
                          <Badge key={courseIndex} variant="outline" className="text-xs">
                            {course}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Certifications</CardTitle>
            <CardDescription>Professional certifications and their Canadian recognition</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {certifications.map((cert, index) => (
                <div key={index} className="border-l-4 border-purple-200 pl-4 py-2 bg-gray-50 rounded-r-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900">{cert.name}</h4>
                      <p className="text-sm text-gray-600">{cert.issuer}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline">{cert.year}</Badge>
                      {cert.expiryDate && (
                        <div className="mt-1">
                          <Badge variant="secondary">Expires: {cert.expiryDate}</Badge>
                        </div>
                      )}
                      {cert.canadianRecognition && (
                        <div className="mt-1">
                          <Badge className={
                            cert.canadianRecognition === 'Recognized' ? 'bg-green-100 text-green-800 border-green-200' :
                            cert.canadianRecognition === 'Partially' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                            'bg-red-100 text-red-800 border-red-200'
                          }>
                            {cert.canadianRecognition}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Projects</CardTitle>
            <CardDescription>Notable projects extracted from your resume</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {projects.map((project, index) => (
                <div key={index} className="border-l-4 border-indigo-200 pl-4 py-3 bg-gray-50 rounded-r-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-900">{project.name}</h4>
                      <p className="text-sm text-gray-600">{project.role}</p>
                      <p className="text-sm text-gray-700 mt-1">{project.description}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline">{project.year}</Badge>
                      <div className="mt-1">
                        <Badge variant="outline" className={getScoreColor(toPercentage(project.confidence))}>
                          {toPercentage(project.confidence)}% confidence
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  {Array.isArray(project.technologies) && project.technologies.length > 0 && (
                    <div className="mt-3">
                      <h5 className="font-medium text-gray-800 mb-2">Technologies Used:</h5>
                      <div className="flex flex-wrap gap-1">
                        {project.technologies.map((tech, techIndex) => (
                          <Badge key={techIndex} variant="secondary" className="text-xs bg-indigo-50 text-indigo-700 border-indigo-200">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <h3 className="font-semibold text-blue-900 mb-4">Next Steps</h3>
          <div className="flex flex-wrap gap-3">
            <Button 
              onClick={handleGenerateCareerProfile}
              className="bg-blue-600 hover:bg-blue-700"
              disabled={loadingPositions || (targetIndustries.length === 0 && (!analysis.positionRecommendations || analysis.positionRecommendations.length === 0))}
            >
              {loadingPositions ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating Recommendations...
                </>
              ) : (
                <>
                  <Target className="w-4 h-4 mr-2" />
                  View Career Profile
                </>
              )}
            </Button>
            <Button 
              variant="outline"
              onClick={() => window.location.href = '/dashboard/user/ai/resume'}
              className="border-blue-600 text-blue-600 hover:bg-blue-50"
            >
              Upload New Resume
            </Button>
            <Button 
              variant="outline"
              onClick={onBack}
            >
              Back to Analyses
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Position Recommendations Modal */}
      {showPositionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Career Path Recommendations</h2>
              <Button onClick={closeModal} variant="ghost" size="sm">
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="p-6">
              {!enhancedProfile ? (
                <>
                  <p className="text-gray-600 mb-6">
                    Based on your resume analysis, here are the most suitable career paths in Canada:
                  </p>

                  {loadingPositions ? (
                    <div className="text-center py-12">
                      <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
                      <p className="text-gray-600">Analyzing your profile and generating recommendations...</p>
                    </div>
                  ) : (
                    <div className="grid gap-4">
                      {positions.map((position, index) => (
                        <Card key={index} className="hover:shadow-lg transition-shadow">
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex-1">
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">{position.position}</h3>
                                <div className="flex flex-wrap gap-2 mb-3">
                                  {position.immigrantFriendly && (
                                    <Badge className="bg-green-100 text-green-800">
                                      <Globe className="w-3 h-3 mr-1" />
                                      Immigrant Friendly
                                    </Badge>
                                  )}
                                  <Badge className={getDemandColor(position.marketDemand)}>
                                    {position.marketDemand} Demand
                                  </Badge>
                                  <Badge variant="outline">
                                    <DollarSign className="w-3 h-3 mr-1" />
                                    {position.salaryRange}
                                  </Badge>
                                </div>
                              </div>
                              <div className="text-right ml-4">
                                <div className="text-3xl font-bold text-blue-600 mb-1">
                                  {position.successProbability}%
                                </div>
                                <p className="text-sm text-gray-500">Success Rate</p>
                              </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4 mb-4">
                              <div>
                                <h4 className="font-medium text-gray-900 mb-2">Why This Matches:</h4>
                                <ul className="text-sm text-gray-600 space-y-1">
                                  {position.reasons.slice(0, 3).map((reason, idx) => (
                                    <li key={idx} className="flex items-start">
                                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                      {reason}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900 mb-2">Key Skills Match:</h4>
                                <div className="flex items-center mb-2">
                                  <Progress value={position.skillMatch} className="flex-1 mr-3" />
                                  <span className="text-sm font-medium">{position.skillMatch}%</span>
                                </div>
                                <div className="flex flex-wrap gap-1">
                                  {position.requiredSkills.slice(0, 4).map((skill, idx) => (
                                    <Badge key={idx} variant="secondary" className="text-xs">
                                      {skill}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-col gap-2 pt-4 border-t">
                              <div className="flex gap-2">
                                <Button 
                                  onClick={() => handleSelectPosition(position)}
                                  variant="default"
                                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                                >
                                  <Target className="w-4 h-4 mr-2" />
                                  Generate Career Profile
                                </Button>
                                <Button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleJobSearch(position);
                                  }}
                                  variant="outline"
                                  className="flex-1 border-green-600 text-green-700 hover:bg-green-50"
                                >
                                  <Search className="w-4 h-4 mr-2" />
                                  Jobs Related to {position.position}
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="space-y-6">
                  {loadingProfile ? (
                    <div className="text-center py-12">
                      <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
                      <p className="text-gray-600">Generating your personalized career profile...</p>
                    </div>
                  ) : (
                    <>
                      <div className="text-center mb-6">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                          Career Profile: {enhancedProfile.optimized_profile?.professional_title}
                        </h3>
                        <p className="text-gray-600">{enhancedProfile.optimized_profile?.elevator_pitch}</p>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                              <CheckCircle className="w-5 h-5 text-green-600" />
                              <span>Your Current Strengths</span>
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <ul className="space-y-2">
                              {enhancedProfile.skills_positioning?.primary_skills?.map((skill, index) => (
                                <li key={index} className="flex items-start space-x-2">
                                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                                  <span className="text-sm">{skill.skill}</span>
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                              <AlertCircle className="w-5 h-5 text-orange-600" />
                              <span>Skills to Develop</span>
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <ul className="space-y-2">
                              {enhancedProfile.skills_positioning?.skill_development_plan?.map((skill, index) => (
                                <li key={index} className="flex items-start space-x-2">
                                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                                  <span className="text-sm">{skill.skill}</span>
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                              <Target className="w-5 h-5 text-blue-600" />
                              <span>Action Plan</span>
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <ul className="space-y-2">
                              {enhancedProfile["90_day_action_plan"]?.week_1_2?.map((action, index) => (
                                <li key={index} className="flex items-start space-x-2">
                                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                  <span className="text-sm">{action}</span>
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                              <Award className="w-5 h-5 text-purple-600" />
                              <span>Canadian Certifications</span>
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <ul className="space-y-2">
                              {enhancedProfile.skills_positioning?.primary_skills?.map((skill, index) => (
                                <li key={index} className="flex items-start space-x-2">
                                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                                  <span className="text-sm">{skill.skill}</span>
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <Card>
                          <CardHeader>
                            <CardTitle>Timeline & Salary Progression</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              <div>
                                <p className="text-sm font-medium text-gray-700">Expected Timeline:</p>
                                <p className="text-sm text-gray-600">{enhancedProfile["90_day_action_plan"]?.month_1}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-700">Salary Progression:</p>
                                <p className="text-sm text-gray-600">{enhancedProfile.optimized_profile?.value_proposition}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader>
                            <CardTitle>Market Outlook</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-gray-600">{enhancedProfile.optimized_profile?.value_proposition}</p>
                          </CardContent>
                        </Card>
                      </div>

                      <Card>
                        <CardHeader>
                          <CardTitle>Networking Strategy</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {enhancedProfile.application_strategy?.networking_approach?.target_professionals?.map((strategy, index) => (
                              <li key={index} className="flex items-start space-x-2">
                                <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                                <span className="text-sm">{strategy}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>

                      <div className="flex justify-center">
                        <Button onClick={closeModal} className="bg-blue-600 hover:bg-blue-700">
                          Done
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Job Search Modal */}
      <JobSearchModal
        isOpen={jobSearchModalOpen}
        onClose={() => setJobSearchModalOpen(false)}
        careerPath={jobSearchCareerPath || { title: '' }}
      />
    </div>
  );
};

export default ResumeAnalysisDetail; 