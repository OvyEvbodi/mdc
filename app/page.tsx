// import { getUsers } from "@/lib/utils";
// import { MDCTheme, MDCThemesList, themes } from "@/lib/mdc_themes";
import LandingPage from "@/components/LandingPage";


export default async function Home() {
  // const users = await getUsers()
  // const userColor: string = users[0].name.split(" ")[0] || "default"; // add settings to 
  // const theme: MDCTheme = themes[userColor as keyof MDCThemesList] ?? themes.default;
  // console.log(theme)
  
  return (
    <div className=" font-[family-name:var(--font-roboto)]">
      <main>
        <LandingPage />
      </main>
        
    </div>
  );
}
