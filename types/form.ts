import { questions as Question, forms as Form } from "@prisma/client"
import { MDCUserInterface } from "@/types/user";

export interface MDCFormInterface extends Form {
  questions: Question[]
}

export interface FormResponse extends Response {
  data: {
    form: MDCFormInterface,
    user: MDCUserInterface
  };
  sucess?: {message: string;}
  error?:  {message: string;}
}

export interface FormListResponse extends Response {
  data: {
    forms: MDCFormInterface[],
    user: MDCUserInterface
  };
  sucess?: {message: string;}
  error?:  {message: string;}
}

// questions--------------------
export interface MDCQuestionChoice {
  id: string;
  form_id: string;
  label?: string;
  type: string;
  required?: string;
  options?: string[];
  placeholder?: string;
  title?: string;
}

export interface formErrors {
  label?: string[] | undefined;
  placeholder?: string[] | undefined;
  title?: string[] | undefined;
}

export interface MDCQuestionChoiceResponse  {
  error?: {message: string;}
  success?: {message: string;}
  data?: MDCQuestionChoice;
  zodErrors?: formErrors;
}