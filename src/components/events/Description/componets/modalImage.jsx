import ImageUploaderDragAndDrop from "@/components/imageUploaderDragAndDrop/imageUploaderDragAndDrop";
import { message, Modal } from "antd";
import { useState, useEffect } from "react";

const ModalImageComponent = ({ type, setType, saveItem, initialValue }) => {
    const [image, setImage] = useState(null);

    useEffect(() => {
        if (type !== "image") return;
        !initialValue ? setImage(null) : setImage(initialValue.value);
        console.log("SE EJECUTA EL EFFECT IMAGE==>", initialValue);
        return () => setType(null);
    }, [type]);

    const saveImage = () => {
        if (image) {

            const item = {
                ...initialValue,
                type: 'image',
                value: image
            }
            saveItem(item);
            setType(null);
        } else {
            message.error("Seleccione una imagen para poder guardar")
        }

    }
    const handleImage = (imageUrl) => {
        setImage(imageUrl)
    }
    return (
        <Modal title="Agregar componente de imagen" visible={type == 'image'} onOk={saveImage} onCancel={() => setType(null)}>
            <ImageUploaderDragAndDrop
                imageDataCallBack={(imageUrl) => handleImage(imageUrl)}
                imageUrl={image}
                width='80'
                height='80'
            />
        </Modal>
    );

}

export default ModalImageComponent;