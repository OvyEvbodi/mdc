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
import CopyLink from "@/components/CopyLink";
import { Globe, SquareArrowOutUpRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";


const MDCForm = (form: MDCFormInterface) => {
  
  return (
    <Card className="w-[380px]">
      <CardHeader>
        <CardTitle>{form.name}</CardTitle>
        <CardDescription>{form.description}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className=" flex items-center space-x-4 rounded-md border p-4">
          <Globe  />          
        <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">
              Publicity Status
            </p>
            <p className="text-sm text-muted-foreground">
              This form is {form.published ? "currently accepting responses." : "not open to the public."}
            </p>
          </div>
          <Badge variant={form.published ? "secondary" : "destructive"}>{form.published ? "Published" : "Deactivated"}</Badge>
        </div>
        <div>
        <CopyLink url={`${process.env.API_BASE_URL}/forms/${form.id}`}  />
        </div>
      </CardContent>
      <CardFooter>
        <Link href={`/forms/edit/${form.id}`} className="w-full">
          <Button className="w-full cursor-pointer">
          <SquareArrowOutUpRight  />View Form
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}


export const MDCFormSkeleton = () => {
  return (
    <div className="flex flex-col space-y-3">
      <Skeleton className="h-[125px] w-[250px] rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  )
}


export default MDCForm;