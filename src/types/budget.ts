export type AgentType = 'atendimento' | 'sdr' | 'vendedor' | 'suporte' | 'clone' | 'personalizado';

export type PaymentMethod = 'cartao' | 'transferencia' | 'pix' | 'boleto';

export type PaymentCondition = 'avista' | 'parcelado' | 'personalizado';

export type PlanType = 'completo' | 'implementacao';

export interface CustomResource {
    id: string;
    description: string;
}

export interface BudgetState {
    client: {
        companyName: string;
        responsibleName: string;
        email: string;
        phone: string;
    };
    agents: {
        types: AgentType[];
        customTypeDescription: string;
        quantity: number;
    };
    financial: {
        planType: PlanType;
        implementationValue: number;
        maintenanceValue: number;
        contractDuration: number; // months
        paymentMethod: PaymentMethod;
        paymentCondition: PaymentCondition;
        customPaymentCondition: string;
        deliveryTime: number; // days
    };
    features: {
        whatsapp: boolean;
        spreadsheet: boolean;
        crm: boolean;
        externalTools: boolean;
        dashboard: boolean;
        reports: boolean;
        training: boolean;
        support247: boolean;
        customResources: CustomResource[];
    };
    discount: {
        coupon: string | null;
        percentage: number;
    };
    observations: string;
}

export const INITIAL_STATE: BudgetState = {
    client: {
        companyName: '',
        responsibleName: '',
        email: '',
        phone: '',
    },
    agents: {
        types: [],
        customTypeDescription: '',
        quantity: 1,
    },
    financial: {
        planType: 'completo',
        implementationValue: 5000,
        maintenanceValue: 1000,
        contractDuration: 12,
        paymentMethod: 'boleto',
        paymentCondition: 'parcelado',
        customPaymentCondition: '',
        deliveryTime: 30,
    },
    features: {
        whatsapp: false,
        spreadsheet: false,
        crm: false,
        externalTools: false,
        dashboard: false,
        reports: false,
        training: false,
        support247: false,
        customResources: [],
    },
    discount: {
        coupon: null,
        percentage: 0,
    },
    observations: '',
};
