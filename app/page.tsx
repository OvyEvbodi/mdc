import { getUsers } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { MDCTheme, MDCThemesList, themes } from "@/lib/mdc_themes";
import FormField from "@/components/FormField";
import SignInBtn from "@/components/GoogleSignInBtn";


export default async function Home() {
  const users = await getUsers()
  const userColor: string = users[0].name.split(" ")[0] || "default"; // add settings to 
  const theme: MDCTheme = themes[userColor as keyof MDCThemesList] ?? themes.default;
  console.log(theme)
  const quest = {
    id: "",
    label: "quest 1",
    placeholder: "holalo",
    type: "select",
    form_id: "",
    required: false,
    options: ["hi"]
}
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-roboto)]">
      <main className=" flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <section>
          {users && JSON.stringify(users)}
          MDC Home page 
          <FormField {...quest} />
        </section>
        <SignInBtn/>
  
        <div className={`${theme.colors.primary} `}>hola</div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <Link
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href=""
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Build Form
        </Link>
        <Link
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href=""
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Dashboard
        </Link>
        <Link
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href=""
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Sign In →
        </Link>
      </footer>
    </div>
  );
}
