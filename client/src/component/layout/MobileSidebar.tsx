import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import Button from '../ui/Button';
import Sidebar from './Sidebar';

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileSidebar: React.FC<MobileSidebarProps> = ({ isOpen, onClose }) => {
  // Close sidebar when Escape key is pressed
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);

    // Prevent body scroll when sidebar is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-gray-600 bg-opacity-75 z-20 md:hidden"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 left-0 flex z-30 md:hidden">
        <div className="relative flex-1 flex flex-col w-72 max-w-sm bg-white">
          <div className="absolute top-0 right-0 p-1">
            <Button
              variant="ghost"
              className="p-2"
              onClick={onClose}
              aria-label="Close menu"
            >
              <X size={24} />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto pt-12">
            <Sidebar />
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileSidebar;