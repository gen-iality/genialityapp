import { useContext } from "react";
import { Button, Typography, Space, Row, Col, Card, Tabs } from "antd";
import AgendaContext from "../../../../context/AgendaContext";
import { useCurrentUser } from '@context/userContext';

const VimeoStreamingPanel = ({ meeting_id, activityEdit }) => {
  const vimeoUrl = "https://vimeo.com/";
  const vimeoPlayerUrl = "https://player.vimeo.com/video/";
  const vimeoCreateTransmissionUrl =
    "https://vimeo.zendesk.com/hc/es/articles/115012811168-Resumen-Crear-un-evento-y-transmitir-en-vivo#:~:text=El%20primer%20paso%20para%20transmitir,que%20sea%20un%20evento%20%C3%BAnico.";
  const streamYardUrl =
    "https://streamyard.com/teams/nqMJDiHJSBnP5E7bmGs7JyZV/broadcasts";
  //Link para eviusmeet dónde se origina el video
  const eviusmeets = `https://stagingeviusmeet.netlify.app/prepare`;
  let cUser = useCurrentUser();
  //   const eventContext = useContext(CurrentEventContext);
  const { transmition } = useContext(AgendaContext);
  const { names, email, picture } = cUser.value;
  let linkAdmin =
    eviusmeets +
    `?meetingId=${activityEdit}&rol=1&username=${names}&email=${email}&photo=${picture ? picture : ""
    }`;

  console.log("debug transmition ", transmition);

  function WhatPlatformWillItBeBroadcastOn(transmition) {
    switch (transmition) {
      case "StreamYard":
        return (
          <Button type="primary" href={streamYardUrl} target="_blank">
            {transmition === "StreamYard" &&
              `Configurar transmisión en StreamYard`}
          </Button>
        );
      case "EviusMeet":
        return (
          <>
            <Button type="primary" href={linkAdmin} target="_blank">
              Ingresar a EviusMeets para transmitir
            </Button>
            <Button
              type="secondary"
              href={vimeoCreateTransmissionUrl}
              target="_blank"
            >
              Como crear una transmisión en Vimeo?
            </Button>
          </>
        );
      case "RTMP":
        return "";
      default:
        break;
    }
  }

  return (
    <>
      <br />
      <Card bordered style={{ borderRadius: "10px" }}>
        <Row gutter={[ 16, 16 ]}>
          <Col span={24}>
            <Row justify="space-between">
              <Space>
                <Button type="primary" href={vimeoUrl} target="_blank">
                  Configurar transmisión en Vimeo
                </Button>
                {WhatPlatformWillItBeBroadcastOn(transmition)}
              </Space>
            </Row>
          </Col>
        </Row>
      </Card>
      {transmition && (
        <>
          <br />
          <Card bordered style={{ borderRadius: "10px" }}>
            <Row gutter={[ 16, 16 ]}>
              <Col span={10}>
                {/* {transmition !== 'EviusMeet' ? (
                  <> */}
                <iframe
                  src={`${vimeoPlayerUrl}${meeting_id}`}
                  allowusermedia
                  frameborder="0"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowfullscreen
                  style={{ width: "100%", height: "100%" }}
                ></iframe>
              </Col>
              <Col span={14}>
                <Tabs defaultActiveKey="1">
                  <Tabs.TabPane tab={"Datos"} key="1">
                    <Typography.Text type="secondary">
                      ID transmisión:
                      <br />
                    </Typography.Text>
                    <Typography.Text>
                      <b>{meeting_id}</b> <br />
                    </Typography.Text>
                    <Typography.Text type="secondary">
                      Proveedor de transmisión:
                      <br />
                    </Typography.Text>
                    <b>Vimeo</b>
                    <br />
                    <Typography.Text type="secondary">
                      Origen de transmisión:
                      <br />
                    </Typography.Text>
                    <b>{transmition}</b>
                    <Typography.Text>
                      <Space>{/* <b>{livestreamStatus?.state}</b> */}</Space>{" "}
                      <br />
                    </Typography.Text>
                    <Typography.Text type="secondary">
                      {/* Origin conectado: */}
                      <br />
                    </Typography.Text>
                    <Typography.Text>
                      <Space>
                        <b>
                          {/* {livestreamStats && livestreamStats?.connected && <>{livestreamStats?.connected.value}</>} */}
                        </b>
                      </Space>{" "}
                      <br />
                    </Typography.Text>
                    <Typography.Text type="secondary">
                      {/* Estado del origen: */}
                      <br />
                    </Typography.Text>
                    <Typography.Text>
                      <Space>
                        <b>
                          {/* {livestreamStats && livestreamStats?.connected && <>{livestreamStats?.connected.status}</>} */}
                        </b>
                      </Space>{" "}
                      <br />
                    </Typography.Text>
                    <Typography.Text type="secondary">
                      {/* Información:  */}
                      <br />
                    </Typography.Text>
                    <Typography.Text>
                      <Space>
                        {/* <b>{livestreamStats && livestreamStats?.connected && <>{livestreamStats?.connected.text}</>}</b> */}
                      </Space>{" "}
                      <br />
                    </Typography.Text>
                  </Tabs.TabPane>
                </Tabs>
              </Col>
            </Row>
          </Card>
          <br />
        </>
      )}
    </>
  );
};
export default VimeoStreamingPanel;
