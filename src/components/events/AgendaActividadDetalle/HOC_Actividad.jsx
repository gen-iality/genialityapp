/* eslint-disable no-unused-vars */
import { useHelper } from "../../../context/helperContext/hooks/useHelper";
import ImageComponentwithContext from "./ImageComponent";
import RenderComponent from "./RenderComponent";

const HCOActividad = ({ isBingo = false }) => {
  const { currentActivity } = useHelper();

  const formatDateToICS = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().replace(/-|:|\.\d+/g, "") + "Z";
  };

  const generateICSFile = () => {
    const icsContent = `
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Live Events//Live Events//ES
BEGIN:VEVENT
UID:${new Date().getTime()}@geniality.com.co
DTSTAMP:${new Date().toISOString().replace(/-|:|\.\d+/g, "")}Z
DTSTART:${formatDateToICS(currentActivity?.datetime_start)}
DTEND:${formatDateToICS(currentActivity?.datetime_end)}
SUMMARY:${currentActivity?.name || "Actividad sin nombre"}
LOCATION:${currentActivity?.lugar || "Evento virtual"}
DESCRIPTION:${currentActivity?.descripcion || ""}
END:VEVENT
END:VCALENDAR
    `;

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });

    if (navigator.msSaveBlob) { 
      // Para Internet Explorer
      navigator.msSaveBlob(blob, "evento.ics");
    } else {
      const link = document.createElement("a");
      if (link.download !== undefined) { 
        // Para navegadores modernos
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "evento.ics");
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        // Para Safari en iOS, abrir el archivo en una nueva pestaña
        window.open(URL.createObjectURL(blob), "_blank");
      }
    }
  };

  const imageVisible = () => {
    return (
      ((currentActivity?.habilitar_ingreso === "" ||
        currentActivity?.habilitar_ingreso === null ||
        currentActivity?.habilitar_ingreso === "created_meeting_room") &&
        (!currentActivity?.video)) ||
      (!currentActivity?.habilitar_ingreso && !currentActivity?.video)
    );
  };

  return (
    <header>
      <div>
        <RenderComponent isBingo={isBingo} />
        {/* Descomenta la línea siguiente si quieres renderizar SecondVideoActivity cuando currentActivity.secondvideo exista */}
        {/* {currentActivity && currentActivity.secondvideo && <SecondVideoActivity />} */}
        {/* Descomenta la línea siguiente si quieres renderizar ImageComponentwithContext cuando imageVisible sea true */}
        {/* {imageVisible() && <ImageComponentwithContext />} */}
      </div>
      <div
        style={{ textDecoration: "underline", cursor: "pointer" }}
        onClick={generateICSFile}
      >
        Clic aquí para añadir este evento a tú calendario
      </div>
    </header>
  );
};

export default HCOActividad;

