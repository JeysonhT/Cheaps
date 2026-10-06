import { Building2, Pencil, Phone, Trash2 } from "lucide-react-native";
import { Linking, Pressable, StyleSheet, View } from "react-native";
import Card from "@/components/Card";
import { HStack, Text, VStack } from "@/components/layout";
import { makeStyles } from "@/hooks/useTheme";
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
  const styles = useStyles();

  const handleCall = () => {
    if (creditor.phoneNumber) {
      Linking.openURL(`tel:${creditor.phoneNumber}`);
    }
  };

  return (
    <Card style={styles.card}>
      <HStack align="center">
        <View style={styles.avatar}>
          <Building2
            size={24}
            color={styles.iconColor.color}
          />
        </View>

        <VStack flex={1} justify="center">
          <Text size="md" weight="semibold" color="text">
            {creditor.name}
          </Text>
          {creditor.phoneNumber ? (
            <Text size="sm" color="textMuted" mt="1">
              {creditor.phoneNumber}
            </Text>
          ) : (
            <Text size="sm" color="textMuted" mt="1" style={styles.noPhone}>
              Sin teléfono registrado
            </Text>
          )}
        </VStack>

        <HStack align="center" gap="2">
          {creditor.phoneNumber && (
            <Pressable onPress={handleCall} style={styles.actionButton}>
              <Phone
                size={20}
                color={styles.callIconColor.color}
              />
            </Pressable>
          )}
          {onEdit && (
            <Pressable
              onPress={() => onEdit(creditor)}
              style={styles.actionButton}
            >
              <Pencil
                size={20}
                color={styles.editIconColor.color}
              />
            </Pressable>
          )}
          {onDelete && (
            <Pressable
              onPress={() => onDelete(creditor.id)}
              style={[styles.actionButton, styles.deleteButton]}
            >
              <Trash2
                size={20}
                color={styles.deleteIconColor.color}
              />
            </Pressable>
          )}
        </HStack>
      </HStack>
    </Card>
  );
}

const useStyles = makeStyles((t, sp, _fs, _fw, r) =>
  StyleSheet.create({
    card: {
      backgroundColor: t.bgElevated,
      marginVertical: sp[1],
      marginHorizontal: sp[3],
      padding: sp[3],
    },
    avatar: {
      width: 48,
      height: 48,
      borderRadius: r.full,
      backgroundColor: t.bgMuted,
      alignItems: "center",
      justifyContent: "center",
      marginRight: sp[3],
    },
    iconColor: {
      color: t.primary,
    },
    noPhone: {
      fontStyle: "italic",
    },
    actionButton: {
      width: 36,
      height: 36,
      borderRadius: r.full,
      backgroundColor: t.bgSubtle,
      alignItems: "center",
      justifyContent: "center",
    },
    deleteButton: {
      backgroundColor: "#fee2e2",
    },
    callIconColor: {
      color: t.secondary,
    },
    editIconColor: {
      color: t.primary,
    },
    deleteIconColor: {
      color: t.error,
    },
  }),
);
