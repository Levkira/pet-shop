import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { clearToast } from '../features/ui/uiSlice';

export default function Toast() {
  const message = useAppSelector((state) => state.ui.toast);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => dispatch(clearToast()), 2500);
    return () => clearTimeout(timer);
  }, [message, dispatch]);

  if (!message) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-forest px-5 py-3 text-sm font-medium text-white shadow-lg"
    >
      {message}
    </div>
  );
}
