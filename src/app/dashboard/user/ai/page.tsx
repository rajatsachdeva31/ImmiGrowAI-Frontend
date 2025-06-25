"use client";

import React from 'react';
import AIFeaturesPanel from '@/components/ai/AIFeaturesPanel';

export default function AIPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AI Career Assistant
          </h1>
          <p className="text-xl text-gray-600">
            Accelerate your career journey in Canada with our AI-powered tools
          </p>
        </div>
        
        <AIFeaturesPanel />
      </div>
    </div>
  );
} 