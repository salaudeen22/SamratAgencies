import { useEffect } from 'react';

const Modal = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Background overlay with blur */}
        <div
          className="fixed inset-0 backdrop-blur-sm bg-white/30 transition-opacity"
          onClick={onClose}
        ></div>

        {/* Modal panel */}
        <div className="relative bg-white rounded-lg shadow-2xl border-2 max-w-2xl w-full max-h-[90vh] overflow-y-auto" style={{ borderColor: '#BDD7EB' }}>
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold" style={{ color: '#1F2D38' }}>
                {title}
              </h3>
              <button
                onClick={onClose}
                type="button"
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div>{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
