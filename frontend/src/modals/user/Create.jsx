import { useRef, useState } from 'react';
import api from '../../api/axios';
import {
    useToast,
    Button,
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton,
    FormControl, FormLabel, Input
} from "@chakra-ui/react";

export default function CreateUserModal({ isOpen, onClose, setRefetch }) {
    const initialFocusRef = useRef(null)
    const toast = useToast();

    const [isLoading, setIsLoading] = useState(false);
    const [payload, setPayload] = useState({
        email: "",
        password: ""
    });

    const handleCreateUser = async () => {
        setIsLoading(true);
        try {
            // get users to determine new user ID
            const { data: users } = await api.get('/users');

            // create new user
            await api.post('/users', {
                Id: users.length + 1,
                Email: payload.email,
                PasswordHash: payload.password
            });

            toast({
                title: "User created.",
                description: "The user has been created successfully.",
                status: "success",
                duration: 5000,
                isClosable: true,
            })

            onClose();
        } catch (error) {
            toast({
                title: "Error creating user.",
                description: "There was an error creating the user.",
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
                <ModalHeader>Create User</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <FormControl mb={4}>
                        <FormLabel>Email</FormLabel>
                        <Input placeholder='Enter email' ref={initialFocusRef} onChange={(e) => setPayload(prev => ({ ...prev, email: e.target.value }))} />
                    </FormControl>
                    <FormControl mb={4}>
                        <FormLabel>Password</FormLabel>
                        <Input type='password' placeholder='Enter password' onChange={(e) => setPayload(prev => ({ ...prev, password: e.target.value }))} />
                    </FormControl>
                </ModalBody>

                <ModalFooter>
                    <Button colorScheme='blue' mr={3} onClick={handleCreateUser} isLoading={isLoading}>
                        Create
                    </Button>
                    <Button variant='ghost' onClick={onClose} isLoading={isLoading}>Close</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}