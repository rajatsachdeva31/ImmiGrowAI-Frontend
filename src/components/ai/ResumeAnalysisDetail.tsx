"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, FileText, User, Mail, Phone, MapPin, Calendar, TrendingUp, Star, AlertCircle, CheckCircle, Briefcase, GraduationCap, Code, Languages } from 'lucide-react';

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

interface ResumeAnalysisDetailProps {
  analysis: ResumeAnalysis;
  onBack: () => void;
}

const ResumeAnalysisDetail: React.FC<ResumeAnalysisDetailProps> = ({ analysis, onBack }) => {
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

      {/* Canadian Market Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Star className="w-5 h-5" />
            <span>Canadian Market Analysis</span>
          </CardTitle>
          <CardDescription>
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
              onClick={() => window.location.href = '/dashboard/user/ai/profile'}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Generate Career Profile
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
    </div>
  );
};

export default ResumeAnalysisDetail; 