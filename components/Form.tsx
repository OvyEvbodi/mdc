import {MDCFormInterface } from "@/types/form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link"

const MDCForm = (form: MDCFormInterface) => {
  return (
      <Card className="">
        <CardHeader>
          <CardTitle>{form.name}</CardTitle>
          <CardDescription>{form.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div>Link -&gt; {form.url}</div>
          <p>{JSON.stringify(form.questions)}</p>
        </CardContent>
        <CardFooter>
          <Link href={`/forms/edit/${form.id}`}>
            <Button className="w-full">View </Button>
          </Link>
        </CardFooter>
      </Card>
  )
}

export default MDCForm;