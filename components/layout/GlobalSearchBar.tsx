"use client";
import React, { useState } from 'react'; // useEffect, useRef, useCallback removed
// Link import removed (was for GTPLogoOld)
// import { useRouter } from 'next/router'; // Removed useRouter
import { FloatingBarContainer } from './FloatingBar/FloatingBarContainer';
// import { SearchInput } from './FloatingBar/SearchInput'; // Removed SearchInput
import { Badge } from './FloatingBar/Badge';
import { FloatingBarButton } from './FloatingBar/FloatingBarButton'; // Still used by Active Filters clear all
import { FilterSelectionContainer } from './FloatingBar/FilterSelectionContainer';
// import { Popover } from './FloatingBar/Popover'; // Removed Popover
// import { ToggleOption } from './FloatingBar/ToggleOption'; // Removed ToggleOption
// import { NumericInput } from './FloatingBar/NumericInput'; // Removed NumericInput
// import { GTPIcon } from './GTPIcon'; // Removed GTPIcon
import { useUIContext } from '@/contexts/UIContext';
import Icon from './Icon'; // Icon is still used by other components indirectly, and potentially directly if any Icon usage remains. Let's keep it based on earlier grep.
import { useLocalStorage } from 'usehooks-ts';
// useSearchParams and usePathname are no longer used directly in GlobalSearchBar
// SearchBar and useSearchBuckets will be used in MainSearchBar.tsx
import EthUsdSwitch from './EthUsdSwitch';
import FocusSwitch from './FocusSwitch';
// IconContextMenu import removed (was for GTPLogoOld)
// useToast import removed (was for GTPLogoOld)
// useNotifications import removed
// NotificationInsideContent import removed as it's no longer directly used here
// import { GTPIconName } from '@/icons/gtp-icon-names'; // Removed GTPIconName
// import { track } from '@vercel/analytics/react'; // Removed track
// SharePopoverContent import removed as it's no longer directly used here
// MobileMenuContent import removed as it's no longer directly used here
// NotificationContent import for popover is removed
import { NotificationBell } from './NotificationBell'; // Added
import { MobileMenu } from './MobileMenu'; // Added
import { ShareButton } from './ShareButton'; // Added
import { SidebarToggle } from './SidebarToggle'; // Added
import { MainSearchBar } from './MainSearchBar'; // Added


export default function GlobalFloatingBar() {
  const [showGlobalSearchBar, setShowGlobalSearchBar] = useLocalStorage("showGlobalSearchBar", false);
  const { isMobile, isSidebarOpen } = useUIContext(); // Removed toggleSidebar

  // All search-related states, refs, effects, and handlers are moved to MainSearchBar.tsx
  // (isSearchActive, searchContainerRef, searchTimeoutRef, activateSearch, deactivateSearch, etc.)
  // (isSearchInputFocusedMobile, searchInputRef, handleSearchInputFocus, handleSearchInputBlur)
  // (showMore, searchParams, pathname, isOpen for search) - these are now internal to MainSearchBar or its children

  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  // Handle filter selection - This seems to be for a separate filter UI, keep for now
  const addFilter = (filter: string) => {
    if (!activeFilters.includes(filter)) {
      setActiveFilters([...activeFilters, filter]);
    }
  };

  // Handle filter removal
  const removeFilter = (filter: string) => {
    setActiveFilters(activeFilters.filter(f => f !== filter));
  };

  // Clear all filters
  const clearAllFilters = () => {
    setActiveFilters([]);
  };

  // Create filter badges
  const filterBadges = activeFilters.map(filter => (
    <Badge
      key={filter}
      label={filter}
      leftIcon="feather:tag"
      rightIcon="heroicons-solid:x-circle"
      rightIconColor="#FE5468"
      onClick={() => removeFilter(filter)}
    />
  ));

  // Handle download function removed

  // Sidebar toggle states, constants, and effects are moved to SidebarToggle.tsx
  // The useEffect for anchor link clicks and the mobile search active overlay are moved to MainSearchBar.tsx


  if (!showGlobalSearchBar) return null;

  return (
    <>
      <div className={`fixed z-global-search-backdrop bottom-[-200px] md:bottom-auto md:top-[0px] w-full max-w-[1680px] px-0 md:px-[13px] ${isSidebarOpen ? "md:ml-[253px]" : "md:ml-[94px]"} transition-[margin] duration-sidebar ease-sidebar z-50 flex justify-center w-full`}>
        <div className="bg-[#151a19] z-[-1] relative bottom-0 top-0 md:bottom-auto md:top-0 left-0 right-0 h-[300px] md:h-[100px] overflow-hidden pointer-events-none sidebar-bg-mask">
          <div className="background-gradient-group">
            <div className="background-gradient-yellow"></div>
            <div className="background-gradient-green"></div>
          </div>
        </div>
      </div>
      {/* Mobile search active overlay is now part of MainSearchBar.tsx */}
      <div className="fixed z-global-search bottom-[60px] md:hidden left-0 right-0 flex justify-center w-full pointer-events-none pb-[30px] md:pb-0 md:pt-[30px]">
        <div className="w-full max-w-[1680px] px-[20px] md:px-[13px] pointer-events-auto">
          <div className="px-[5px] md:px-[15px] md:py-[10px]">
            <NotificationBell isMobile={true} />
          </div>
        </div>
      </div>
      <div className={`fixed z-global-search bottom-0 md:bottom-auto md:top-[0px] left-0 right-0 flex justify-center w-full pointer-events-none pb-[30px] md:pb-0 md:pt-[30px]`}>

        <div className="w-full max-w-[1680px] px-[20px] md:px-[13px]">
          <FloatingBarContainer className='p-[5px] md:px-[15px] md:py-[10px]'>
            {/* Mobile - Share Button */}
            <ShareButton />
            {/* Desktop - Home Button / Sidebar Toggle */}
            <SidebarToggle />

            {/* Search Bar */}
            <MainSearchBar />

            {/* Active Filters Section */}
            {activeFilters.length > 0 && (
              <div className="hidden md:block max-w-[300px] lg:max-w-[400px]">
                <FilterSelectionContainer>
                  {filterBadges}
                  {activeFilters.length > 0 && (
                    <div onClick={clearAllFilters} className="cursor-pointer">
                      <Badge
                        rightIcon="heroicons-solid:x"
                        rightIconColor="#FE5468"
                        label="Clear All"
                      />
                    </div>
                  )}
                </FilterSelectionContainer>
              </div>
            )}
            <FocusSwitch showBorder={true} className='hidden md:flex' />
            <EthUsdSwitch showBorder={true} className='hidden md:flex' />

            {/* Desktop - Notifications */}
            <NotificationBell isMobile={false} />
            {/* Mobile - Menu Button */}
            <MobileMenu />
          </FloatingBarContainer>
        </div>
      </div>
    </>
  );
}

// SearchContainer component definition is moved to MainSearchBar.tsx

// GTPLogoOld component definition is moved to SidebarToggle.tsx

// GTPLogoNew component definition removed
