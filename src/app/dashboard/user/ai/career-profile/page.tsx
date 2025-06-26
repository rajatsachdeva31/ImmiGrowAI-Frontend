"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Upload, 
  FileText, 
  Target, 
  TrendingUp, 
  Star, 
  ChevronRight, 
  Briefcase,
  DollarSign,
  CheckCircle,
  BookOpen
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PositionRecommendation {
  title: string;
  industry: string;
  level: string;
  successProbability: number;
  matchScore: number;
  salaryRange: {
    min: number;
    max: number;
    currency: string;
  };
  requiredSkills: string[];
  skillsMatch: {
    matching: string[];
    missing: string[];
    transferable: string[];
  };
  canadianRelevance: {
    workExperienceValue: string;
    educationRecognition: string;
    certificationNeeds: string[];
  };
}

interface EnhancedProfile {
  optimizedSkills: {
    technical: string[];
    soft: string[];
    leadership: string[];
  };
  repositionedExperience: Array<{
    company: string;
    title: string;
    optimizedDescription: string;
    keyAchievements: string[];
  }>;
  applicationStrategy: {
    targetCompanies: string[];
    networkingStrategy: string[];
    timelineRecommendations: string[];
  };
  skillDevelopmentPlan: {
    immediateActions: string[];
    shortTermGoals: string[];
    longTermObjectives: string[];
  };
}

