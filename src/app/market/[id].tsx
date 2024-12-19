import { Button } from "@/components/button"
import { Loading } from "@/components/loading"
import { Coupon } from "@/components/market/coupon"
import { Cover } from "@/components/market/cover"
import { Details, DetailsProps } from "@/components/market/details"
import { fetchMarket } from "@/services"
import { api } from "@/services/api"
import { CameraView, useCameraPermissions } from "expo-camera"
import { Redirect, useLocalSearchParams } from "expo-router"
import { useEffect, useRef, useState } from "react"
import { Alert, Modal, ScrollView, StatusBar, View } from "react-native"

type DataProps = DetailsProps & {
  cover: string
}

export default function Market() {
  const params = useLocalSearchParams<{ id: string }>()
  const [_, requestPermission] = useCameraPermissions()
  const [data, setData] = useState<DataProps>()
  const [coupon, setCoupon] = useState<string | null>(null)
  const [couponIsFetching, setCouponIsFetching] = useState(false)
  const [loading, setLoading] = useState(true)
  const [cameraModal, setCameraModal] = useState(false)

  const qrLock = useRef(false)

  useEffect(() => {
    const getMarket = async () => {
      const data = await fetchMarket(params.id)
      setData(data)
      setLoading(false)
    }

    getMarket()
  }, [params.id, coupon])

  async function handleOpenCamera() {
    const { granted } = await requestPermission()

    if (!granted) {
      return Alert.alert("Câmera", "Necessário habilitar a câmera.")
    }

    qrLock.current = false
    setCameraModal(true)
  }

  async function getCoupon(id: string) {
    try {
      setCouponIsFetching(true)

      const { data } = await api.patch("/coupons/" + id)

      Alert.alert("Cupom", data.coupon)
      setCoupon(data.coupon)
    } catch (error) {
      console.log(error)
      Alert.alert("Erro", "Não foi possível utilizar o cupom")
    } finally {
      setCouponIsFetching(false)
    }
  }

  function handleUseCoupon(id: string) {
    setCameraModal(false)

    Alert.alert(
      "Cupom",
      "Não é possível reutilizar um cupom resgatado. Deseja realmente resgatar o cupom?",
      [
        { style: "cancel", text: "Não" },
        { text: "Sim", onPress: () => getCoupon(id) },
      ]
    )
  }

  if (loading) {
    return <Loading />
  }

  if (!data) {
    return <Redirect href="/home" />
  }

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" hidden={cameraModal} />

      <ScrollView showsVerticalScrollIndicator={false} />
      <Cover uri={data.cover} />
      <Details data={data} />
      {coupon && <Coupon code={coupon} />}

      <View style={{ padding: 32 }}>
        <Button onPress={handleOpenCamera}>
          <Button.Title>Ler QR Code</Button.Title>
        </Button>
      </View>

      <Modal style={{ flex: 1 }} visible={cameraModal}>
        <CameraView
          style={{ flex: 1 }}
          facing="back"
          onBarcodeScanned={({ data }) => {
            if (data && !qrLock.current) {
              qrLock.current = true
              handleUseCoupon(data)
            }
          }}
        />

        <View style={{
          position: "absolute",
          bottom: 32,
          left: 32,
          right: 32
        }}>
          <Button onPress={() => setCameraModal(false)} isLoading={couponIsFetching}>
            <Button.Title>Voltar</Button.Title>
          </Button>
        </View>
      </Modal>
    </View>
  )
}