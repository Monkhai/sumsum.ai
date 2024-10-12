"use client";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import React from "react";
import GoogleButton from "react-google-button";
import { auth } from "~/firebase/firebase";

export default function index() {
  const authProvider = new GoogleAuthProvider();
  return (
    <GoogleButton
      type="light"
      onClick={() => signInWithPopup(auth, authProvider)}
    >
      login
    </GoogleButton>
  );
}
