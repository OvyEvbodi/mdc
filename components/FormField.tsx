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
import { Edit, Pencil, SquareX, Trash2 } from "lucide-react";
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
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";


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

  const router = useRouter();

  const handleDeleteQuestion = async () => {
    const URL = process.env.API_BASE_URL ?? "";
    const result = await fetch(`${URL}/api/forms/edit?form-id=${props.form_id}&id=${props.id}&action=delete-question`, {
      method: "DELETE",
    })
    if (result.status === 200) toast(`Question Deleted!`)
    if (result.status === 500) toast(`Error saving question`)
      router.refresh();
    // else set error or sth
  };


  const handleQuestionEdit: (prevState: MDCQuestionChoiceResponse, formData: FormData) => Promise<MDCQuestionChoiceResponse> = async (prevState: MDCQuestionChoiceResponse, formData: FormData) => {
    const URL = process.env.API_BASE_URL ?? "";
    const result = await fetch(`${URL}/api/forms/edit?form-id=${props.form_id}&id=${props.id}&action=update-question`, {
      method: "PATCH",
      body: formData
    })
    if (result.status !== 201) console.log(result.status);
    const feedback:MDCQuestionChoiceResponse = await result.json();
    router.refresh()
    if (result.status === 201) toast(`${props.title} question succcessfully updated!`)
    if (result.status === 500) toast(`Error editing question`)

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
          editMode ? 
          (
            <div className="border space-y-4 boder-primary p-3 rounded-sm shadow inset-shadow-md">
              {state.zodErrors && <p>{JSON.stringify(state.zodErrors)}</p>}
              <form action={action} className=" space-y-3">
                <Label htmlFor="" className="text-muted">Type: {props.type}</Label>
                <div className="space-y-1">
                  <Label htmlFor="title">Title</Label>
                  <Input className="" name="title" placeholder={props.title || "Enter title"} defaultValue={props.title} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="label">Label</Label>
                  <Input className="" name="label" placeholder={props.label || "Enter label"} defaultValue={props.label} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="placeholder">Placeholder</Label>
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
                <div className="flex justify-between items-center">
                  <Button className="cursor-pointer" disabled={isPending}>Save</Button>
                  <SquareX onClick={() => setEditMode(false)} strokeWidth={1.4} size={32} className="bg-destructive p-1 text-background rounded-sm" />
                </div>
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
              <div><span className="font-bold">Type: </span>{props.type}</div>
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
      <div>
        {
          editMode ? 
          (
            <div className="border space-y-4 boder-primary p-3 rounded-sm shadow inset-shadow-md">
              {state.zodErrors && <p>{JSON.stringify(state.zodErrors)}</p>}
              <form action={action} className=" space-y-3">
                <Label htmlFor="" className="text-muted">Type: {props.type}</Label>
                <div className="space-y-1">
                  <Label htmlFor="title">Title</Label>
                  <Input className="" name="title" placeholder={props.title || "Enter title"} defaultValue={props.title} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="label">Label</Label>
                  <Input className="" name="label" placeholder={props.label || "Enter label"} defaultValue={props.label} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="placeholder">Placeholder</Label>
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
                <div>
                  <span className="font-medium">Options: </span>
                  {
                    props.options && props.options.map((option, index) => (
                    <span key={index}>{option}{props.options![props.options!.length-1] != option && ", "}</span>
                    ))
                  }
                  <NewOptions {...props} />
                </div>
                <input type="hidden" name="question_id" value={props.id} />
                <input type="hidden" name="type" value={props.type} />
                <div className="flex justify-between items-center">
                  <Button className="cursor-pointer" disabled={isPending}>Save</Button>
                  <SquareX onClick={() => setEditMode(false)} strokeWidth={1.4} size={32} className="bg-destructive p-1 text-background rounded-sm" />
                </div>
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
                <div><span className="font-bold">Type: </span>{props.type}</div>
                <div><span className="font-bold">Label: </span>{props.label}</div>
                <div><span className="font-bold">Required: </span>{props.required}</div>
                <div><span className="font-bold">Placeholder: </span>{props.placeholder}</div>
                <div>
                  <span className="font-bold">Options: </span>
                  {
                    props.options && props.options.map((option, index) => (
                    <span key={index}>{option}{props.options![props.options!.length-1] != option && ", "}</span>
                    ))
                  }
                </div>
              </div>
            </div>
          )
        }
      </div>
    ),
    radio: () => (
      <div>
        {
          editMode ? 
          (
            <div className="border space-y-4 boder-primary p-3 rounded-sm shadow inset-shadow-md">
              {state.zodErrors && <p>{JSON.stringify(state.zodErrors)}</p>}
              <form action={action} className=" space-y-3">
                <Label htmlFor="" className="text-muted">Type: {props.type}</Label>
                <div className="space-y-1">
                  <Label htmlFor="title">Title</Label>
                  <Input className="" name="title" placeholder={props.title || "Enter title"} defaultValue={props.title} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="label">Label</Label>
                  <Input className="" name="label" placeholder={props.label || "Enter label"} defaultValue={props.label} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="placeholder">Placeholder</Label>
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
                <div className="flex justify-between items-center">
                  <Button className="cursor-pointer" disabled={isPending}>Save</Button>
                  <SquareX onClick={() => setEditMode(false)} strokeWidth={1.4} size={32} className="bg-destructive p-1 text-background rounded-sm" />
                </div>
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
                <div><span className="font-bold">Type: </span>{props.type}</div>
                <div><span className="font-bold">Label: </span>{props.label}</div>
                <div><span className="font-bold">Required: </span>{props.required}</div>
                <div><span className="font-bold">Placeholder: </span>{props.placeholder}</div>
                <div>
                  <span className="font-bold">Options: </span>
                  {
                    props.options && props.options.map((option, index) => (
                    <span key={index}>{option}{props.options![props.options!.length-1] != option && ", "}</span>
                    ))
                  }
                </div>
              </div>
            </div>
          )
        }
      </div>
    ),
    checkbox: () => (
      <div>
        {
          editMode ? 
          (
            <div className="border space-y-4 boder-primary p-3 rounded-sm shadow inset-shadow-md">
              {state.zodErrors && <p>{JSON.stringify(state.zodErrors)}</p>}
              <form action={action} className=" space-y-3">
                <Label htmlFor="" className="text-muted">Type: {props.type}</Label>
                <div className="space-y-1">
                  <Label htmlFor="title">Title</Label>
                  <Input className="" name="title" placeholder={props.title || "Enter title"} defaultValue={props.title} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="label">Label</Label>
                  <Input className="" name="label" placeholder={props.label || "Enter label"} defaultValue={props.label} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="placeholder">Placeholder</Label>
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
                <div className="flex justify-between items-center">
                  <Button className="cursor-pointer" disabled={isPending}>Save</Button>
                  <SquareX onClick={() => setEditMode(false)} strokeWidth={1.4} size={32} className="bg-destructive p-1 text-background rounded-sm" />
                </div>
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
                <div><span className="font-bold">Type: </span>{props.type}</div>
                <div><span className="font-bold">Label: </span>{props.label}</div>
                <div><span className="font-bold">Required: </span>{props.required}</div>
                <div><span className="font-bold">Placeholder: </span>{props.placeholder}</div>
                <div>
                  <span className="font-bold">Options: </span>
                  {
                    props.options && props.options.map((option, index) => (
                    <span key={index}>{option}{props.options![props.options!.length-1] != option && ", "}</span>
                    ))
                  }
                </div>
              </div>
            </div>
          )
        }
      </div>
    ),
  }


  return field[props.type as keyof typeof field] && field[props.type as keyof typeof field]()
}


