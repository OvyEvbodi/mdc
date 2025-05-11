import { auth } from '@/lib/auth';
import { FormResponse } from '@/types/form';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import React from 'react';
import { notFound } from 'next/navigation';
import FormEditor from '@/components/FormEditor';


const EditFormPage = async (props: {params: Promise<{id: string}> }) => {
  const params = await props.params;

  const { id } = params;
  const cookieHeader = (await cookies()).toString(); 
  const session = await auth();
  if (!session) redirect("/");
    
  const result = await fetch(`/api/forms/edit?id=${id}`, {
    method: "GET",
    body: null,
    headers: {
      Cookie: cookieHeader,
    },
  });
  if (result.status === 404) notFound();
  if  (result.status === 401) redirect("/");

  const formdata:FormResponse = await result.json();

  return (
    <main>
      <FormEditor {...formdata} />
    </main>
  )
}

export default EditFormPage;