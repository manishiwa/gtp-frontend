"use client";
import React, { useState, useCallback } from 'react';
import { Popover } from './FloatingBar/Popover';
import { FloatingBarButton } from './FloatingBar/FloatingBarButton';
import SharePopoverContent from './FloatingBar/SharePopoverContent';
import { GTPIconName } from '@/icons/gtp-icon-names'; // Potentially needed if icon was dynamic
import { track } from '@vercel/analytics/react';
import { useUIContext } from '@/contexts/UIContext';

// This component is designed for the mobile view, as per the original GlobalSearchBar.tsx
export const ShareButton: React.FC = () => {
  const { isMobile } = useUIContext();
  const [isSharePopoverOpen, setIsSharePopoverOpen] = useState(false);

  const handleSharePopoverOpenChange = useCallback((openState: boolean) => {
    // Determine location based on current isMobile, though this component is mobile-first
    const location = isMobile ? 'mobile' : 'desktop';
    if (openState && !isSharePopoverOpen) { // Opening
      track("opened Share window", {
        location,
        page: window.location.pathname
      });
    } else if (!openState && isSharePopoverOpen) { // Closing via overlay/escape
      track("closed Share window by overlay/escape", {
        location,
        page: window.location.pathname
      });
    }
    setIsSharePopoverOpen(openState);
  }, [isMobile, isSharePopoverOpen]); // Added isSharePopoverOpen to dependencies

  // Only render the button if on mobile, consistent with original placement
  if (!isMobile) {
    return null;
  }

  return (
    <Popover
      placement="top-start"
      isOpen={isSharePopoverOpen}
      onOpenChange={handleSharePopoverOpenChange}
      content={
        <SharePopoverContent onClose={() => setIsSharePopoverOpen(false)} />
      }
      className='block' // md:hidden removed, component handles mobile-only rendering. Retain block.
      trigger="click"
    >
      <FloatingBarButton
        icon="gtp-share" // Specific icon, GTPIconName might not be strictly needed if it's always this
        title="Share"
      />
    </Popover>
  );
};
