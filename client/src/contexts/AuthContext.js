import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../config/supabase';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState(1000);
  const [username, setUsername] = useState('');

  // Generate guest username
  const generateGuestUsername = () => {
    const randomNum = Math.floor(Math.random() * 10000);
    return `guest${randomNum}`;
  };

  // Initialize auth state
  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('Error getting session:', error);
        setLoading(false);
        return;
      }
      
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        loadUserBalance(session.user.id);
        loadUsername(session.user.id);
      } else {
        // Don't auto-create guest - wait for user to choose
        // Only set guest if they've explicitly chosen guest mode (stored in sessionStorage)
        const guestMode = sessionStorage.getItem('guestMode');
        if (guestMode === 'true') {
          const guestUsername = generateGuestUsername();
          setUsername(guestUsername);
          setBalance(1000);
        }
        // Otherwise, username stays empty to show auth screen
      }
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        loadUserBalance(session.user.id);
        loadUsername(session.user.id);
        // Clear guest mode if user signs in
        sessionStorage.removeItem('guestMode');
      } else {
        // Check if guest mode was previously set
        const guestMode = sessionStorage.getItem('guestMode');
        if (guestMode === 'true') {
          const guestUsername = generateGuestUsername();
          setUsername(guestUsername);
          setBalance(1000);
        } else {
          // User signed out - clear username to show auth screen again
          setUsername('');
          setBalance(1000);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Load user balance from Supabase
  const loadUserBalance = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('user_balances')
        .select('balance')
        .eq('user_id', userId)
        .maybeSingle(); // Use maybeSingle instead of single to handle null gracefully

      if (error) {
        // Only log if it's not a "not found" error
        if (error.code !== 'PGRST116' && error.code !== '42P01') {
          console.error('Error loading balance:', error);
        }
        // Default balance on error
        setBalance(1000);
        return;
      }

      if (data && data.balance !== undefined && data.balance !== null) {
        // If balance is 0 or less, reset to 1000
        setBalance(data.balance > 0 ? data.balance : 1000);
      } else {
        // No record exists, create one with default balance
        await createUserBalance(userId, 1000);
        setBalance(1000);
      }
    } catch (error) {
      console.error('Error loading balance:', error);
      setBalance(1000);
    }
  };

  // Load username from Supabase
  const loadUsername = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('username')
        .eq('user_id', userId)
        .maybeSingle(); // Use maybeSingle instead of single to handle null gracefully

      if (error) {
        // Only log if it's not a "not found" error
        if (error.code !== 'PGRST116' && error.code !== '42P01') {
          console.error('Error loading username:', error);
        }
        return;
      }

      if (data && data.username) {
        setUsername(data.username);
      }
    } catch (error) {
      console.error('Error loading username:', error);
    }
  };

  // Create user balance record
  const createUserBalance = async (userId, initialBalance = 1000) => {
    try {
      const { error } = await supabase
        .from('user_balances')
        .insert({
          user_id: userId,
          balance: initialBalance,
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error creating balance:', error);
      }
    } catch (error) {
      console.error('Error creating balance:', error);
    }
  };

  // Update user balance in Supabase
  const updateBalance = async (newBalance) => {
    // Always update local state first for immediate UI feedback
    setBalance(newBalance);
    
    if (!user) {
      // Guest mode - just update local state, don't save
      return;
    }

    try {
      // If balance is 0 or less, reset to 1000
      const balanceToSave = newBalance > 0 ? newBalance : 1000;

      const { error } = await supabase
        .from('user_balances')
        .upsert({
          user_id: user.id,
          balance: balanceToSave,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (error) {
        console.error('Error updating balance:', error);
        // If update fails, keep the local balance but log the error
      } else if (balanceToSave !== newBalance) {
        // If balance was reset, update local state to reflect the reset
        setBalance(balanceToSave);
      }
    } catch (error) {
      console.error('Error updating balance:', error);
    }
  };

  // Sign up
  const signUp = async (email, password, username) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username
          },
          emailRedirectTo: window.location.origin
        }
      });

      if (error) throw error;

      // The trigger function should automatically create the profile and balance
      // But we need to update the profile with the username and email if they weren't set by the trigger
      if (data.user) {
        // Wait a moment for the trigger to execute
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Update the profile with username and email (trigger might have created it with defaults)
        const { error: updateError } = await supabase
          .from('user_profiles')
          .update({
            username: username,
            email: email
          })
          .eq('user_id', data.user.id);

        if (updateError) {
          console.error('Error updating profile:', updateError);
          // If update fails, try to insert (in case trigger didn't run)
          const { error: insertError } = await supabase
            .from('user_profiles')
            .insert({
              user_id: data.user.id,
              username: username,
              email: email,
              created_at: new Date().toISOString()
            });
          
          if (insertError) {
            console.error('Error inserting profile:', insertError);
          }
        }
        
        // If session exists (email confirmation disabled), set username immediately
        if (data.session) {
          setUsername(username);
          await loadUserBalance(data.user.id);
        } else {
          // Email confirmation required - show message
          return { 
            data, 
            error: null,
            requiresConfirmation: true 
          };
        }
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  // Sign in - accepts either email or username
  const signIn = async (emailOrUsername, password) => {
    try {
      let emailToUse = emailOrUsername;

      // Check if input is a username (doesn't contain @)
      if (!emailOrUsername.includes('@')) {
        // Look up email by username using RPC function
        const { data: emailData, error: rpcError } = await supabase
          .rpc('get_email_by_username', { username_to_find: emailOrUsername });

        if (rpcError || !emailData || emailData.length === 0 || !emailData[0]?.email) {
          // Fallback to direct query if RPC doesn't work
          const { data: profileData, error: profileError } = await supabase
            .from('user_profiles')
            .select('email')
            .eq('username', emailOrUsername)
            .maybeSingle();

          if (profileError || !profileData || !profileData.email) {
            return { 
              data: null, 
              error: { message: 'Invalid username or password' } 
            };
          }

          emailToUse = profileData.email;
        } else {
          emailToUse = emailData[0].email;
        }
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: emailToUse,
        password,
      });

      if (error) throw error;

      if (data.user) {
        await loadUserBalance(data.user.id);
        await loadUsername(data.user.id);
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Clear guest mode and reset
      sessionStorage.removeItem('guestMode');
      setUsername('');
      setBalance(1000);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Continue as guest
  const continueAsGuest = () => {
    const guestUsername = generateGuestUsername();
    setUsername(guestUsername);
    setBalance(1000);
    // Store guest mode in sessionStorage so it persists on refresh
    sessionStorage.setItem('guestMode', 'true');
  };

  const value = {
    user,
    session,
    loading,
    balance,
    username,
    setBalance: updateBalance,
    signUp,
    signIn,
    signOut,
    continueAsGuest,
    isGuest: !user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

