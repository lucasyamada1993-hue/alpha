// @ts-nocheck
import { motion } from "framer-motion";
import { CheckCircle2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useEffect } from "react";

export default function ThankYou() {
  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = "/";
    }, 15000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background via-accent/30 to-background p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="text-center max-w-lg"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="inline-flex items-center justify-center w-28 h-28 rounded-full bg-emerald-100 mb-8"
        >
          <CheckCircle2 className="w-16 h-16 text-emerald-500" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-3xl sm:text-4xl font-extrabold text-foreground mb-4"
        >
          Obrigado!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-lg text-muted-foreground mb-10 max-w-sm mx-auto leading-relaxed"
        >
          Sua avaliação foi registrada com sucesso. Agradecemos sua contribuição para a melhoria dos nossos serviços.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Link to="/">
            <Button
              variant="outline"
              size="lg"
              className="text-base px-8 py-5 rounded-xl font-semibold"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Nova Pesquisa
            </Button>
          </Link>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-xs text-muted-foreground mt-8 opacity-50"
        >
          Esta tela retornará automaticamente ao início em 15 segundos
        </motion.p>
      </motion.div>
    </div>
  );
}