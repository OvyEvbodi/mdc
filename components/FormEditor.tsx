"use client"

import { FormResponse, MDCQuestionChoice } from '@/types/form';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { MDCFormEditField, MDCNewQuestionEditField } from '@/components/FormField';
import { Reorder } from 'framer-motion';
import { useActionState, useState } from 'react';
import { Pencil, Plus } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import {useRouter} from 'next/navigation';
import { Label } from '@radix-ui/react-label';
import { Input } from './ui/input';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";


const FormEditor = (formdata:FormResponse ) => {

  const [ editMode, setEditMode ] = useState(false);
  const [ questionsList, setQuestionsList] = useState(formdata.data.form.questions);
  const [ newQuestionsList, setNewQuestionsList ] = useState<MDCQuestionChoice[]>([]);
  const questionTypes = ["input", "radio", "select", "checkbox"];
  const router = useRouter();
  
  const handleAddQuestionField = (type: string) => {
    const questionInitialData = {
      type,
      title: "",
      label: "",
      placeholder: "",
      required: "",
      form_id: formdata.data.form.id,
      id: ""
    };
    console.log(questionInitialData)
    setNewQuestionsList([...newQuestionsList, {...questionInitialData}])
  };
  const initialState: FormResponse = {
    data: {
      form: formdata.data.form,
      user: formdata.data.user
    },
  };

  const handleFormEdit: (prevState: FormResponse, formData: FormData) => Promise<FormResponse> = async (prevState: FormResponse, formData: FormData) => {
      const result = await fetch(`/api/forms/edit?form-id=${formdata.data.form.id}&action=update-form`, {
        method: "PATCH",
        body: formData
      })
      if (result.status !== 201) console.log(result.status);
      const feedback:FormResponse = await result.json();
      router.refresh()
      setEditMode(false)
      if (result.status === 201) toast(`${formdata.data.form.name} form succcessfully updated!`)
      if (result.status === 500) toast(`Error editing form`)
  
      return {
        error: feedback.error || null,
        success: feedback.success || null,
        data: feedback.data || null,
        zodErrors: feedback.zodErrors
      } as FormResponse
    };
    const [ state, action, isPending ] = useActionState(handleFormEdit, initialState);
    
    const handleCopyFormUrl = () => {
      navigator.clipboard.writeText(formdata.data.form.url)
      .then(() => toast("Form link copied to clipboard!")
    )
    };
  
  return (
    <div>
      <section className=''>
      <ResizablePanelGroup 
        direction="horizontal"
        className="min-h-screen rounded-lg border md:min-w-[450px]"
      >
        <ResizablePanel defaultSize={25} className='bg-secondary text-secondary-foreground'>
          <div className="flex flex-col h-full items-center justify-baseline p-6">
            <div className="font-semibold">Fields</div>
            <div>
              {questionTypes.map((type, index) => (
                <div key={index} className='p-2 cu'>
                  <Button onClick={() => handleAddQuestionField(type)} className='cursor-pointer bg-transparent'>Add {type} field <Plus /></Button>
                </div>
              ))}
            </div>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={75} className=''>
          <div className="flex h-full items-center justify-center p-6">
          <Card className="min-w-full">
            {
              editMode ? (
                <CardHeader>
                  <form className='text-muted' action={action}>
                    <CardTitle>
                      <div className="space-y-3">
                        <Label htmlFor="name">Title: </Label>
                        <Input className="" name="name" placeholder={formdata.data.form.name || "Enter title"} defaultValue={formdata.data.form.name} />
                      </div>
                      </CardTitle>
                    <CardDescription>
                      <div className="space-y-3">
                        <Label htmlFor="description">Description: </Label>
                        <Input className="" name="description" placeholder={formdata.data.form.description || "Enter form description"} defaultValue={formdata.data.form.description} />
                      </div>
                      <div className="flex flex-col gap-3">
                  <Label htmlFor="required">Required</Label>
                  <RadioGroup defaultValue={formdata.data.form.published ? "true" : "false" } name="published">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="true" id="published-true" />
                        <Label htmlFor="published-true">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="false" id="published-false" />
                        <Label htmlFor="published-false">No</Label>
                    </div>
                  </RadioGroup>
                </div>
                    </CardDescription>
                    <Button type='submit' className="w-full cursor-pointer">Save Changes </Button>
                  </form>
                </CardHeader>
              ) : 
              (
                <CardHeader>
                  <Button onClick={()=> setEditMode(true)} className="cursor-pointer"><Pencil />Edit {formdata.data.form.name}</Button>
                  <CardTitle>Title: {formdata.data.form.name}</CardTitle>
                  <CardDescription>
                    <p>Description: {formdata.data.form.description}</p>
                    <p>Published: {JSON.stringify(formdata.data.form.published)}</p>
                    <p>Response Link: {formdata.data.form.url}</p>
                  </CardDescription>
                </CardHeader>
              )
            }
        
        <CardContent>
          <div>Questions</div>
          <div className='space-y-4'>
          <Reorder.Group values={questionsList} onReorder={setQuestionsList} >
          {
            formdata.data.form.questions.map((question, index) => (
              <Reorder.Item value={question} key={index}>
                <div className='p-3 md:m-4' >
                  <MDCFormEditField {...question} />
                </div>
              </Reorder.Item>
            ))
          }
          </Reorder.Group>
          {
            newQuestionsList.map((question, index) => (
              <div key={index} className='p-3 md:m-4'>
                <MDCNewQuestionEditField {...question} />
              </div>
            ))
          }
          </div>
          
        </CardContent>
        <CardFooter>
            <Button onClick={handleCopyFormUrl} className="w-full cursor-pointer">Copy Form Link </Button>
        </CardFooter>
      </Card>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
      </section>
    </div>
  )
}


export default FormEditor