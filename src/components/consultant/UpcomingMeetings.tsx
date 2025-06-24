'use client';

import React, { useEffect, useState } from 'react';
import { VideoIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Meeting {
  id: number;
  startDate: string; // already timezone-adjusted by backend
  endDate: string;
  meetLink: string;
  user: {
    fullName: string;
    email: string;
    phoneNo: string;
  };
}

const UpcomingConsultantMeetings = () => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const endpoint = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchMeetings = async () => {
      try {

        const tokenResponse = await fetch(`${endpoint}auth/token`, {
          credentials: "include",
        });
        if (!tokenResponse.ok) {
          throw new Error("Failed to get authentication token");
        }
        const tokenData = await tokenResponse.json();
        const token = tokenData?.token;
        const res = await fetch(`${endpoint}api/protected/consultants/upcoming`, {
          credentials: 'include',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await res.json();

        if (data.success) {
          setMeetings(data.meetings);
        }
      } catch (err) {
        console.error('Failed to fetch upcoming meetings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMeetings();
  }, []);

  if (loading) return <p>Loading meetings...</p>;
  if (meetings.length === 0) return <p>No upcoming meetings.</p>;

  return (
    <div className="flex flex-col gap-4">
      {meetings.map((meeting) => (
        <div
          key={meeting.id}
          className="flex flex-row items-center bg-white shadow-sm border border-gray-200 rounded-xl p-4 max-w-xs"
        >
          {/* Blue circular icon */}
          <a href={meeting.meetLink} target="_blank" rel="noopener noreferrer">
          <div className="flex items-center justify-center w-20 h-24 mr-2 bg-green-500 hover:bg-green-600 text-white border">
            
            
            <VideoIcon className="w-8 h-8" />
              
          </div>
          </a>

          {/* Info section */}
          <div className="flex-1 ml-2">
            <p className="text-sm font-semibold text-gray-800">
             {meeting.user.fullName}
            </p>
            <p className="text-sm text-gray-600">
            {new Date(meeting.startDate).toDateString()}
            </p>
            <p className="text-sm text-gray-600">
              {new Date(meeting.startDate).toLocaleTimeString()} – {new Date(meeting.endDate).toLocaleTimeString()}
            </p>
            {/* <Button
              asChild
              size="sm"
              className="mt-2 bg-green-600 hover:bg-green-500"
            >
              <a href={meeting.meetLink} target="_blank" rel="noopener noreferrer">
                Join Meeting
              </a>
            </Button> */}
          </div>
        </div>
      ))}
    </div>
  );
};

export default UpcomingConsultantMeetings;