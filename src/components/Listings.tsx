'use client';

import { useState, useEffect } from 'react';
import ListingCard from './ListingCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation'; // Import the navigation styles

interface Listing {
  id: number;
  title: string;
  location?: string;
  price: number;
  imageUrl: string;
  description?: string | null;
  houseImages?: string[];
  carImages?: string[];
  make?: string;
  model?: string;
}

interface ListingsProps {
  listings: Listing[];
}


export default function Listings({ listings: initialListings }: ListingsProps) {
  const [listings, setListings] = useState<Listing[]>(initialListings);
  const [savedListings, setSavedListings] = useState<Set<number>>(new Set());

  // ✅ Sync state with updated listings from parent
  useEffect(() => {
    setListings(initialListings);
  }, [initialListings]);

  const handleSave = (listingId: number) => {
    setSavedListings((prev) => {
      const newSavedListings = new Set(prev);
      if (newSavedListings.has(listingId)) {
        newSavedListings.delete(listingId); // Unsave the listing
      } else {
        newSavedListings.add(listingId); // Save the listing
      }
      return newSavedListings;
    });
  };

  return (
    <Swiper
      modules={[Navigation]} // Ensure Navigation module is added
      spaceBetween={10}
      slidesPerView={3}
      navigation
      breakpoints={{
        1200: { slidesPerView: 3},
        1024: { slidesPerView: 3},
        768: { slidesPerView: 2 },
        480: { slidesPerView: 1 },
        0: { slidesPerView: 1 },
      }}
      style={{ width: '100%', overflow: 'hidden' }}
    >
      {listings.map((listing) => (
        <SwiperSlide key={listing.id}>
          <ListingCard
            listing={listing}
            isSaved={savedListings.has(listing.id)}
            onSave={handleSave}
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
