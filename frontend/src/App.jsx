import './App.css'
import Tasks from "./Tasks"

import { Stack, Heading } from '@chakra-ui/react';

function App() {

  return (
    <Stack w={"100vw"} h={"100vh"} align={"center"} bgColor={"#242424"} p={5}>
      <Heading color={"white"}>📝 React Task Evaluator</Heading>
      <Tasks />
    </Stack>
  );

  return (
    <div className="app">
      <h1>📝 React Task Evaluator</h1>
      <Tasks />
    </div>
  );
}

export default App
