import { User } from "@/lib/types";
import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";
import { ConfirmationModal } from "./ui/ConfirmationModal";

interface UserCardProps {
    user: User;
    onDelete: (id: number) => Promise<void>;
    onEdit: (user: User) => void;
}

export function UserCard({ user, onDelete, onEdit }: UserCardProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);

    const handleDelete = async () => {
        if (user.id) {
            setIsDeleting(true);
            try {
                await onDelete(user.id);
            } finally {
                setIsDeleting(false);
            }
        }
    };

    return (
        <>
            <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{
                    opacity: 1,
                    scale: 1,
                    filter: isDeleting ? "brightness(0.7)" : "brightness(1)",
                }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
                className="relative rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md"
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
            >
                {isDeleting && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-lg">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1 }}
                            className="w-8 h-8 border-3 border-white border-t-transparent rounded-full"
                        />
                    </div>
                )}

                <div className="flex items-center gap-4">
                    {user.photoUrl && (
                        <div className="relative h-16 w-16 overflow-hidden rounded-full">
                            <Image
                                src={`http://localhost:8080${user.photoUrl}`}
                                alt={user.name}
                                fill
                                className="object-cover"
                            />
                        </div>
                    )}
                    <div className="flex-1">
                        <motion.h3
                            className="text-lg font-semibold"
                            animate={{
                                color: isHovered ? "#2563EB" : "#000000",
                            }}
                        >
                            {user.name}
                        </motion.h3>
                        <p className="text-sm text-gray-600">
                            @{user.nickname}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => onEdit(user)}
                            className="text-blue-500 hover:text-blue-700"
                            disabled={isDeleting}
                        >
                            Editar
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setShowConfirmation(true)}
                            className="text-red-500 hover:text-red-700"
                            disabled={isDeleting}
                        >
                            Excluir
                        </motion.button>
                    </div>
                </div>
                <motion.div
                    className="mt-4 grid grid-cols-2 gap-2 text-sm"
                    animate={{ opacity: isHovered ? 1 : 0.8 }}
                >
                    <p>
                        <strong>Email:</strong> {user.email}
                    </p>
                    <p>
                        <strong>País:</strong> {user.country}
                    </p>
                    <p>
                        <strong>Província:</strong> {user.province}
                    </p>
                    <p>
                        <strong>Bairro:</strong> {user.neighborhood}
                    </p>
                </motion.div>
            </motion.div>

            <ConfirmationModal
                isOpen={showConfirmation}
                onClose={() => setShowConfirmation(false)}
                onConfirm={handleDelete}
                title="Confirmar exclusão"
                message={`Tem certeza que deseja excluir o usuário ${user.name}? Esta ação não pode ser desfeita.`}
            />
        </>
    );
}
