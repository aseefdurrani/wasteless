/**
 * ============================================================================
 * TOAST CONTAINER - Renders Toast Notifications on Screen
 * ============================================================================
 *
 * WHAT IS THIS COMPONENT?
 * This component is responsible for DISPLAYING the toast notifications.
 * It reads the toasts array from UIContext and renders them on screen.
 *
 * HOW DOES IT WORK WITH UICONTEXT?
 * ─────────────────────────────────
 *
 * 1. UIContext holds the toasts ARRAY (the data)
 * 2. ToastContainer DISPLAYS that array (the UI)
 *
 * When you call showToast() in any component:
 *   showToast("Hello!", "success")
 *        ↓
 *   UIContext adds to toasts array: [{ id: "123", message: "Hello!", type: "success" }]
 *        ↓
 *   ToastContainer re-renders (because toasts changed)
 *        ↓
 *   User sees the toast on screen!
 *
 * WHY IS IT IN App.tsx?
 * ─────────────────────
 * We put <ToastContainer /> at the app level so toasts appear on EVERY page.
 * It's positioned fixed (toast-top toast-end) so it floats in the corner
 * regardless of page content.
 *
 * DAISYUI CLASSES USED:
 * - toast: Container for toast notifications
 * - toast-top: Position at top of screen
 * - toast-end: Position at end (right side in LTR languages)
 * - alert: DaisyUI alert component styling
 * - alert-success/error/warning/info: Color variants
 */

import { useUI } from "../contexts/UIContext";

export default function ToastContainer() {
  /**
   * GET TOASTS FROM CONTEXT
   *
   * useUI() gives us access to the UI context.
   * We only need toasts (the array) and removeToast (to handle X button click).
   *
   * This component will RE-RENDER whenever toasts changes.
   * That's how React works: when state changes, components using that state update.
   */
  const { toasts, removeToast } = useUI();

  /**
   * GET CSS CLASS BASED ON TOAST TYPE
   *
   * DaisyUI has different alert colors:
   * - alert-success: Green (for success messages)
   * - alert-error: Red (for errors)
   * - alert-warning: Yellow/Orange (for warnings)
   * - alert-info: Blue (for info/neutral messages)
   *
   * This function takes a type and returns the right class.
   */
  const getAlertClass = (type: string) => {
    switch (type) {
      case "success":
        return "alert-success";
      case "error":
        return "alert-error";
      case "warning":
        return "alert-warning";
      case "info":
      default:
        return "alert-info";
    }
  };

  /**
   * RENDER THE TOASTS
   *
   * - The outer div is the container (positioned fixed in corner)
   * - We .map() over the toasts array to render each one
   * - Each toast has a key (required by React for lists)
   * - The X button calls removeToast to dismiss it early
   */
  return (
    // Fixed container in top-right corner, high z-index so it's above everything
    <div className="toast toast-top toast-end z-50">
      {/* 
        Map through all toasts and render each one.
        If toasts is empty [], nothing renders.
        If toasts has items, each one becomes a div.
      */}
      {toasts.map((toast) => (
        <div
          key={toast.id} // React requires unique keys for list items
          className={`alert ${getAlertClass(toast.type)} shadow-lg`}
        >
          {/* The toast message */}
          <span>{toast.message}</span>

          {/* X button to dismiss toast early */}
          <button
            className="btn btn-sm btn-ghost"
            onClick={() => removeToast(toast.id)}
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
