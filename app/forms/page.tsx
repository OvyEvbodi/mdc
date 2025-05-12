import { Metadata } from "next";
import { FormListResponse, MDCFormInterface } from "@/types/form";
import { auth } from "@/lib/auth";
import MDCForm from "@/components/Form";
import { redirect } from "next/navigation";
// import { Button } from "@/components/ui/button";
import { cookies } from "next/headers";
import { ErrorBoundary } from "react-error-boundary";


export const metadata: Metadata = {
  title: "My Data Collection Form listing page",
  description: "All forms appear here",
};


const FormsPage = async() => {

  const cookieHeader = (await cookies()).toString(); 
  const session = await auth();
  if (!session) redirect("/");
  
  const result = await fetch(`${process.env.API_BASE_URL ?? ""}/api/forms`, {
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
    <main className=" min-h-screen p-8 md:pt-12 flex flex-col justify-center items-center">
      <div className="max-w-6xl flex flex-col justify-center items-center">
        <h1 className="p-4 text-3xl font-bold">Forms page</h1>
        <div className="flex justify-center items-center">
        <ErrorBoundary fallback={<div className="text-center">Something&apos;s not right. Please refresh the page.</div>}>
          <section className="flex justify-center items-center flex-wrap gap-4 md:gap-8 ">
            {
              forms && forms.map(form => (
                <MDCForm key={form.id} {...form} />
              ))
            }
          </section>
        </ErrorBoundary>
        </div>
        
      </div>
    </main>
  )
};

export default FormsPage;
