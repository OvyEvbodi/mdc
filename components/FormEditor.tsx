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
import {useRouter} from 'next/navigation';
import { Label } from '@radix-ui/react-label';
import { Input } from './ui/input';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";



const FormEditor = (formdata:FormResponse ) => {

  const [ editMode, setEditMode ] = useState(false);
  const [ questionsList, setQuestionsList] = useState(formdata.data.form.questions);
  const [ newQuestionsList, setNewQuestionsList ] = useState<MDCQuestionChoice[]>([]);
  const questionTypes = ["input", "radio", "select", "checkbox"];
  const router = useRouter();
  const URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://mdc-nu.vercel.app";
  
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
    
      const result = await fetch(`${URL}/api/forms/edit?form-id=${formdata.data.form.id}&action=update-form`, {
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [ state, action, isPending ] = useActionState(handleFormEdit, initialState);
    
    const handleCopyFormUrl = () => {
      navigator.clipboard.writeText(`${URL}/${formdata.data.form.url}`)
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
                  <Label htmlFor="required">Published</Label>
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
                    <p>Response Link: {`${URL}/${formdata.data.form.url}`}</p>
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

export const NewForm = () => {
  const router = useRouter();
  const formSchemaObject = {
    name: z.string({required_error:`Name is required.`}).min(3, `Form name cannot be less than 3 characters`),
    description: z.string({required_error:`Name is required.`}).min(3, `Form name cannot be less than 3 characters`),
    published: z.enum(["true", "false"]),
  };
  const formDefault = {
    name: "",
    description: "",
    published: undefined
  };
  const formSchema = z.object(formSchemaObject)

  const publicForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: formDefault
  })
 
  const handleAddNewForm = async(values: z.infer<typeof formSchema>) => {
    
    const URL = process.env.API_BASE_URL ?? "";
    console.log("submitted")
    const result = await fetch(`${URL}/api/forms/edit?action=add-form`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values)
    })

    if (result.status === 200)
    toast("Form added. Please exit.")
    router.refresh();
    // // reroute to thank you page and render thank you msg
    
    console.log(values)
  }

  return (
    <div className="mb-4">
      <Dialog >
        <DialogTrigger asChild>
          <Button variant="secondary" className='cursor-pointer'>Add new form <Plus/> </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>New Form</DialogTitle>
            <DialogDescription>
              Add form metadata here. Click save when you&apos;re done, and head to the editing page to add questions.
            </DialogDescription>
          </DialogHeader>
          <Form {...publicForm}>
            <form onSubmit={publicForm.handleSubmit(handleAddNewForm)} className="space-y-8">
              <FormField
                control={publicForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Form Name</FormLabel>
                    <FormControl>
                      <Input placeholder="" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is your public form name.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={publicForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Form description</FormLabel>
                    <FormControl>
                      <Input placeholder="" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is your public form description.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={publicForm.control}
                name="published"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Form Status</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="true" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            yes
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="false" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            no
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormDescription>
                      This is your publicity status.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                  <Button type="submit">Add Form</Button>
                </DialogFooter>
            </form>
          </Form>
        </DialogContent>  
      </Dialog>
    </div>
  )
};

export default FormEditor