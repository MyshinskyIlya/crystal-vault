"use client";

import { invoke } from "@tauri-apps/api/core";
import { useState } from "react";

export default function Vault() {
    const [password, setPassword] = useState("");
    const [key, setKey] = useState("");
    const [result, setResult] = useState("");
    const [loading, setLoading] = useState(false);
    const [rustTime, setRustTime] = useState<number | null>(null);

    // Универсальная функция для вызова Rust (DRY - Don't Repeat Yourself)
    const callRust = async (command: "encrypt_vault" | "decrypt_vault") => {
        if (!password && command === "encrypt_vault")
            return alert("Введите текст!");
        if (!result && command === "decrypt_vault")
            return alert("Сначала зашифруйте что-нибудь!");
        if (!key) return alert("Введите ключ!");

        setLoading(true);
        try {
            const response = await invoke<{
                data: string;
                duration_ms: number;
            }>(command, {
                // Если расшифровываем, берем данные из текущего результата
                password: command === "encrypt_vault" ? password : result,
                secretKey: key,
                // Если в Rust аргумент называется encryptedHex, Tauri v2 сопоставит его автоматически
                encryptedHex: result,
            });

            setResult(response.data);
            setRustTime(response.duration_ms);
        } catch (e) {
            setResult(`Ошибка: ${e}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-4 p-8 bg-zinc-900 rounded-2xl w-[400px] border border-zinc-800 shadow-2xl shadow-orange-900/10">
            <h2 className="text-white text-xl font-bold mb-2">Crystal Vault</h2>

            <input
                type="text"
                placeholder="Текст для шифрования"
                className="bg-black border border-zinc-700 p-2 rounded text-white focus:border-orange-500 outline-none transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <input
                type="password"
                placeholder="Секретный ключ"
                className="bg-black border border-zinc-700 p-2 rounded text-white focus:border-orange-500 outline-none transition-all"
                value={key}
                onChange={(e) => setKey(e.target.value)}
            />

            <div className="bg-black p-4 rounded border border-dashed border-zinc-700 min-h-[100px] flex items-center justify-center">
                <p className="text-orange-400 font-mono text-xs break-all text-center">
                    {result || "Ожидание действий..."}
                </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <button
                    onClick={() => callRust("encrypt_vault")}
                    disabled={loading}
                    className="bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 disabled:opacity-50 transition-all active:scale-95 text-sm font-semibold"
                >
                    Зашифровать
                </button>
                <button
                    onClick={() => callRust("decrypt_vault")}
                    disabled={loading}
                    className="bg-zinc-700 text-white py-2 rounded-lg hover:bg-zinc-600 disabled:opacity-50 transition-all active:scale-95 text-sm font-semibold"
                >
                    Расшифровать
                </button>
            </div>

            {rustTime && (
                <span className="text-[10px] text-zinc-500 text-center uppercase tracking-widest">
                    Rust Speed: {rustTime.toFixed(4)} ms
                </span>
            )}
        </div>
    );
}
