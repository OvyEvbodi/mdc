
import { signIn , signOut} from "@/lib/auth"

export const SignInBtn = () => {

  const handleSignIn = async () => {
    await signIn("google")
  };

  return (
    <>
      <form action={handleSignIn}>
        <button 
          type="submit"
          className="bg-blue-600 p-2 cursor-pointer"
        >
          Sign in with Google
        </button>
      </form>
    </>
  )
}

export const SignOutBtn = () => {

  const handleSignOut = async () => {
    await signOut()
  };

  return (
    <>
      <form action={handleSignOut}>
        <button 
          type="submit"
          className="bg-blue-600 p-2 cursor-pointer"
        >
          Sign Out
        </button>
      </form>
    </>
  )
}

