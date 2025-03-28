import { useState, useCallback } from "react";
import { User, UserFormData } from "@/lib/types";
import { userService } from "@/services/userService";

export function useUsers() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchUsers = useCallback(async () => {
        try {
            setLoading(true);
            const data = await userService.getAll();
            setUsers(data);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setLoading(false);
        }
    }, []);

    const updateUser = useCallback(
        async (id: number, data: Partial<UserFormData>) => {
            try {
                setLoading(true);
                const updatedUser = await userService.update(id, data);
                setUsers((prev) =>
                    prev.map((user) => (user.id === id ? updatedUser : user)),
                );
                setError(null);
                return updatedUser;
            } catch (err) {
                setError(
                    err instanceof Error ? err.message : "An error occurred",
                );
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [],
    );

    const createUser = useCallback(async (data: UserFormData) => {
        try {
            setLoading(true);
            const newUser = await userService.create(data);
            setUsers((prev) => [...prev, newUser]);
            setError(null);
            return newUser;
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteUser = useCallback(async (id: number) => {
        try {
            setLoading(true);
            await userService.delete(id);
            setUsers((prev) => prev.filter((user) => user.id !== id));
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        users,
        loading,
        error,
        fetchUsers,
        createUser,
        deleteUser,
        updateUser,
    };
}
