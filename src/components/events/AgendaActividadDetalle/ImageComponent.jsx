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

const vimeoVideoUrl =
  "https://player.vimeo.com/video/970166216?title=0&byline=0&portrait=0&badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&loop=1&muted=1";

const ImageComponent = (props) => {
  let { currentActivity } = useHelper();
  const [, setactivityState] = useState("");

  useEffect(() => {
    setactivityState(currentActivity?.habilitar_ingreso);
    return () => {
      setactivityState("");
    };
  }, [currentActivity]);

  const RenderTextActivity = (state) => {
    switch (state) {
      case "created_meeting_room":
        return "Estamos configurando el contenido para que puedas disfrutarlo. ¡Espéralo!";
      case "closed_meeting_room":
        return "La actividad iniciará pronto. ¡Prepárate!";
      default:
        return "El contenido de esta actividad no está cargado, disponible próximamente.";
    }
  };

  const getIcon = (state) => {
    switch (state) {
      case "created_meeting_room":
        return <ClockCircleOutlined style={{ color: "#33FF93", fontSize: "2.5rem" }} />;
      case "closed_meeting_room":
        return <LoadingOutlined style={{ color: "#33FF93", fontSize: "2.5rem" }} />;
      default:
        return <SettingOutlined />;
    }
  };

  const customStyles = {
    position: "relative",
    height: "auto",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    backgroundColor: "black",
  };

  const iframeContainerStyles = {
    padding: "56.25% 0 0 0",
    position: "relative",
    width: "100%",
    height: "100%",
  };

  const iframeStyles = {
    position: "absolute",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    border: "none",
  };

  const overlayStyles = {
    position: "absolute",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    zIndex: "0",
  };

  return (
    <div className="mediaplayer" style={customStyles}>
      <div style={iframeContainerStyles}>
        <iframe
          src={vimeoVideoUrl}
          allow="autoplay; fullscreen; picture-in-picture"
          style={iframeStyles}
          title="video_back"
        ></iframe>
        <div style={overlayStyles} className="content">
          {currentActivity ? (
            <Result
              icon={getIcon(currentActivity.habilitar_ingreso)}
              title={
                <span
                  className="blinking-text"
                  style={{ background: "rgba(0, 0, 0, 0.5)" }}
                >
                  {RenderTextActivity(currentActivity.habilitar_ingreso)}
                </span>
              }
            />
          ) : (
            <Result icon={getIcon("")} title={RenderTextActivity("")} />
          )}
        </div>
      </div>
    </div>
  );
};

let ImageComponentwithContext = WithEviusContext(ImageComponent);
export default ImageComponentwithContext;
