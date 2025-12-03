/**
 * ============================================================================
 * CONTEXT DUMMY PAGE - Demo/Testing Page for Context API
 * ============================================================================
 *
 * WHAT IS THIS PAGE?
 * A playground to test and understand how AuthContext and UIContext work.
 * Click the buttons to see the contexts in action!
 *
 * HOW TO USE:
 * 1. Navigate to /contextTest in your browser
 * 2. Try logging in - notice the UI updates AND it persists after refresh
 * 3. Try the toast buttons - see different colors appear
 * 4. Try "Load Data" - see the loading overlay
 *
 * THIS PAGE DEMONSTRATES:
 * ─────────────────────────
 * ✅ How to import and use the custom hooks (useAuth, useUI)
 * ✅ Reading state (user, isAuthenticated, isLoading)
 * ✅ Calling functions (login, logout, showToast, setIsLoading)
 * ✅ Conditional rendering based on state
 * ✅ How toasts and loading overlays work
 *
 * DELETE THIS PAGE LATER:
 * This is just for learning/testing. Once you understand contexts,
 * you can delete this page and apply the patterns to real features.
 */

import { useAuth } from "../contexts/AuthContext";
import { useUI } from "../contexts/UIContext";

export default function ContextDummy() {
  /**
   * ACCESS THE CONTEXTS WITH HOOKS
   *
   * useAuth() returns: { user, login, logout, isAuthenticated }
   * useUI() returns: { isLoading, setIsLoading, toasts, showToast, removeToast }
   *
   * We're using "destructuring" to pull out just what we need.
   * This is the same as:
   *
   *   const auth = useAuth();
   *   const user = auth.user;
   *   const login = auth.login;
   *   // etc...
   *
   * But destructuring is cleaner!
   */
  const { user, login, logout, isAuthenticated } = useAuth();
  const { isLoading, setIsLoading, showToast } = useUI();

  /**
   * MOCK LOGIN HANDLER
   *
   * In a real app, this would:
   * 1. Call your backend API with email/password
   * 2. Get back user data + token
   * 3. Call login() with that data
   *
   * For now, we just create a fake user to demonstrate.
   *
   * TRY THIS:
   * 1. Click "Login (Mock)"
   * 2. See the UI update to show "Logged in as: John Doe"
   * 3. Refresh the page
   * 4. You're STILL logged in! (localStorage at work)
   */
  const handleLogin = () => {
    // Fake user data - in real app, this comes from your API
    const mockUser = {
      id: "123",
      email: "user@wasteless.com",
      name: "John Doe",
    };

    // Call login() from AuthContext
    // This sets user in state AND saves to localStorage
    login(mockUser);

    // Show a success toast
    showToast("Successfully logged in!", "success");
  };

  /**
   * MOCK DATA LOADING HANDLER
   *
   * Demonstrates how to use loading state for async operations.
   *
   * In a real app:
   *   setIsLoading(true);
   *   const data = await fetch('/api/data');
   *   setIsLoading(false);
   *
   * Here we use setTimeout to simulate a 2-second API call.
   */
  const handleLoadData = () => {
    // Turn on loading (shows the overlay)
    setIsLoading(true);
    showToast("Loading data...", "info");

    // Simulate API call with setTimeout
    // In real app: await fetch('/api/something')
    setTimeout(() => {
      // Turn off loading (hides the overlay)
      setIsLoading(false);
      showToast("Data loaded successfully!", "success");
    }, 2000); // 2000ms = 2 seconds
  };

  /**
   * LOGOUT HANDLER
   *
   * Clears user from state and localStorage.
   * The UI will update to show "Not logged in" state.
   */
  const handleLogout = () => {
    logout(); // From AuthContext
    showToast("Logged out", "info");
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Context API Test Page</h2>

      {/*
        ════════════════════════════════════════════════════════════════
        AUTH STATUS SECTION
        ════════════════════════════════════════════════════════════════
        
        This section demonstrates:
        - Reading isAuthenticated to show different UI
        - Displaying user data when logged in
        - Calling login/logout functions
        
        TRY: Log in, refresh page, you're still logged in!
      */}
      <div className="card bg-base-200 mb-6 p-6">
        <h3 className="text-xl font-semibold mb-4">🔐 Auth Status</h3>

        {/*
          CONDITIONAL RENDERING
          
          {isAuthenticated ? (logged in UI) : (logged out UI)}
          
          This is a "ternary operator" - a shorthand if/else.
          When isAuthenticated is true, show the first part.
          When false, show the part after the colon.
        */}
        {isAuthenticated ? (
          // LOGGED IN STATE
          <div>
            <p className="mb-2">
              ✅ Logged in as: <strong>{user?.name}</strong>
            </p>
            <p className="mb-4">Email: {user?.email}</p>

            {/* 
              The ?. is "optional chaining" - safely access properties
              even if user might be null. Same as:
              user ? user.email : undefined
            */}

            <button className="btn btn-error btn-sm" onClick={handleLogout}>
              Logout
            </button>
          </div>
        ) : (
          // LOGGED OUT STATE
          <div>
            <p className="mb-4">❌ Not logged in</p>
            <button className="btn btn-primary btn-sm" onClick={handleLogin}>
              Login (Mock)
            </button>
          </div>
        )}
      </div>

      {/*
        ════════════════════════════════════════════════════════════════
        UI CONTEXT DEMO SECTION
        ════════════════════════════════════════════════════════════════
        
        This section demonstrates:
        - setIsLoading() to show/hide loading overlay
        - showToast() with different types
        
        TRY: Click each button and watch the toasts appear!
      */}
      <div className="card bg-base-200 p-6">
        <h3 className="text-xl font-semibold mb-4">🎨 UI Context Demo</h3>
        <div className="flex flex-wrap gap-3">
          {/*
            LOAD DATA BUTTON
            Shows loading state - button text changes while loading
          */}
          <button className="btn btn-primary" onClick={handleLoadData}>
            {isLoading ? "Loading..." : "Load Data"}
          </button>

          {/*
            TOAST BUTTONS
            Each calls showToast() with a different type
            The type determines the color in ToastContainer
          */}
          <button
            className="btn btn-success"
            onClick={() => showToast("This is a success message!", "success")}
          >
            Show Success Toast
          </button>
          <button
            className="btn btn-error"
            onClick={() => showToast("This is an error message!", "error")}
          >
            Show Error Toast
          </button>
          <button
            className="btn btn-warning"
            onClick={() => showToast("This is a warning!", "warning")}
          >
            Show Warning Toast
          </button>
        </div>
      </div>

      {/*
        ════════════════════════════════════════════════════════════════
        LOADING OVERLAY
        ════════════════════════════════════════════════════════════════
        
        This only renders when isLoading is true.
        
        {isLoading && <div>...</div>}
        
        This is a "short-circuit" - if isLoading is false, React stops
        evaluating and renders nothing. If true, it renders the div.
        
        The overlay:
        - Fixed positioning (covers entire screen)
        - Semi-transparent black background (bg-black/50)
        - High z-index (z-50) to appear above other content
        - Centered spinner
        
        NOTE: In a real app, you might move this to App.tsx so it shows
        on ALL pages, not just this one!
      */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      )}
    </div>
  );
}