// --------------- New question component -----------------------------------------


export const MDCNewQuestionEditField = (props: MDCQuestionChoice) => {
  const initialState: MDCQuestionChoiceResponse = {
    data: props
  };

  const [ editMode, setEditMode ] = useState(false);
  const router = useRouter();

  const handleDeleteQuestion = async () => {
    // delete from questions or forms redux store
      router.refresh();
    // else set error or sth
  };


  const handleQuestionSave: (prevState: MDCQuestionChoiceResponse, formData: FormData) => Promise<MDCQuestionChoiceResponse> = async (prevState: MDCQuestionChoiceResponse, formData: FormData) => {
    const URL = process.env.API_BASE_URL ?? "";
    const result = await fetch(`${URL}/api/forms/edit?form-id=${props.form_id}&action=save-question`, {
      method: "PUT",
      body: formData
    })
    if (result.status === 201) toast(`Question added!`)
    if (result.status === 500) toast(`Error saving question`)
    const feedback:MDCQuestionChoiceResponse = await result.json();
    router.refresh()
    

    // delete from temporary list  

    return {
      error: feedback.error || null,
      success: feedback.success || null,
      data: feedback.data || null,
      zodErrors: feedback.zodErrors
    } as MDCQuestionChoiceResponse
  };
  const [ state, action, isPending ] = useActionState(handleQuestionSave, initialState);


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
                <div className="flex justify-between items-center">
                  <Button className="cursor-pointer" disabled={isPending}>Save</Button>
                  <SquareX onClick={() => setEditMode(false)} strokeWidth={1.4} size={32} className="bg-destructive p-1 text-background rounded-sm" />
                </div>
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
                <div><span className="font-bold">Type: </span>{props.type}</div>
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
      <div>
        {
          editMode ? 
          (
            <div className="border space-y-4 boder-primary p-3 rounded-sm shadow inset-shadow-md">
              {state.zodErrors && <p>{JSON.stringify(state.zodErrors)}</p>}
              <form action={action} className=" space-y-3">
                <Label htmlFor="" className="text-muted">Type: {props.type}</Label>
                <div className="space-y-1">
                  <Label htmlFor="title">Title</Label>
                  <Input className="" name="title" placeholder={props.title || "Enter title"} defaultValue={props.title} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="label">Label</Label>
                  <Input className="" name="label" placeholder={props.label || "Enter label"} defaultValue={props.label} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="placeholder">Placeholder</Label>
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
                <div>
                  <span className="font-medium">Options: </span>
                  {
                    props.options && props.options.map((option, index) => (
                    <span key={index}>{option}{props.options![props.options!.length-1] != option && ", "}</span>
                    ))
                  }
                  <NewOptions {...props} />
                </div>
                <input type="hidden" name="question_id" value={props.id} />
                <input type="hidden" name="type" value={props.type} />
                <div className="flex justify-between items-center">
                  <Button className="cursor-pointer" disabled={isPending}>Save</Button>
                  <SquareX onClick={() => setEditMode(false)} strokeWidth={1.4} size={32} className="bg-destructive p-1 text-background rounded-sm" />
                </div>
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
                <div><span className="font-bold">Type: </span>{props.type}</div>
                <div><span className="font-bold">Label: </span>{props.label}</div>
                <div><span className="font-bold">Required: </span>{props.required}</div>
                <div><span className="font-bold">Placeholder: </span>{props.placeholder}</div>
                <div>
                  <span className="font-bold">Options: </span>
                  {
                    props.options && props.options.map((option, index) => (
                    <span key={index}>{option}{props.options![props.options!.length-1] != option && ", "}</span>
                    ))
                  }
                </div>
              </div>
            </div>
          )
        }
      </div>
    ),
    radio: () => (
      <div>
        {
          editMode ? 
          (
            <div className="border space-y-4 boder-primary p-3 rounded-sm shadow inset-shadow-md">
              {state.zodErrors && <p>{JSON.stringify(state.zodErrors)}</p>}
              <form action={action} className=" space-y-3">
                <Label htmlFor="" className="text-muted">Type: {props.type}</Label>
                <div className="space-y-1">
                  <Label htmlFor="title">Title</Label>
                  <Input className="" name="title" placeholder={props.title || "Enter title"} defaultValue={props.title} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="label">Label</Label>
                  <Input className="" name="label" placeholder={props.label || "Enter label"} defaultValue={props.label} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="placeholder">Placeholder</Label>
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
                <div className="flex justify-between items-center">
                  <Button className="cursor-pointer" disabled={isPending}>Save</Button>
                  <SquareX onClick={() => setEditMode(false)} strokeWidth={1.4} size={32} className="bg-destructive p-1 text-background rounded-sm" />
                </div>
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
                <div><span className="font-bold">Type: </span>{props.type}</div>
                <div><span className="font-bold">Label: </span>{props.label}</div>
                <div><span className="font-bold">Required: </span>{props.required}</div>
                <div><span className="font-bold">Placeholder: </span>{props.placeholder}</div>
                <div>
                  <span className="font-bold">Options: </span>
                  {
                    props.options && props.options.map((option, index) => (
                    <span key={index}>{option}{props.options![props.options!.length-1] != option && ", "}</span>
                    ))
                  }
                </div>
              </div>
            </div>
          )
        }
      </div>
    ),
    checkbox: () => (
      <div>
        {
          editMode ? 
          (
            <div className="border space-y-4 boder-primary p-3 rounded-sm shadow inset-shadow-md">
              {state.zodErrors && <p>{JSON.stringify(state.zodErrors)}</p>}
              <form action={action} className=" space-y-3">
                <Label htmlFor="" className="text-muted">Type: {props.type}</Label>
                <div className="space-y-1">
                  <Label htmlFor="title">Title</Label>
                  <Input className="" name="title" placeholder={props.title || "Enter title"} defaultValue={props.title} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="label">Label</Label>
                  <Input className="" name="label" placeholder={props.label || "Enter label"} defaultValue={props.label} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="placeholder">Placeholder</Label>
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
                <div className="flex justify-between items-center">
                  <Button className="cursor-pointer" disabled={isPending}>Save</Button>
                  <SquareX onClick={() => setEditMode(false)} strokeWidth={1.4} size={32} className="bg-destructive p-1 text-background rounded-sm" />
                </div>
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
                <div><span className="font-bold">Type: </span>{props.type}</div>
                <div><span className="font-bold">Label: </span>{props.label}</div>
                <div><span className="font-bold">Required: </span>{props.required}</div>
                <div><span className="font-bold">Placeholder: </span>{props.placeholder}</div>
                <div>
                  <span className="font-bold">Options: </span>
                  {
                    props.options && props.options.map((option, index) => (
                    <span key={index}>{option}{props.options![props.options!.length-1] != option && ", "}</span>
                    ))
                  }
                </div>
              </div>
            </div>
          )
        }
      </div>
    ),
  }


  return field[props.type as keyof typeof field] && field[props.type as keyof typeof field]()
}

