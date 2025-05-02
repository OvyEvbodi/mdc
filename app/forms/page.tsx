import { Metadata } from "next";
import { MDCFormInterface } from "@/types/form";
import { auth } from "@/lib/auth"
import MDCForm from "@/components/Form";
import { redirect } from "next/navigation";
// import { Button } from "@/components/ui/button";
import { cookies } from "next/headers";
import { MDCUserInterface } from "@/types/user";


export const metadata: Metadata = {
  title: "My Data Collection Form listing page",
  description: "All forms appear here",
};

interface FormResponse extends Response {
  data: {
    forms: MDCFormInterface[],
    user: MDCUserInterface
  };
  sucess: string;
}

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

  const data:FormResponse = await result.json();
  console.log(data)
  

  const forms: MDCFormInterface[] | null = data ? data.data.forms : null;

  
  return (
    <main className="p-8 md:pt-12">
    
          <h1 className="bg-blue-400">Forms page</h1>
         
            {
              forms && forms.map(form => (
                <MDCForm key={form.id} {...form} />
              ))
            }
            <p>{session && JSON.stringify(session.user)}</p>
    </main>
  )
};

export default FormsPage;