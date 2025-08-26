import { create } from "zustand";
import { auth, googleProvider, db } from "../firebase"; // Added db import
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export const useAuthStore = create((set) => ({
  authUser: null,
  isAdmin: false, // Added admin status
  loading: {
    checkAuth: false,
    login: false,
    logout: false,
  },
  error: {
    checkAuth: "",
    login: "",
    logout: "",
  },

  // ✅ check auth state - ONLY allow admins
  checkAuth: async () => {
    set((state) => ({
      loading: { ...state.loading, checkAuth: true },
      error: { ...state.error, checkAuth: "" },
    }));

    try {
      return await new Promise((resolve) => {
        onAuthStateChanged(auth, async (user) => {
          if (user) {
            try {
              // Check if user is admin in Firestore
              const adminRef = doc(db, "admins", user.email);
              const adminSnap = await getDoc(adminRef);

              if (adminSnap.exists()) {
                const adminData = adminSnap.data();
                // Check if admin is active
                if (adminData.status === 'active') {
                  // ✅ User is active admin - keep them logged in
                  set({ 
                    authUser: user,
                    isAdmin: true,
                    loading: { checkAuth: false, login: false, logout: false },
                  });
                  resolve(user);
                } else {
                  // ❌ Admin exists but is inactive
                  await signOut(auth);
                  set({ 
                    authUser: null,
                    isAdmin: false,
                    loading: { checkAuth: false, login: false, logout: false },
                    error: { checkAuth: "Access denied: Admin account is inactive", login: "", logout: "" },
                  });
                  resolve(null);
                }
              } else {
                // ❌ User is not admin - sign them out
                await signOut(auth);
                set({ 
                  authUser: null,
                  isAdmin: false,
                  loading: { checkAuth: false, login: false, logout: false },
                  error: { checkAuth: "Access denied: Admin privileges required", login: "", logout: "" },
                });
                resolve(null);
              }
            } catch (err) {
              // Error checking admin status - sign out to be safe
              await signOut(auth);
              set((state) => ({
                authUser: null,
                isAdmin: false,
                error: { ...state.error, checkAuth: err.message },
                loading: { ...state.loading, checkAuth: false },
              }));
              resolve(null);
            }
          } else {
            // No user signed in
            set({ 
              authUser: null,
              isAdmin: false,
              loading: { checkAuth: false, login: false, logout: false },
            });
            resolve(null);
          }
        });
      });
    } catch (err) {
      set((state) => ({
        error: { ...state.error, checkAuth: err.message },
        loading: { ...state.loading, checkAuth: false },
        authUser: null,
        isAdmin: false,
      }));
      return null;
    }
  },

  // ✅ login with google - ONLY admins allowed
  login: async () => {
    set((state) => ({
      loading: { ...state.loading, login: true },
      error: { ...state.error, login: "" },
    }));

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Check if user is admin
      const adminRef = doc(db, "admins", user.email);
      const adminSnap = await getDoc(adminRef);

      if (adminSnap.exists()) {
        const adminData = adminSnap.data();
        // Check if admin is active
        if (adminData.status === 'active') {
          // ✅ User is active admin - successful login
          set({ 
            authUser: user,
            isAdmin: true,
          });
          return user;
        } else {
          // ❌ Admin exists but is inactive
          await signOut(auth);
          set((state) => ({
            authUser: null,
            isAdmin: false,
            error: { ...state.error, login: "Access denied: Admin account is inactive" },
          }));
          throw new Error("Access denied: Admin account is inactive");
        }
      } else {
        // ❌ Not an admin - sign out immediately
        await signOut(auth);
        set((state) => ({
          authUser: null,
          isAdmin: false,
          error: { ...state.error, login: "Access denied: You are not authorized as an admin" },
        }));
        throw new Error("Access denied: You are not authorized as an admin");
      }
    } catch (err) {
      set((state) => ({
        authUser: null,
        isAdmin: false,
        error: { ...state.error, login: err.message },
      }));
      throw err;
    } finally {
      set((state) => ({
        loading: { ...state.loading, login: false },
      }));
    }
  },

  // ✅ logout user
  logout: async () => {
    set((state) => ({
      loading: { ...state.loading, logout: true },
      error: { ...state.error, logout: "" },
    }));

    try {
      await signOut(auth);
      set({ 
        authUser: null,
        isAdmin: false,
      });
    } catch (err) {
      set((state) => ({
        error: { ...state.error, logout: err.message },
      }));
      throw err;
    } finally {
      set((state) => ({
        loading: { ...state.loading, logout: false },
      }));
    }
  },

  // ✅ Clear all errors
  clearErrors: () => {
    set({
      error: {
        checkAuth: "",
        login: "",
        logout: "",
      },
    });
  },
})); 