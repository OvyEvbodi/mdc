import { questions as question, forms as form } from "@prisma/client"
import { MDCUserInterface } from "@/types/user";

export interface MDCFormInterface extends form {
  questions: question[]
}

export interface FormResponse extends Response {
  data: {
    forms: MDCFormInterface[],
    user: MDCUserInterface
  };
  sucess?: {message: string;}
  error?:  {message: string;}
}
