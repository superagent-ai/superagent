"use client";
import NextLink from "next/link";
import {
  Button,
  Container,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  Stack,
  Tag,
  Text,
} from "@chakra-ui/react";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import { SUPERAGENT_VERSION } from "@/lib/constants";
import { analytics } from "@/lib/analytics";

export default function Login() {
  const session = useSession();
  if (session.data) {
    window.location.href = "/";
  }
  const {
    formState: { isSubmitting, errors },
    register,
    handleSubmit,
  } = useForm();
  const onSubmit = async (data) => {
    if (process.env.NEXT_PUBLIC_SEGMENT_WRITE_KEY) {
      analytics.track("Signed In");
    }

    await signIn("credentials", {
      ...data,
      redirect: true,
      callbackUrl: "/",
    });
  };

  return (
    <Container
      maxWidth="md"
      as="form"
      onSubmit={handleSubmit(onSubmit)}
      alignSelf="center"
      justifySelf="center"
    >
      <Stack spacing={8} minHeight="100vh" justifyContent="center">
        <HStack spacing={4} justifyContent="center" alignItems="center">
          <Text as="strong" fontSize="2xl">
            Superagent
          </Text>
          <Tag size="sm">{SUPERAGENT_VERSION}</Tag>
        </HStack>
        <Stack>
          <FormControl isInvalid={errors?.email}>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              placeholder="Enter email..."
              {...register("email", { required: true })}
            />
            {errors?.email && (
              <FormErrorMessage>Invalid email</FormErrorMessage>
            )}
          </FormControl>
          <FormControl isInvalid={errors?.password}>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              placeholder="Enter password..."
              {...register("password", { required: true })}
            />
            {errors?.password && (
              <FormErrorMessage>Invalid password</FormErrorMessage>
            )}
          </FormControl>
        </Stack>
        <Button
          backgroundColor="primary.500"
          type="submit"
          isLoading={isSubmitting}
        >
          Login
        </Button>
        <HStack alignItems="center" justifyContent="center" fontSize="sm">
          <Text>New user?</Text>
          <NextLink passHref href="/register">
            <Text color="orange.500" textDecoration="underline">
              Create an account
            </Text>
          </NextLink>
        </HStack>
      </Stack>
    </Container>
  );
}
