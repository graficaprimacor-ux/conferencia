import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { CardTitle } from "@/components/ui/card";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const checklistItems = [
    "O TAMANHO DO ARQUIVO ESTÁ DE ACORDO",
    "O ARQUIVO ESTÁ NO MODO DE COR CONFORME SOLICITADO NA O.S",
    "O ARQUIVO POSSUI SANGRIA DE NO MÍNIMO 5MM",
    "VERIFIQUE SE TODAS DAS IMAGENS ESTÃO COM NO MÍNIMO 300 DPI’S DE QUALIDADE E SE TODAS FORAM CONVERTIDAS PARA CMYK",
    "VERIFIQUE SE FOI FEITO SINALIZAÇÃO PARA O DESTAQUE",
    "VERIFIQUE A PORCENTAGEM DO PRETO NOS TEXTOS E DEMAIS OBJETOS. (C=0, M=0, Y=0, K=100%)",
    "VERIFIQUE A ORTOGRAFIA E A DIAGRAMAÇÃO DO DOCUMENTO",
    "VERIFIQUE SE O ARQUIVO ESTÁ COM RESERVA DE COLA - FRENTE | VERSO",
    "VERIFIQUE SE A FACA ESTÁ SOBREPOSTA E EM PANTONE",
    "VERIFIQUE NOMENCLATURA NO PDF, COM NOME, NÚMERO O.S",
    "FOI MONTADO BONECA",
    "FEZ APONTAMENTO NO SISTEMA",
    "FOI ENVIADO CLICHÊ",
    "FOI ENVIADO FACA",
    "QUAL MODO DE COR? (PANTONE) - (POLICROMIA) - (PRETO E BRANCO)"
];

const initialChecklistState = checklistItems.reduce((acc, item) => {
    acc[item] = { option: '', observation: '' };
    return acc;
}, {} as Record<string, { option: string; observation: string }>);

const PrepressChecklist = () => {
    const [headerData, setHeaderData] = useState({
        osNumber: '',
        clientNumber: '',
        clientName: '',
        date: new Date().toISOString().split('T')[0],
        operator: ''
    });
    const [checklistData, setChecklistData] = useState(initialChecklistState);
    const printRef = useRef<HTMLDivElement>(null);

    const handleHeaderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setHeaderData(prev => ({ ...prev, [id]: value }));
    };

    const handleChecklistChange = (item: string, type: 'option' | 'observation', value: string) => {
        setChecklistData(prev => ({
            ...prev,
            [item]: { ...prev[item], [type]: value }
        }));
    };

    const handleGeneratePdf = () => {
        const input = printRef.current;
        if (input) {
            html2canvas(input, { scale: 2 }).then(canvas => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF('p', 'mm', 'a4');
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = pdf.internal.pageSize.getHeight();

                const imgProps= pdf.getImageProperties(imgData);
                const imgWidth = pdfWidth;
                const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

                let heightLeft = imgHeight;
                let position = 0;

                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pdfHeight;

                while (heightLeft > 0) {
                  position = position - pdfHeight;
                  pdf.addPage();
                  pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                  heightLeft -= pdfHeight;
                }
                
                pdf.save(`OS_${headerData.osNumber || 'checklist'}.pdf`);
            });
        }
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 container mx-auto p-4 md:p-8 print:p-0 print:bg-white">
            <div ref={printRef} className="print:p-8">
                <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden print:shadow-none print:border print:rounded-none">
                    <div className="p-8 bg-slate-50 border-b-4 border-primary print:bg-transparent print:border-none">
                        <img src="/logo.png" alt="Primacor Gráfica Logo" className="w-56 mx-auto mb-6" />
                        <CardTitle className="text-3xl font-bold text-center text-foreground">
                            Conferência de Pré-Impressão
                        </CardTitle>
                    </div>
                    
                    <div className="p-6 md:p-8">
                        <div className="mb-8">
                            <h3 className="text-xl font-semibold mb-4 border-b pb-2 text-primary">Detalhes da Ordem de Serviço</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="osNumber">Número da O.S:</Label>
                                    <Input id="osNumber" value={headerData.osNumber} onChange={handleHeaderChange} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="clientNumber">Nº Cliente:</Label>
                                    <Input id="clientNumber" value={headerData.clientNumber} onChange={handleHeaderChange} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="clientName">Nome do Cliente:</Label>
                                    <Input id="clientName" value={headerData.clientName} onChange={handleHeaderChange} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="date">Data:</Label>
                                    <Input id="date" type="date" value={headerData.date} onChange={handleHeaderChange} />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="operator">Operador Responsável:</Label>
                                    <Input id="operator" value={headerData.operator} onChange={handleHeaderChange} />
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold mb-4 border-b pb-2 text-primary">Checklist de Itens</h3>
                            <div className="space-y-6">
                                {checklistItems.map((item, index) => {
                                    const option = checklistData[item].option;
                                    const itemClasses = {
                                        'SIM': 'bg-primary/10 border-primary shadow-md',
                                        'NÃO': 'bg-destructive/10 border-destructive shadow-md',
                                        'NC': 'bg-accent/10 border-accent shadow-md',
                                        '': 'bg-white border-gray-200'
                                    }[option] || 'bg-white border-gray-200';

                                    return (
                                        <div key={index} className={`p-4 border-l-4 rounded-lg break-inside-avoid transition-all duration-300 hover:shadow-lg hover:scale-[1.01] ${itemClasses}`}>
                                            <div className="flex items-start gap-4 mb-4">
                                                <div className="flex-shrink-0 w-8 h-8 bg-primary/20 text-primary font-bold rounded-md flex items-center justify-center mt-1">
                                                    {index + 1}
                                                </div>
                                                <p className="font-semibold text-foreground flex-grow text-base pt-1">{item}</p>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center pl-12">
                                                <RadioGroup
                                                    value={option}
                                                    onValueChange={(value) => handleChecklistChange(item, 'option', value)}
                                                    className="flex items-center space-x-6"
                                                >
                                                    <div className="flex items-center space-x-2">
                                                        <RadioGroupItem value="SIM" id={`${index}-sim`} />
                                                        <Label htmlFor={`${index}-sim`}>SIM</Label>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <RadioGroupItem value="NÃO" id={`${index}-nao`} />
                                                        <Label htmlFor={`${index}-nao`}>NÃO</Label>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <RadioGroupItem value="NC" id={`${index}-nc`} />
                                                        <Label htmlFor={`${index}-nc`}>NC</Label>
                                                    </div>
                                                </RadioGroup>
                                                <div>
                                                    <Label htmlFor={`${index}-obs`} className="sr-only">Observações</Label>
                                                    <Textarea
                                                        id={`${index}-obs`}
                                                        placeholder="Observações..."
                                                        value={checklistData[item].observation}
                                                        onChange={(e) => handleChecklistChange(item, 'observation', e.target.value)}
                                                        className="h-12 bg-white/80"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8 flex justify-center gap-4 print:hidden">
                <Button onClick={handleGeneratePdf} size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold shadow-lg hover:shadow-xl transition-shadow">
                    GERAR PDF
                </Button>
                <Button onClick={handlePrint} variant="outline" size="lg" className="font-bold border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors">
                    IMPRIMIR
                </Button>
            </div>
        </div>
    );
};

export default PrepressChecklist;