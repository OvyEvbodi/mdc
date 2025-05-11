"use client"

import { MDCFormInterface } from "@/types/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z, ZodType } from "zod";
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
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";


const ResponseForm = (form: MDCFormInterface) => {

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formSchemaObject:any = {};
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formDefault:any = {};

  const getOptionsSchema = (options: string[]): ZodType<string> => {
    if (options.length === 0) {
      throw new Error("Options array cannot be empty");
    }
  
    if (options.length === 1) {
      return z.literal(options[0]);
    }
  
    return z.union(
      options.map(option => z.literal(option)) as [z.ZodLiteral<string>, z.ZodLiteral<string>, ...z.ZodLiteral<string>[]]
    );
  };

  form.questions.forEach(question => {
    if ( question.required === "true"){
      formDefault[question.title] = "";
      formSchemaObject[question.title] =  question.type === "input" ?
      z.string({required_error:`${question.title} is required.`}).min(1, `Please enter a response for ${question.title}`) :
      question.type === "radio" ? 
      getOptionsSchema(question.options) :
      ""
    } 
    
  })

  const formSchema = z.object(formSchemaObject)

  const publicForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: formDefault
  })
 
  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("submitted")
    const result = await fetch(`/api/forms/responses?id=${form.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values)
    })

    // reroute to thank you page and render thank you msg
    console.log(result)
  }
  return (
    <div className="flex flex-col gap-4 justify-center items-center min-h-screen px-4 md:px-12">
      <div className="text-secondary-foreground bg-secondary text-center w-dvw p-4 ">
        <h1 className="font-bold text-xl md:text-2xl">{form.name}</h1>
        <p>{form.description}</p>
      </div>
    <Form {...publicForm}>
      <form onSubmit={publicForm.handleSubmit(onSubmit)} className="space-y-6 p-4 md:p-8 min-w-full sm:min-w-3/4">
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
                      {
                        question.type === "input" ?
                        (<Input {...field} placeholder={question.placeholder}/>)
                        : question.type === "radio" ?
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                          >
                          {
                            question.options!.map((option, index) => (
                              <FormItem key={index} className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value={option} />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    {option}
                                  </FormLabel>
                                </FormItem>
                            ))
                          }
                        </RadioGroup>
                        : question.type === "select" ?
                        (<div></div>)
                        : (<div></div>)
                      }
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
          
        <Button type="submit" className="cursor-pointer">Submit Response</Button>
      </form>
    </Form>
    </div>
  )
}

export default ResponseForm;