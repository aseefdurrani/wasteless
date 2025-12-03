/**
 * ============================================================================
 * UI CONTEXT - Manages Global UI State (Loading, Toasts, etc.)
 * ============================================================================
 *
 * WHAT IS THIS FILE?
 * This context manages UI-related state that multiple components need to share:
 * - Loading states (show a spinner while fetching data)
 * - Toast notifications (success/error messages that pop up)
 * - Could also include: modals, sidebars, theme, etc.
 *
 * IS THIS CONTEXT ACTUALLY NEEDED? OR JUST A NICE-TO-HAVE?
 * ──────────────────────────────────────────────────────────
 * Good question! Let's break it down:
 *
 * ✅ LOADING STATE - Very useful!
 *    Without this, you'd need to manage loading state in EVERY component
 *    that fetches data. With this, any component can:
 *    - Set loading: setIsLoading(true)
 *    - Show a global spinner overlay
 *    - Clear loading: setIsLoading(false)
 *
 * ✅ TOAST NOTIFICATIONS - Very useful!
 *    Without this, you'd need to pass toast functions through props everywhere.
 *    With this, ANY component can show a notification:
 *    - showToast("Saved!", "success")
 *    - showToast("Something went wrong", "error")
 *
 * You COULD technically manage these locally in each component, but:
 * - Loading overlays would be duplicated everywhere
 * - Each component would need its own toast system
 * - No consistency across the app
 *
 * VERDICT: It's not strictly "required", but it's a VERY common pattern
 * that makes your app much cleaner and more consistent. Most production
 * apps have something like this.
 *
 * NOTE: This does NOT use localStorage (unlike AuthContext).
 * UI state is temporary - we don't need to remember if a toast was showing
 * after the user refreshes the page.
 */

import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

/**
 * TOAST INTERFACE
 * Defines the shape of a toast notification.
 *
 * Each toast has:
 * - id: Unique identifier (used to remove specific toasts)
 * - message: The text to display
 * - type: Determines the color/style (success=green, error=red, etc.)
 */
interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info" | "warning";
}

/**
 * UI CONTEXT TYPE
 * Defines what's available to components using useUI().
 *
 * Components can:
 * - Check/set loading state
 * - Show toast notifications
 * - Remove specific toasts
 */
interface UIContextType {
  isLoading: boolean; // Is something loading globally?
  setIsLoading: (loading: boolean) => void; // Turn loading on/off
  toasts: Toast[]; // Array of active toasts
  showToast: (message: string, type: Toast["type"]) => void; // Show a toast
  removeToast: (id: string) => void; // Remove a specific toast
}

/**
 * CREATE THE CONTEXT
 * Same pattern as AuthContext - create an empty container.
 */
const UIContext = createContext<UIContextType | undefined>(undefined);

/**
 * UI PROVIDER COMPONENT
 *
 * Wraps your app (see App.tsx) and provides UI state to all children.
 * This sits inside AuthProvider, so UI components can also access auth if needed.
 */
export function UIProvider({ children }: { children: ReactNode }) {
  /**
   * LOADING STATE
   *
   * When true, you might show a spinner overlay (see contextDummy.tsx).
   * Set to true before API calls, false when done.
   *
   * Example usage:
   * setIsLoading(true);
   * await fetch('/api/data');
   * setIsLoading(false);
   */
  const [isLoading, setIsLoading] = useState(false);

  /**
   * TOASTS STATE
   *
   * An array of toast notifications currently being displayed.
   * New toasts get added to the end, old ones get removed.
   *
   * Why an array? Multiple toasts can show at once!
   * Try clicking "Show Success Toast" multiple times quickly.
   */
  const [toasts, setToasts] = useState<Toast[]>([]);

  /**
   * SHOW A TOAST NOTIFICATION
   *
   * Call this from ANY component to display a message:
   *   showToast("Hello!", "info")
   *   showToast("Saved!", "success")
   *   showToast("Error!", "error")
   *
   * How it works:
   * 1. Create a unique ID using timestamp (simple but works)
   * 2. Add the new toast to the array
   * 3. Set a timer to auto-remove after 3 seconds
   *
   * The ToastContainer component (see ToastContainer.tsx) watches this
   * array and renders the actual toast UI.
   */
  const showToast = (message: string, type: Toast["type"] = "info") => {
    // Create unique ID - Date.now() gives milliseconds since 1970
    // Good enough for our purposes (very unlikely to have duplicates)
    const id = Date.now().toString();

    // Create the toast object
    const newToast: Toast = { id, message, type };

    // Add to array - using functional update to ensure we have latest state
    // [...prev, newToast] = keep all existing toasts, add new one at end
    setToasts((prev) => [...prev, newToast]);

    // Auto-remove after 3 seconds
    // setTimeout schedules a function to run after X milliseconds
    setTimeout(() => {
      removeToast(id);
    }, 3000); // 3000ms = 3 seconds
  };

  /**
   * REMOVE A TOAST
   *
   * Called when:
   * 1. User clicks the X button on a toast
   * 2. Auto-remove timer fires (after 3 seconds)
   *
   * Uses .filter() to keep all toasts EXCEPT the one with matching id
   */
  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  // Bundle everything we want to share
  const value = {
    isLoading,
    setIsLoading,
    toasts,
    showToast,
    removeToast,
  };

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

/**
 * CUSTOM HOOK: useUI()
 *
 * Easy way for components to access UI state.
 *
 * Usage:
 * import { useUI } from '../contexts/UIContext';
 *
 * function MyComponent() {
 *   const { showToast, setIsLoading } = useUI();
 *   showToast("Hello!", "success");
 * }
 */
export function useUI() {
  const context = useContext(UIContext);

  if (context === undefined) {
    throw new Error("useUI must be used within a UIProvider");
  }

  return context;
}
