import { useRef, useState } from 'react';
import api from '../../api/axios';
import {
    useToast,
    Button,
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton,
    FormControl, FormLabel, Input
} from "@chakra-ui/react";

export default function AddTaskModal({ isOpen, onClose, setRefetch, setSelectedUser, selectedUser }) {
    const initialFocusRef = useRef(null)
    const toast = useToast();

    const [isLoading, setIsLoading] = useState(false);
    const [payload, setPayload] = useState({
        title: "",
    });

    const handleAddTask = async () => {
        setIsLoading(true);
        try {
            await api.post('/tasks', {
                Title: payload.title,
                IsDone: false,
                UserId: selectedUser.id,
            });

            toast({
                title: "Task created.",
                description: "The task has been created successfully.",
                status: "success",
                duration: 5000,
                isClosable: true,
            })

            onClose();
        } catch (error) {
            console.log("Error creating task:", error);
            toast({
                title: "Error creating task.",
                description: "There was an error creating the task.",
                status: "error",
                duration: 5000,
                isClosable: true,
            })
        } finally {
            setIsLoading(false);
            setRefetch(prev => !prev);
            setSelectedUser(null);
        }
    }
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Create Task</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <FormControl mb={4}>
                        <FormLabel>Title</FormLabel>
                        <Input placeholder='Enter title' ref={initialFocusRef} onChange={(e) => setPayload(prev => ({ ...prev, title: e.target.value }))} />
                    </FormControl>
                </ModalBody>

                <ModalFooter>
                    <Button colorScheme='blue' mr={3} onClick={handleAddTask} isLoading={isLoading}>
                        Create
                    </Button>
                    <Button variant='ghost' onClick={onClose} isLoading={isLoading}>Close</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}