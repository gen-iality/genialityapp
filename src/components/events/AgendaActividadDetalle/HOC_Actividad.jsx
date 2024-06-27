/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { useHelper } from "../../../context/helperContext/hooks/useHelper";
import ImageComponentwithContext from "./ImageComponent";
import RenderComponent from "./RenderComponent";
import { saveAs } from "file-saver";

const HCOActividad = ({ isBingo = false }) => {
  let { currentActivity } = useHelper();

  const formatDateToICS = (dateString) => {
    const [date, time] = dateString.split(" ");
    return date.replace(/-/g, "") + "T" + time.replace(/:/g, "") + "Z";
  };

  const generateICSFile = () => {
    const icsContent = `
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Your Organization//Your Product//EN
BEGIN:VEVENT
UID:${new Date().getTime()}@yourdomain.com
DTSTAMP:${new Date().toISOString().replace(/-|:|\.\d+/g, "")}
DTSTART:${formatDateToICS(currentActivity?.datetime_start)}
DTEND:${formatDateToICS(currentActivity?.datetime_end)}
SUMMARY:${currentActivity?.nombre || "Actividad sin nombre"}
LOCATION:${currentActivity?.lugar || "Ubicación no especificada"}
DESCRIPTION:${currentActivity?.descripcion || "Sin descripción"}
END:VEVENT
END:VCALENDAR
    `;

    const blob = new Blob([icsContent], {
      type: "text/calendar;charset=utf-8",
    });
    saveAs(blob, "evento.ics");
  };

  const imageVisible = () => {
    if (
      ((currentActivity?.habilitar_ingreso === "" ||
        currentActivity?.habilitar_ingreso === null ||
        currentActivity?.habilitar_ingreso === "created_meeting_room") &&
        (currentActivity?.video == null || !currentActivity?.video)) ||
      (!currentActivity?.habilitar_ingreso && !currentActivity?.video)
    ) {
      return true;
    }
    return false;
  };

  return (
    <header>
      <div>
        <RenderComponent isBingo={isBingo} />
        {/* {currentActivity && currentActivity.secondvideo && <SecondVideoActivity />} */}
        {/* {imageVisible() && <ImageComponentwithContext/>} */}
      </div>
      {/* <div
        style={{ textDecoration: "underline", cursor: "pointer" }}
        onClick={generateICSFile}
      >
        Clic aquí para añadir esta actividad al calendario
      </div> */}
    </header>
  );
};

export default HCOActividad;
