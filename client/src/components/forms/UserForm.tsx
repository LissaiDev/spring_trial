import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { WebcamCapture } from "../camera/WebcamCapture";
import { UserFormData } from "@/lib/types";
import toast from "react-hot-toast";
import Image from "next/image";

interface UserFormProps {
    onSubmit: (data: UserFormData) => Promise<void>;
    onCancel: () => void;
}

export function UserForm({ onSubmit, onCancel }: UserFormProps) {
    const [formData, setFormData] = useState<UserFormData>({
        name: "",
        nickname: "",
        birthDate: "",
        country: "",
        province: "",
        neighborhood: "",
        email: "",
        photo: null,
    });
    const [showCamera, setShowCamera] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handlePhotoCapture = (file: File) => {
        setFormData((prev) => ({ ...prev, photo: file }));
        setShowCamera(false);
        toast.success("Foto capturada com sucesso!");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validação básica
        if (!formData.name || !formData.email || !formData.photo) {
            toast.error(
                "Por favor, preencha todos os campos obrigatórios e tire uma foto.",
            );
            return;
        }

        try {
            setIsSubmitting(true);
            await onSubmit(formData);
            toast.success("Usuário cadastrado com sucesso!");
        } catch (error) {
            console.error(error);
            toast.error("Erro ao cadastrar usuário. Tente novamente.");
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
            <div className="bg-white rounded-lg p-6 max-w-lg w-full">
                <h2 className="text-2xl font-bold mb-6">Novo Usuário</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
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

                    <div className="space-y-2">
                        <p className="text-sm text-gray-600">Foto do Usuário</p>
                        {formData.photo ? (
                            <div className="relative w-32 h-32 rounded-lg overflow-hidden">
                                <Image
                                    src={URL.createObjectURL(formData.photo)}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                    fill
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            photo: null,
                                        }))
                                    }
                                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                                >
                                    ✕
                                </button>
                            </div>
                        ) : (
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => setShowCamera(true)}
                            >
                                Tirar Foto
                            </Button>
                        )}
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
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Cadastrando..." : "Cadastrar"}
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
