"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { BudgetState, INITIAL_STATE, CustomResource } from '@/types/budget';

interface BudgetContextType {
    state: BudgetState;
    updateClient: (field: keyof BudgetState['client'], value: string) => void;
    toggleAgentType: (type: string) => void;
    setCustomAgentType: (value: string) => void;
    updateQuantity: (increment: boolean) => void;
    updateFinancial: (field: keyof BudgetState['financial'], value: any) => void;
    toggleFeature: (feature: keyof BudgetState['features']) => void;
    addCustomResource: (description: string) => void;
    removeCustomResource: (id: string) => void;
    applyCoupon: (coupon: string) => void;
    updateObservations: (value: string) => void;
    totals: {
        implementation: number;
        maintenanceTotal: number;
        subtotal: number;
        total: number;
        monthlyMaintenance: number;
    };
}

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

export const BudgetProvider = ({ children }: { children: ReactNode }) => {
    const [state, setState] = useState<BudgetState>(INITIAL_STATE);

    // Load from local storage on mount
    useEffect(() => {
        const saved = localStorage.getItem('budget_draft');
        if (saved) {
            try {
                setState(JSON.parse(saved));
            } catch (e) {
                console.error('Failed to load draft', e);
            }
        }
    }, []);

    // Save to local storage on change
    useEffect(() => {
        localStorage.setItem('budget_draft', JSON.stringify(state));
    }, [state]);

    const updateClient = (field: keyof BudgetState['client'], value: string) => {
        setState(prev => ({
            ...prev,
            client: { ...prev.client, [field]: value }
        }));
    };

    const toggleAgentType = (type: string) => {
        setState(prev => {
            const types = prev.agents.types.includes(type as any)
                ? prev.agents.types.filter(t => t !== type)
                : [...prev.agents.types, type as any];
            return { ...prev, agents: { ...prev.agents, types } };
        });
    };

    const setCustomAgentType = (value: string) => {
        setState(prev => ({
            ...prev,
            agents: { ...prev.agents, customTypeDescription: value }
        }));
    };

    const updateQuantity = (increment: boolean) => {
        setState(prev => ({
            ...prev,
            agents: {
                ...prev.agents,
                quantity: Math.max(1, Math.min(20, prev.agents.quantity + (increment ? 1 : -1)))
            }
        }));
    };

    const updateFinancial = (field: keyof BudgetState['financial'], value: any) => {
        setState(prev => ({
            ...prev,
            financial: { ...prev.financial, [field]: value }
        }));
    };

    const toggleFeature = (feature: keyof BudgetState['features']) => {
        if (feature === 'customResources') return;
        setState(prev => ({
            ...prev,
            features: { ...prev.features, [feature]: !prev.features[feature] }
        }));
    };

    const addCustomResource = (description: string) => {
        const newResource: CustomResource = {
            id: Math.random().toString(36).substr(2, 9),
            description
        };
        setState(prev => ({
            ...prev,
            features: {
                ...prev.features,
                customResources: [...prev.features.customResources, newResource]
            }
        }));
    };

    const removeCustomResource = (id: string) => {
        setState(prev => ({
            ...prev,
            features: {
                ...prev.features,
                customResources: prev.features.customResources.filter(r => r.id !== id)
            }
        }));
    };

    const applyCoupon = (coupon: string) => {
        const validCoupons: Record<string, number> = { 'GAND10': 10, 'IA2023': 15, 'BEMVINDO': 5 };
        const upperCoupon = coupon.toUpperCase();

        if (validCoupons[upperCoupon]) {
            setState(prev => ({
                ...prev,
                discount: { coupon: upperCoupon, percentage: validCoupons[upperCoupon] }
            }));
        } else {
            setState(prev => ({
                ...prev,
                discount: { coupon: null, percentage: 0 }
            }));
        }
    };

    const updateObservations = (value: string) => {
        setState(prev => ({ ...prev, observations: value }));
    };

    // Calculations
    const calculateTotals = () => {
        const { implementationValue, maintenanceValue, contractDuration, planType, paymentCondition } = state.financial;
        const { quantity } = state.agents;
        const { percentage } = state.discount;

        const implementation = implementationValue * quantity;
        let maintenanceTotal = 0;

        if (planType === 'completo') {
            maintenanceTotal = (maintenanceValue * quantity) * contractDuration;
        }

        let subtotal = implementation + maintenanceTotal;
        let total = subtotal;

        if (percentage > 0) {
            total -= subtotal * (percentage / 100);
        }

        if (paymentCondition === 'avista') {
            total *= 0.95;
        }

        return {
            implementation,
            maintenanceTotal,
            subtotal,
            total,
            monthlyMaintenance: maintenanceValue * quantity
        };
    };

    return (
        <BudgetContext.Provider value={{
            state,
            updateClient,
            toggleAgentType,
            setCustomAgentType,
            updateQuantity,
            updateFinancial,
            toggleFeature,
            addCustomResource,
            removeCustomResource,
            applyCoupon,
            updateObservations,
            totals: calculateTotals()
        }}>
            {children}
        </BudgetContext.Provider>
    );
};

export const useBudget = () => {
    const context = useContext(BudgetContext);
    if (context === undefined) {
        throw new Error('useBudget must be used within a BudgetProvider');
    }
    return context;
};
