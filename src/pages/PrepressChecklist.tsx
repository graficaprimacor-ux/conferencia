import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
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
        <div className="container mx-auto p-4 md:p-8 bg-slate-50 print:p-0 print:bg-white">
            <div ref={printRef}>
                <Card className="w-full max-w-4xl mx-auto shadow-xl print:shadow-none print:border-none">
                    <CardHeader className="text-center">
                        <img src="/logo.png" alt="Primacor Gráfica Logo" className="w-64 mx-auto mb-6" />
                        <CardTitle className="text-3xl font-bold text-foreground">
                            Conferência de Pré-Impressão
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 md:p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
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

                        <Separator className="my-8" />

                        <div className="space-y-6">
                            {checklistItems.map((item, index) => (
                                <div key={index} className="p-4 border rounded-lg bg-white break-inside-avoid transition-colors hover:bg-slate-50">
                                    <p className="font-semibold mb-4 text-foreground">{index + 1}. {item}</p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                                        <RadioGroup
                                            value={checklistData[item].option}
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
                                                className="h-12"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="mt-8 flex justify-center gap-4 print:hidden">
                <Button onClick={handleGeneratePdf} size="lg">
                    GERAR PDF
                </Button>
                <Button onClick={handlePrint} variant="outline" size="lg">
                    IMPRIMIR
                </Button>
            </div>
        </div>
    );
};

export default PrepressChecklist;