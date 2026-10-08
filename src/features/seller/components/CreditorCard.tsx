import { Building2, Pencil, Phone, Trash2 } from "lucide-react-native";
import { Linking, Pressable, Text, View } from "react-native";
import Card from "@/components/Card";
import type { Creditor } from "@/types";

interface CreditorCardProps {
  creditor: Creditor;
  onEdit?: (creditor: Creditor) => void;
  onDelete?: (id: number) => void;
}

export default function CreditorCard({
  creditor,
  onEdit,
  onDelete,
}: CreditorCardProps) {
  const handleCall = () => {
    if (creditor.phoneNumber) {
      Linking.openURL(`tel:${creditor.phoneNumber}`);
    }
  };

  return (
    <Card className="my-1 mx-3 p-3 bg-white rounded-xl border border-slate-100 shadow-sm">
      <View className="flex-row items-center">
        {/* Avatar */}
        <View className="w-12 h-12 rounded-full bg-slate-100 items-center justify-center mr-3">
          <Building2 size={24} color="#064E3B" />
        </View>

        {/* Info */}
        <View className="flex-1 justify-center">
          <Text className="text-base font-semibold text-slate-900">
            {creditor.name}
          </Text>
          {creditor.phoneNumber ? (
            <Text className="text-sm text-slate-500 mt-1">
              {creditor.phoneNumber}
            </Text>
          ) : (
            <Text className="text-sm text-slate-400 mt-1 italic">
              Sin teléfono registrado
            </Text>
          )}
        </View>

        {/* Action Buttons */}
        <View className="flex-row items-center gap-2">
          {creditor.phoneNumber && (
            <Pressable
              onPress={handleCall}
              className="w-9 h-9 rounded-full bg-blue-50 items-center justify-center active:opacity-70"
            >
              <Phone size={18} color="#2563EB" />
            </Pressable>
          )}
          {onEdit && (
            <Pressable
              onPress={() => onEdit(creditor)}
              className="w-9 h-9 rounded-full bg-emerald-50 items-center justify-center active:opacity-70"
            >
              <Pencil size={18} color="#064E3B" />
            </Pressable>
          )}
          {onDelete && (
            <Pressable
              onPress={() => onDelete(creditor.id)}
              className="w-9 h-9 rounded-full bg-red-100 items-center justify-center active:opacity-70"
            >
              <Trash2 size={18} color="#ef4444" />
            </Pressable>
          )}
        </View>
      </View>
    </Card>
  );
}
