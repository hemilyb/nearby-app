import { View, Text } from "react-native"
import { s } from "./styles"
import { Step } from "../step"
import { IconMapPin, IconQrcode, IconTicket } from "@tabler/icons-react-native"

export function Steps() {
  return (
    <View style={s.container}>
      <Text>Veja como funciona:</Text>
      <Step
        title="Encontre estabelecimentos"
        description="Veja locais perto de você que são parceiros Nearby."
        icon={IconMapPin} />

      <Step
        title="Ative o cupom com QR Code"
        description="Escaneie o código no estabelecimento para usar o benefício."
        icon={IconQrcode} />

      <Step
        title="Garanta vantagens perto de você"
        description="Ative cupons onde estiver, em diferentes tipos de estabelecimento."
        icon={IconTicket} />
    </View>
  )
}