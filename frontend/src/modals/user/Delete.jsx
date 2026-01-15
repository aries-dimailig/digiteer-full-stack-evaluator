import { useState } from 'react';
import api from '../../api/axios';
import {
    useToast,
    Button,
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalCloseButton
} from "@chakra-ui/react";

export default function DeleteUserModal({ isOpen, onClose, setRefetch, selectedUser, setSelectedUser }) {
    const toast = useToast();

    const [isLoading, setIsLoading] = useState(false);

    const handleDeleteUser = async () => {
        setIsLoading(true);

        try {
            await api.delete(`/users/${selectedUser.id}`)
            toast({
                title: "User deleted.",
                description: "The user has been deleted successfully.",
                status: "success",
                duration: 5000,
                isClosable: true,
            })
        } catch (error) {
            toast({
                title: "Error deleting user.",
                description: "There was an error deleting the user.",
                status: "error",
                duration: 5000,
                isClosable: true,
            })
        } finally {
            setRefetch(prev => !prev)
            setIsLoading(false);
            setSelectedUser(null);
            onClose();
        }
    }
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Delete user {selectedUser?.email || ""}?</ModalHeader>
                <ModalCloseButton />

                <ModalFooter>
                    <Button colorScheme='red' mr={3} onClick={handleDeleteUser} isLoading={isLoading}>
                        Delete
                    </Button>
                    <Button variant='ghost' onClick={onClose} isLoading={isLoading}>Close</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}