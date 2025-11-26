import React from "react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { useBudget } from "@/contexts/BudgetContext";
import { Building2, User, Mail, Phone } from "lucide-react";

export function ClientForm() {
    const { state, updateClient } = useBudget();

    return (
        <Card className="p-6">
            <h2 className="mb-4 flex items-center text-xl font-semibold text-white">
                <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-500">
                    <Building2 className="h-5 w-5" />
                </div>
                Dados do Cliente
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Input
                    label="Nome da Empresa"
                    placeholder="Digite o nome da empresa"
                    icon={<Building2 className="h-4 w-4" />}
                    value={state.client.companyName}
                    onChange={(e) => updateClient("companyName", e.target.value)}
                />
                <Input
                    label="Responsável"
                    placeholder="Nome do responsável"
                    icon={<User className="h-4 w-4" />}
                    value={state.client.responsibleName}
                    onChange={(e) => updateClient("responsibleName", e.target.value)}
                />
                <Input
                    label="E-mail"
                    type="email"
                    placeholder="E-mail para contato"
                    icon={<Mail className="h-4 w-4" />}
                    value={state.client.email}
                    onChange={(e) => updateClient("email", e.target.value)}
                />
                <Input
                    label="Telefone"
                    type="tel"
                    placeholder="(00) 00000-0000"
                    icon={<Phone className="h-4 w-4" />}
                    value={state.client.phone}
                    onChange={(e) => updateClient("phone", e.target.value)}
                />
            </div>
        </Card>
    );
}
