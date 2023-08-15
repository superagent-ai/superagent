import React from 'react';
import ReactDOM from 'react-dom';
import { useAsync } from 'react-use';
import {SuperAgentClient} from 'superagentai-js';
import { ChakraProvider, Box, useDisclosure, Avatar, IconButton, Icon } from '@chakra-ui/react';
import {TbX} from "react-icons/tb"

const ENVIRONMENT = "https://api.superagent.sh"

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
    right: "20px",
    width: "450px",
    height: "600px",
    display: "flex",
    borderRadius: "lg",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "md",
    overflow: "hidden",
  }
}

function SuperagentWidget({ agentId, apiKey, type }) {
  const {isOpen, onClose, onOpen} = useDisclosure();

  if (!type || !agentId || !apiKey) {
    throw new Error(
      "Missing one of the following parameters: agentId, apiKey or type"
    );
  } 

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
            src={`https://app.superagent.sh/share?agentId=${agentId}&token=${agent.data.shareableToken}`} 
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
            boxShadow="md"
            width="55px"
            height="55px"
            src={agent?.data?.avatarUrl || "https://app.superagent.sh/logo.png"}
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
            boxShadow="md"
            borderRadius="full"
            icon={<Icon as={TbX} fontSize="2xl" />}
            width="55px"
            height="55px"
            src={agent?.data?.avatarUrl || "https://app.superagent.sh/logo.png"}
            _hover={{transform: "scale(1.1)", transition: "0.2s all"}} 
            position="fixed"
            cursor="pointer"
            bottom="20px"
            right="20px"
            onClick={isOpen ? onClose : onOpen}
          />
        )}
        {agent && (
          <Box {...styles.modalContainer} display={!isOpen && "none"}>
            <iframe
              style={styles.iframe} 
              width="100%"
              height="100%"
              src={`https://app.superagent.sh/share?agentId=${agentId}&token=${agent.data.shareableToken}`} 
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