// ----------------------------options edit--------------------------

export const NewOptions = (props: MDCQuestionChoice) => {

  const router = useRouter();
  const [open, setOpen] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formSchemaObject:any = {};
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formDefault:any = {};

  const newOptions =  props.options || [];
  // newOptions.push("New Option")

  newOptions.forEach(option => {
    formDefault[option] = option;
    formSchemaObject[option] = z.string({required_error:`Please enter a value!`})
  })

  const formSchema = z.object(formSchemaObject)

  const publicForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: formDefault
  })
  
  const handleEditOptions = async (values: z.infer<typeof formSchema>) => {
      const URL = process.env.API_BASE_URL ?? "";

      console.log("ops------------")
      console.log(values)
      console.log("submitted")
      const result = await fetch(`${URL}/api/forms/edit?id=${props.id}&form-id=${props.form_id}&action=edit-options`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values)
      })
  
      if (result.status === 200) {
        toast("Options edited!")
        setOpen(false)
        router.refresh()
      }
      
    }

    // const handleAddOption = () => {
    //   newOptions.push("option--")
    // };


  return (
    <div className="mb-4">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="default" className='cursor-pointer w-full'>Edit options <Edit/> </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Options</DialogTitle>
            <DialogDescription>
              Edit question options here. Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>
          <Form {...publicForm}>
            <form onSubmit={publicForm.handleSubmit(handleEditOptions)} className="space-y-8">
              {
                newOptions.map((option, index) => (
                  <FormField
                    key={index}
                    control={publicForm.control}
                    name={option}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="enter option" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))
              }
              {/* <div className="cursor-pointer" onClick={handleAddOption}>Add option</div> */}
              <DialogFooter>
                  <Button type="submit">Save Options</Button>
                </DialogFooter>
            </form>
          </Form>
        </DialogContent>  
      </Dialog>
    </div>
  )
};

export default MDCFormField;
