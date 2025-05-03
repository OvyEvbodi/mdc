"use client"

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
import { Reorder } from 'framer-motion';
import { useState } from 'react';
import { Plus } from 'lucide-react';


const FormEditor = (formdata:FormResponse ) => {
  const [ questionsList, setQuestionsList] = useState(formdata.data.form.questions);
  const [ newQuestionsList, setNewQuestionsList ] = useState([]);
  const questionTypes = ["input", "radio", "select", "checkbox"];
  const questionInitialData = {
    
  };

  const handleAddQuestionField = () => {
    //
  };

  return (
    <div>
      <section className=''>
      <ResizablePanelGroup 
        direction="horizontal"
        className="min-h-screen rounded-lg border md:min-w-[450px]"
      >
        <ResizablePanel defaultSize={25} className='bg-secondary text-secondary-foreground'>
          <div className="flex flex-col h-full items-center justify-baseline p-6">
            <div className="font-semibold">Fields</div>
            <div>
              {questionTypes.map((type, index) => (
                <div key={index} className='p-2 cu'>
                  <Button onClick={handleAddQuestionField} className='cursor-pointer bg-transparent'>Add {type} field <Plus /></Button>
                </div>
              ))}
            </div>
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
          <div className='space-y-4'>
          <Reorder.Group values={questionsList} onReorder={setQuestionsList} >
          {
            formdata.data.form.questions.map((question, index) => (
              <Reorder.Item value={question} key={index}>
                <div className='p-4 m-4' >
                  <MDCFormEditField {...question} />
                </div>
              </Reorder.Item>
            ))
          }
          </Reorder.Group>
          </div>
          
        </CardContent>
        <CardFooter>
            <Button className="w-full">Publish Changes </Button>
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