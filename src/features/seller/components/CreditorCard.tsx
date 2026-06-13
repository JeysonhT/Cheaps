import Card from "@/components/Card";
import { Label, SubTitle } from "@/components/StyledText";
import { makeStyles } from "@/hooks/useTheme";
import { Creditor } from "@/types";
import MaterialIcons from "@react-native-vector-icons/material-icons";
import { Linking, Pressable, StyleSheet, View } from "react-native";

interface CreditorCardProps {
  creditor: Creditor;
  onDelete?: (id: number) => void;
}

export default function CreditorCard({
  creditor,
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
      <View style={styles.container}>
        <View style={styles.avatar}>
          <MaterialIcons
            name="corporate-fare"
            size={24}
            color={styles.iconColor.color}
          />
        </View>

        <View style={styles.content}>
          <Label style={styles.name}>{creditor.name}</Label>
          {creditor.phoneNumber ? (
            <SubTitle style={styles.phone}>{creditor.phoneNumber}</SubTitle>
          ) : (
            <SubTitle style={styles.noPhone}>Sin teléfono registrado</SubTitle>
          )}
        </View>

        <View style={styles.actions}>
          {creditor.phoneNumber && (
            <Pressable onPress={handleCall} style={styles.actionButton}>
              <MaterialIcons
                name="call"
                size={20}
                color={styles.callIconColor.color}
              />
            </Pressable>
          )}
          {onDelete && (
            <Pressable
              onPress={() => onDelete(creditor.id)}
              style={[styles.actionButton, styles.deleteButton]}
            >
              <MaterialIcons
                name="delete-outline"
                size={20}
                color={styles.deleteIconColor.color}
              />
            </Pressable>
          )}
        </View>
      </View>
    </Card>
  );
}

const useStyles = makeStyles((t, sp, fs, fw, r) =>
  StyleSheet.create({
    card: {
      backgroundColor: t.bgElevated,
      marginVertical: sp[1],
      marginHorizontal: sp[3],
      padding: sp[3],
    },
    container: {
      flexDirection: "row",
      alignItems: "center",
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
    content: {
      flex: 1,
      justifyContent: "center",
    },
    name: {
      fontWeight: fw.semibold,
      fontSize: fs.md,
      color: t.text,
    },
    phone: {
      fontSize: fs.sm,
      color: t.textMuted,
      marginTop: sp[1],
    },
    noPhone: {
      fontSize: fs.sm,
      color: t.textMuted,
      fontStyle: "italic",
      marginTop: sp[1],
    },
    actions: {
      flexDirection: "row",
      alignItems: "center",
      gap: sp[2],
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
    deleteIconColor: {
      color: t.error,
    },
  }),
);
