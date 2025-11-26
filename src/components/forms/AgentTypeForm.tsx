import React from "react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { useBudget } from "@/contexts/BudgetContext";
import { Bot, MessageSquare, PhoneCall, ShoppingBag, Wrench, UserPlus, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { AgentType } from "@/types/budget";

const AGENT_OPTIONS: { id: AgentType; label: string; description: string; icon: React.ReactNode }[] = [
    {
        id: "atendimento",
        label: "Agente de Atendimento",
        description: "Atendimento automático ao cliente via chat e voz",
        icon: <MessageSquare className="h-6 w-6" />,
    },
    {
        id: "sdr",
        label: "Agente SDR",
        description: "Qualificação de leads e agendamento de reuniões",
        icon: <PhoneCall className="h-6 w-6" />,
    },
    {
        id: "vendedor",
        label: "Agente Vendedor",
        description: "Vendas automatizadas com inteligência comercial",
        icon: <ShoppingBag className="h-6 w-6" />,
    },
    {
        id: "suporte",
        label: "Agente de Suporte",
        description: "Solução de problemas técnicos e dúvidas frequentes",
        icon: <Wrench className="h-6 w-6" />,
    },
    {
        id: "clone",
        label: "Clone Digital",
        description: "Réplica digital de uma pessoa com voz e personalidade",
        icon: <UserPlus className="h-6 w-6" />,
    },
    {
        id: "personalizado",
        label: "Outro tipo",
        description: "Solução personalizada para sua necessidade",
        icon: <Sparkles className="h-6 w-6" />,
    },
];

export function AgentTypeForm() {
    const { state, toggleAgentType, setCustomAgentType } = useBudget();

    return (
        <Card className="p-6">
            <h2 className="mb-4 flex items-center text-xl font-semibold text-white">
                <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-500">
                    <Bot className="h-5 w-5" />
                </div>
                Tipo de Agente
            </h2>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {AGENT_OPTIONS.map((option) => {
                    const isSelected = state.agents.types.includes(option.id);
                    return (
                        <div
                            key={option.id}
                            onClick={() => toggleAgentType(option.id)}
                            className={cn(
                                "cursor-pointer rounded-lg border border-gray-700 bg-gray-800 p-4 transition-all hover:bg-gray-700",
                                isSelected && "border-indigo-500 bg-indigo-500/10 ring-1 ring-indigo-500"
                            )}
                        >
                            <div className="flex items-start space-x-4">
                                <div className={cn(
                                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-700 text-gray-400",
                                    isSelected && "bg-indigo-500 text-white"
                                )}>
                                    {option.icon}
                                </div>
                                <div>
                                    <h3 className={cn("font-medium text-gray-200", isSelected && "text-indigo-400")}>
                                        {option.label}
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-400">{option.description}</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {state.agents.types.includes("personalizado") && (
                <div className="mt-4 animate-in fade-in slide-in-from-top-2">
                    <Input
                        label="Especifique o tipo de agente"
                        placeholder="Descreva o tipo de agente necessário"
                        value={state.agents.customTypeDescription}
                        onChange={(e) => setCustomAgentType(e.target.value)}
                    />
                </div>
            )}
        </Card>
    );
}
