import { useState, useEffect } from "react";
import WithEviusContext from "../../../context/withContext";
import { useHelper } from "../../../context/helperContext/hooks/useHelper";
import { Result } from "antd";
import {
  ClockCircleOutlined,
  LoadingOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import "./styles.css";

const imageBack1 =
  "https://firebasestorage.googleapis.com/v0/b/magnetic-be10a.appspot.com/o/images%2FEscenario_detas_camaras.jpg?alt=media&token=4699a1a9-5018-4c01-9036-132a984990b9";

const ImageComponent = (props) => {
  let { currentActivity } = useHelper();
  const [, setactivityState] = useState("");

  useEffect(() => {
    setactivityState(currentActivity?.habilitar_ingreso);
    return () => {
      setactivityState("");
    };
  }, [currentActivity]);

  console.log(currentActivity.image);

  const RenderTextActivity = (state) => {
    switch (state) {
      case "created_meeting_room":
        return "El contenido está siendo configurado para que puedas disfrutar de esta actividad.";
      case "closed_meeting_room":
        return "La actividad iniciará pronto. ¡Prepárate!";
      default:
        return "El contenido de esta actividad no esta cargada, disponible próximamente.";
    }
  };
  const getIcon = (state) => {
    switch (state) {
      case "created_meeting_room":
        return <ClockCircleOutlined style={{ color: "#33FF93" }} />;
      case "closed_meeting_room":
        return <LoadingOutlined style={{ color: "#33FF93" }} />;
      default:
        return <SettingOutlined />;
    }
  };

  const customStyles = {
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${imageBack1})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    height: "60vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
};

  return (
    <div className="mediaplayer" style={customStyles}>
      {currentActivity ? (
        <Result
          icon={getIcon(currentActivity.habilitar_ingreso)}
          title={
            <span className="blinking-text">
              {RenderTextActivity(currentActivity.habilitar_ingreso)}
            </span>
          }
        />
      ) : (
        <Result icon={getIcon("")} title={RenderTextActivity("")} />
      )}
    </div>
  );
};

let ImageComponentwithContext = WithEviusContext(ImageComponent);
export default ImageComponentwithContext;
