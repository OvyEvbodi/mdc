import { signIn } from "@/lib/auth"

const SignInBtn = () => {

  

  const handleSignIn = async () => {
    "use server"
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

export default SignInBtn
