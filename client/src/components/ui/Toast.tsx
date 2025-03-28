import { Toaster } from "react-hot-toast";

export function Toast() {
    return (
        <Toaster
            position="top-right"
            toastOptions={{
                duration: 3000,
                style: {
                    background: "#363636",
                    color: "#fff",
                },
                success: {
                    duration: 3000,
                    style: {
                        background: "#059669",
                        color: "#fff",
                    },
                },
                error: {
                    duration: 3000,
                    style: {
                        background: "#DC2626",
                        color: "#fff",
                    },
                },
            }}
        />
    );
}
