"use client";
import React, { useState } from 'react';
import { Popover } from './FloatingBar/Popover';
import { FloatingBarButton } from './FloatingBar/FloatingBarButton';
import MobileMenuContent from './FloatingBar/MobileMenuContent';
import { GTPIconName } from '@/icons/gtp-icon-names';
import { useUIContext } from '@/contexts/UIContext'; // Added to control visibility based on isMobile

export const MobileMenu: React.FC = () => {
  const { isMobile } = useUIContext();
  const [isMobileMenuPopoverOpen, setIsMobileMenuPopoverOpen] = useState(false);

  // The component should only render on mobile.
  // The original GlobalSearchBar uses className='flex md:hidden' for the Popover's parent/trigger.
  // We can achieve a similar effect here or rely on the parent in GlobalSearchBar to control visibility.
  // For self-containment, let's only render if isMobile is true.
  if (!isMobile) {
    return null;
  }

  return (
    <Popover
      placement='top-end'
      isOpen={isMobileMenuPopoverOpen}
      onOpenChange={setIsMobileMenuPopoverOpen}
      content={
        <MobileMenuContent onClose={() => setIsMobileMenuPopoverOpen(false)} />
      }
      className='flex' // md:hidden removed, component handles mobile-only rendering. Retain flex.
      trigger="click"
    >
      <FloatingBarButton
        icon={"gtp-burger-menu" as GTPIconName}
        title="Menu"
      />
    </Popover>
  );
};
