"use client";

import React from "react";
import { BudgetProvider } from "@/contexts/BudgetContext";
import { ClientForm } from "@/components/forms/ClientForm";
import { AgentTypeForm } from "@/components/forms/AgentTypeForm";
import { FinancialForm } from "@/components/forms/FinancialForm";
import { FeaturesForm } from "@/components/forms/FeaturesForm";
import { BudgetSummary } from "@/components/forms/BudgetSummary";
import { Calculator } from "lucide-react";

export default function Home() {
    return (
        <BudgetProvider>
            <div className="min-h-screen bg-[#111827] text-gray-100 font-sans selection:bg-indigo-500/30">
                <div className="container mx-auto px-4 py-8 max-w-7xl">
                    {/* Header */}
                    <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-800 pb-6">
                        <div>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent flex items-center gap-3">
                                <Calculator className="h-8 w-8 text-indigo-500" />
                                Calculadora de Orçamentos
                            </h1>
                            <p className="mt-2 text-gray-400 text-lg">
                                Crie orçamentos personalizados para soluções em IA de alta performance.
                            </p>
                        </div>
                        <div className="text-right hidden md:block">
                            <div className="flex items-center gap-3 justify-end">
                                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                                    <span className="font-bold text-xl">G</span>
                                </div>
                                <div>
                                    <h2 className="text-xl font-semibold text-white">Agência Gand</h2>
                                    <p className="text-indigo-400 text-sm font-medium">Soluções em IA</p>
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* Main Content */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column - Forms */}
                        <div className="lg:col-span-2 space-y-8">
                            <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <ClientForm />
                            </section>

                            <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
                                <AgentTypeForm />
                            </section>

                            <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
                                <FinancialForm />
                            </section>

                            <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
                                <FeaturesForm />
                            </section>
                        </div>

                        {/* Right Column - Summary */}
                        <div className="lg:col-span-1">
                            <section className="animate-in fade-in slide-in-from-right-4 duration-700">
                                <BudgetSummary />
                            </section>
                        </div>
                    </div>

                    {/* Footer */}
                    <footer className="mt-16 border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
                        <p>&copy; {new Date().getFullYear()} Agência Gand. Todos os direitos reservados.</p>
                    </footer>
                </div>
            </div>
        </BudgetProvider>
    );
}
