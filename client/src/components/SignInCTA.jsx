import React from "react";
import { SignedOut, SignInButton } from "@clerk/clerk-react";

const SignInCTA = ({ children }) => {
  return (
    <SignedOut>
      <SignInButton mode="modal">{children}</SignInButton>
    </SignedOut>
  );
};

export default SignInCTA;
