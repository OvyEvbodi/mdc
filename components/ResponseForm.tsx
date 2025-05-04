"use client"

import { MDCFormInterface } from "@/types/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { MDCFormEditField } from "./FormField";



const ResponseForm = (form: MDCFormInterface) => {

  const formSchemaObject:any = {};
  const formDefault:any = {};

  form.questions.forEach(question => {
    formDefault[question.title] = "";
    formSchemaObject[question.title] = z.string().min(3, {
      message: `${question.title} must be at least 3 characters.`,
    });
  })

  const formSchema = z.object(formSchemaObject)

  const publicForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: formDefault
  })
 
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
  }
  return (
    <Form {...publicForm}>
      <form onSubmit={publicForm.handleSubmit(onSubmit)} className="space-y-8">
        {
          form.questions.map((question, index) => (
            <div key={index}>
              <FormField
          control={publicForm.control}
          name={question.title}
          render={({ field }) => (
            <FormItem>
              <FormLabel key={index}>{question.title}</FormLabel>
              <FormControl>
                <MDCFormEditField {...question} />
              </FormControl>
              <FormDescription>
                {question.label}
              </FormDescription>
              <FormMessage />
              </FormItem>
              )}
              />
            </div>
          ))
        }  
          
        <Button type="submit">Submit Response</Button>
      </form>
    </Form>
  )
}

export default ResponseForm;