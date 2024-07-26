import { UseEventContext } from "@/context/eventContext";
import { useHelper } from "@/context/helperContext/hooks/useHelper";
import { firestore } from "@/helpers/firebase";
import { Alert, Button, Space, Grid, Modal } from "antd";
import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import {
  EventAccessActionButtonsInterface,
  EventAccessActionInterface,
  informativeMessagesInterface,
} from "../interfaces/interfaces";
import { assignStatusAccordingToAction } from "./utils/utils";
import { useIntl } from "react-intl";
import ConditionalModal from "@/components/authentication/ConditionalModal";
import { useEventCapacityValidator } from "@/events-capacity";
import { useModalLogic } from "@/hooks/useModalLogic";
import { CapacityCompleted } from "@/events-capacity/components/CapacityCompleted";
import { UseCurrentUser } from "@/context/userContext";

const { useBreakpoint } = Grid;

const EventAccessAction = ({ eventAction }: EventAccessActionInterface) => {
  let cEvent = UseEventContext();
  let cUser = UseCurrentUser();
  const history = useHistory();
  const intl = useIntl();
  const initialButtonsState = [{ label: "INITIAL_STATE", action: () => {} }];
  const informativeMessagesState = [{ label: "INITIAL_STATE" }];
  const bgColor = cEvent?.value?.styles?.toolbarDefaultBg;
  const textColor = cEvent?.value?.styles?.textMenu;
  const [eventData, setEventData] = useState<any>({});
  const screens = useBreakpoint();
  const [modal, setModal] = useState(false);
  const [blockRegistration, setBlockRegistration] = useState(false);
  const { isCompletedAforo, isEventUser } = useEventCapacityValidator();
  const idEvent = cEvent?.value?._id;
  const [buttonsActions, setButtonsActions] = useState<
    EventAccessActionButtonsInterface[]
  >(initialButtonsState);
  const [informativeMessages, setInformativeMessage] = useState<
    informativeMessagesInterface[]
  >(informativeMessagesState);
  let { handleChangeTypeModal, helperDispatch } = useHelper();
  const { closeModal, isOpenModal, openModal } = useModalLogic();
  const ORIGINAL_EVENT_ID: { [key: string]: string } = {
    "64f2159bf5076637df054592": "64cacb2d6014cebb340ef142", // demo wom
    /* '64230dc18611006a490d6022' : '645536848fb7b0e0dd0eb262' */ //evento de pruebas para aleja
  };
  const [shouldShowLoginButton, setShouldShowLoginButton] = useState(true);

  const handleFunction = (
    params: EventAccessActionButtonsInterface[]
  ): EventAccessActionButtonsInterface[] => {
    const fakeEvents = Object.keys(ORIGINAL_EVENT_ID);
    if (fakeEvents.includes(cEvent.value._id)) {
      return [
        {
          label: "Ingresar al evento",
          action: () => {
            setModal(true);
          },
        },
      ];
    } else {
      return buttonsActions;
    }
  };
  const onRegisterUser = async (action: () => void) => {
    const isCompleted = await isCompletedAforo(cEvent.value._id);
    setBlockRegistration(isCompleted);
    if (isCompleted)
      return Modal.warning({
        title: "Capacidad insuficiente",
        content: `El evento ha llegado al máximo de participantes disponibles, si cree que es un error, comuníquese con el administrador del evento`,
      });
    action();
  };

  useEffect(() => {
    if (idEvent && !Object.keys(eventData).length) {
      const unsubscribe = firestore
        .collection("events")
        .doc(idEvent)
        .onSnapshot((snapshot) => {
          const data = snapshot.data();
          if (!!data && Object.keys(data).includes("_id")) {
            setEventData(data);
          } else {
            setEventData(cEvent.value);
          }
        });
      return () => unsubscribe();
    }
  }, []);

  /*  useEffect(() => {
    console.log({ eventData, cEvent });
  }, [eventData, cEvent]); */

  useEffect(() => {
    const assignStatusAccordingToActionParams = {
      setButtonsActions,
      setInformativeMessage,
      initialButtonsState,
      informativeMessagesState,
      eventAction,
      handleChangeTypeModal,
      helperDispatch,
      cEvent: eventData || cEvent,
      history,
      intl,
    };

    assignStatusAccordingToAction(assignStatusAccordingToActionParams);

    return () => {
      setInformativeMessage(informativeMessagesState);
      setButtonsActions(initialButtonsState);
 
    };
  }, [eventAction, eventData]);

  useEffect(() => {
    // Paso 1: Obtén el ID de la ruta actual.
    // Asumiendo que `history` es un objeto proporcionado por React Router y contiene la ruta actual.
    const currentRouteId = history.location.pathname.split("/").pop();

    // Paso 2: Comprueba si el ID de la ruta es igual a `6663656f68f89bcf0a0896d2`.
    if (currentRouteId === "6663656f68f89bcf0a0896d2") {
      // Si el ID coincide, puedes establecer una variable de estado o realizar alguna acción
      // para evitar mostrar el botón "Iniciar sesión".
      // Por ejemplo, establecer un estado que controle la visibilidad del botón.
      setShouldShowLoginButton(false);
      return; // Salir temprano para evitar ejecutar más lógica en este efecto.
    }
    setShouldShowLoginButton(false);

    // El resto de tu lógica useEffect aquí...
    const fetchAforoCompleted = async () => {
      if (cUser.status === "LOADED") {
        const isLoginUser = !!cUser.value;
        if (isLoginUser) {
          const isRegisterInEvent = await isEventUser(
            cEvent.value._id,
            cUser.value.email
          );
          if (isRegisterInEvent) return;
          const isCompleted = await isCompletedAforo(cEvent.value._id);
          // Continúa con la lógica existente...
        }
      }
    };

    // Llama a la función asincrónica si es necesario.
    fetchAforoCompleted();
  }, [
    eventAction,
    eventData,
    history,
    cUser.status,
    cUser.value,
    cEvent.value,
  ]);

  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      {handleFunction(buttonsActions).map((button, index) => (
        <>
          {button.label !== "INITIAL_STATE" &&
            (button.label === "Iniciar sesión" &&
            !shouldShowLoginButton ? null : (
              <Button
                disabled={
                  button.label === "Inscribirme al evento" && blockRegistration
                }
                key={`${index}-${button.label}`}
                block
                className={
                  button.label === "Ingresar al evento"
                    ? "animate__animated animate__heartBeat animate__slower animate__infinite"
                    : "animate__animated animate__heartBeat animate__slower animate__infinite"
                }
                style={{
                  height: "48px",
                  padding: "6.4px 30px",
                  color:
                    idEvent !== "6334782dc19fe2710a0b8753"
                      ? bgColor
                      : "#c55a95",
                  backgroundColor: textColor,
                  border: "none",
                  width: screens.xs ? "300px" : "",
                }}
                type="primary"
                size="large"
                onClick={
                  button.label === "Inscribirme al evento"
                    ? () => onRegisterUser(button.action)
                    : button.action
                }
              >
                {blockRegistration && button.label === "Inscribirme al evento"
                  ? "Capacidad Superada"
                  : button.label}
              </Button>
            ))}
        </>
      ))}
      <ConditionalModal
        visible={modal}
        setVisible={setModal}
        realEvent={ORIGINAL_EVENT_ID[cEvent.value._id] ?? ""}
        key={"conditional-key"}
        bgColor={bgColor}
        textColor={textColor}
      />

      {isOpenModal && (
        <CapacityCompleted visible={isOpenModal} onCancel={closeModal} />
      )}
      {informativeMessages.map((message) => (
        <>
          {message.label !== "INITIAL_STATE" && (
            <Alert message={message.label} type="success" />
          )}
        </>
      ))}
    </Space>
  );
};

export default EventAccessAction;
