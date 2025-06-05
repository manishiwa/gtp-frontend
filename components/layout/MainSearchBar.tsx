"use client";
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useUIContext } from '@/contexts/UIContext';
import { SearchBar, useSearchBuckets } from '../search/Components';
import { useSearchParams, usePathname } from 'next/navigation';

// Props definition for MainSearchBar - currently none, it gets isMobile from context
interface MainSearchBarProps {}

export const SearchContainer = ({ children }: { children: React.ReactNode }) => {
  const { allFilteredData } = useSearchBuckets();
  const searchParams = useSearchParams(); // Used by SearchContainer
  const query = searchParams.get("query");
  const [hasOverflow, setHasOverflow] = useState(false);
  const [isScreenTall, setIsScreenTall] = useState(false);
  const [pressedKey, setPressedKey] = useState<string | null>(null);

  const totalResults = allFilteredData.reduce((total, { filteredData }) => total + filteredData.length, 0);
  const showKeyboardShortcuts = query && allFilteredData.length > 0 && isScreenTall && totalResults >= 10;
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      const hasVerticalOverflow = contentRef.current.scrollHeight > contentRef.current.clientHeight;
      setHasOverflow(hasVerticalOverflow);
    }
  }, [allFilteredData, query]);

  useEffect(() => {
    const checkScreenHeight = () => setIsScreenTall(window.innerHeight >= 500);
    checkScreenHeight();
    window.addEventListener('resize', checkScreenHeight);
    return () => window.removeEventListener('resize', checkScreenHeight);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter', 'Escape'].includes(event.key)) {
        setPressedKey(event.key);
      }
    };
    const handleKeyUp = (event: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter', 'Escape'].includes(event.key)) {
        setTimeout(() => setPressedKey(null), 200);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return (
    <div className="absolute bottom-[-5px] md:bottom-auto md:top-[-10px] left-0 w-full p-[5px] md:p-2.5 bg-[#344240] rounded-[32px] flex flex-col justify-start items-center">
      <div ref={contentRef} className="w-full flex-1 overflow-hidden flex flex-col min-h-0">
        <div className={`w-full bg-[#151A19] rounded-t-[22px] ${hasOverflow ? 'rounded-bl-[22px]' : 'rounded-b-[22px]'} flex flex-col justify-start items-center gap-2.5 flex-shrink-0`}>
          {children}
        </div>
      </div>
      {/* Keyboard shortcuts */}
      <div className={`flex px-[10px] pt-2 pb-[5px] items-start gap-[15px] self-stretch flex-shrink-0 ${!showKeyboardShortcuts ? 'hidden' : ''} max-sm:hidden`}>
        <div className="flex h-[21px] py-[2px] px-0 items-center gap-[5px]">
          <svg xmlns="http://www.w3.org/2000/svg" width="70" height="21" viewBox="0 0 70 21" fill="none">
            <rect x="24" width="22" height="10" rx="2" fill={pressedKey === 'ArrowUp' ? "#5A6462" : "#151A19"} />
            <path d="M32.6708 6.77639L34.5528 3.01246C34.737 2.64394 35.263 2.64394 35.4472 3.01246L37.3292 6.77639C37.4954 7.10884 37.2537 7.5 36.882 7.5H33.118C32.7463 7.5 32.5046 7.10884 32.6708 6.77639Z" fill="#CDD8D3" stroke="#CDD8D3" />
            <rect y="11" width="22" height="10" rx="2" fill={pressedKey === 'ArrowLeft' ? "#5A6462" : "#151A19"} />
            <path d="M12.8336 18.0581L8.33821 16.4715C7.89343 16.3145 7.89343 15.6855 8.33822 15.5285L12.8336 13.9419C13.1589 13.8271 13.5 14.0684 13.5 14.4134L13.5 17.5866C13.5 17.9316 13.1589 18.1729 12.8336 18.0581Z" fill="#CDD8D3" stroke="#CDD8D3" />
            <rect x="48" y="11" width="22" height="10" rx="2" fill={pressedKey === 'ArrowRight' ? "#5A6462" : "#151A19"} />
            <path d="M57.1664 13.9419L61.6618 15.5285C62.1066 15.6855 62.1066 16.3145 61.6618 16.4715L57.1664 18.0581C56.8411 18.1729 56.5 17.9316 56.5 17.5866L56.5 14.4134C56.5 14.0684 56.8411 13.8271 57.1664 13.9419Z" fill="#CDD8D3" stroke="#CDD8D3" />
            <rect x="24" y="11" width="22" height="10" rx="2" fill={pressedKey === 'ArrowDown' ? "#5A6462" : "#151A19"} />
            <path d="M37.3292 14.2236L35.4472 17.9875C35.263 18.3561 34.737 18.3561 34.5528 17.9875L32.6708 14.2236C32.5046 13.8912 32.7463 13.5 33.118 13.5L36.882 13.5C37.2537 13.5 37.4954 13.8912 37.3292 14.2236Z" fill="#CDD8D3" stroke="#CDD8D3" />
          </svg>
          <div className="text-[#CDD8D3] font-raleway text-xs font-medium leading-[150%] font-feature-lining font-feature-proportional cursor-default">Move</div>
        </div>
        <div className="flex h-[21px] py-[2px] px-0 items-center gap-[5px] flex-[1_0_0]">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="21" viewBox="0 0 22 21" fill="none">
            <rect y="0.5" width="22" height="20" rx="2" fill={pressedKey === 'Enter' ? "#5A6462" : "#151A19"} />
            <path d="M16 5.5V12.5C16 13.0523 15.5523 13.5 15 13.5H9" stroke="#CDD8D3" strokeWidth="2" />
            <path d="M10.3336 15.5581L5.83821 13.9715C5.39343 13.8145 5.39343 13.1855 5.83822 13.0285L10.3336 11.4419C10.6589 11.3271 11 11.5684 11 11.9134L11 15.0866C11 15.4316 10.6589 15.6729 10.3336 15.5581Z" fill="#CDD8D3" stroke="#CDD8D3" />
          </svg>
          <div className="text-[#CDD8D3] font-raleway text-xs font-medium leading-[150%] font-feature-lining font-feature-proportional cursor-default">Select</div>
        </div>
        <div className="w-[7px] h-[8px]"></div>
        <div className="flex h-[21px] py-[2px] px-0 items-center gap-[5px]">
          <div className={`w-[22px] h-[20px] shrink-0 rounded-[2px] flex items-center justify-center ${pressedKey === 'Escape' ? "bg-[#5A6462]" : "bg-[#151A19]"}`}>
            <div className={`w-[22px] h-[20px] shrink-0 rounded-[2px] flex items-center justify-center mt-[1px] text-[#CDD8D3] numbers-xxxs cursor-default ${pressedKey === 'Escape' ? "bg-[#5A6462]" : "bg-[#151A19]"}`}>ESC</div>
          </div>
          <div className="text-[#CDD8D3] font-raleway text-xs font-medium leading-[150%] font-feature-lining font-feature-proportional cursor-default">Close</div>
        </div>
      </div>
    </div>
  );
};

