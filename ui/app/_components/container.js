"use client";
import { Inter } from "next/font/google";
import { Flex, useColorModeValue } from "@chakra-ui/react";

const inter = Inter({ subsets: ["latin"] });

export default function AppContainer({ children }) {
  //const backgroundColor = useColorModeValue("#131416", "#131416");

  return (
    <Flex
      maxHeight="100vh"
      overflow="hidden"
      //backgroundColor={backgroundColor}
      className={inter.className}
      flexDirection={["column", "row", "row", "row"]}
    >
      {children}
    </Flex>
  );
}
