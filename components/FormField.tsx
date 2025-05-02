"use client"
import { questions as Question } from "@prisma/client"

// Individual form fields
const FormField = (props: Question) => {


  if (!props) return;
  

  const field = {
    input: () => (
      <p>input</p>
    ),
    select: () => (
      <p>select</p>
    )
  }


  return props.type && field[props.type as keyof typeof field]()
}

export default FormField;