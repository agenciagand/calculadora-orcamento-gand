import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useBudget } from "@/contexts/BudgetContext";
import { Star, Plus, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const FEATURES = [
    { id: 'whatsapp', label: 'Integração com WhatsApp', description: 'Conexão direta com o WhatsApp Business' },
    { id: 'spreadsheet', label: 'Integração com Planilha', description: 'Sincronização com Google Sheets/Excel' },
    { id: 'crm', label: 'Integração com CRM', description: 'Salesforce, HubSpot ou Pipedrive' },
    { id: 'externalTools', label: '3 Ferramentas externas', description: 'Integração com até 3 sistemas' },
    { id: 'dashboard', label: 'Dashboard de Métricas', description: 'Painel com KPIs e análises' },
    { id: 'reports', label: 'Relatórios Semanais', description: 'Enviados automaticamente por e-mail' },
    { id: 'training', label: 'Treinamento da Equipe', description: '4 horas de treinamento incluídas' },
    { id: 'support247', label: 'Suporte 24/7', description: 'Atendimento prioritário a qualquer hora' },
] as const;

export function FeaturesForm() {
    const { state, toggleFeature, addCustomResource, removeCustomResource } = useBudget();
    const [customResource, setCustomResource] = useState("");

    const handleAddCustom = () => {
        if (customResource.trim()) {
            addCustomResource(customResource.trim());
            setCustomResource("");
        }
    };

    return (
        <Card className="p-6">
            <h2 className="mb-4 flex items-center text-xl font-semibold text-white">
                <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-500">
                    <Star className="h-5 w-5" />
                </div>
                Recursos Incluídos
            </h2>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {FEATURES.map((feature) => {
                    const isSelected = state.features[feature.id];
                    return (
                        <div
                            key={feature.id}
                            onClick={() => toggleFeature(feature.id)}
                            className={cn(
                                "cursor-pointer rounded-lg border border-gray-700 bg-gray-800 p-4 transition-all hover:bg-gray-700",
                                isSelected && "border-indigo-500 bg-indigo-500/10 ring-1 ring-indigo-500"
                            )}
                        >
                            <div className="flex items-start space-x-3">
                                <div className={cn(
                                    "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border border-gray-600",
                                    isSelected && "border-indigo-500 bg-indigo-500 text-white"
                                )}>
                                    {isSelected && <Check className="h-3.5 w-3.5" />}
                                </div>
                                <div>
                                    <h3 className={cn("font-medium text-sm", isSelected ? "text-indigo-300" : "text-gray-200")}>
                                        {feature.label}
                                    </h3>
                                    <p className="text-xs text-gray-400">{feature.description}</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-6 border-t border-gray-800 pt-6">
                <label className="mb-2 block text-sm font-medium text-gray-300">Recursos Personalizados</label>
                <div className="flex gap-2">
                    <Input
                        placeholder="Descreva um recurso extra"
                        value={customResource}
                        onChange={(e) => setCustomResource(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddCustom()}
                    />
                    <Button onClick={handleAddCustom}>
                        <Plus className="mr-2 h-4 w-4" />
                        Adicionar
                    </Button>
                </div>

                {state.features.customResources.length > 0 && (
                    <div className="mt-4 space-y-2">
                        {state.features.customResources.map((resource) => (
                            <div key={resource.id} className="flex items-center justify-between rounded-lg bg-gray-800 p-3">
                                <span className="text-sm text-gray-200">{resource.description}</span>
                                <button
                                    onClick={() => removeCustomResource(resource.id)}
                                    className="text-gray-500 hover:text-red-400"
                                >
                                    &times;
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Card>
    );
}
