import { auth } from '@/lib/auth';
import { FormResponse, MDCFormInterface } from '@/types/form';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import React from 'react';
import { notFound } from 'next/navigation';
import ResponseForm from '@/components/ResponseForm';


const ResponseFormPage= async (props: {params: Promise<{formid: string}> }) => {
  const params = await props.params;

  const id = params.formid;
  const cookieHeader = (await cookies()).toString();
  const session = await auth();
  if (!session) redirect("/");

  const result = await fetch(`https://mdc-nu.vercel.app/api/forms/edit?id=${id}`, {
    method: "GET",
    body: null,
    headers: {
      Cookie: cookieHeader,
    },
  });
  if (result.status === 404) notFound();
  if  (result.status === 401) redirect("/");

  const formResult:FormResponse = await result.json();
  const formData: MDCFormInterface = formResult.data.form;

  return (
    <main>
      {
        formData.published ? 
        (
          <ResponseForm {...formData} />
        )
        :
        (
          <div className="text-secondary-foreground bg-secondary text-center w-dvw p-4 ">
            <h1>This form is currently not accepting responses.</h1>
          </div>
        )
      }
    </main>
  )
}

export default ResponseFormPage;