import * as React from "react";

import { SignUpButton,SignInButton,UserButton,SignedOut, SignedIn } from "@clerk/clerk-react";


const LoginPage = () => {
  return (
    <div className="sign-in-container">
      <div>
      
        <SignedOut>
          <SignInButton mode="modal">Sign In</SignInButton>
          <SignUpButton mode="modal">Sign Up</SignUpButton>
        </SignedOut>
        <SignedIn>
          <UserButton/>
        </SignedIn>
      </div>
    </div>
  );
};

export default LoginPage;
