import { useState, useEffect } from "react";
import { Steps, Typography, Input, Button, Form } from "antd";
import { useIntl } from "react-intl";
import FormEnrollAttendeeToEvent from "@/components/forms/FormEnrollAttendeeToEvent";
import { UseUserEvent } from "@/context/eventUserContext";
import { UseCurrentUser } from "@/context/userContext";
import { UseEventContext } from "../../context/eventContext";
import { useHelper } from "../../context/helperContext/hooks/useHelper";
import { DispatchMessageService } from "../../context/MessageService";
import { AttendeeApi } from "@/helpers/request";
import { fieldNameEmailFirst } from "@/helpers/utils";
import { app } from "../../helpers/firebase";
import openNewWindow from "./services/openNewWindow";
import { eventAttendeesService } from "@/services/eventAttendees.service";

const { Step } = Steps;
const { Title } = Typography;

interface RegisterUserAndEventUserProps {
  screens: any;
  stylePaddingMobile: any;
  stylePaddingDesktop: any;
}

const RegisterUserAndEventUser: React.FC<RegisterUserAndEventUserProps> = ({
  screens,
  stylePaddingMobile,
  stylePaddingDesktop,
}) => {
  const intl = useIntl();
  const cEvent = UseEventContext();
  const cEventUser = UseUserEvent();
  const cUser = UseCurrentUser();
  const { helperDispatch } = useHelper();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [emailError, setEmailError] = useState<string | JSX.Element>("");
  const { fields_conditions, type_event, _id, user_properties } =
    cEvent?.value || {};
  const fields = fieldNameEmailFirst(user_properties);

  const labelButton =
    cEvent?.value?._id === "6334782dc19fe2710a0b8753"
      ? "Inscribirme y donar"
      : "Ingresar";
  let attendee: any = cUser.value || {};
  attendee["properties"] = cUser.value;

  const handleEmailSubmit = async () => {
    if (email) {
      setLoading(true);
      setEmailError("");
      try {
        const eventUsers = await AttendeeApi.getAll(_id);
        const eventUser = eventUsers.data.find(
          (user: any) => user.properties.email === email
        );

        if (eventUser) {
          const user = await app.auth().signInAnonymously();
          await app.auth().currentUser?.updateProfile({
            displayName: eventUser.properties.names,
            photoURL: email,
          });
        } else {
          setEmailError(
            <>
              El correo no se encuentra registrado, verifícalo{" "}
              <a
                onClick={() => setEmailSubmitted(false)}
                style={{ textDecoration: "underline", cursor: "pointer" }}
              >
                regístrate nuevamente aquí.
              </a>
            </>
          );
        }
      } catch (err) {
        console.error(err);
        DispatchMessageService({
          type: "error",
          msj: "Ha ocurrido un error",
          action: "show",
        });
      } finally {
        setLoading(false);
      }
    } else {
      DispatchMessageService({
        type: "error",
        msj: "Por favor ingrese un correo electrónico válido",
        action: "show",
      });
    }
  };

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const user = await app.auth().signInAnonymously();
      await app.auth().currentUser?.updateProfile({
        displayName: values.names,
        photoURL: values.email, // almacenamos el email en el photoURL para setearlo en el context del usuario
      });
      if (user.user) {
        const body = {
          event_id: cEvent.value._id,
          uid: user.user?.uid,
          anonymous: true,
          properties: {
            ...values,
          },
        };
        await app.auth().currentUser?.reload();
        await AttendeeApi.create(cEvent.value._id, body);
        cEventUser.setUpdateUser(true);
        helperDispatch({ type: "showLogin", visible: false });
        openNewWindow(
          "https://donaronline.org/fundacion-ellen-riegner-de-casas/pink-yoga-by-audi",
          cEvent.value._id,
          true
        );
      }
    } catch (err) {
      DispatchMessageService({
        type: "error",
        msj: "Ha ocurrido un error",
        action: "show",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {emailSubmitted ? (
        <div style={{ textAlign: "center" }}>
          <Title level={3}>
            {intl.formatMessage({
              id: "modal.title.registerevent.email",
              defaultMessage: "Ingresar al evento",
            })}
          </Title>
          <p>
            Escribe el correo electrónico con el que te hayas registrado
            anteriormente para acceder o{" "}
            <a
              onClick={() => setEmailSubmitted(false)}
              style={{ textDecoration: "underline", cursor: "pointer" }}
            >
              regístrate nuevamente aquí.
            </a>
          </p>
          <Form onFinish={handleEmailSubmit}>
            <Form.Item
              name="email"
              rules={[
                {
                  required: true,
                  message: "Por favor ingrese su correo electrónico",
                },
                {
                  type: "email",
                  message: "Por favor ingrese un correo electrónico válido",
                },
              ]}
            >
              <Input
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Item>
            {emailError && <p style={{ color: "red" }}>{emailError}</p>}
            <Button type="primary" htmlType="submit" loading={loading}>
              Ingresar
            </Button>
          </Form>
        </div>
      ) : (
        <div style={{ textAlign: "center" }}>
          <Title level={3} style={{ textAlign: "center" }}>
            Información para el evento
          </Title>
          <FormEnrollAttendeeToEvent
            saveAttendee={handleSubmit}
            fields={fields}
            attendee={attendee}
            conditionalFields={fields_conditions}
            loaderWhenSavingUpdatingOrDelete={loading}
            submitButtonProps={{
              styles: {
                marginTop: "20px",
              },
              text: labelButton,
            }}
          />
          <p>¿Ya te has registrado o ingresado a este evento?</p>
          <Button
            size="small"
            onClick={() => setEmailSubmitted(true)}
            style={{ textDecoration: "underline", cursor: "pointer" }}
          >
            Clic para acceder con tu correo
          </Button>
        </div>
      )}
    </div>
  );
};

export default RegisterUserAndEventUser;
