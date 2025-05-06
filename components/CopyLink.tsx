"use client"

import React from 'react';
import { toast } from 'sonner';
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from '@radix-ui/react-label';
import { Input } from './ui/input';

const CopyLink = ({url } : {url: string}) => {

  const handleCopyFormUrl = () => {
    navigator.clipboard.writeText(url)
    .then(() => toast("Form link copied to clipboard!")
  )
  };
  return (
    <Dialog>
    <DialogTrigger asChild>
    <Button variant="link" >Copy Link</Button>
    </DialogTrigger>
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Copy Form Link</DialogTitle>
        <DialogDescription>
          Anyone who has this link will be able to submit a response to this form.
        </DialogDescription>
      </DialogHeader>
      <div className="flex items-center space-x-2">
        <div className="grid flex-1 gap-2">
          <Label htmlFor="link" className="sr-only">
            Link
          </Label>
          <Input
            id="link"
            defaultValue={url}
            readOnly
          />
        </div>
        <Button onClick={handleCopyFormUrl} type="submit" size="sm" className="px-3">
          <span className="sr-only">Copy</span>
          <Copy />
        </Button>
      </div>
      <DialogFooter className="sm:justify-start">
        <DialogClose asChild>
          <Button type="button" variant="secondary">
            Close
          </Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  </Dialog>
  )
}

export default CopyLink;
