import { useEffect, useRef, useState } from 'react';

/**
 * Generic actions popover.
 *
 * Props:
 * - isOpen: boolean
 * - onClose: () => void
 * - anchorRef: React.RefObject (button that toggles the menu)
 * - menuItems: Array<{ id?: string; label: string; onClick?: ()=>void; variant?: 'default'|'danger'; disabled?: boolean; }>
 * - maxHeight?: number (optional scroll if many items)
 */
const ActionsMenu = ({ isOpen, onClose, anchorRef, menuItems = [], maxHeight = 240 }) => {
  const menuRef = useRef(null);
  const [placement, setPlacement] = useState('bottom');

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!isOpen) return;
      const m = menuRef.current;
      const a = anchorRef?.current;
      if (m && !m.contains(e.target) && a && !a.contains(e.target)) onClose?.();
    };
    const handleEsc = (e) => e.key === 'Escape' && onClose?.();

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose, anchorRef]);

  useEffect(() => {
    if (!isOpen || !anchorRef?.current) return;
    const rect = anchorRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const estimatedHeight = Math.min(maxHeight, 160);
    setPlacement(spaceBelow < estimatedHeight ? 'top' : 'bottom');
  }, [isOpen, anchorRef, maxHeight]);

  if (!isOpen) return null;

  const positionClasses = placement === 'bottom' ? 'top-8 right-2' : 'bottom-8 right-2';

  return (
    <div
      ref={menuRef}
      role="menu"
      aria-orientation="vertical"
      className={`absolute ${positionClasses} z-50 w-56 rounded-2xl bg-white shadow-xl ring-1 ring-black/5 p-2`}
      style={{ maxHeight, overflowY: 'auto' }}
    >
      {menuItems.map((item, idx) => {
        const isDanger = item.variant === 'danger';
        const base =
          'w-full text-left px-3 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed';
        const color = isDanger
          ? 'text-[#ff5c00] hover:bg-orange-50'
          : 'text-gray-700 hover:bg-gray-50';

        return (
          <button
            key={item.id ?? idx}
            role="menuitem"
            disabled={item.disabled}
            onClick={() => {
              if (item.disabled) return;
              item.onClick?.();
              onClose?.();
            }}
            className={`${base} ${color}`}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
};

export default ActionsMenu;
