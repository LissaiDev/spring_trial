import { User, UserFormData } from "@/lib/types";

const API_BASE = "/api/users"; // Atualizado para usar o proxy

export const userService = {
    async getAll(): Promise<User[]> {
        const response = await fetch(API_BASE, {
            headers: {
                Accept: "application/json",
            },
        });
        if (!response.ok) throw new Error("Failed to fetch users");
        return response.json();
    },

    async getById(id: number): Promise<User> {
        const response = await fetch(`${API_BASE}/${id}`, {
            headers: {
                Accept: "application/json",
            },
        });
        if (!response.ok) throw new Error("Failed to fetch user");
        return response.json();
    },

    async create(data: UserFormData): Promise<User> {
        const formData = new FormData();
        const userData = { ...data };
        delete (userData as { photo?: File }).photo;

        formData.append("user", JSON.stringify(userData));
        if (data.photo) {
            formData.append("photo", data.photo);
        }

        const response = await fetch(API_BASE, {
            method: "POST",
            body: formData,
        });

        if (!response.ok) throw new Error("Failed to create user");
        return response.json();
    },

    async update(id: number, data: Partial<User>): Promise<User> {
        const response = await fetch(`${API_BASE}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) throw new Error("Failed to update user");
        return response.json();
    },

    async delete(id: number): Promise<void> {
        const response = await fetch(`${API_BASE}/${id}`, {
            method: "DELETE",
        });

        if (!response.ok) throw new Error("Failed to delete user");
    },
};
