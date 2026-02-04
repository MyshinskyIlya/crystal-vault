"use client";

import { invoke } from "@tauri-apps/api/core";
import { useState } from "react";

export default function SayHi() {
    const [message, setMessage] = useState("Ожидание ответа...");
    const [duration, setDuration] = useState<number | null>(null);

    const handleClick = async () => {
        const start = performance.now(); // Засекаем время ПЕРЕД вызовом
        try {
            const response = await invoke<string>("greet_from_rust");

            const end = performance.now(); // Засекаем время ПОСЛЕ получения ответа

            setMessage(response);
            setDuration(end - start); // Вычисляем разницу
        } catch (error) {
            console.error("Ошибка вызова Rust:", error);
        }
    };

    return (
        <div className="flex flex-col gap-4 items-center">
            <p className="text-zinc-800 dark:text-zinc-200 font-mono">
                {message}
            </p>

            {duration !== null && (
                <p className="text-xs text-green-600 font-bold">
                    Время отклика: {duration.toFixed(4)} мс
                </p>
            )}

            <button
                onClick={handleClick}
                className="rounded-full bg-orange-500 px-6 py-2 text-white hover:bg-orange-600 transition-colors"
            >
                Вызвать Rust
            </button>
        </div>
    );
}
