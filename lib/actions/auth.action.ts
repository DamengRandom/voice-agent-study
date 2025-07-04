'use server';

import { DEFAULT_TOKEN_EXPIRE_DURATION } from "@/constants";
import { auth, db } from "@/firebase/admin";
import { FirebaseError } from "firebase-admin/app";
import { cookies } from "next/headers";

export async function signUp(params: SignUpParams) {
  const { uid, name, email } = params;

  try {
    const userRecord = await db.collection('users').doc(uid).get();

    if (userRecord.exists) {
      return {
        success: false,
        message: 'user already detected, please sign in instead ..'
      }
    }

    await db.collection('users').doc(uid).set({
      name,
      email,
    });

    return {
      success: true,
      message: 'user account has been created successfully ~',
    }
  } catch (error) {
      console.error(`Error creating a user ${error} ...`);

      if ((error as FirebaseError)?.code === 'auth/email-already-exists') {
        return {
          success: false,
          error: 'Email already exists',
        }
      }

      return {
        success: false,
        error: 'Failed to create an user account ..',
      }
  }
}

export async function signIn(params: SignInParams) {
  const { email, idToken } = params;

  try {
    const userRecord = await auth.getUserByEmail(email);

    if (!userRecord) {
      return {
        success: false,
        message: 'user not found, please sign up instead ..',
      }
    }

    await setSessionCookie(idToken);

    return {
      success: true,
      message: 'user has been logged in successfully ~',
    }
  } catch (error) {
    console.error(`Failed to login ${error} ...`);

    return {
      success: false,
      message: "Failed to login .."
    }
  }
}

export async function setSessionCookie(idToken: string) {
  const cookieStore = await cookies();

  const sessionCookie = await auth.createSessionCookie(idToken, {
    expiresIn: DEFAULT_TOKEN_EXPIRE_DURATION * 1000
  });

  cookieStore.set('session', sessionCookie, {
    maxAge: DEFAULT_TOKEN_EXPIRE_DURATION,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    sameSite: 'lax'
  });
}

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();
  
  const sessionCookie = cookieStore.get('session')?.value;

  if (!sessionCookie) return null;

  try {
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);

    const userRecord = await db.collection('users').doc(decodedClaims.uid).get();

    if (!userRecord.exists) return null;

    return {
      ...userRecord.data(),
      id: userRecord.id,
    } as User;
  } catch (error) {
    console.error(`Failed to get current user information ${error} ..`);

    return null;
  }
}

export async function isAuthenticated() {
  const user = await getCurrentUser();

  return !!user;
}
