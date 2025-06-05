"use client";
import React, { useState } from 'react';
import { Popover } from './FloatingBar/Popover';
import { FloatingBarButton } from './FloatingBar/FloatingBarButton';
import NotificationContent from './FloatingBar/NotificationContent';
import { useNotifications } from '@/hooks/useNotifications';
import { GTPIconName } from '@/icons/gtp-icon-names';

interface NotificationBellProps {
  isMobile: boolean;
}

export const NotificationBell: React.FC<NotificationBellProps> = ({ isMobile }) => {
  const { filteredData, hasUnseenNotifications, markNotificationsAsSeen, isLoading, error } = useNotifications();
  const [isNotificationPopoverOpen, setIsNotificationPopoverOpen] = useState(false);

  const handlePopoverOpenChange = (open: boolean) => {
    setIsNotificationPopoverOpen(open);
    if (!open) {
      markNotificationsAsSeen();
    }
  };

  if (isMobile) {
    return (
      <Popover
        placement='top-start'
        isOpen={isNotificationPopoverOpen}
        onOpenChange={setIsNotificationPopoverOpen} // Simplified for mobile, no markAsSeen on close via overlay
        content={
          <NotificationContent onClose={() => setIsNotificationPopoverOpen(false)} />
        }
        className='flex md:hidden' // This class might need adjustment if isMobile is true
        trigger="click"
      >
        <FloatingBarButton
          icon={(hasUnseenNotifications ? "gtp-notification-new" : "gtp-notification") as GTPIconName}
          title="Notifications"
          className='!bg-[#344240]' // Specific to mobile version in original code
        />
      </Popover>
    );
  }

  return (
    <Popover
      placement='bottom-end'
      isOpen={isNotificationPopoverOpen}
      onOpenChange={handlePopoverOpenChange}
      content={
        <NotificationContent onClose={() => setIsNotificationPopoverOpen(false)} />
      }
      className='hidden md:flex' // This class might need adjustment if isMobile is false
      trigger="click"
    >
      <FloatingBarButton
        icon={(hasUnseenNotifications ? "gtp-notification-new" : "gtp-notification") as GTPIconName}
        title="Notifications"
      />
    </Popover>
  );
};
