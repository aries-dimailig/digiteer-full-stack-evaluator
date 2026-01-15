import { useEffect, useState } from 'react';
import api from "./api/axios";
import {
  useDisclosure,
  Stack,
  Heading, List, ListItem, Button, IconButton, Text,
  Menu, MenuButton, MenuList, MenuItem,
  Spinner
} from "@chakra-ui/react";
import { ChevronDownIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons';

// Task modals
import AddTaskModal from './modals/task/Add';
import UpdateTaskModal from './modals/task/Update';
import { DeleteTaskModal } from './modals/task/Delete';

// User modals
import CreateUserModal from './modals/user/Create';
import UpdateUserModal from './modals/user/Update';
import DeleteUserModal from './modals/user/Delete';


function Tasks() {
  const [isLoading, setIsLoading] = useState(false);
  const [refetch, setRefetch] = useState(true);

  const [users, setUsers] = useState([]);

  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);

  const userModal = {
    create: useDisclosure(),
    update: useDisclosure(),
    delete: useDisclosure(),
  }

  const taskModal = {
    create: useDisclosure(),
    update: useDisclosure(),
    delete: useDisclosure(),
  }

  useEffect(() => {
    handleFetchUsers()
  }, [refetch]);

  const handleFetchUsers = async () => {
    setIsLoading(true);

    try {
      const { data } = await api.get('/users');
      console.log("Fetched users:", data);
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
      setRefetch(false);
    }
  }

  return (
    <Stack w={"100%"} h={"100vh"} align={"center"} mt={10}>
      <Heading color={"white"}>Task Manager</Heading>
      {/* user modals */}
      <CreateUserModal
        {...userModal.create}
        setRefetch={setRefetch}
      />
      <UpdateUserModal
        {...userModal.update}
        setRefetch={setRefetch}
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
      />
      <DeleteUserModal
        {...userModal.delete}
        setRefetch={setRefetch}
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
      />

      {/* task modals */}
      <AddTaskModal
        {...taskModal.create}
        selectedUser={selectedUser}
        setRefetch={setRefetch}
        setSelectedUser={setSelectedUser}
      />
      <UpdateTaskModal
        {...taskModal.update}
        selectedTask={selectedTask}
        setRefetch={setRefetch}
        setSelectedTask={setSelectedTask}
      />
      <DeleteTaskModal
        {...taskModal.delete}
        selectedTask={selectedTask}
        setRefetch={setRefetch}
        setSelectedTask={setSelectedTask}
      />

      <Button colorScheme='green' onClick={userModal.create.onOpen} mb={5}>Create User</Button>
      <Stack direction={"row"} whiteSpace={"wrap"} w={"100%"} justify={"center"} gap={5}>
        {
          isLoading ? (
            <Spinner size={"xl"} color={"white"} />
          )
            : users.length > 0 && users.map(user => (
              <Stack key={user.id} border={"1px solid"} borderColor={"whiteAlpha.500"} p={3} align={"center"} rounded={"md"}>
                <Stack direction={"row"} justify={"center"} align={"center"} gap={5}>
                  <Heading size={"md"} color={"white"}>{user.email}</Heading>
                  <Menu>
                    <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                      Actions
                    </MenuButton>
                    <MenuList>
                      <MenuItem onClick={() => {
                        setSelectedUser(user);
                        taskModal.create.onOpen()
                      }}>Add Task</MenuItem>
                      <MenuItem
                        onClick={() => {
                          setSelectedUser(user);
                          userModal.update.onOpen()
                        }}
                      >Update</MenuItem>
                      <MenuItem
                        onClick={() => {
                          setSelectedUser(user);
                          userModal.delete.onOpen()
                        }}
                      >Delete</MenuItem>
                    </MenuList>
                  </Menu>
                </Stack>
                <List w={"100%"} spacing={3}>
                  {
                    user.tasks.length > 0 && user.tasks.map(task => (
                      <ListItem key={task.id} color={"white"} w={"100%"}>
                        <Stack w={"100%"} direction={"row"} justify={"space-between"} align={"center"}>
                          <Text>{task.title} {task.isDone ? '✅' : '❌'}</Text>
                          <Stack direction={"row"} justify={"center"} align={"center"}>
                            <IconButton
                              size={"sm"}
                              colorScheme={'green'}
                              icon={<EditIcon />}
                              onClick={() => {
                                setSelectedTask(task)
                                taskModal.update.onOpen()
                              }}
                            />
                            <IconButton
                              size={"sm"}
                              colorScheme='red'
                              icon={<DeleteIcon />}
                              onClick={() => {
                                setSelectedTask(task)
                                taskModal.delete.onOpen()
                              }}
                            />
                          </Stack>
                        </Stack>
                      </ListItem>
                    ))
                  }
                </List>
              </Stack>
            ))
        }
      </Stack>
    </Stack>
  );
}

export default Tasks;
