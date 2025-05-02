"use client"
import { questions as Question } from "@prisma/client"
import { Field, Input, Portal, Select, Spinner, createListCollection } from "@chakra-ui/react"
import { useState } from "react"

// Individual form fields
const FormField = (props: Question) => {

  const [value, setValue] = useState<string[]>([])
  const collection = props.options && 
    createListCollection({
      items: props.options.map(item =>  {
        return {label: item, value: item}
      })
    });

  if (!props) return;
  

  const field = {
    input: () => (
      <Field.Root>
        <Field.Label>
          <Field.RequiredIndicator />
        </Field.Label>
        <Input placeholder={props.label} />
        <Field.HelperText />
        <Field.ErrorText />
      </Field.Root>
    ),
    select: () => (
      <Select.Root
      collection={collection}
      width="320px"
      value={value}
      onValueChange={(e) => setValue(e.value)}
    >
      <Select.HiddenSelect />
      <Select.Label>{props.label}</Select.Label>
      <Select.Control>
        <Select.Trigger>
          <Select.ValueText placeholder={props.label}/>
        </Select.Trigger>
        <Select.IndicatorGroup>
          <Select.Indicator />
        </Select.IndicatorGroup>
      </Select.Control>
      <Portal>
        <Select.Positioner>
          <Select.Content>
            {collection.items.map((option) => (
              <Select.Item item={option} key={option.value}>
                {option.label}
                <Select.ItemIndicator />
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Positioner>
      </Portal>
    </Select.Root>
    )
  }


  return props.type && field[props.type as keyof typeof field]()
}

export default FormField;