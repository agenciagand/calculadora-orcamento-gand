import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { BudgetState } from "@/types/budget";

// Helper to format currency
const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

export const generatePDF = (state: BudgetState, totals: any, orderNumber: string) => {
    const doc = new jsPDF();

    // Colors
    const PRIMARY_COLOR: [number, number, number] = [0, 0, 0]; // Black
    const TEXT_COLOR: [number, number, number] = [31, 41, 55]; // Gray 800
    const LIGHT_TEXT_COLOR: [number, number, number] = [107, 114, 128]; // Gray 500

    // Header
    doc.setFontSize(10);
    doc.setTextColor(LIGHT_TEXT_COLOR[0], LIGHT_TEXT_COLOR[1], LIGHT_TEXT_COLOR[2]);
    doc.text("Orçamento - Agência Gand", 20, 20);
    doc.text(`Número: #${orderNumber}`, 190, 20, { align: "right" });

    doc.setDrawColor(229, 231, 235); // Gray 200
    doc.line(20, 25, 190, 25);

    // Title
    doc.setFontSize(24);
    doc.setTextColor(TEXT_COLOR[0], TEXT_COLOR[1], TEXT_COLOR[2]);
    doc.setFont("helvetica", "bold");
    doc.text("Proposta Comercial", 105, 45, { align: "center" });

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(LIGHT_TEXT_COLOR[0], LIGHT_TEXT_COLOR[1], LIGHT_TEXT_COLOR[2]);
    doc.text(`Emitido em: ${new Date().toLocaleDateString('pt-BR')}`, 105, 52, { align: "center" });

    // Client Info
    doc.setFontSize(14);
    doc.setTextColor(TEXT_COLOR[0], TEXT_COLOR[1], TEXT_COLOR[2]);
    doc.setFont("helvetica", "bold");
    doc.text("Dados do Cliente", 20, 70);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(LIGHT_TEXT_COLOR[0], LIGHT_TEXT_COLOR[1], LIGHT_TEXT_COLOR[2]);

    const clientInfo = [
        [`Empresa: ${state.client.companyName || 'N/A'}`, `Responsável: ${state.client.responsibleName || 'N/A'}`],
        [`E-mail: ${state.client.email || 'N/A'}`, `Telefone: ${state.client.phone || 'N/A'}`]
    ];

    autoTable(doc, {
        startY: 75,
        body: clientInfo,
        theme: 'plain',
        styles: { cellPadding: 2, fontSize: 10, textColor: TEXT_COLOR },
        columnStyles: { 0: { cellWidth: 90 }, 1: { cellWidth: 90 } },
    });

    // Investment Box
    const boxY = (doc as any).lastAutoTable.finalY + 15;

    doc.setFillColor(249, 250, 251); // Gray 50
    doc.setDrawColor(229, 231, 235); // Gray 200
    doc.roundedRect(20, boxY, 170, 50, 3, 3, "FD");

    doc.setFontSize(12);
    doc.setTextColor(TEXT_COLOR[0], TEXT_COLOR[1], TEXT_COLOR[2]);
    doc.setFont("helvetica", "bold");
    doc.text("INVESTIMENTO TOTAL", 30, boxY + 15);

    doc.setFontSize(28);
    doc.setTextColor(PRIMARY_COLOR[0], PRIMARY_COLOR[1], PRIMARY_COLOR[2]);
    doc.text(formatCurrency(totals.total), 30, boxY + 30);

    doc.setFontSize(10);
    doc.setTextColor(LIGHT_TEXT_COLOR[0], LIGHT_TEXT_COLOR[1], LIGHT_TEXT_COLOR[2]);
    doc.setFont("helvetica", "normal");

    if (state.financial.planType === 'completo') {
        doc.text(`Implementação: ${formatCurrency(totals.implementation)}`, 110, boxY + 15);
        doc.text(`Mensalidade: ${formatCurrency(totals.monthlyMaintenance)}`, 110, boxY + 22);
        doc.text(`Contrato: ${state.financial.contractDuration} meses`, 110, boxY + 29);
    } else {
        doc.text(`Implementação Única`, 110, boxY + 15);
        doc.text(`Suporte: 1 ano incluído`, 110, boxY + 22);
    }

    // Details
    const detailsY = boxY + 65;
    doc.setFontSize(14);
    doc.setTextColor(TEXT_COLOR[0], TEXT_COLOR[1], TEXT_COLOR[2]);
    doc.setFont("helvetica", "bold");
    doc.text("Detalhes do Projeto", 20, detailsY);

    const agentLabels: Record<string, string> = {
        'atendimento': 'Agente de Atendimento',
        'sdr': 'Agente SDR',
        'vendedor': 'Agente Vendedor',
        'suporte': 'Agente de Suporte',
        'clone': 'Clone Digital',
        'personalizado': 'Personalizado'
    };

    const featureLabels: Record<string, string> = {
        'whatsapp': 'Integração com WhatsApp',
        'spreadsheet': 'Integração com Planilha',
        'crm': 'Integração com CRM',
        'externalTools': 'Ferramentas Externas',
        'dashboard': 'Dashboard de Métricas',
        'reports': 'Relatórios Semanais',
        'training': 'Treinamento da Equipe',
        'support247': 'Suporte 24/7'
    };

    const agentTypes = state.agents.types.map(t => agentLabels[t] || t).join(", ");
    const featuresList = Object.entries(state.features)
        .filter(([k, v]) => k !== 'customResources' && v)
        .map(([k]) => featureLabels[k] || k)
        .concat(state.features.customResources.map(r => r.description));

    const detailsData = [
        ["Serviço", `${state.agents.quantity}x Agentes (${agentTypes || 'Nenhum selecionado'})`],
        ["Prazo de Entrega", `${state.financial.deliveryTime} dias`],
        ["Forma de Pagamento", state.financial.paymentMethod.toUpperCase()],
        ["Condições", state.financial.paymentCondition === 'personalizado' ? state.financial.customPaymentCondition : state.financial.paymentCondition.toUpperCase()],
        ["Recursos Incluídos", featuresList.length > 0 ? featuresList.join(", ") : "Nenhum recurso extra selecionado"]
    ];

    autoTable(doc, {
        startY: detailsY + 5,
        head: [['Item', 'Descrição']],
        body: detailsData,
        theme: 'grid',
        headStyles: { fillColor: PRIMARY_COLOR, textColor: [255, 255, 255] },
        styles: { fontSize: 10, cellPadding: 4 },
        columnStyles: { 0: { cellWidth: 50, fontStyle: 'bold' } },
    });

    // Observations
    if (state.observations) {
        const obsY = (doc as any).lastAutoTable.finalY + 15;
        doc.setFontSize(14);
        doc.setTextColor(TEXT_COLOR[0], TEXT_COLOR[1], TEXT_COLOR[2]);
        doc.text("Observações", 20, obsY);

        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(LIGHT_TEXT_COLOR[0], LIGHT_TEXT_COLOR[1], LIGHT_TEXT_COLOR[2]);

        const splitObs = doc.splitTextToSize(state.observations, 170);
        doc.text(splitObs, 20, obsY + 8);
    }

    // Footer
    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(8);
    doc.setTextColor(LIGHT_TEXT_COLOR[0], LIGHT_TEXT_COLOR[1], LIGHT_TEXT_COLOR[2]);
    doc.text("Agência Gand - Soluções em IA", 20, pageHeight - 10);
    doc.text("Página 1 de 1", 190, pageHeight - 10, { align: "right" });

    // Save
    const filename = `orcamento_${state.client.companyName.replace(/\s+/g, '_') || 'cliente'}_${orderNumber}.pdf`;
    doc.save(filename);
};
