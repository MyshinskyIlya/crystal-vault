"use client";
import { useState } from "react";
import EncryptPanel from "@/components/EncryptPanel";
import DecryptPanel from "@/components/DecryptPanel";

export default function Home() {
    const [activeTab, setActiveTab] = useState<"encrypt" | "decrypt">(
        "encrypt",
    );

    return (
        <main className="flex items-center justify-center min-h-screen bg-black text-zinc-200 p-4">
            <div className="w-full max-w-[450px] bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
                {/* Шапка и Переключатель */}
                <div className="p-6 pb-0">
                    <h1 className="text-2xl font-black bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent mb-6">
                        CRYSTAL VAULT
                    </h1>

                    <div className="flex bg-black/40 p-1 rounded-xl mb-6">
                        <button
                            onClick={() => setActiveTab("encrypt")}
                            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === "encrypt" ? "bg-zinc-800 text-white shadow-lg" : "text-zinc-500 hover:text-zinc-300"}`}
                        >
                            Шифрование
                        </button>
                        <button
                            onClick={() => setActiveTab("decrypt")}
                            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === "decrypt" ? "bg-zinc-800 text-white shadow-lg" : "text-zinc-500 hover:text-zinc-300"}`}
                        >
                            Дешифрование
                        </button>
                    </div>
                </div>

                {/* Контент вкладок */}
                <div className="p-6 pt-0 min-h-[350px]">
                    {activeTab === "encrypt" ? (
                        <EncryptPanel />
                    ) : (
                        <DecryptPanel />
                    )}
                </div>

                <div className="bg-zinc-800/30 p-4 text-center border-t border-zinc-800/50">
                    <p className="text-[10px] text-zinc-600 uppercase tracking-[0.2em]">
                        Powered by Myshinsky - piskonuh228_RUS | 2026y
                    </p>
                </div>
            </div>
        </main>
    );
}
