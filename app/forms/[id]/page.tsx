import { auth } from '@/lib/auth';
import { FormResponse, MDCFormInterface } from '@/types/form';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import React from 'react';
import { notFound } from 'next/navigation';
import ResponseForm from '@/components/ResponseForm';


const ResponseFormPage = async ({params}: {
  params: {
    id: string
  }
}) => {

  const { id } = await params;
  const cookieHeader = await cookies().toString(); 
  const session = await auth();
  if (!session) redirect("/");
    
  const result = await fetch(`http://127.0.0.1:3000/api/forms/edit?id=${id}`, {
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
      <ResponseForm {...formData} />
    </main>
  )
}

export default ResponseFormPage;