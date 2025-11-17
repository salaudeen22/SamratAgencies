import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

/**
 * ProtectedImage - Copyright protected image component
 * Prevents right-click, drag-drop, and screenshot attempts
 */
const ProtectedImage = ({
  src,
  alt,
  className = '',
  style = {},
  loading = 'lazy',
  watermark = false,
  watermarkText = '© Samrat Agencies',
  onLoad,
  onError,
  ...props
}) => {
  const imgRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const img = imgRef.current;
    const container = containerRef.current;

    if (!img || !container) return;

    // Prevent right-click context menu
    const preventContextMenu = (e) => {
      e.preventDefault();
      return false;
    };

    // Prevent drag and drop
    const preventDrag = (e) => {
      e.preventDefault();
      return false;
    };

    // Prevent selection
    const preventSelection = (e) => {
      e.preventDefault();
      return false;
    };

    // Add event listeners
    img.addEventListener('contextmenu', preventContextMenu);
    img.addEventListener('dragstart', preventDrag);
    img.addEventListener('selectstart', preventSelection);
    container.addEventListener('contextmenu', preventContextMenu);

    // Prevent keyboard shortcuts for saving
    const preventKeyboardShortcuts = (e) => {
      // Prevent Ctrl+S, Cmd+S (Save)
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        return false;
      }
      // Prevent Ctrl+Shift+S, Cmd+Shift+S (Save As)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 's') {
        e.preventDefault();
        return false;
      }
      // Prevent Print Screen on some browsers
      if (e.key === 'PrintScreen') {
        e.preventDefault();
        return false;
      }
    };

    document.addEventListener('keydown', preventKeyboardShortcuts);

    return () => {
      img.removeEventListener('contextmenu', preventContextMenu);
      img.removeEventListener('dragstart', preventDrag);
      img.removeEventListener('selectstart', preventSelection);
      container.removeEventListener('contextmenu', preventContextMenu);
      document.removeEventListener('keydown', preventKeyboardShortcuts);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`protected-image-container ${className}`}
      style={{
        position: 'relative',
        display: 'inline-block',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none',
        ...style,
      }}
      {...props}
    >
      {/* Invisible overlay to prevent interactions */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1,
          pointerEvents: 'auto',
        }}
        onContextMenu={(e) => e.preventDefault()}
        onDragStart={(e) => e.preventDefault()}
      />

      {/* Actual image */}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        loading={loading}
        draggable="false"
        onContextMenu={(e) => e.preventDefault()}
        onDragStart={(e) => e.preventDefault()}
        onLoad={onLoad}
        onError={onError}
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          MozUserSelect: 'none',
          msUserSelect: 'none',
          WebkitUserDrag: 'none',
          pointerEvents: 'none',
        }}
      />

      {/* Watermark overlay (optional) */}
      {watermark && (
        <div
          style={{
            position: 'absolute',
            bottom: '10px',
            right: '10px',
            background: 'rgba(0, 0, 0, 0.5)',
            color: 'white',
            padding: '4px 8px',
            fontSize: '12px',
            borderRadius: '4px',
            pointerEvents: 'none',
            userSelect: 'none',
            zIndex: 2,
          }}
        >
          {watermarkText}
        </div>
      )}

      {/* Copyright notice overlay */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: 0,
          transition: 'opacity 0.3s',
          background: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          fontSize: '14px',
          pointerEvents: 'none',
          zIndex: 3,
        }}
        className="copyright-notice"
      >
        ⚠️ This image is copyrighted
      </div>
    </div>
  );
};

ProtectedImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  className: PropTypes.string,
  style: PropTypes.object,
  loading: PropTypes.oneOf(['lazy', 'eager']),
  watermark: PropTypes.bool,
  watermarkText: PropTypes.string,
  onLoad: PropTypes.func,
  onError: PropTypes.func,
};

export default ProtectedImage;
