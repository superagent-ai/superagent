"use client";
import { useState, useRef } from "react";
import { Button, Icon, Input } from "@chakra-ui/react";
import { TbPlus } from "react-icons/tb";
import { useAsyncFn } from "react-use";

export default function UploadButton({ onSelect }) {
  const fileInputRef = useRef(null);
  const [isLoading, setIsLoading] = useState();

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    setIsLoading(true);

    if (file) {
      await onSelect(file);
      setIsLoading();
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <>
      <Input
        hidden={true}
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".pdf, .csv, .txt, .md, text/plain, application/pdf, text/csv"
      />
      <Button
        leftIcon={<Icon as={TbPlus} />}
        onClick={triggerFileInput}
        isLoading={isLoading}
        loadingText="Uploading..."
      >
        Upload file
      </Button>
    </>
  );
}
