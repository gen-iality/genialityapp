/* eslint-disable no-unused-vars */
import { useCallback, useContext, useEffect, useState } from "react";
import { useHelper } from "../../../context/helperContext/hooks/useHelper";
import ImageComponentwithContext from "./ImageComponent";
import RenderComponent from "./RenderComponent";
import { createEvent } from "ics";
import { saveAs } from "file-saver";
import { CurrentEventContext } from "@/context/eventContext";

const HCOActividad = ({ isBingo = false }) => {
  const { currentActivity } = useHelper();
  const cEventContext = useContext(CurrentEventContext);

  // const generateICSFile = () => {
  //   const event = {
  //     start: formatDateToICSArray(currentActivity?.datetime_start),
  //     end: formatDateToICSArray(currentActivity?.datetime_end),
  //     title: currentActivity?.name || "Actividad sin nombre",
  //     description: currentActivity?.descripcion || "",
  //     location: currentActivity?.lugar || "Evento virtual",
  //     url: `https://liveevents.geniality.com.co/${cEventContext.nameEvent}`,
  //     status: "CONFIRMED",
  //     organizer: { name: "Live Events", email: "alerts@geniality.com.co" },
  //   };

  //   createEvent(event, (error, value) => {
  //     if (error) {
  //       console.error(error);
  //       return;
  //     }
  //     const blob = new Blob([value], { type: "text/calendar;charset=utf-8" });
  //     saveFile(blob);
  //   });
  // };

  // const formatDateToICSArray = (dateString) => {
  //   if (!dateString) return null;
  //   // Parsea la fecha y hora de inicio
  //   const [date, time] = dateString.split(" ");
  //   const [year, month, day] = date.split("-").map((num) => parseInt(num, 10));
  //   const [hour, minute] = time.split(":").map((num) => parseInt(num, 10));

  //   // Retorna el arreglo en el formato esperado por ics
  //   return [year, month, day, hour, minute];
  // };

  // const saveFile = (blob) => {
  //   if (navigator.msSaveBlob) {
  //     // Para Internet Explorer
  //     navigator.msSaveBlob(blob, "evento.ics");
  //   } else {
  //     const link = document.createElement("a");
  //     if (link.download !== undefined) {
  //       // Para navegadores modernos
  //       const url = URL.createObjectURL(blob);
  //       link.setAttribute("href", url);
  //       link.setAttribute("download", "evento.ics");
  //       link.style.visibility = "hidden";
  //       document.body.appendChild(link);
  //       link.click();
  //       document.body.removeChild(link);
  //     } else {
  //       // Para Safari en iOS, abrir el archivo en una nueva pestaña
  //       window.open(URL.createObjectURL(blob), "_blank");
  //     }
  //   }
  // };

  const imageVisible = () => {
    return (
      ((currentActivity?.habilitar_ingreso === "" ||
        currentActivity?.habilitar_ingreso === null ||
        currentActivity?.habilitar_ingreso === "created_meeting_room") &&
        !currentActivity?.video) ||
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
      {/* <div
        style={{ textDecoration: "underline", cursor: "pointer" }}
        onClick={generateICSFile}
        align="center"
      >
        Clic aquí para añadir este evento a tú calendario
      </div> */}
    </header>
  );
};

export default HCOActividad;
