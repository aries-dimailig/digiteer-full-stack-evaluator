import { useState } from 'react';
import api from '../../api/axios';
import {
    useToast,
    Button,
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalCloseButton
} from "@chakra-ui/react";

export function DeleteTaskModal({ isOpen, onClose, setRefetch, selectedTask, setSelectedTask }) {
    const toast = useToast();

    const [isLoading, setIsLoading] = useState(false);

    const handleDeleteTask = async () => {
        setIsLoading(true);

        try {
            await api.delete(`/tasks/${selectedTask.id}`)
            toast({
                title: "Task deleted.",
                description: "The task has been deleted successfully.",
                status: "success",
                duration: 5000,
                isClosable: true,
            })
        } catch (error) {
            toast({
                title: "Error deleting task.",
                description: "There was an error deleting the task.",
                status: "error",
                duration: 5000,
                isClosable: true,
            })
        } finally {
            setRefetch(prev => !prev)
            setIsLoading(false);
            setSelectedTask(null);
            onClose();
        }
    }
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Delete task {selectedTask?.title || ""}?</ModalHeader>
                <ModalCloseButton />

                <ModalFooter>
                    <Button colorScheme='red' mr={3} onClick={handleDeleteTask} isLoading={isLoading}>
                        Delete
                    </Button>
                    <Button variant='ghost' onClick={onClose} isLoading={isLoading}>Close</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}