import { useEffect, useRef, useState } from 'react';
import api from '../../api/axios';
import {
    useToast,
    Button,
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton,
    FormControl, FormLabel, Input
} from "@chakra-ui/react";

export default function UpdateUserModal({ isOpen, onClose, setRefetch, selectedUser, setSelectedUser }) {
    const initialFocusRef = useRef(null)
    const toast = useToast();

    const [isLoading, setIsLoading] = useState(false);
    const [payload, setPayload] = useState({
        email: "",
        password: ""
    });

    useEffect(() => {
        if (selectedUser) {
            setPayload({
                email: selectedUser.email,
                password: ""
            })
        }
    }, [selectedUser]);

    const handleCreateUser = async () => {
        setIsLoading(true);
        try {
            // get users to determine new user ID
            // create new user
            await api.put(`/users/${selectedUser.id}`, {
                Email: payload.email,
                PasswordHash: payload.password
            });

            toast({
                title: "User updated.",
                description: "The user has been updated successfully.",
                status: "success",
                duration: 5000,
                isClosable: true,
            })

            setSelectedUser(null);
            onClose();
        } catch (error) {
            toast({
                title: "Error updating user.",
                description: "There was an error updating the user.",
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
                <ModalHeader>Update User</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <FormControl mb={4}>
                        <FormLabel>Email</FormLabel>
                        <Input placeholder={payload.email} ref={initialFocusRef} onChange={(e) => setPayload(prev => ({ ...prev, email: e.target.value }))} />
                    </FormControl>
                    <FormControl mb={4}>
                        <FormLabel>Password</FormLabel>
                        <Input type='password' placeholder='Enter password' onChange={(e) => setPayload(prev => ({ ...prev, password: e.target.value }))} />
                    </FormControl>
                </ModalBody>

                <ModalFooter>
                    <Button colorScheme='blue' mr={3} onClick={handleCreateUser} isLoading={isLoading}>
                        Update
                    </Button>
                    <Button variant='ghost' onClick={onClose} isLoading={isLoading}>Close</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}