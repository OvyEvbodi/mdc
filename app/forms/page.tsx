import { Metadata } from "next";
import { FormListResponse, MDCFormInterface } from "@/types/form";
import { auth } from "@/lib/auth"
import MDCForm from "@/components/Form";
import { redirect } from "next/navigation";
// import { Button } from "@/components/ui/button";
import { cookies } from "next/headers";


export const metadata: Metadata = {
  title: "My Data Collection Form listing page",
  description: "All forms appear here",
};


const FormsPage = async() => {

  const cookieHeader = cookies().toString(); 
  const session = await auth();
  if (!session) redirect("/");
  
  const result = await fetch("http://127.0.0.1:3000/api/forms", {
    method: "GET",
    body: null,
    headers: {
      Cookie: cookieHeader,
    },
  });
  if (result.status !== 200) redirect("/");

  const data:FormListResponse = await result.json();
  

  const forms: MDCFormInterface[] | null = data ? data.data.forms : null;

  
  return (
    <main className="p-8 md:pt-12 max-w-6xl flex flex-col justify-center items-center">
    
          <h1 className="bg-blue-400">Forms page</h1>
          <section className="flex flex-wrap gap-4 md:gap-8">
            {
              forms && forms.map(form => (
                <MDCForm key={form.id} {...form} />
              ))
            }
          </section>
            
            <p>{session && JSON.stringify(session.user)}</p>
    </main>
  )
};

export default FormsPage;