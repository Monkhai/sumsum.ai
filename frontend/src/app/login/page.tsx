"use client";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import React from "react";
import GoogleButton from "react-google-button";
import { auth } from "~/firebase/firebase";
import { motion } from "framer-motion";

export default function index() {
  const authProvider = new GoogleAuthProvider();
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-8">
      <div className="relative flex flex-col items-center gap-2">
        <motion.h1
          initial={{ opacity: 0, bottom: -50, scale: 0.5 }}
          animate={{ opacity: 1, bottom: 0, scale: 1 }}
          transition={{ duration: 1 }}
          className="relative text-2xl font-medium"
        >
          Welcome to SumSum.ai
        </motion.h1>
        <motion.h2
          initial={{ opacity: 0, bottom: -50, scale: 0.5 }}
          animate={{ opacity: 1, bottom: 0, scale: 1 }}
          className="relative text-lg font-medium"
          transition={{ delay: 0.5, duration: 1 }}
        >
          Simplifying your workflow with AI-powered markdown summaries
        </motion.h2>
      </div>
      <GoogleButton
        type="dark"
        style={{
          borderRadius: "10px",
          overflow: "hidden",
        }}
        onClick={() => signInWithPopup(auth, authProvider)}
      >
        login
      </GoogleButton>
    </div>
  );
}
