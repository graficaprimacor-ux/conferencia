import { Button } from "@/components/ui/button";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Sistema de Conferência</h1>
        <p className="text-xl text-gray-600 mb-8">
          Clique no botão abaixo para acessar o checklist de pré-impressão.
        </p>
        <Button asChild size="lg">
          <Link to="/checklist">Acessar Checklist</Link>
        </Button>
      </div>
      <div className="absolute bottom-4">
        <MadeWithDyad />
      </div>
    </div>
  );
};

export default Index;