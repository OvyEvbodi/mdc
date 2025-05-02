import { auth } from '@/lib/auth';
import { FormResponse } from '@/types/form';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import React from 'react';
import { notFound } from 'next/navigation';


const EditFormPage = async ({params}: {
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

  const data:FormResponse = await result.json();
  // console.log(data)

  return (
    <main>
      <section>
        <div>{id}</div>
        <div>{JSON.stringify(data)}</div>
      </section>
    </main>
  )
}

export default EditFormPage;