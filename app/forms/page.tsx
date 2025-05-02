import { Metadata } from "next";
import { Container, Box, Center } from "@chakra-ui/react"

export const metadata: Metadata = {
  title: "My Data Collection Form listing page",
  description: "All forms appear here",
};

const FormsPage = () => {
  
  return (
    <main className="p-8 md:pt-12">
      <Container maxW={'6xl'} py='8' >
        <Center>
          <h1 className="bg-blue-400">Forms page</h1>
          <Box className="bg-amber-400">

          </Box>
        </Center>
      </Container>
    </main>
  )
};

export default FormsPage;