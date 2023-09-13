"use client";
import { Center, Stack, Spinner } from "@chakra-ui/react";

export default function Loading() {
  return (
    <Stack flex={1} height="100vh" justifyContent="center" alignItems="center">
      <Spinner size="sm" />
    </Stack>
  );
}
