import { FormResponse, MDCFormInterface } from '@/types/form';
import React from 'react';
import { notFound } from 'next/navigation';
import ResponseForm from '@/components/ResponseForm';


const ResponseFormPage= async (props: {params: Promise<{formid: string}> }) => {
  const params = await props.params;
  const URL = process.env.API_BASE_URL ?? "";

  const id = params.formid;

  const result = await fetch(`${URL}/api/forms/responses?id=${id}`, {
    method: "GET"
  });
  if (result.status === 404) notFound();

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