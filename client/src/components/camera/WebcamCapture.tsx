import { useCallback, useRef, useState } from "react";
import Webcam from "react-webcam";
import { Button } from "../ui/Button";
import { motion, AnimatePresence } from "framer-motion";

interface WebcamCaptureProps {
    onCapture: (imageFile: File) => void;
    onClose: () => void;
}

export function WebcamCapture({ onCapture, onClose }: WebcamCaptureProps) {
    const webcamRef = useRef<Webcam>(null);
    const [isCaptured, setIsCaptured] = useState(false);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);

    const capture = useCallback(() => {
        const imageSrc = webcamRef.current?.getScreenshot();
        if (imageSrc) {
            setCapturedImage(imageSrc);
            setIsCaptured(true);
        }
    }, [webcamRef]);

    const retake = () => {
        setCapturedImage(null);
        setIsCaptured(false);
    };

    const confirm = () => {
        if (capturedImage) {
            // Converter base64 para File
            fetch(capturedImage)
                .then((res) => res.blob())
                .then((blob) => {
                    const file = new File([blob], "webcam-photo.jpg", {
                        type: "image/jpeg",
                    });
                    onCapture(file);
                });
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4"
        >
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Capturar Foto</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        ✕
                    </button>
                </div>

                <div className="relative aspect-video overflow-hidden rounded-lg">
                    <AnimatePresence mode="wait">
                        {!isCaptured ? (
                            <Webcam
                                audio={false}
                                ref={webcamRef}
                                screenshotFormat="image/jpeg"
                                className="w-full"
                                videoConstraints={{
                                    width: 720,
                                    height: 480,
                                    facingMode: "user",
                                }}
                            />
                        ) : (
                            <motion.img
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                src={capturedImage || ""}
                                alt="Captured"
                                className="w-full"
                            />
                        )}
                    </AnimatePresence>
                </div>

                <div className="flex justify-center gap-4 mt-4">
                    {!isCaptured ? (
                        <Button onClick={capture}>Tirar Foto</Button>
                    ) : (
                        <>
                            <Button variant="secondary" onClick={retake}>
                                Tirar Novamente
                            </Button>
                            <Button onClick={confirm}>Confirmar</Button>
                        </>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
