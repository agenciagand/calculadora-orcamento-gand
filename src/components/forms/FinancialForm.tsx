import React from "react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useBudget } from "@/contexts/BudgetContext";
import { Settings, Minus, Plus, Calendar, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";
import { PaymentMethod, PaymentCondition } from "@/types/budget";

export function FinancialForm() {
    const { state, updateFinancial, updateQuantity } = useBudget();

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    };

    return (
        <Card className="p-6">
            <h2 className="mb-4 flex items-center text-xl font-semibold text-white">
                <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-500">
                    <Settings className="h-5 w-5" />
                </div>
                Configuração Financeira
            </h2>

            {/* Tipo de Plano */}
            <div className="mb-6">
                <label className="mb-3 block text-sm font-medium text-gray-300">Tipo de Plano</label>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div
                        onClick={() => updateFinancial("planType", "completo")}
                        className={cn(
                            "cursor-pointer rounded-lg border border-gray-700 bg-gray-800 p-4 transition-all hover:bg-gray-700",
                            state.financial.planType === "completo" && "border-indigo-500 bg-indigo-500/10 ring-1 ring-indigo-500"
                        )}
                    >
                        <h3 className={cn("font-medium", state.financial.planType === "completo" ? "text-indigo-400" : "text-gray-200")}>
                            Plano Completo
                        </h3>
                        <p className="mt-1 text-sm text-gray-400">Implementação + Manutenção mensal recorrente</p>
                    </div>
                    <div
                        onClick={() => updateFinancial("planType", "implementacao")}
                        className={cn(
                            "cursor-pointer rounded-lg border border-gray-700 bg-gray-800 p-4 transition-all hover:bg-gray-700",
                            state.financial.planType === "implementacao" && "border-indigo-500 bg-indigo-500/10 ring-1 ring-indigo-500"
                        )}
                    >
                        <h3 className={cn("font-medium", state.financial.planType === "implementacao" ? "text-indigo-400" : "text-gray-200")}>
                            Apenas Implementação
                        </h3>
                        <p className="mt-1 text-sm text-gray-400">Pagamento único com suporte de 1 ano incluído</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Valores */}
                <div>
                    <Input
                        label="Valor de Implementação (por agente)"
                        type="number"
                        icon={<span className="text-gray-400 text-sm font-bold">R$</span>}
                        value={state.financial.implementationValue}
                        onChange={(e) => updateFinancial("implementationValue", Number(e.target.value))}
                    />
                </div>

                {state.financial.planType === "completo" && (
                    <div className="animate-in fade-in slide-in-from-top-2">
                        <Input
                            label="Valor de Manutenção Mensal (por agente)"
                            type="number"
                            icon={<span className="text-gray-400 text-sm font-bold">R$</span>}
                            value={state.financial.maintenanceValue}
                            onChange={(e) => updateFinancial("maintenanceValue", Number(e.target.value))}
                        />
                    </div>
                )}

                {/* Quantidade */}
                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-300">Quantidade de Agentes</label>
                    <div className="flex items-center space-x-4">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(false)}
                            disabled={state.agents.quantity <= 1}
                        >
                            <Minus className="h-4 w-4" />
                        </Button>
                        <span className="text-xl font-bold text-white w-8 text-center">{state.agents.quantity}</span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(true)}
                            disabled={state.agents.quantity >= 20}
                        >
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* Tempo de Contrato */}
                {state.financial.planType === "completo" && (
                    <div className="animate-in fade-in slide-in-from-top-2">
                        <label className="mb-2 block text-sm font-medium text-gray-300">Tempo de Contrato</label>
                        <div className="grid grid-cols-3 gap-2">
                            {[3, 6, 12].map((months) => (
                                <Button
                                    key={months}
                                    variant={state.financial.contractDuration === months ? "primary" : "outline"}
                                    size="sm"
                                    onClick={() => updateFinancial("contractDuration", months)}
                                    className="w-full"
                                >
                                    {months} meses
                                </Button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Prazo e Pagamento */}
            <div className="mt-8 border-t border-gray-800 pt-6">
                <h3 className="mb-4 flex items-center text-lg font-medium text-white">
                    <Calendar className="mr-2 h-5 w-5 text-indigo-400" />
                    Prazo e Pagamento
                </h3>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-300">Prazo de Entrega</label>
                        <div className="mb-3 grid grid-cols-3 gap-2">
                            {[15, 30, 45].map((days) => (
                                <Button
                                    key={days}
                                    variant={state.financial.deliveryTime === days ? "primary" : "outline"}
                                    size="sm"
                                    onClick={() => updateFinancial("deliveryTime", days)}
                                    className="w-full"
                                >
                                    {days} dias
                                </Button>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <Input
                                type="number"
                                placeholder="Outro prazo"
                                className="h-9"
                                onChange={(e) => {
                                    const val = parseInt(e.target.value);
                                    if (val > 0) updateFinancial("deliveryTime", val);
                                }}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-300">Forma de Pagamento</label>
                        <div className="grid grid-cols-2 gap-2">
                            {[
                                { id: 'cartao', label: 'Cartão' },
                                { id: 'transferencia', label: 'Transferência' },
                                { id: 'pix', label: 'PIX' },
                                { id: 'boleto', label: 'Boleto' }
                            ].map((method) => (
                                <Button
                                    key={method.id}
                                    variant={state.financial.paymentMethod === method.id ? "primary" : "outline"}
                                    size="sm"
                                    onClick={() => updateFinancial("paymentMethod", method.id as PaymentMethod)}
                                    className="w-full"
                                >
                                    {method.label}
                                </Button>
                            ))}
                        </div>
                    </div>

                    <div className="md:col-span-2">
                        <label className="mb-2 block text-sm font-medium text-gray-300">Condições de Pagamento</label>
                        <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
                            {[
                                { id: 'avista', label: 'À vista (5% desc.)' },
                                { id: 'parcelado', label: 'Parcelado s/ juros' },
                                { id: 'personalizado', label: 'Personalizado' }
                            ].map((condition) => (
                                <Button
                                    key={condition.id}
                                    variant={state.financial.paymentCondition === condition.id ? "primary" : "outline"}
                                    size="sm"
                                    onClick={() => updateFinancial("paymentCondition", condition.id as PaymentCondition)}
                                    className="w-full"
                                >
                                    {condition.label}
                                </Button>
                            ))}
                        </div>
                        {state.financial.paymentCondition === 'personalizado' && (
                            <div className="mt-3 animate-in fade-in slide-in-from-top-2">
                                <Input
                                    placeholder="Descreva as condições de pagamento"
                                    value={state.financial.customPaymentCondition}
                                    onChange={(e) => updateFinancial("customPaymentCondition", e.target.value)}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Card>
    );
}
