import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, CheckCircle, AlertCircle, Clock, Zap, Globe, TrendingUp, Award, Briefcase } from 'lucide-react';

interface AnalysisResult {
  analysisId: string;
  analysis: {
    personalInfo: any;
    professionalSummary: string;
    skills: any[];
    workExperience: any[];
    education: any[];
    certifications: any[];
    projects: any[];
    canadianMarketAnalysis: any;
    confidenceScores: any;
    metadata: any;
  };
  rateLimitStatus: {
    minuteRemaining: number;
    dailyRemaining: number;
    nextResetTime: string;
  };
  processingMethod: 'direct_pdf' | 'text_extraction';
}

interface EnhancedResumeUploadProps {
  onAnalysisComplete?: (result: AnalysisResult) => void;
}

const EnhancedResumeUpload: React.FC<EnhancedResumeUploadProps> = ({ onAnalysisComplete }) => {
  const [uploading, setUploading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    setProgress(0);

    const formData = new FormData();
    formData.append('resume', file);

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const response = await fetch('/api/ai/resume/upload', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      clearInterval(progressInterval);
      setProgress(100);

      const result = await response.json();

      if (result.success) {
        setAnalysisResult(result.data);
        onAnalysisComplete?.(result.data);
      } else {
        setError(result.message || 'Analysis failed');
      }
    } catch (err: any) {
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  }, [onAnalysisComplete]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    disabled: uploading
  });

  const renderUploadArea = () => (
    <div
      {...getRootProps()}
      className={`
        border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300
        ${isDragActive 
          ? 'border-blue-500 bg-blue-50 scale-[1.02]' 
          : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
        }
        ${uploading ? 'pointer-events-none opacity-50' : ''}
      `}
    >
      <input {...getInputProps()} />
      
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <Upload className="w-12 h-12 text-gray-400" />
          <Zap className="w-6 h-6 text-yellow-500 absolute -top-1 -right-1" />
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Enhanced Resume Analysis with Gemini AI
          </h3>
          <p className="text-gray-600 mb-4">
            {isDragActive 
              ? 'Drop your resume here...' 
              : 'Drag & drop your resume or click to select'
            }
          </p>
          
          <div className="flex flex-wrap justify-center gap-2 text-sm text-gray-500">
            <span className="bg-green-100 text-green-700 px-2 py-1 rounded">PDF Direct Processing</span>
            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">Up to 10MB</span>
            <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded">Canadian Market Focus</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-xs text-gray-600 max-w-md">
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4 text-yellow-500" />
            <span>67x Faster Processing</span>
          </div>
          <div className="flex items-center space-x-2">
            <Globe className="w-4 h-4 text-blue-500" />
            <span>Canadian Job Market</span>
          </div>
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span>1000 req/min Limit</span>
          </div>
          <div className="flex items-center space-x-2">
            <FileText className="w-4 h-4 text-purple-500" />
            <span>Direct PDF Reading</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderProgress = () => (
    <div className="text-center space-y-4">
      <div className="flex items-center justify-center space-x-2">
        <Clock className="w-5 h-5 text-blue-500 animate-spin" />
        <span className="text-lg font-medium">Analyzing with Gemini AI...</span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div 
          className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      <p className="text-sm text-gray-600">
        Using {progress < 50 ? 'direct PDF processing' : 'Canadian market analysis'}...
      </p>
    </div>
  );

  const renderResults = () => {
    if (!analysisResult) return null;

    const { analysis, processingMethod, rateLimitStatus } = analysisResult;

    return (
      <div className="space-y-6">
        {/* Success Header */}
        <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg border border-green-200">
          <CheckCircle className="w-6 h-6 text-green-600" />
          <div>
            <h3 className="font-semibold text-green-900">Analysis Complete!</h3>
            <p className="text-sm text-green-700">
              Processed using {processingMethod === 'direct_pdf' ? 'Direct PDF Reading' : 'Text Extraction'}
            </p>
          </div>
        </div>

        {/* Rate Limit Status */}
        <div className="grid grid-cols-3 gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{rateLimitStatus.minuteRemaining}</div>
            <div className="text-sm text-blue-800">Requests Left/Min</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{rateLimitStatus.dailyRemaining}</div>
            <div className="text-sm text-purple-800">Requests Left/Day</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-green-600">✓</div>
            <div className="text-sm text-green-800">Processing Method</div>
          </div>
        </div>

        {/* Analysis Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Professional Summary */}
          {analysis.professionalSummary && (
            <div className="p-4 border rounded-lg">
              <div className="flex items-center space-x-2 mb-3">
                <Briefcase className="w-5 h-5 text-blue-500" />
                <h4 className="font-semibold">Professional Summary</h4>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">
                {analysis.professionalSummary}
              </p>
            </div>
          )}

          {/* Skills Overview */}
          <div className="p-4 border rounded-lg">
            <div className="flex items-center space-x-2 mb-3">
              <Award className="w-5 h-5 text-purple-500" />
              <h4 className="font-semibold">Skills Identified</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {analysis.skills.slice(0, 8).map((skill: any, index: number) => (
                <span 
                  key={index}
                  className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded"
                >
                  {typeof skill === 'string' ? skill : skill.name}
                </span>
              ))}
              {analysis.skills.length > 8 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                  +{analysis.skills.length - 8} more
                </span>
              )}
            </div>
          </div>

          {/* Canadian Market Analysis */}
          {analysis.canadianMarketAnalysis && (
            <div className="p-4 border rounded-lg md:col-span-2">
              <div className="flex items-center space-x-2 mb-3">
                <Globe className="w-5 h-5 text-green-500" />
                <h4 className="font-semibold">Canadian Market Insights</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Market Fit:</span>
                  <div className="text-green-600 font-semibold">
                    {analysis.canadianMarketAnalysis.marketFitScore || 'Analyzing...'}
                  </div>
                </div>
                <div>
                  <span className="font-medium text-gray-700">In-Demand Skills:</span>
                  <div className="text-blue-600 font-semibold">
                    {analysis.canadianMarketAnalysis.inDemandSkills?.length || 0} identified
                  </div>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Improvement Areas:</span>
                  <div className="text-orange-600 font-semibold">
                    {analysis.canadianMarketAnalysis.improvementAreas?.length || 0} suggestions
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Confidence Scores */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold mb-3">Analysis Confidence</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            {Object.entries(analysis.confidenceScores || {}).map(([key, value]: [string, any]) => (
              <div key={key} className="text-center">
                <div className="text-lg font-bold text-indigo-600">{Math.round(value * 100)}%</div>
                <div className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderError = () => (
    <div className="flex items-center space-x-3 p-4 bg-red-50 rounded-lg border border-red-200">
      <AlertCircle className="w-6 h-6 text-red-600" />
      <div>
        <h3 className="font-semibold text-red-900">Analysis Failed</h3>
        <p className="text-sm text-red-700">{error}</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Enhanced Resume Analysis
        </h2>
        <p className="text-gray-600">
          Powered by Gemini Developer API with 67x faster processing and Canadian market focus
        </p>
      </div>

      {error && renderError()}
      
      {!analysisResult && !uploading && !error && renderUploadArea()}
      
      {uploading && renderProgress()}
      
      {analysisResult && renderResults()}
    </div>
  );
};

export default EnhancedResumeUpload; 