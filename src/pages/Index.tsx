import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 p-4">
      <div className="w-full max-w-md text-center bg-white rounded-2xl shadow-2xl p-8 md:p-12">
        <img src="/logo.png" alt="Primacor Gráfica Logo" className="w-64 mx-auto mb-8" />
        <h1 className="text-4xl font-bold mb-4 text-foreground">Sistema de Conferência</h1>
        <p className="text-lg text-gray-600 mb-10">
          Clique no botão abaixo para acessar o checklist de pré-impressão.
        </p>
        <Button asChild size="lg" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg py-6 shadow-lg hover:shadow-xl transition-shadow">
          <Link to="/checklist">Acessar Checklist</Link>
        </Button>
      </div>
    </div>
  );
};

export default Index;