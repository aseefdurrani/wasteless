/**
 * ============================================================================
 * AUTH CONTEXT - Manages User Authentication State
 * ============================================================================
 *
 * WHAT IS THIS FILE?
 * This file creates a "global" state for user authentication that ANY component
 * in your app can access without passing props down through every level.
 *
 * WHY DO WE NEED THIS?
 * Without context, if your Navbar needs to know if a user is logged in, and your
 * Dashboard also needs it, you'd have to:
 *   1. Store user state in App.tsx
 *   2. Pass it as props: App → Navbar (user={user})
 *   3. Pass it as props: App → Dashboard (user={user})
 *   4. If Dashboard has child components that need user... keep passing!
 *
 * This is called "prop drilling" and gets messy fast. Context solves this by
 * letting ANY component access the user state directly with useAuth().
 *
 * IS LOCALSTORAGE SET UP?
 * YES! ✅ See the useEffect on line ~35 and the login/logout functions.
 * - When user logs in → saved to localStorage (persists across browser refreshes)
 * - When app loads → checks localStorage and restores user automatically
 * - When user logs out → removed from localStorage
 *
 * THE PATTERN (used in most React apps):
 * 1. Create a Context (the "container" for shared state)
 * 2. Create a Provider (the component that "provides" state to children)
 * 3. Create a custom hook (easy way for components to access the state)
 */

import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

/**
 * USER INTERFACE
 * Defines what a "user" object looks like in your app.
 * When you connect to a real backend, update this to match your API response.
 *
 * Example: Your backend might return:
 * { id: "abc123", email: "user@example.com", name: "John", avatar: "url", role: "admin" }
 */
interface User {
  id: string;
  email: string;
  name: string;
  // TODO: Add more fields as your app grows:
  // avatar?: string;
  // role?: 'user' | 'admin';
  // token?: string;  // JWT token for API authentication
}

/**
 * AUTH CONTEXT TYPE
 * Defines what values/functions will be available to any component using useAuth().
 *
 * Think of this as the "API" of your auth system. Any component can:
 * - Read the current user
 * - Call login() to log someone in
 * - Call logout() to log them out
 * - Check isAuthenticated to see if someone is logged in
 */
interface AuthContextType {
  user: User | null; // The current user, or null if not logged in
  login: (userData: User) => void; // Function to log in
  logout: () => void; // Function to log out
  isAuthenticated: boolean; // Quick check: is someone logged in?
}

/**
 * CREATE THE CONTEXT
 *
 * createContext() creates a "container" that can hold our auth state.
 * We start with `undefined` because we haven't provided any value yet.
 * The Provider below will give it the actual value.
 *
 * Think of it like creating an empty box labeled "Auth" that we'll fill later.
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * AUTH PROVIDER COMPONENT
 *
 * This component WRAPS your entire app (see App.tsx) and makes auth state
 * available to all children components.
 *
 * How it works:
 * <AuthProvider>          ← This provides the auth state
 *   <YourApp />           ← Everything inside can access it
 * </AuthProvider>
 *
 * The { children } prop is whatever you put inside <AuthProvider>...</AuthProvider>
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  /**
   * USER STATE
   * This is the actual "source of truth" for who is logged in.
   * - null = no one is logged in
   * - User object = someone is logged in
   */
  const [user, setUser] = useState<User | null>(null);

  /**
   * LOAD USER FROM LOCALSTORAGE ON APP START
   *
   * useEffect with [] runs ONCE when the component first mounts (app starts).
   *
   * This is how we "remember" the user across browser refreshes:
   * 1. User logs in → we save to localStorage (see login function below)
   * 2. User closes browser, comes back later
   * 3. This useEffect runs, finds the saved user, restores them!
   *
   * Without this, users would have to log in every time they refresh the page.
   */
  useEffect(() => {
    // Try to get saved user data from browser's localStorage
    const savedUser = localStorage.getItem("wasteless_user");

    if (savedUser) {
      try {
        // Parse the JSON string back into an object and set as current user
        setUser(JSON.parse(savedUser));
        console.log("✅ User restored from localStorage");
      } catch (error) {
        // If the data is corrupted/invalid, clean it up
        console.error("Failed to parse saved user:", error);
        localStorage.removeItem("wasteless_user");
      }
    }
  }, []); // Empty array = run only once on mount

  /**
   * LOGIN FUNCTION
   *
   * When you call login(userData), this:
   * 1. Sets the user in React state (updates the UI immediately)
   * 2. Saves to localStorage (persists across refreshes)
   *
   * In a real app, you'd call this AFTER your API confirms the login:
   *
   * const handleLogin = async (email, password) => {
   *   const response = await api.login(email, password);
   *   if (response.success) {
   *     login(response.user);  // ← This function
   *   }
   * }
   */
  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem("wasteless_user", JSON.stringify(userData));
    console.log("✅ User logged in and saved to localStorage");
  };

  /**
   * LOGOUT FUNCTION
   *
   * Clears the user from:
   * 1. React state (updates UI immediately)
   * 2. localStorage (so they stay logged out on refresh)
   *
   * In a real app, you might also:
   * - Call an API to invalidate the session/token
   * - Redirect to the login page
   */
  const logout = () => {
    setUser(null);
    localStorage.removeItem("wasteless_user");
    console.log("✅ User logged out and removed from localStorage");
  };

  /**
   * HELPER: IS AUTHENTICATED
   * Quick boolean check - is someone logged in?
   *
   * Usage in components:
   * if (isAuthenticated) {
   *   // Show dashboard
   * } else {
   *   // Show login page
   * }
   */
  const isAuthenticated = user !== null;

  /**
   * THE VALUE WE PROVIDE
   * This object is what components get when they call useAuth().
   * Any component can access all of these.
   */
  const value = {
    user, // The current user object (or null)
    login, // Function to log in
    logout, // Function to log out
    isAuthenticated, // Boolean: is someone logged in?
  };

  /**
   * RENDER THE PROVIDER
   *
   * AuthContext.Provider is a special component from React.
   * It "provides" the value to all children components.
   *
   * {children} = whatever components are inside <AuthProvider>...</AuthProvider>
   */
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * CUSTOM HOOK: useAuth()
 *
 * This is the EASY WAY for components to access auth state.
 * Instead of using useContext(AuthContext) directly, we wrap it in a hook.
 *
 * Benefits:
 * 1. Cleaner syntax: const { user } = useAuth()
 * 2. Error handling: throws if used outside AuthProvider
 * 3. Better autocomplete in your IDE
 *
 * Usage in any component:
 *
 * import { useAuth } from '../contexts/AuthContext';
 *
 * function MyComponent() {
 *   const { user, login, logout, isAuthenticated } = useAuth();
 *   // Now you can use these!
 * }
 */
export function useAuth() {
  const context = useContext(AuthContext);

  // Safety check: make sure this is used inside an AuthProvider
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
