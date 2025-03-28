import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { WebcamCapture } from "../camera/WebcamCapture";
import { User, UserFormData } from "@/lib/types";
import toast from "react-hot-toast";
import Image from "next/image";

interface UserEditFormProps {
    user: User;
    onSubmit: (id: number, data: Partial<UserFormData>) => Promise<void>;
    onCancel: () => void;
}

export function UserEditForm({ user, onSubmit, onCancel }: UserEditFormProps) {
    const [formData, setFormData] = useState<UserFormData>({
        name: user.name,
        nickname: user.nickname,
        birthDate: user.birthDate,
        country: user.country,
        province: user.province,
        neighborhood: user.neighborhood,
        email: user.email,
        photo: null,
    });

    const [showCamera, setShowCamera] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);

    useEffect(() => {
        // Verificar se houve alterações
        const changed = Object.keys(formData).some((key) => {
            if (key === "photo") return formData.photo !== null;
            return (
                formData[key as keyof UserFormData] !== user[key as keyof User]
            );
        });
        setHasChanges(changed);
    }, [formData, user]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handlePhotoCapture = (file: File) => {
        setFormData((prev) => ({ ...prev, photo: file }));
        setShowCamera(false);
        toast.success("Foto atualizada com sucesso!");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setIsSubmitting(true);
            await onSubmit(user.id!, formData);
            toast.success("Perfil atualizado com sucesso!");
        } catch (error) {
            console.error(error);
            toast.error("Erro ao atualizar perfil. Tente novamente.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50 p-4"
        >
            <div className="bg-white rounded-lg p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Editar Perfil</h2>
                    <button
                        onClick={onCancel}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-4">
                        {/* Foto atual e opções de foto */}
                        <div className="space-y-2">
                            <p className="text-sm text-gray-600">
                                Foto do Perfil
                            </p>
                            <div className="flex items-center gap-4">
                                <div className="relative w-32 h-32 rounded-lg overflow-hidden">
                                    {formData.photo ? (
                                        <Image
                                            fill
                                            src={URL.createObjectURL(
                                                formData.photo,
                                            )}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <Image
                                            fill
                                            src={`http://localhost:8080${user.photoUrl}`}
                                            alt={user.name}
                                            className="w-full h-full object-cover"
                                        />
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        onClick={() => setShowCamera(true)}
                                    >
                                        Nova Foto
                                    </Button>
                                    {formData.photo && (
                                        <Button
                                            type="button"
                                            variant="secondary"
                                            onClick={() =>
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    photo: null,
                                                }))
                                            }
                                            className="text-red-500"
                                        >
                                            Remover Nova Foto
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Campos do formulário */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="Nome"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                            />
                            <Input
                                label="Apelido"
                                name="nickname"
                                value={formData.nickname}
                                onChange={handleInputChange}
                                required
                            />
                            <Input
                                label="Data de Nascimento"
                                name="birthDate"
                                type="date"
                                value={formData.birthDate}
                                onChange={handleInputChange}
                                required
                            />
                            <Input
                                label="Email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                            />
                            <Input
                                label="País"
                                name="country"
                                value={formData.country}
                                onChange={handleInputChange}
                                required
                            />
                            <Input
                                label="Província"
                                name="province"
                                value={formData.province}
                                onChange={handleInputChange}
                                required
                            />
                            <Input
                                label="Bairro"
                                name="neighborhood"
                                value={formData.neighborhood}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 mt-6">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={onCancel}
                            disabled={isSubmitting}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting || !hasChanges}
                        >
                            {isSubmitting ? "Salvando..." : "Salvar Alterações"}
                        </Button>
                    </div>
                </form>
            </div>

            <AnimatePresence>
                {showCamera && (
                    <WebcamCapture
                        onCapture={handlePhotoCapture}
                        onClose={() => setShowCamera(false)}
                    />
                )}
            </AnimatePresence>
        </motion.div>
    );
}
