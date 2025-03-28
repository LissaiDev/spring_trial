"use client";

import { useState, useEffect } from "react";
import { useUsers } from "@/hooks/useUsers";
import { Input } from "@/components/ui/Input";
import { UserForm } from "@/components/forms/UserForm";
import { UserFormData } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { UserCard } from "@/components/UserCard";
import { FiltersPanel } from "@/components/filters/FiltersPanel";
import { Toast } from "@/components/ui/Toast";
import { User } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { UserEditForm } from "@/components/forms/UserEditForm";

export default function Home() {
    const { users, fetchUsers, deleteUser, createUser, updateUser } =
        useUsers();
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [showFilters, setShowFilters] = useState(false);
    const [showNewUserForm, setShowNewUserForm] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [filters, setFilters] = useState({
        searchTerm: "",
        country: "",
        province: "",
        minAge: 0,
        maxAge: 100,
    });

    const handleUpdateUser = async (
        id: number,
        data: Partial<UserFormData>,
    ) => {
        try {
            await updateUser(id, data);
            setEditingUser(null);
            fetchUsers();
            toast.success("Usuário atualizado com sucesso!");
        } catch (error) {
            toast.error("Erro ao atualizar usuário");
            throw error;
        }
    };

    const handleCreateUser = async (data: UserFormData) => {
        try {
            await createUser(data);
            setShowNewUserForm(false);
            fetchUsers();
            toast.success("Usuário cadastrado com sucesso!");
        } catch (error) {
            toast.error("Erro ao cadastrar usuário");
            throw error;
        }
    };

    const handleDeleteUser = async (id: number) => {
        try {
            await deleteUser(id);
            toast.success("Usuário excluído com sucesso!");
        } catch (error) {
            console.error(error);
            toast.error("Erro ao excluir usuário. Tente novamente.");
        }
    };

    const uniqueCountries = [...new Set(users.map((user) => user.country))];
    const uniqueProvinces = [...new Set(users.map((user) => user.province))];

    const calculateAge = (birthDate: string) => {
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    };

    const handleFilterChange = (filterName: string, value: any) => {
        setFilters((prev) => ({
            ...prev,
            [filterName]: value,
        }));
    };

    const clearFilters = () => {
        setFilters({
            searchTerm: "",
            country: "",
            province: "",
            minAge: 0,
            maxAge: 100,
        });
        toast.success("Filtros limpos!");
    };

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    useEffect(() => {
        const filtered = users.filter((user) => {
            const age = calculateAge(user.birthDate);
            const matchesSearch = Object.values(user)
                .join(" ")
                .toLowerCase()
                .includes(filters.searchTerm.toLowerCase());
            const matchesCountry =
                !filters.country || user.country === filters.country;
            const matchesProvince =
                !filters.province || user.province === filters.province;
            const matchesAge = age >= filters.minAge && age <= filters.maxAge;

            return (
                matchesSearch && matchesCountry && matchesProvince && matchesAge
            );
        });

        setFilteredUsers(filtered);
    }, [users, filters]);

    return (
        <main className="container mx-auto px-4 py-8">
            <Toast />
            <div className="mb-8 space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold">Usuários Cadastrados</h1>
                    <div className="flex gap-4">
                        <Button onClick={() => setShowNewUserForm(true)}>
                            Novo Usuário
                        </Button>
                        <Button onClick={() => setShowFilters(!showFilters)}>
                            {showFilters
                                ? "Ocultar Filtros"
                                : "Mostrar Filtros"}
                        </Button>
                    </div>
                </div>

                <div className="flex gap-4">
                    <Input
                        type="search"
                        placeholder="Pesquisar usuários..."
                        value={filters.searchTerm}
                        onChange={(e) =>
                            handleFilterChange("searchTerm", e.target.value)
                        }
                        className="max-w-md"
                    />
                </div>

                <AnimatePresence>
                    {showFilters && (
                        <FiltersPanel
                            filters={filters}
                            uniqueCountries={uniqueCountries}
                            uniqueProvinces={uniqueProvinces}
                            onFilterChange={handleFilterChange}
                            onClearFilters={clearFilters}
                        />
                    )}
                </AnimatePresence>
            </div>

            <motion.div
                layout
                className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
                <AnimatePresence>
                    {filteredUsers.map((user) => (
                        <UserCard
                            onEdit={setEditingUser}
                            key={user.id}
                            user={user}
                            onDelete={handleDeleteUser}
                        />
                    ))}
                </AnimatePresence>
            </motion.div>

            <AnimatePresence>
                {showNewUserForm && (
                    <UserForm
                        onSubmit={handleCreateUser}
                        onCancel={() => setShowNewUserForm(false)}
                    />
                )}
                {editingUser && (
                    <UserEditForm
                        user={editingUser}
                        onSubmit={handleUpdateUser}
                        onCancel={() => setEditingUser(null)}
                    />
                )}
            </AnimatePresence>
            {filteredUsers.length === 0 && (
                <div className="text-center text-gray-500">
                    Nenhum usuário encontrado com os filtros selecionados
                </div>
            )}
        </main>
    );
}