export const MainSearchBar: React.FC<MainSearchBarProps> = () => {
  const { isMobile } = useUIContext();
  // searchParams and pathname are not directly used by MainSearchBar's logic, but are props for SearchContainer & SearchBar
  // const searchParams = useSearchParams();
  // const pathname = usePathname();

  const [showMore, setShowMore] = useState<{ [key: string]: boolean }>({}); // For SearchBar
  const [isSearchActive, setIsSearchActive] = useState(false); // Manages overall search active state (especially for mobile UI)
  const searchContainerRef = useRef<HTMLDivElement>(null); // For click outside detection
  const searchInputRef = useRef<HTMLInputElement>(null); // For focusing input
  const searchTimeoutRef = useRef<NodeJS.Timeout>(); // For delaying deactivation

  const activateSearch = useCallback(() => {
    if (isMobile) {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
      setIsSearchActive(true);
      // setTimeout for focusing is removed, relying on the useEffect below.
    }
  }, [isMobile]);

  useEffect(() => { // Focus input when search becomes active on mobile
    if (isMobile && isSearchActive) {
      const timerId = setTimeout(() => {
        if (searchInputRef.current && document.activeElement !== searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }, 50);
      return () => clearTimeout(timerId);
    }
  }, [isMobile, isSearchActive]);

  const deactivateSearch = useCallback(() => { // Delay deactivation for mobile
    if (isMobile) {
      searchTimeoutRef.current = setTimeout(() => {
        if (searchContainerRef.current && !searchContainerRef.current.contains(document.activeElement)) {
          setIsSearchActive(false);
        }
      }, 300);
    }
  }, [isMobile]);

  useEffect(() => { // Cleanup timeout on unmount
    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, []);

  useEffect(() => { // Handle clicks outside search area on mobile
    if (!isMobile || !isSearchActive) return;
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchActive(false);
      }
    };
    const timeoutId = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }, 100);
    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isMobile, isSearchActive]);

  // isSearchInputFocusedMobile state and its direct handlers are for fine-grained focus state on mobile.
  // isSearchInputFocusedMobile state and its handlers (handleSearchInputFocus, handleSearchInputBlur) are removed.

  useEffect(() => { // Global keydown for '/' to focus and 'Escape' to blur/close
    const handleGlobalKeyDown = (event: KeyboardEvent) => {
      const targetElement = event.target as HTMLElement;
      const isTypingInInput = targetElement.tagName === 'INPUT' || targetElement.tagName === 'TEXTAREA' || targetElement.isContentEditable;
      if (event.key === '/') {
        if (!isTypingInInput) {
          event.preventDefault();
          if (isMobile) activateSearch();
          else searchInputRef.current?.focus();
        }
      } else if (event.key === 'Escape') {
        if (document.activeElement === searchInputRef.current) {
          searchInputRef.current?.blur();
          if (isMobile && isSearchActive) setIsSearchActive(false);
        } else if (isMobile && isSearchActive) {
          setIsSearchActive(false);
        }
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isMobile, isSearchActive, activateSearch]);

  useEffect(() => { // Effect for closing mobile search on anchor link clicks
    const handleAnchorLinkClick = (e: MouseEvent) => {
      const target = e.target;
      if (target instanceof HTMLAnchorElement && target.href && target.href.includes('#')) {
        if (isMobile && isSearchActive) {
           setIsSearchActive(false);
        }
      }
    }
    window.addEventListener('click', handleAnchorLinkClick, true);
    return () => {
      window.removeEventListener('click', handleAnchorLinkClick, true);
    }
  }, [isMobile, isSearchActive]);

  // Handle search submission (placeholder)
  const handleSearchSubmit = (query: string) => {
    console.log('Search submitted in MainSearchBar:', query);
  };

  return (
    <>
      {isMobile && isSearchActive && (
        <div
          className="fixed inset-0 bg-black/20 z-40 md:hidden" // Ensure it's only for mobile
          onClick={() => setIsSearchActive(false)}
        />
      )}
      <div
        ref={searchContainerRef}
        className={`flex-1 min-w-0 relative h-[44px] ${isMobile && isSearchActive ? "-mx-[55px]" : ""} transition-[margin] duration-200`}
        onTouchStart={isMobile ? activateSearch : undefined} // Only use onTouchStart for mobile
      >
        <SearchContainer>
          <SearchBar
            ref={searchInputRef}
            showMore={showMore}
            setShowMore={setShowMore}
            showSearchContainer={false}
            onFocus={isMobile ? activateSearch : undefined}
            onBlur={isMobile ? deactivateSearch : undefined}
            // onSubmit={handleSearchSubmit} // Pass if SearchBar supports it
          />
        </SearchContainer>
      </div>
    </>
  );
};
