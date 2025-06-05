"use client";
import React, { useState, useEffect } from 'react'; // Removed useCallback
import Link from 'next/link';
import { useUIContext } from '@/contexts/UIContext';
import Icon from './Icon';
import { track } from '@vercel/analytics/react';
// useToast, IconContextMenu are confirmed to be removed
import { GTPIconName } from '@/icons/gtp-icon-names';

const ANIMATION_DURATION = 200;

const HOVER_ROTATIONS = {
  SIDEBAR_OPEN: {
    HOVER_ON: 180,
    HOVER_OFF: 0,
    DEFAULT: 0
  },
  SIDEBAR_CLOSED: {
    HOVER_ON: 0,
    HOVER_OFF: 180,
    DEFAULT: 180
  }
};

const GTPLogoOld = () => {
  const { isSidebarOpen } = useUIContext();
  // Removed: toast, logoFullSVG state, useEffect for fetching SVG, getLogoSvgData callback.

  return (
    <Link
      href="/"
      // Adjusted classes for potentially direct styling of img if needed, or rely on img styling.
      // The crucial part is the outer Link controls the clickable area and overflow for collapse.
      className={`${isSidebarOpen ? "relative h-[45.07px] w-[192.87px] block" : "relative h-[45.07px] w-[62px] overflow-clip"} transition-all duration-sidebar ease-sidebar flex items-center justify-start`}
    >
      {/* Removed IconContextMenu wrapper */}
      {/* Replaced inline SVG with <img> tag */}
      <img
        src="/logo-full.svg"
        alt="GTP Logo"
        className={`block object-contain object-left transition-all duration-sidebar ease-sidebar ${isSidebarOpen ? 'translate-x-[1.5px]' : 'translate-x-[1.5px]'}`}
        style={{
          height: '45.07px', // Maintain original height
          width: '192.87px', // Full width, parent Link will clip if needed
          transformOrigin: "21px 27px" // Kept from original div in case it matters for subtle positioning
        }}
      />
    </Link>
  )
}

export const SidebarToggle: React.FC = () => {
  const { isSidebarOpen, toggleSidebar } = useUIContext();
  const [isHoveringToggle, setIsHoveringToggle] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [isChangingSidebar, setIsChangingSidebar] = useState(false);

  useEffect(() => {
    if (isChangingSidebar) return;
    if (isSidebarOpen) {
      setRotation(isHoveringToggle ? HOVER_ROTATIONS.SIDEBAR_OPEN.HOVER_ON : HOVER_ROTATIONS.SIDEBAR_OPEN.DEFAULT);
    } else {
      setRotation(isHoveringToggle ? HOVER_ROTATIONS.SIDEBAR_CLOSED.HOVER_ON : HOVER_ROTATIONS.SIDEBAR_CLOSED.DEFAULT);
    }
  }, [isHoveringToggle, isSidebarOpen, isChangingSidebar]);

  const handleToggleSidebar = () => {
    track("clicked Sidebar Close", { // Or "clicked Sidebar Open" depending on isSidebarOpen
      location: "desktop sidebar", // This seems to be always desktop from the context
      page: window.location.pathname,
    });
    toggleSidebar();
    setIsChangingSidebar(true);
    setTimeout(() => {
      setIsChangingSidebar(false);
    }, ANIMATION_DURATION);
  };

  return (
    <div className={`hidden md:flex items-center justify-between w-[50.87px] ${isSidebarOpen ? "md:w-[230px]" : "md:w-[60.87px]"} transition-all duration-sidebar ease-sidebar`}>
      <GTPLogoOld />
      <div
        className="flex items-center justify-end h-full cursor-pointer"
        onClick={handleToggleSidebar}
        onMouseEnter={() => setIsHoveringToggle(true)}
        onMouseLeave={() => setIsHoveringToggle(false)}
      >
        <Icon
          icon={isSidebarOpen ? "feather:log-out" : "feather:log-in"}
          className={`w-[13.15px] h-[13.15px] transition-transform duration-sidebar ease-sidebar`}
          style={{ transform: `rotate(${rotation}deg)` }}
        />
      </div>
    </div>
  );
};
