import { Calendar } from "lucide-react-native";
import { Text } from "react-native";
import Card from "@/components/Card";
import { HStack } from "@/components/layout";

import type { DebtWithCreditor } from "@/types";

interface NextPayProps {
  debt: DebtWithCreditor | null;
}

export default function NextPay({ debt }: NextPayProps) {
  if (!debt) {
    return (
      <Card className="bg-primary-400 mt-2">
        <HStack className="items-center gap-2 mb-1">
          <Calendar color="#ffffff" size={24} />
          <Text className="text-lg text-white font-medium">Próximo Pago</Text>
        </HStack>
        <HStack className="justify-between items-center">
          <Text className="text-lg text-white font-bold">Sin deudas</Text>
          <Text className="text-sm text-white font-medium">Al día</Text>
        </HStack>
      </Card>
    );
  }

  // Estimar cuota aproximada
  const installment = debt.amount * (debt.payFrecuency / 365);
  const displayInstallment = Math.min(
    debt.currentAmount,
    installment > 0 ? installment : debt.currentAmount,
  );

  // Calcular próxima fecha de pago
  const getNextPayDate = () => {
    try {
      const baseDate = new Date(debt.debtDate);
      const today = new Date();
      // Incrementar hasta que la fecha sea futura
      while (baseDate < today) {
        baseDate.setDate(baseDate.getDate() + debt.payFrecuency);
      }

      const months = [
        "Ene",
        "Feb",
        "Mar",
        "Abr",
        "May",
        "Jun",
        "Jul",
        "Ago",
        "Sep",
        "Oct",
        "Nov",
        "Dic",
      ];
      return `${baseDate.getDate()} de ${months[baseDate.getMonth()]}, ${baseDate.getFullYear()}`;
    } catch (_) {
      return debt.debtDate;
    }
  };

  const formatCurrency = (val: number) => {
    return `C$ ${val.toLocaleString("es-NI", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <Card className="bg-primary-400 mt-2">
      <HStack className="items-center gap-2 mb-1">
        <Calendar color="#ffffff" size={24} />
        <Text className="text-lg text-white font-medium">
          Próximo Pago: {debt.name}
        </Text>
      </HStack>
      <HStack className="items-center justify-between">
        <Text className="text-lg text-white font-bold">
          {formatCurrency(displayInstallment)}
        </Text>
        <Text className="text-sm text-white font-medium">
          {getNextPayDate()}
        </Text>
      </HStack>
    </Card>
  );
}
