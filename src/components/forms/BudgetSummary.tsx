import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useBudget } from "@/contexts/BudgetContext";
import { FileDown, Mail, Save, Tag, CheckCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";
// import { generatePDF } from "@/lib/pdfGenerator"; // Will implement next

export function BudgetSummary() {
    const { state, totals, applyCoupon, updateObservations } = useBudget();
    const [couponInput, setCouponInput] = useState("");
    const [showCoupon, setShowCoupon] = useState(false);
    const [orderNumber, setOrderNumber] = useState("000000");

    useEffect(() => {
        // Generate random order number on mount
        const now = new Date();
        const random = Math.floor(Math.random() * 100).toString().padStart(2, '0');
        const num = `${now.getFullYear().toString().slice(-2)}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}${random}`;
        setOrderNumber(num);
    }, []);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    };

    const handleApplyCoupon = () => {
        applyCoupon(couponInput);
    };

    const handleGeneratePDF = async () => {
        // Dynamic import to avoid SSR issues with jspdf
        const { generatePDF } = await import("@/lib/pdfGenerator");
        generatePDF(state, totals, orderNumber);
    };

    const handleSaveDraft = () => {
        // Already handled by context effect, but we can add a toast here
        alert("Rascunho salvo automaticamente!");
    };

    return (
        <div className="sticky top-6 space-y-6">
            <Card className="p-6 border-t-4 border-t-indigo-500">
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-white">Resumo do Orçamento</h2>
                    <span className="rounded-full bg-indigo-500/20 px-3 py-1 text-sm font-medium text-indigo-300">
                        #{orderNumber}
                    </span>
                </div>

                <div className="space-y-4 divide-y divide-gray-800">
                    {/* Client */}
                    <div className="pt-4 first:pt-0">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</p>
                        <p className="mt-1 font-medium text-white">{state.client.companyName || "-"}</p>
                        <p className="text-sm text-gray-400">{state.client.responsibleName || "-"}</p>
                    </div>

                    {/* Service */}
                    <div className="pt-4">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Serviço</p>
                        <p className="mt-1 font-medium text-white">
                            {state.agents.types.length > 0
                                ? `${state.agents.types.length} tipo(s) de agente`
                                : "Nenhum agente selecionado"}
                        </p>
                        <p className="text-sm text-gray-400">{state.agents.quantity} unidade(s)</p>
                    </div>

                    {/* Totals */}
                    <div className="pt-4">
                        <div className="rounded-lg bg-gradient-to-r from-indigo-900/50 to-purple-900/50 p-4 border border-indigo-500/20">
                            <p className="text-sm text-gray-300">Valor Total do Projeto</p>
                            <p className="text-3xl font-bold text-white">{formatCurrency(totals.total)}</p>

                            <div className="mt-2 flex justify-between text-xs text-gray-400">
                                <span>Impl: {formatCurrency(totals.implementation)}</span>
                                <span>
                                    {state.financial.planType === 'completo'
                                        ? `Recorrência: ${formatCurrency(totals.maintenanceTotal)}`
                                        : 'Pagamento único'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Details */}
                    <div className="pt-4">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Detalhes</p>
                        <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-sm">
                            <div>
                                <p className="text-gray-500">Manutenção/mês</p>
                                <p className="text-gray-300">
                                    {state.financial.planType === 'completo'
                                        ? formatCurrency(totals.monthlyMaintenance)
                                        : 'Incluso (1 ano)'}
                                </p>
                            </div>
                            <div>
                                <p className="text-gray-500">Contrato</p>
                                <p className="text-gray-300">
                                    {state.financial.planType === 'completo'
                                        ? `${state.financial.contractDuration} meses`
                                        : 'Vitalício'}
                                </p>
                            </div>
                            <div>
                                <p className="text-gray-500">Prazo</p>
                                <p className="text-gray-300">{state.financial.deliveryTime} dias</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Pagamento</p>
                                <p className="text-gray-300 capitalize">{state.financial.paymentMethod}</p>
                            </div>
                        </div>
                    </div>

                    {/* Features */}
                    <div className="pt-4">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Recursos</p>
                        <ul className="space-y-1">
                            {Object.entries(state.features).filter(([key, val]) => key !== 'customResources' && val).length === 0 && state.features.customResources.length === 0 ? (
                                <li className="flex items-center text-sm text-gray-500">
                                    <Info className="mr-2 h-4 w-4" />
                                    Nenhum recurso selecionado
                                </li>
                            ) : (
                                <>
                                    {Object.entries(state.features).map(([key, value]) => {
                                        if (key === 'customResources' || !value) return null;
                                        // Map key to label (simplified)
                                        const label = key === 'whatsapp' ? 'WhatsApp' : key === 'crm' ? 'CRM' : key;
                                        return (
                                            <li key={key} className="flex items-center text-sm text-gray-300">
                                                <CheckCircle className="mr-2 h-3 w-3 text-emerald-500" />
                                                <span className="capitalize">{label}</span>
                                            </li>
                                        );
                                    })}
                                    {state.features.customResources.map(res => (
                                        <li key={res.id} className="flex items-center text-sm text-gray-300">
                                            <CheckCircle className="mr-2 h-3 w-3 text-emerald-500" />
                                            <span>{res.description}</span>
                                        </li>
                                    ))}
                                </>
                            )}
                        </ul>
                    </div>

                    {/* Observations */}
                    <div className="pt-4">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Observações</p>
                        <textarea
                            className="w-full rounded-lg border border-gray-700 bg-gray-800 p-2 text-sm text-white focus:border-indigo-500 focus:outline-none"
                            rows={2}
                            placeholder="Adicione observações..."
                            value={state.observations}
                            onChange={(e) => updateObservations(e.target.value)}
                        />
                    </div>
                </div>

                {/* Actions */}
                <div className="mt-6 space-y-3">
                    <Button onClick={handleGeneratePDF} className="w-full" size="lg">
                        <FileDown className="mr-2 h-5 w-5" />
                        Baixar PDF
                    </Button>
                    <Button variant="secondary" className="w-full" onClick={() => alert("Em breve!")}>
                        <Mail className="mr-2 h-5 w-5" />
                        Enviar por E-mail
                    </Button>
                    <Button variant="ghost" className="w-full" onClick={handleSaveDraft}>
                        <Save className="mr-2 h-5 w-5" />
                        Salvar Rascunho
                    </Button>
                </div>
            </Card>

            {/* Coupon */}
            <Card className="p-4 bg-gradient-to-r from-indigo-900/40 to-purple-900/40 border-indigo-500/30">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-white">Cupom de desconto</p>
                        <p className="text-xs text-gray-400">
                            {state.discount.percentage > 0
                                ? `${state.discount.percentage}% de desconto aplicado`
                                : "Aplique um cupom válido"}
                        </p>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs"
                        onClick={() => setShowCoupon(!showCoupon)}
                    >
                        {showCoupon ? "Fechar" : "Aplicar"}
                    </Button>
                </div>

                {showCoupon && (
                    <div className="mt-3 flex gap-2 animate-in fade-in slide-in-from-top-1">
                        <Input
                            placeholder="Código"
                            className="h-9 text-sm"
                            value={couponInput}
                            onChange={(e) => setCouponInput(e.target.value)}
                        />
                        <Button size="sm" onClick={handleApplyCoupon}>OK</Button>
                    </div>
                )}
            </Card>
        </div>
    );
}
