import React from 'react'
import { SignedIn, SignInButton, SignOutButton } from '@clerk/clerk-react'

/**
 * Render the application root with a welcome heading and Clerk authentication controls.
 *
 * The UI includes a heading "Welcome to the app", a SignInButton (modal) shown when the user is signed out,
 * and a SignOutButton shown when the user is signed in.
 * @returns {JSX.Element} The root JSX element containing the heading and conditional Clerk auth components.
 */
function App() {


  return (
    <>
      <h1>Welcome to the app</h1>

      <SignedOut>
        <SignInButton mode="modal" >
          <button>login</button>
          </SignInButton>
      </SignedOut>

      <SignedIn>
        <SignOutButton>
        
        </SignOutButton>
       
      </SignedIn>
    </>
  );
}

export default App