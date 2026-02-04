"use client";
import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";

export default function EncryptPanel() {
    const [text, setText] = useState("");
    const [key, setKey] = useState("");
    const [result, setResult] = useState("");

    const handleAction = async () => {
        try {
            const res = await invoke<{ data: string }>("encrypt_vault", {
                password: text,
                secretKey: key,
            });
            setResult(res.data);
        } catch (e) {
            alert(e);
        }
    };

    return (
        <div className="flex flex-col gap-3 animate-in fade-in duration-500">
            <textarea
                placeholder="Что нужно зашифровать?"
                className="bg-zinc-800 p-3 rounded-lg text-white border border-zinc-700 h-24 resize-none focus:border-orange-500 outline-none"
                onChange={(e) => setText(e.target.value)}
            />
            <input
                type="password"
                placeholder="Ключ доступа"
                className="bg-zinc-800 p-3 rounded-lg text-white border border-zinc-700 focus:border-orange-500 outline-none"
                onChange={(e) => setKey(e.target.value)}
            />
            <button
                onClick={handleAction}
                className="bg-orange-600 hover:bg-orange-700 p-3 rounded-lg font-bold transition-all"
            >
                Зашифровать
            </button>
            {result && (
                <div className="mt-2 p-3 bg-black/50 border border-dashed border-zinc-700 rounded-lg break-all text-xs text-orange-400 font-mono">
                    {result}
                </div>
            )}
        </div>
    );
}
