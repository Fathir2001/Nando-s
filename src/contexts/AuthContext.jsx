import React, { createContext, useContext, useState, useEffect } from "react";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile 
} from "firebase/auth";
import { 
  doc, 
  setDoc, 
  updateDoc, 
  getDoc, 
  serverTimestamp 
} from "firebase/firestore";
import { auth, db } from "../firebase/config";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Updated Register function with phone and address
  async function register(fullName, email, password, phone, address) {
    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile with display name
      await updateProfile(userCredential.user, {
        displayName: fullName
      });
      
      // Add user to Firestore with phone and address
      await setDoc(doc(db, "users", userCredential.user.uid), {
        uid: userCredential.user.uid,
        fullName,
        email,
        phone,
        address,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      return userCredential.user;
    } catch (error) {
      throw error;
    }
  }

  // Login function
  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  // Logout function
  function logout() {
    return signOut(auth);
  }

  // Password reset function
  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email);
  }

  // Update user profile in Firebase Auth
  async function updateUserProfile(displayName) {
    try {
      await updateProfile(currentUser, { displayName });
      setCurrentUser({ ...currentUser, displayName });
      
      // Update the Firestore document as well
      const userRef = doc(db, "users", currentUser.uid);
      await updateDoc(userRef, {
        fullName: displayName,
        updatedAt: serverTimestamp()
      });
      
      // Update local userProfile state
      if (userProfile) {
        setUserProfile({
          ...userProfile,
          fullName: displayName
        });
      }
      
      return true;
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  }

  // Update user details in Firestore (phone, address, etc.)
  async function updateUserDetails(details) {
    try {
      const userRef = doc(db, "users", currentUser.uid);
      await updateDoc(userRef, {
        ...details,
        updatedAt: serverTimestamp()
      });
      
      // Update local userProfile state
      if (userProfile) {
        setUserProfile({
          ...userProfile,
          ...details
        });
      }
      
      return true;
    } catch (error) {
      console.error("Error updating user details:", error);
      throw error;
    }
  }

  // Fetch user profile from Firestore
  async function fetchUserProfile() {
    if (!currentUser) return null;
    
    try {
      const userRef = doc(db, "users", currentUser.uid);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        const userData = userSnap.data();
        console.log("User data from Firestore:", userData);
        setUserProfile(userData);
        return userData;
      } else {
        // No profile found in Firestore, create one
        console.log("No user profile found, creating new one");
        const newProfile = {
          uid: currentUser.uid,
          fullName: currentUser.displayName || "",
          email: currentUser.email,
          phone: "",
          address: "",
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        };
        
        await setDoc(userRef, newProfile);
        setUserProfile(newProfile);
        return newProfile;
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }
  }

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        // User is signed in, fetch their profile
        await fetchUserProfile();
      } else {
        // User is signed out
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Context value
  const value = {
    currentUser,
    userProfile,
    register,
    login,
    logout,
    resetPassword,
    updateUserProfile,
    updateUserDetails,
    fetchUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}