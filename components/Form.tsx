import {MDCFormInterface } from "@/types/form"
import { Box } from "@chakra-ui/react";


const MDCForm = (form: MDCFormInterface) => {
  return (
    <Box>
      <h1>{form.name}</h1>
    </Box>
  )
}

export default MDCForm;