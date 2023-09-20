import React from 'react';
import ReactDOM from 'react-dom';
import { useAsync } from 'react-use';
import {SuperAgentClient} from 'superagentai-js';
import { ChakraProvider, Box, useDisclosure, Avatar, IconButton, Icon } from '@chakra-ui/react';
import {TbX} from "react-icons/tb"

const ENVIRONMENT = "https://api.beta.superagent.sh"

const styles = {
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    border: "none",      
    zIndex: 1000
  },
  iframe: {
    border: "none"
  },
  modalTriggerButton: {
    position: "fixed",
    cursor: "pointer",
    bottom: "20px", 
    right: "20px",
    width: "60px",
    height: "60px",
    display: "flex",
    borderRadius: "50%",
    alignItems: "center",
    justifyContent: "center",
    backgroundPosition: "center",
    backgroundSize: "contain",
    boxShadow: "md",
  }, 
  modalContainer: {
    position: "fixed",
    cursor: "pointer",
    bottom: "90px", 
    maxWidth: "450px",
    height: "600px",
    display: "flex",
    borderRadius: "2xl",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "md",
    overflow: "hidden",
  }
}

function decodeFromIdentifier(identifier) {
  const buffer = atob(identifier, "base64")
  const combined = buffer.toString("utf8")
  const [agentId, apiKey] = combined.split("|")
  return { agentId, apiKey }
}

function SuperagentWidget({ authorization, type }) {
  const {isOpen, onClose, onOpen} = useDisclosure();

  if (!type || !authorization) {
    throw new Error(
      "Missing one of the following parameters: agentId, apiKey or type"
    );
  } 

  const {agentId, apiKey} = decodeFromIdentifier(authorization)
  const superagentClient = new SuperAgentClient({
    environment: ENVIRONMENT,
    token: apiKey
  });
  const {loading: isLoading, value: agent} = useAsync(async () => {
    return superagentClient.agent.getAgent(agentId);
  }, [agentId]);

  if (type === "inline") {
    return (
      <div style={styles.container}>
        {agent && (
          <iframe
            style={styles.iframe} 
            width="100%"
            height="100%"
            src={`https://beta.superagent.sh/share/${authorization}`} 
          />
        )}
      </div>
    );
  }

  if (type === "popup") {
    return (
      <ChakraProvider>
        {agent && !isOpen && (
          <Avatar
            zIndex={99999999}
            boxShadow="md"
            width="55px"
            height="55px"
            src={agent?.data?.avatarUrl || "https://beta.superagent.sh/logo.png"}
            _hover={{transform: "scale(1.1)", transition: "0.2s all"}} 
            position="fixed"
            cursor="pointer"
            bottom="20px"
            right="20px"
            onClick={isOpen ? onClose : onOpen}
          />
        )}
        {agent && isOpen && (
          <IconButton
            zIndex={99999999}
            boxShadow="md"
            borderRadius="full"
            icon={<Icon as={TbX} fontSize="2xl" />}
            width="55px"
            height="55px"
            src={agent?.data?.avatarUrl || "https://beta.superagent.sh/logo.png"}
            _hover={{transform: "scale(1.1)", transition: "0.2s all"}} 
            position="fixed"
            cursor="pointer"
            bottom="20px"
            right="20px"
            onClick={isOpen ? onClose : onOpen}
          />
        )}
        {agent && (
          <Box 
            {...styles.modalContainer} 
            display={!isOpen && "none"} 
            zIndex={99999999}
            minWidth={["100%", "450px"]}
            right={["0", "20px", "20px"]}
          >
            <iframe
              style={styles.iframe} 
              width="100%"
              height="100%"
              src={`https://beta.superagent.sh/share/${authorization}`} 
            />
          </Box>
        )}
      </ChakraProvider>
    )
  }
  
}

function init(options) {
  const mountElement = document.getElementById(options.mountPoint || 'superagent-chat');
  ReactDOM.render(<SuperagentWidget {...options} />, mountElement);
}

export { init };
