
import { signIn, signOut } from 'next-auth/react';

// import { signIn , signOut} from "@/lib/auth"

export const SignInBtn = () => {

  // const handleSignIn = async () => {
  //   await signIn("google")
  // };

  return (
    <div>
      <button 
        onClick={() => signIn('google')}
        type="submit"
        className="bg-secondary text-secondary-foreground sm:px-6 rounded-sm p-2 cursor-pointer"
      >
        Sign in with Google
      </button>
    </div>
  )
}

export const SignOutBtn = () => {

  // const handleSignOut = async () => {
  //   await signOut()
  // };

  return (
    <div>
      <button 
        onClick={() => signOut()}
        type="submit"
        className="bg-secondary text-secondary-foreground p-2 sm:px-6 rounded-sm cursor-pointer"
      >
        Sign Out
      </button>
    </div>
  )
}
