"use client"

import React from 'react'
import { toast } from 'sonner';
import { Button } from "@/components/ui/button";

const CopyLink = ({url } : {url: string}) => {

  const handleCopyFormUrl = () => {
    navigator.clipboard.writeText(url)
    .then(() => toast("Form link copied to clipboard!")
  )
  };
  return (
    <Button onClick={handleCopyFormUrl} variant="link">Copy Link</Button>
  )
}

export default CopyLink;
