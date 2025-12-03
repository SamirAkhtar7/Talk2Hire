import React from 'react'
import { SignedIn,SignedOut, SignInButton,UserButton ,SignOutButton } from '@clerk/clerk-react'

function App() {


  return (
    <>
      <h1>Welcome to the app</h1>

      <SignedOut>
        <SignInButton mode="modal">
          <button>login</button>
        </SignInButton>
      </SignedOut>

      <SignedIn>
        <SignOutButton>logout</SignOutButton>
      </SignedIn>
      <UserButton />
    </>
  );
}

export default App
