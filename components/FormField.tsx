"use client"
import { questions as Question } from "@prisma/client"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Individual form fields
const FormField = (question: Question) => {


  if (!question) return;
  

  const field = {
    input: () => (
      <Input type={question.type} placeholder={question.placeholder} />
    ),
    select: () => (
      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder={question.placeholder} />
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
      <RadioGroup defaultValue={question.options[0]}>
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
  }


  return question.type && field[question.type as keyof typeof field]()
}

export default FormField;