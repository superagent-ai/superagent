"use client";
import NextLink from "next/link";
import ky from "ky";
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
import { SUPERAGENT_VERSION } from "@/lib/constants";
import { stripe } from "@/lib/stripe";
import { analytics } from "@/lib/analytics";

export default function Register() {
  const {
    formState: { isSubmitting, errors },
    register,
    handleSubmit,
  } = useForm();
  const onSubmit = async (data) => {
    let payload = { ...data };

    if (process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY) {
      const { id: stripeCustomerId } = await stripe.customers.create({
        email: data.email,
        name: data.name,
      });

      const subscription = await stripe.subscriptions.create({
        customer: stripeCustomerId,
        items: [{ price: process.env.NEXT_PUBLIC_STRIPE_FREE_PLAN_ID }],
      });

      payload.metadata = { stripe_customer_id: stripeCustomerId, subscription };
    }

    await ky
      .post(`${process.env.NEXT_PUBLIC_SUPERAGENT_API_URL}/auth/sign-up`, {
        json: payload,
      })
      .json();

    if (process.env.NEXT_PUBLIC_SEGMENT_WRITE_KEY) {
      analytics.track("Signed Up", {
        email: data.email,
        name: data.name,
        stripe_customer_id: payload.metadata?.stripeCustomerId,
      });
    }

    await signIn("credentials", {
      email: data.email,
      password: data.password,
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
          <FormControl isInvalid={errors?.name}>
            <FormLabel>Name</FormLabel>
            <Input
              type="text"
              placeholder="Enter full name..."
              {...register("name", { required: true })}
            />
            {errors?.name && <FormErrorMessage>Enter a name</FormErrorMessage>}
          </FormControl>
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
          Create account
        </Button>
        <HStack alignItems="center" justifyContent="center" fontSize="sm">
          <Text>Already have an account?</Text>
          <NextLink passHref href="/login">
            <Text color="orange.500" textDecoration="underline">
              Login
            </Text>
          </NextLink>
        </HStack>
      </Stack>
    </Container>
  );
}
