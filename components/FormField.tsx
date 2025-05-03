"use client"
import { questions as Question } from "@prisma/client"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { MDCQuestionChoice, MDCQuestionChoiceResponse } from "@/types/form"
import { Button } from "@/components/ui/button";
import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";


// Individual form fields
const MDCFormField = (question: Question) => {

  if (!question) return;
  
  const field = {
    input: () => (
      <Input type={question.type} placeholder={question.placeholder} name={question.id} />
    ),
    select: () => (
      <Select name={question.id}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder={question.placeholder} />
          <Label htmlFor={question.id}>{question.label}</Label>
        </SelectTrigger>
        <SelectContent>
          {
            question.options.map((option, index) => (
              <SelectItem key={index} value={option}>{option}</SelectItem>
            ))
          }
        </SelectContent>
      </Select>
    ),
    radio: () => (
      <RadioGroup defaultValue={question.options[0]} name={question.id}>
        {
          question.options.map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <RadioGroupItem value={option} id={question.id} />
               <Label htmlFor={question.id}>{question.label}</Label>
            </div>
          ))
        }
      </RadioGroup>
    ),
    check: () => (
      <div className="flex items-center space-x-2">
        <Checkbox id={question.id} />
        <Label
          htmlFor={question.id}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {question.label}
        </Label>
      </div>
    )
  }


  return question.type && field[question.type as keyof typeof field]()
}


export const MDCFormEditField = (props: MDCQuestionChoice) => {
  const initialState: MDCQuestionChoiceResponse = {
    data: props,
  };

  const [ editMode, setEditMode ] = useState(false);
  const [ showAlert, setShowAlert ] = useState(false);

  const router = useRouter();

  const handleDeleteQuestion = async () => {
    console.log("handler block---------------")
    // show popup to confirm first
    setShowAlert(true)
    const result = await fetch(`/api/forms/edit?form-id=${props.form_id}&id=${props.id}&action=delete-question`, {
      method: "DELETE",
    })
    console.log("fetch ran")
    if (result.status === 200)
      router.refresh();
    // else set error or sth
  };

  const handleQuestionEdit: (prevState: MDCQuestionChoiceResponse, formData: FormData) => Promise<MDCQuestionChoiceResponse> = async (prevState: MDCQuestionChoiceResponse, formData: FormData) => {
    const result = await fetch(`/api/forms/edit?form-id=${props.form_id}&id=${props.id}`, {
      method: "PATCH",
      body: formData
    })
    if (result.status !== 201) console.log(result.status);
    const feedback:MDCQuestionChoiceResponse = await result.json();
    router.refresh();

    return {
      error: feedback.error || null,
      success: feedback.success || null,
      data: feedback.data || null,
      zodErrors: feedback.zodErrors
    } as MDCQuestionChoiceResponse
  };
  const [ state, action, isPending ] = useActionState(handleQuestionEdit, initialState);


  if (!props.type) return;

  const field = {
    input: () => (
      <div>
        {
          editMode ? (
            <div className="border space-y-4 boder-primary p-3 rounded-sm shadow inset-shadow-md">
              {state.zodErrors && <p>{JSON.stringify(state.zodErrors)}</p>}
              <form action={action} className=" space-y-3">
                <div>
                <Input className="" name="title" placeholder={props.title || "Enter title"} defaultValue={props.title} />
                </div>
                <div>
                  <Input className="" name="label" placeholder={props.label || "Enter label"} defaultValue={props.label} />
                </div>
                <div>
                  <Input className="" name="placeholder" placeholder={props.placeholder || "Enter placeholder"} defaultValue={props.placeholder} />
                </div>
                <div className="flex flex-col gap-3">
                <Label htmlFor="required">Required</Label>
                  <RadioGroup defaultValue={props.required} name="required">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="true" id={props.id} />
                        <Label htmlFor="required">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="false" id={props.id} />
                        <Label htmlFor="required">No</Label>
                    </div>
                  </RadioGroup>
                </div>
                <input type="hidden" name="question_id" value={props.id} />
                <input type="hidden" name="type" value={props.type} />
                <Button className="cursor-pointer" disabled={isPending}>Save</Button>
              </form>
            </div>
          ) : 
          (
            <div className="border boder-primary p-3 rounded-sm shadow inset-shadow-md">
              <div className="flex justify-between">
                <Button onClick={()=> setEditMode(true)} className="cursor-pointer"><Pencil /></Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                      <Button variant={"destructive"} className="cursor-pointer"><Trash2 /></Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete {props.title}?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the question and its response data from our servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handleDeleteQuestion} >Continue</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
              </div>
              <div>
                <div><span className="font-bold">Title: </span>{props.title}</div>
                <div><span className="font-bold">Label: </span>{props.label}</div>
                <div><span className="font-bold">Required: </span>{props.required}</div>
                <div><span className="font-bold">Placeholder: </span>{props.placeholder}</div>
              </div>
            </div>
          )
        }
      </div>
    ),
    select: () => (
      <div className="border boder-primary p-3 rounded-sm shadow inset-shadow-md">
        <div>Title: {props.title}</div>
        <div>Label:</div>
        <div>Required:</div>
        <div>Placeholder:</div>
        <div>Options: loop</div>
      </div>
    ),
    radio: () => (
      <div className="border boder-primary p-3 rounded-sm shadow inset-shadow-md">
        <div>Title: {props.title}</div>
        <div>Label:</div>
        <div>Required:</div>
        <div>Placeholder:</div>
        <div>Options: loop</div>
      </div>

    ),
    check: () => (
      <div className="border boder-primary p-3 rounded-sm shadow inset-shadow-md">
        <div>Title: {props.title}</div>
        <div>Label:</div>
        <div>Required:</div>
        <div>Placeholder:</div>
        <div>Options: loop</div>
      </div>
    ),
  }


  return props.type && field[props.type as keyof typeof field]()
}

export default MDCFormField;
