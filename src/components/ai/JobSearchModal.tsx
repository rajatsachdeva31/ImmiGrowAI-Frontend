'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ScrollArea } from '../ui/scroll-area';
import { ExternalLink, MapPin, Building2, DollarSign, Clock, Search, Loader2, AlertCircle } from 'lucide-react';

interface JobResult {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  salaryInfo?: {
    formatted: string;
    currency: string;
  };
  jobLevel?: string;
  employmentTypes?: string[];
  applicationInfo?: {
    applicationUrls?: string[];
    applicationEmails?: string[];
    instruction?: string;
  };
  postingPublishTime?: string;
  jobBenefits?: string[];
}

interface JobSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  careerPath: {
    title: string;
    industry?: string;
  };
}

export default function JobSearchModal({ isOpen, onClose, careerPath }: JobSearchModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [jobs, setJobs] = useState<JobResult[]>([]);
  const [searchLocation, setSearchLocation] = useState('Canada');
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [hasSearched, setHasSearched] = useState(false);

  // Reset state when modal closes
  React.useEffect(() => {
    if (!isOpen) {
      setJobs([]);
      setError(null);
      setHasSearched(false);
      setTotalCount(0);
      setIsLoading(false);
    }
  }, [isOpen]);

  // Auto-search when modal opens with a career path
  React.useEffect(() => {
    if (isOpen && careerPath.title && !hasSearched && !isLoading) {
      searchJobs();
    }
  }, [isOpen, careerPath.title]);

  const searchJobs = async () => {
    if (!careerPath?.title) return;

    setIsLoading(true);
    setError(null);
    setHasSearched(false);

    try {
      // First try to get token from localStorage (Google login)
      let token = localStorage.getItem('token');
      console.log('🔐 Job Search - Token from localStorage:', token ? 'Present' : 'Missing');
      
      // If no token in localStorage, try to get from cookie-based auth
      if (!token) {
        console.log('🔐 Job Search - Fetching token from cookie-based auth...');
        const tokenResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/token`, {
          credentials: "include",
        });
        
        if (tokenResponse.ok) {
          const tokenData = await tokenResponse.json();
          token = tokenData?.token;
          console.log('🔐 Job Search - Token from cookie auth:', token ? 'Present' : 'Missing');
        }
      }
      
      if (!token) {
        setError('Please log in to search for jobs');
        console.error('❌ Job Search - No authentication token available');
        return;
      }

      const response = await fetch('/api/career/search-jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          careerPath: {
            title: careerPath.title,
            industry: careerPath.industry
          },
          location: searchLocation,
          filters: {}
        })
      });

      const data = await response.json();

      if (data.success) {
        setJobs(data.data.jobs || []);
        setTotalCount(data.data.totalCount || 0);
        setHasSearched(true);
      } else {
        setError(data.error || data.fallbackMessage || 'Failed to search for jobs');
      }
    } catch (err) {
      console.error('Job search error:', err);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatEmploymentTypes = (types?: string[]) => {
    if (!types || !Array.isArray(types)) return '';
    return types.map(type => 
      type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
    ).join(', ');
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Recently posted';
    try {
      return new Date(dateString).toLocaleDateString('en-CA', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Recently posted';
    }
  };

  const openJobApplication = (job: JobResult) => {
    if (job.applicationInfo?.applicationUrls?.length > 0) {
      window.open(job.applicationInfo.applicationUrls[0], '_blank');
    } else if (job.applicationInfo?.applicationEmails?.length > 0) {
      window.open(`mailto:${job.applicationInfo.applicationEmails[0]}?subject=Application for ${job.title}`, '_blank');
    }
  };

  const getJobSearchUrls = () => {
    const query = encodeURIComponent(`${careerPath.title} ${searchLocation}`);
    return [
      {
        name: 'Indeed Canada',
        url: `https://ca.indeed.com/jobs?q=${query}&l=${encodeURIComponent(searchLocation)}`
      },
      {
        name: 'LinkedIn',
        url: `https://www.linkedin.com/jobs/search/?keywords=${query}&location=${encodeURIComponent(searchLocation)}`
      },
      {
        name: 'Glassdoor',
        url: `https://www.glassdoor.ca/Job/jobs.htm?sc.keyword=${query}&locT=C&locId=2`
      },
      {
        name: 'Job Bank Canada',
        url: `https://www.jobbank.gc.ca/jobsearch/jobsearch?searchstring=${query}`
      }
    ];
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            {careerPath.title} Jobs in Canada
          </DialogTitle>
          <DialogDescription>
            Search and browse job opportunities for {careerPath.title} positions across Canada
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Loading indicator */}
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <span className="ml-2 text-lg">Searching for {careerPath.title} jobs in Canada...</span>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <span className="font-medium text-red-800">Search Error</span>
              </div>
              <p className="text-red-700 mb-3">{error}</p>
              
              <div className="space-y-2">
                <p className="text-sm text-red-600 font-medium">Try searching on these job sites directly:</p>
                <div className="flex flex-wrap gap-2">
                  {getJobSearchUrls().map((site, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(site.url, '_blank')}
                      className="border-red-200 text-red-700 hover:bg-red-50"
                    >
                      <ExternalLink className="mr-1 h-3 w-3" />
                      {site.name}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Results */}
          {hasSearched && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Found {totalCount} jobs for "{careerPath.title}" in {searchLocation}
                </p>
                {(!jobs || jobs.length === 0) && totalCount === 0 && (
                  <div className="text-sm text-gray-500">
                    No jobs found. Try searching on external job sites below.
                  </div>
                )}
              </div>

              {/* External Job Site Links */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm font-medium text-blue-800 mb-2">
                  Search on popular job sites:
                </p>
                <div className="flex flex-wrap gap-2">
                  {getJobSearchUrls().map((site, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(site.url, '_blank')}
                      className="border-blue-200 text-blue-700 hover:bg-blue-100"
                    >
                      <ExternalLink className="mr-1 h-3 w-3" />
                      {site.name}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Job Results */}
              <ScrollArea className="h-96">
                <div className="space-y-3">
                  {(jobs || []).map((job) => (
                    <Card key={job.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <CardTitle className="text-lg font-semibold">{job.title}</CardTitle>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <Building2 className="h-4 w-4" />
                                {job.company}
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {job.location}
                              </div>
                              {job.salaryInfo?.formatted && (
                                <div className="flex items-center gap-1">
                                  <DollarSign className="h-4 w-4" />
                                  {job.salaryInfo.formatted}
                                </div>
                              )}
                            </div>
                          </div>
                          <Button
                            onClick={() => openJobApplication(job)}
                            disabled={!job.applicationInfo?.applicationUrls?.length && !job.applicationInfo?.applicationEmails?.length}
                            className="shrink-0"
                          >
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Apply
                          </Button>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="space-y-3">
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {job.description}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap gap-2">
                            {job.employmentTypes?.length > 0 && (
                              <Badge variant="secondary">
                                {formatEmploymentTypes(job.employmentTypes)}
                              </Badge>
                            )}
                            {job.jobLevel && (
                              <Badge variant="outline">{job.jobLevel}</Badge>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Clock className="h-3 w-3" />
                            {formatDate(job.postingPublishTime)}
                          </div>
                        </div>
                        
                        {job.jobBenefits?.length > 0 && (
                          <div className="space-y-1">
                            <p className="text-xs font-medium text-gray-600">Benefits:</p>
                            <div className="flex flex-wrap gap-1">
                              {job.jobBenefits.slice(0, 3).map((benefit, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {benefit}
                                </Badge>
                              ))}
                              {job.jobBenefits.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{job.jobBenefits.length - 3} more
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}

          {/* Initial state message */}
          {!hasSearched && !isLoading && !error && (
            <div className="text-center py-8 text-gray-500">
              <Search className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>Click "Search Jobs" to find opportunities for {careerPath.title}</p>
            </div>
          )}
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 