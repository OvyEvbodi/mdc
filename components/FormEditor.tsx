import { FormResponse } from '@/types/form';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { MDCFormEditField } from '@/components/FormField';


const FormEditor = (formdata:FormResponse ) => {
  return (
    <div>
      <section className=''>
      <ResizablePanelGroup 
        direction="horizontal"
        className="min-h-screen rounded-lg border md:min-w-[450px]"
      >
        <ResizablePanel defaultSize={25} className='bg-secondary text-secondary-foreground'>
          <div className="flex h-full items-center justify-center p-6">
            <span className="font-semibold">Sidebar</span>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={75} className=''>
          <div className="flex h-full items-center justify-center p-6">
          <Card className="min-w-full">
        <CardHeader>
          <CardTitle>{formdata.data.form.name}</CardTitle>
          <CardDescription>{formdata.data.form.name}</CardDescription>
        </CardHeader>
        <CardContent>
          <div>Link -&gt; {formdata.data.form.name}</div>
          {
            formdata.data.form.questions.map((question, index) => (
              <MDCFormEditField key={index} {...question} />
            ))
          }
        </CardContent>
        <CardFooter>
            <Button className="w-full">Save </Button>
        </CardFooter>
      </Card>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
      </section>
    </div>
  )
}

export default FormEditor