import {MDCFormInterface } from "@/types/form"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const MDCForm = (form: MDCFormInterface) => {
  return (
      <Card>
        <CardHeader>
          <CardTitle>{form.name}</CardTitle>
          <CardDescription>{form.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div>Link -&gt; {form.url}</div>
        </CardContent>
        <CardFooter>
          <Button>View </Button>
        </CardFooter>
      </Card>
  )
}

export default MDCForm;