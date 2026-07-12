import { useAssets } from "expo-asset";
import { useEffect, useState } from "react";

const ASSETS_PATH = "../../../assets/images/";

type ImagesGuides = {
  image: string;
  title: string;
};

const IMAGES_TITLES = [
  "Para comenzar tendras que dirigirte a deudas, la flecha indica el acceso",
  "Ve al panel de acreedores",
  "Toca el boton para agregar un acreedor (Empresa o persona) al que debes dinero",
  "Completa el formulario de los datos de tu acreedor y guardalo",
  "Ahora con un acreedor listo, puedes comenzar a registrar tus deudas",
  "Completa el formulario con los datos de deuda necesarios para realizar un seguimiento y guarda",
];

export default function useGetGuideImages() {
  const [assets, error] = useAssets([
    require(`${ASSETS_PATH}guide_1.png`),
    require(`${ASSETS_PATH}guide_2.png`),
    require(`${ASSETS_PATH}guide_3.png`),
    require(`${ASSETS_PATH}guide_4.png`),
    require(`${ASSETS_PATH}guide_5.png`),
    require(`${ASSETS_PATH}guide_6.png`),
  ]);

  const [data, setData] = useState<ImagesGuides[]>([]);

  useEffect(() => {
    if (assets && data.length === 0) {
      console.table(assets);
      setData(
        assets.map((v, i) => ({
          image: v.localUri || v.uri || "",
          title: IMAGES_TITLES[i] || "",
        })),
      );
    }
  }, [assets, data]);

  const images: ImagesGuides[] = data;

  return {
    images,
    error,
  };
}