export default function CareerProfilePage() {
  const [currentStep, setCurrentStep] = useState<'upload' | 'recommendations' | 'enhanced'>('upload');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<PositionRecommendation[]>([]);
  const [selectedPosition, setSelectedPosition] = useState<PositionRecommendation | null>(null);
  const [enhancedProfile, setEnhancedProfile] = useState<EnhancedProfile | null>(null);
  const [skillGapAnalysis, setSkillGapAnalysis] = useState<any>(null);
  
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setResumeFile(file);
    }
  };

  const handleResumeAnalysis = async () => {
    if (!resumeFile) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('resume', resumeFile);

      const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
      
      const response = await fetch('/api/protected/career/analyze-resume', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Resume analysis failed');
      }

      const result = await response.json();
      
      if (result.success) {
        setAnalysisData(result.data);
        setRecommendations(result.data.positionRecommendations.positions || []);
        setCurrentStep('recommendations');
        
        toast({
          title: "Resume Analyzed Successfully",
          description: `Found ${result.data.positionRecommendations.positions?.length || 0} position recommendations`,
        });
      }
    } catch (error) {
      console.error('Resume analysis error:', error);
      toast({
        title: "Analysis Failed",
        description: "Unable to analyze your resume. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handlePositionSelect = async (position: PositionRecommendation) => {
    setSelectedPosition(position);
    setLoading(true);

    try {
      const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
      
      const response = await fetch('/api/protected/career/enhanced-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          targetPosition: position,
          resumeAnalysisId: analysisData?.analysisId,
          userPreferences: {}
        })
      });

      if (!response.ok) {
        throw new Error('Enhanced profile generation failed');
      }

      const result = await response.json();
      
      if (result.success) {
        setEnhancedProfile(result.data.enhancedProfile);
        setSkillGapAnalysis(result.data.skillGapAnalysis);
        setCurrentStep('enhanced');
        
        toast({
          title: "Enhanced Profile Generated",
          description: "Your personalized career profile is ready!",
        });
      }
    } catch (error) {
      console.error('Enhanced profile generation error:', error);
      toast({
        title: "Profile Generation Failed",
        description: "Unable to generate enhanced profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderUploadStep = () => (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Upload className="w-6 h-6" />
          <span>Upload Your Resume</span>
        </CardTitle>
        <CardDescription>
          Upload your resume to get personalized career recommendations tailored for the Canadian job market
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <FileText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <div className="space-y-2">
            <p className="text-lg font-medium">Choose your resume file</p>
            <p className="text-gray-600">PDF, DOC, or DOCX (max 5MB)</p>
          </div>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileUpload}
            className="hidden"
            id="resume-upload"
          />
          <label htmlFor="resume-upload">
            <Button variant="outline" className="mt-4" asChild>
              <span>Select File</span>
            </Button>
          </label>
        </div>
        
        {resumeFile && (
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <FileText className="w-5 h-5 text-green-600" />
              <span className="font-medium">{resumeFile.name}</span>
            </div>
            <Badge variant="secondary">
              {(resumeFile.size / 1024 / 1024).toFixed(2)} MB
            </Badge>
          </div>
        )}
        
        <Button 
          onClick={handleResumeAnalysis}
          disabled={!resumeFile || uploading}
          className="w-full"
          size="lg"
        >
          {uploading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Analyzing Resume...
            </>
          ) : (
            <>
              <Target className="w-4 h-4 mr-2" />
              Analyze & Get Recommendations
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );

  const renderRecommendationsStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">Career Opportunities</h2>
        <p className="text-gray-600">
          Based on your resume, here are the positions with the highest success probability
        </p>
      </div>
      
      <div className="grid gap-6">
        {recommendations.map((position, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <CardTitle className="text-xl">{position.title}</CardTitle>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span className="flex items-center">
                      <Briefcase className="w-4 h-4 mr-1" />
                      {position.industry}
                    </span>
                    <span className="flex items-center">
                      <DollarSign className="w-4 h-4 mr-1" />
                      ${position.salaryRange.min.toLocaleString()} - ${position.salaryRange.max.toLocaleString()} {position.salaryRange.currency}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">
                    {Math.round(position.successProbability * 100)}%
                  </div>
                  <div className="text-sm text-gray-600">Success Rate</div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Match Score</span>
                    <span className="text-sm">{Math.round(position.matchScore * 100)}%</span>
                  </div>
                  <Progress value={position.matchScore * 100} className="h-2" />
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-green-600 mb-2">✓ Matching Skills</h4>
                    <div className="flex flex-wrap gap-1">
                      {position.skillsMatch.matching.slice(0, 3).map((skill, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {position.skillsMatch.matching.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{position.skillsMatch.matching.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-orange-600 mb-2">⚡ Skills to Develop</h4>
                    <div className="flex flex-wrap gap-1">
                      {position.skillsMatch.missing.slice(0, 3).map((skill, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {position.skillsMatch.missing.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{position.skillsMatch.missing.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                
                <Button 
                  onClick={() => handlePositionSelect(position)}
                  disabled={loading}
                  className="w-full"
                >
                  {loading && selectedPosition === position ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Generating Profile...
                    </>
                  ) : (
                    <>
                      Generate Enhanced Profile
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderEnhancedProfileStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">Your Enhanced Career Profile</h2>
        <p className="text-gray-600">
          Tailored for: <strong>{selectedPosition?.title}</strong>
        </p>
      </div>
      
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">Enhanced Profile</TabsTrigger>
          <TabsTrigger value="skills">Skill Analysis</TabsTrigger>
          <TabsTrigger value="strategy">Action Plan</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="space-y-6">
          {enhancedProfile && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Star className="w-5 h-5" />
                    <span>Optimized Skills Presentation</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Technical Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {enhancedProfile.optimizedSkills.technical.map((skill, idx) => (
                        <Badge key={idx} className="bg-blue-100 text-blue-800">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Soft Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {enhancedProfile.optimizedSkills.soft.map((skill, idx) => (
                        <Badge key={idx} className="bg-green-100 text-green-800">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Leadership Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {enhancedProfile.optimizedSkills.leadership.map((skill, idx) => (
                        <Badge key={idx} className="bg-purple-100 text-purple-800">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Briefcase className="w-5 h-5" />
                    <span>Repositioned Experience</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {enhancedProfile.repositionedExperience.map((exp, idx) => (
                      <div key={idx} className="border-l-4 border-blue-500 pl-4">
                        <h4 className="font-semibold">{exp.title} at {exp.company}</h4>
                        <p className="text-gray-600 mt-1">{exp.optimizedDescription}</p>
                        <div className="mt-2">
                          <h5 className="font-medium text-sm">Key Achievements:</h5>
                          <ul className="list-disc list-inside text-sm text-gray-600 mt-1">
                            {exp.keyAchievements.map((achievement, aidx) => (
                              <li key={aidx}>{achievement}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
        
        <TabsContent value="skills" className="space-y-6">
          {skillGapAnalysis && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5" />
                  <span>Skill Gap Analysis</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {skillGapAnalysis.skillGapAnalysis?.gaps?.map((gap: any, idx: number) => (
                  <div key={idx} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{gap.skill}</h4>
                      <Badge variant={gap.priority === 'High' ? 'destructive' : gap.priority === 'Medium' ? 'default' : 'secondary'}>
                        {gap.priority} Priority
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{gap.description}</p>
                    <div className="text-sm">
                      <strong>Learning Path:</strong> {gap.learningPath}
                    </div>
                    <div className="text-sm">
                      <strong>Timeline:</strong> {gap.timeline}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="strategy" className="space-y-6">
          {enhancedProfile && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="w-5 h-5" />
                    <span>Application Strategy</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Target Companies</h4>
                    <ul className="list-disc list-inside text-sm text-gray-600">
                      {enhancedProfile.applicationStrategy.targetCompanies.map((company, idx) => (
                        <li key={idx}>{company}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Networking Strategy</h4>
                    <ul className="list-disc list-inside text-sm text-gray-600">
                      {enhancedProfile.applicationStrategy.networkingStrategy.map((strategy, idx) => (
                        <li key={idx}>{strategy}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BookOpen className="w-5 h-5" />
                    <span>Development Roadmap</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium text-red-600 mb-2">Immediate Actions (1-2 weeks)</h4>
                    <ul className="list-disc list-inside text-sm">
                      {enhancedProfile.skillDevelopmentPlan.immediateActions.map((action, idx) => (
                        <li key={idx}>{action}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-orange-600 mb-2">Short-term Goals (1-3 months)</h4>
                    <ul className="list-disc list-inside text-sm">
                      {enhancedProfile.skillDevelopmentPlan.shortTermGoals.map((goal, idx) => (
                        <li key={idx}>{goal}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-green-600 mb-2">Long-term Objectives (6+ months)</h4>
                    <ul className="list-disc list-inside text-sm">
                      {enhancedProfile.skillDevelopmentPlan.longTermObjectives.map((objective, idx) => (
                        <li key={idx}>{objective}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-center space-x-4">
        <Button 
          onClick={() => setCurrentStep('recommendations')}
          variant="outline"
        >
          Back to Recommendations
        </Button>
        <Button onClick={() => setCurrentStep('upload')}>
          Analyze New Resume
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <div className={`flex items-center space-x-2 ${currentStep === 'upload' ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${currentStep === 'upload' ? 'border-blue-600 bg-blue-600 text-white' : currentStep !== 'upload' ? 'border-green-600 bg-green-600 text-white' : 'border-gray-300'}`}>
                {currentStep !== 'upload' ? <CheckCircle className="w-4 h-4" /> : '1'}
              </div>
              <span className="font-medium">Upload Resume</span>
            </div>
            <div className="flex-1 h-0.5 bg-gray-300"></div>
            <div className={`flex items-center space-x-2 ${currentStep === 'recommendations' ? 'text-blue-600' : currentStep === 'enhanced' ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${currentStep === 'recommendations' ? 'border-blue-600 bg-blue-600 text-white' : currentStep === 'enhanced' ? 'border-green-600 bg-green-600 text-white' : 'border-gray-300'}`}>
                {currentStep === 'enhanced' ? <CheckCircle className="w-4 h-4" /> : '2'}
              </div>
              <span className="font-medium">Position Recommendations</span>
            </div>
            <div className="flex-1 h-0.5 bg-gray-300"></div>
            <div className={`flex items-center space-x-2 ${currentStep === 'enhanced' ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${currentStep === 'enhanced' ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300'}`}>
                3
              </div>
              <span className="font-medium">Enhanced Profile</span>
            </div>
          </div>
        </div>

        {/* Main content */}
        {currentStep === 'upload' && renderUploadStep()}
        {currentStep === 'recommendations' && renderRecommendationsStep()}
        {currentStep === 'enhanced' && renderEnhancedProfileStep()}
      </div>
    </div>
  );
} 