"use client";
import { Inter } from "next/font/google";
import { Flex, useColorModeValue } from "@chakra-ui/react";

const inter = Inter({ subsets: ["latin"] });

export default function AppContainer({ children }) {
  const backgroundColor = useColorModeValue("#131416", "#131416");

  return (
    <Flex
      minHeight="100vh"
      backgroundColor={backgroundColor}
      className={inter.className}
    >
      {children}
    </Flex>
  );
}
