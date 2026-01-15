import { useEffect, useRef, useState } from 'react';
import api from '../../api/axios';
import {
    useToast,
    Button,
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton,
    FormControl, FormLabel, Input, Select
} from "@chakra-ui/react";

export default function UpdateTaskModal({ isOpen, onClose, setRefetch, selectedTask, setSelectedTask }) {
    const initialFocusRef = useRef(null)
    const toast = useToast();

    const [isLoading, setIsLoading] = useState(false);
    const [payload, setPayload] = useState({
        title: "",
        isDone: false
    });

    useEffect(() => {
        if (selectedTask) {
            setPayload({
                title: selectedTask.title,
                isDone: selectedTask.isDone
            })
        }
    }, [selectedTask]);

    const handleUpdateTask = async () => {
        setIsLoading(true);
        try {
            await api.put(`/tasks/${selectedTask.id}`, {
                Title: payload.title,
                IsDone: payload.isDone
            });

            toast({
                title: "Task updated.",
                description: "The task has been updated successfully.",
                status: "success",
                duration: 5000,
                isClosable: true,
            })

            setSelectedTask(null);
            onClose();
        } catch (error) {
            toast({
                title: "Error updating task.",
                description: "There was an error updating the task.",
                status: "error",
                duration: 5000,
                isClosable: true,
            })
        } finally {
            setIsLoading(false);
            setRefetch(prev => !prev)
        }
    }
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Update Task</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <FormControl mb={4}>
                        <FormLabel>Title</FormLabel>
                        <Input placeholder={payload.title} ref={initialFocusRef} onChange={(e) => setPayload(prev => ({ ...prev, title: e.target.value }))} />
                    </FormControl>
                    <FormControl mb={4}>
                        <FormLabel>Status</FormLabel>
                        <Select value={payload.isDone} onChange={(e) => setPayload(prev => ({ ...prev, isDone: e.target.value === 'true' }))}>
                            <option value={true}>Done</option>
                            <option value={false}>Not Done</option>
                        </Select>
                    </FormControl>
                </ModalBody>

                <ModalFooter>
                    <Button colorScheme='blue' mr={3} onClick={handleUpdateTask} isLoading={isLoading}>
                        Update
                    </Button>
                    <Button variant='ghost' onClick={onClose} isLoading={isLoading}>Close</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}