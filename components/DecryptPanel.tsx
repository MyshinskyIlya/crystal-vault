"use client";
import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";

export default function DecryptPanel() {
    const [hex, setHex] = useState("");
    const [key, setKey] = useState("");
    const [result, setResult] = useState("");
    const [error, setError] = useState<string | null>(null); // Состояние для ошибки

    const handleAction = async () => {
        setError(null); // Сбрасываем старую ошибку
        setResult(""); // Очищаем прошлый результат

        try {
            const res = await invoke<{ data: string }>("decrypt_vault", {
                encryptedHex: hex,
                secretKey: key,
            });
            setResult(res.data);
        } catch (e) {
            // e — это строка, которую мы отправили из Rust через Err()
            setError(String(e));
        }
    };

    return (
        <div className="flex flex-col gap-3 animate-in fade-in duration-500">
            <textarea
                placeholder="Вставьте зашифрованный код..."
                className={`bg-zinc-800 p-3 rounded-lg text-white border h-24 resize-none outline-none transition-all ${error ? "border-red-500" : "border-zinc-700 focus:border-blue-500"}`}
                onChange={(e) => setHex(e.target.value)}
            />
            <input
                type="password"
                placeholder="Ключ доступа"
                className="bg-zinc-800 p-3 rounded-lg text-white border border-zinc-700 focus:border-blue-500 outline-none"
                onChange={(e) => setKey(e.target.value)}
            />

            <button
                onClick={handleAction}
                className="bg-blue-600 hover:bg-blue-700 p-3 rounded-lg font-bold"
            >
                Расшифровать
            </button>

            {/* Вывод ошибки */}
            {error && (
                <div className="p-3 bg-red-900/20 border border-red-800/50 rounded-lg text-red-400 text-xs italic">
                    ⚠️ {error}
                </div>
            )}

            {/* Вывод результата */}
            {result && (
                <div className="mt-2 p-3 bg-green-900/20 border border-green-800/50 rounded-lg text-green-400 break-all font-mono">
                    {result}
                </div>
            )}
        </div>
    );
}
