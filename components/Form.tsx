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
import Link from "next/link";
import { Badge } from "@/components/ui/badge"


const MDCForm = (form: MDCFormInterface) => {
  return (
      <Card className="">
        <CardHeader>
          <CardTitle>
            <div>
              <h3>{form.name}</h3>
              <Badge variant="default">{form.published ? "Published" : "Deactivated"}</Badge>
            </div>
          </CardTitle>
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