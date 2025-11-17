import { useEffect } from 'react';
import toast from 'react-hot-toast';

/**
 * Hook to protect images from unauthorized copying
 * Detects and prevents various methods of image theft
 */
const useImageProtection = (enabled = true) => {
  useEffect(() => {
    if (!enabled) return;

    let devtoolsOpen = false;

    // Detect DevTools opening
    const detectDevTools = () => {
      const threshold = 160;
      const widthThreshold = window.outerWidth - window.innerWidth > threshold;
      const heightThreshold = window.outerHeight - window.innerHeight > threshold;

      if (widthThreshold || heightThreshold) {
        if (!devtoolsOpen) {
          devtoolsOpen = true;
          toast.error('⚠️ All images are copyrighted by Samrat Agencies', {
            duration: 5000,
            position: 'top-center',
          });
        }
      } else {
        devtoolsOpen = false;
      }
    };

    // Check periodically
    const devToolsInterval = setInterval(detectDevTools, 1000);

    // Prevent right-click globally
    const preventContextMenu = (e) => {
      if (e.target.tagName === 'IMG') {
        e.preventDefault();
        toast.error('Right-click is disabled on images', {
          duration: 2000,
          icon: '🚫',
        });
        return false;
      }
    };

    // Prevent drag globally
    const preventDrag = (e) => {
      if (e.target.tagName === 'IMG') {
        e.preventDefault();
        return false;
      }
    };

    // Prevent keyboard shortcuts
    const preventKeyboardShortcuts = (e) => {
      // Prevent Ctrl+S / Cmd+S (Save)
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        toast.error('Saving is disabled', { duration: 2000, icon: '🚫' });
        return false;
      }

      // Prevent Ctrl+Shift+I / Cmd+Option+I (DevTools)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'I') {
        e.preventDefault();
        return false;
      }

      // Prevent F12 (DevTools)
      if (e.key === 'F12') {
        e.preventDefault();
        return false;
      }

      // Prevent Ctrl+U / Cmd+U (View Source)
      if ((e.ctrlKey || e.metaKey) && e.key === 'u') {
        e.preventDefault();
        return false;
      }

      // Prevent Ctrl+Shift+C / Cmd+Option+C (Inspect Element)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'C') {
        e.preventDefault();
        return false;
      }

      // Prevent PrintScreen
      if (e.key === 'PrintScreen') {
        e.preventDefault();
        toast.error('Screenshots are monitored', { duration: 3000, icon: '⚠️' });

        // Blur the page temporarily
        document.body.style.filter = 'blur(10px)';
        setTimeout(() => {
          document.body.style.filter = 'none';
        }, 500);

        return false;
      }
    };

    // Detect copy attempts
    const preventCopy = (e) => {
      const selection = window.getSelection();
      if (selection && selection.toString().length === 0) {
        // Check if trying to copy an image
        const target = e.target;
        if (target && target.tagName === 'IMG') {
          e.preventDefault();
          toast.error('Copying images is not allowed', {
            duration: 2000,
            icon: '🚫',
          });
          return false;
        }
      }
    };

    // Detect screenshot using visibility change (works on some mobile devices)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Page is hidden, might be taking screenshot
        console.warn('Potential screenshot attempt detected');
      }
    };

    // Monitor clipboard
    const monitorClipboard = async (e) => {
      try {
        const items = e.clipboardData?.items;
        if (items) {
          for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
              e.preventDefault();
              toast.error('Image copying is not allowed', {
                duration: 3000,
                icon: '🚫',
              });
              return false;
            }
          }
        }
      } catch (err) {
        // Clipboard API not supported
      }
    };

    // Disable long-press on mobile
    let longPressTimer;
    const handleTouchStart = (e) => {
      if (e.target.tagName === 'IMG') {
        longPressTimer = setTimeout(() => {
          toast.error('Long-press is disabled on images', {
            duration: 2000,
            icon: '🚫',
          });
        }, 500);
      }
    };

    const handleTouchEnd = () => {
      clearTimeout(longPressTimer);
    };

    // Add all event listeners
    document.addEventListener('contextmenu', preventContextMenu);
    document.addEventListener('dragstart', preventDrag);
    document.addEventListener('keydown', preventKeyboardShortcuts);
    document.addEventListener('copy', preventCopy);
    document.addEventListener('cut', preventCopy);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('paste', monitorClipboard);
    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchend', handleTouchEnd);

    // Show copyright notice
    const showCopyrightNotice = () => {
      const notice = document.createElement('div');
      notice.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 10px 15px;
        border-radius: 8px;
        font-size: 12px;
        z-index: 999999;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      `;
      notice.textContent = '© All images are copyrighted by Samrat Agencies';
      document.body.appendChild(notice);

      setTimeout(() => {
        notice.style.transition = 'opacity 0.5s';
        notice.style.opacity = '0';
        setTimeout(() => notice.remove(), 500);
      }, 3000);
    };

    // Show notice after 2 seconds
    const noticeTimer = setTimeout(showCopyrightNotice, 2000);

    // Cleanup
    return () => {
      clearInterval(devToolsInterval);
      clearTimeout(noticeTimer);
      document.removeEventListener('contextmenu', preventContextMenu);
      document.removeEventListener('dragstart', preventDrag);
      document.removeEventListener('keydown', preventKeyboardShortcuts);
      document.removeEventListener('copy', preventCopy);
      document.removeEventListener('cut', preventCopy);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('paste', monitorClipboard);
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [enabled]);

  return null;
};

export default useImageProtection;
