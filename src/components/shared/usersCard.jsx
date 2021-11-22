import React, { useEffect, useState, useContext } from 'react';
import { List, Avatar, Badge, Image, Tooltip, Popover, Typography } from 'antd';
import { MessageTwoTone, EyeOutlined, CrownFilled, FileImageOutlined } from '@ant-design/icons';
import PopoverInfoUser from '../socialZone/hooks/Popover';
import { HelperContext } from '../../Context/HelperContext';
import { UseCurrentUser } from '../../Context/userContext';
import moment from 'moment';

const { Paragraph, Title, Text } = Typography;

/** estilos list item */
const styleList = {
  background: 'white',
  color: '#333F44',
  padding: 5,
  margin: 5,
  display: 'flex',
  borderRadius: '8px',
  fontWeight: '500',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  transition: '500ms all',
};

const styleListPointer = {
  background: 'white',
  color: '#333F44',
  padding: 5,
  margin: 5,
  display: 'flex',
  borderRadius: '8px',
  fontWeight: '500',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  cursor: 'pointer',
  transition: '300ms all',
};

function UsersCard(props) {
  let cUser = UseCurrentUser();
  let {
    createNewOneToOneChat,
    HandleChatOrAttende,
    HandlePublicPrivate,
    imageforDefaultProfile,
    HandleGoToChat,
  } = useContext(HelperContext);
  const [actionCapture, setActionCapture] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [avatar, setAvatar] = useState('');
  const { names, name, imageProfile, status, uid, participants, ultimo_mensaje, score, time } = props.item;

  const isAnImage = ultimo_mensaje ? ultimo_mensaje.includes('https://firebasestorage.googleapis.com') : false;

  function getPrivateChatImg() {
    let userLogo = null;
    // console.log('Chat', props.item);
    if (participants) {
      const filtererdImg = participants?.filter((part) => part.idparticipant != cUser.value.uid);

      userLogo = filtererdImg[0]?.profilePicUrl ? filtererdImg[0]?.profilePicUrl : imageforDefaultProfile;
      return userLogo;
    }
    return true;
  }

  function formatName(name) {
    const result = decodeURIComponent(name);
    return result;
  }

  function podiumValidate() {
    switch (props.position + 1) {
      case 1:
        return <CrownFilled style={{ fontSize: '30px', color: '#FFD800' }} rotate={-45} />;
      case 2:
        return <CrownFilled style={{ fontSize: '30px', color: '#DADDE9' }} rotate={-45} />;
      case 3:
        return <CrownFilled style={{ fontSize: '30px', color: '#D36A62' }} rotate={-45} />;
      default:
        break;
    }
  }

  function attendeeRender() {
    setActionCapture(() => {
      return (
        <>
          {cUser.value ? (
            <a
              key='list-loadmore-edit'
              onClick={() => {
                createNewOneToOneChat(
                  cUser.value.uid,
                  cUser.value.names || cUser.value.name,
                  uid,
                  names || name,
                  imageProfile
                );
                HandleChatOrAttende('1');
                HandlePublicPrivate('private');
              }}>
              <Tooltip title={'Chatear'}>
                <MessageTwoTone style={{ fontSize: '24px' }} />
              </Tooltip>
            </a>
          ) : null}
        </>
      );
    });
    setTitle(() => {
      return (
        <>
          {props.propsAttendees ? (
            <Popover
              trigger='hover'
              placement='leftTop'
              content={<PopoverInfoUser item={props.item} props={props.propsAttendees} />}>
              <Text
                ellipsis={{ rows: 1 }}
                style={{
                  color: 'black',
                  cursor: 'pointer',
                  width: '80%',
                  fontSize: '15px',
                  // whiteSpace: 'break-spaces'
                }}
                key='list-loadmore-edit'>
                {name || names}
              </Text>
            </Popover>
          ) : (
            <Text
              ellipsis={{ rows: 1 }}
              style={{
                color: 'black',
                width: '80%',
                fontSize: '15px',
                // whiteSpace: 'break-spaces'
              }}
              key='list-loadmore-edit'>
              {name || names}
            </Text>
          )}
        </>
      );
    });
    setDescription(() => {
      return status === 'online' ? (
        <span style={{ color: '#52C41A' }}>En linea</span>
      ) : (
        <span style={{ color: '#CCCCCC' }}>Desconectado</span>
      );
    });
    setAvatar(() => {
      return (
        <Avatar
          style={{ filter: ' drop-shadow(0px 0px 4px rgba(0, 0, 0, 0.25))' }}
          src={
            <Image
              src={imageProfile !== imageforDefaultProfile ? imageProfile : 'error'}
              preview={{ mask: <EyeOutlined /> }}
              fallback={imageProfile}
            />
          }
          size={45}
        />
      );
    });
  }

  function privateChats() {
    setActionCapture(() => {
      /** Validar que la hora se guarde en firebase */
      return time && <span>{time}</span>;
    });
    setTitle(() => {
      return (
        <Text
          ellipsis={{ rows: 1 }}
          style={{
            color: 'black',
            width: '80%',
            fontSize: '15px',
            // whiteSpace: 'break-spaces'
          }}
          key='list-loadmore-edit'>
          {names || name}
        </Text>
      );
    });
    setDescription(() => {
      return ultimo_mensaje ? (
        isAnImage ? (
          <Text ellipsis={{ rows: 1 }} style={{ color: '#52C41A', width: '90%' }}>
          <FileImageOutlined /> Imagen
        </Text>
        ) : (
          <Text ellipsis={{ rows: 1 }} style={{ color: '#52C41A', width: '90%' }}>
            {ultimo_mensaje}
          </Text>
        )
      ) : (
        <Text ellipsis={{ rows: 1 }} style={{ color: '#CCCCCC', width: '90%' }}>
          No hay mensajes nuevos
        </Text>
      );
    });
    setAvatar(() => {
      return (
        <Avatar
          style={{ filter: ' drop-shadow(0px 0px 4px rgba(0, 0, 0, 0.25))' }}
          src={
            <Image
              src={getPrivateChatImg() !== imageforDefaultProfile ? getPrivateChatImg() : 'error'}
              preview={{ mask: <EyeOutlined /> }}
              fallback={getPrivateChatImg()}
            />
          }
          size={45}
        />
      );
    });
  }

  function ranking() {
    setActionCapture(
      <Text
        style={{
          fontSize: '24px',
          color: `${
            props.position + 1 === 1
              ? '#FFD800'
              : props.position + 1 === 2
              ? '#DADDE9'
              : props.position + 1 === 3
              ? '#D36A62'
              : '#DDDDDD'
          }`,
          fontWeight: '600',
        }}>
        {props.position + 1}
      </Text>
    );
    setTitle(() => {
      return (
        <Text
          ellipsis={{ rows: 1 }}
          style={{
            color: 'black',
            width: '80%',
            fontSize: '15px',
            // whiteSpace: 'break-spaces'
          }}
          key='list-loadmore-edit'>
          {formatName(name || names)}
        </Text>
      );
    });
    setDescription(() => {
      return (
        <div className='animate__animated animate__bounceIn' style={{ color: '#52C41A' }}>
          {score} Pts
        </div>
      );
    });
    setAvatar(() => {
      return (
        <Badge offset={[-40, 3]} count={podiumValidate()}>
          <Avatar
            src={imageProfile ? imageProfile : imageforDefaultProfile}
            style={{ filter: ' drop-shadow(0px 0px 4px rgba(0, 0, 0, 0.25))' }}
            size={45}>
            {!imageProfile && name && name.charAt(0).toUpperCase()}
          </Avatar>
        </Badge>
      );
    });
  }

  function initComponent() {
    switch (props.type) {
      case 'attendees':
        attendeeRender();
        break;
      case 'privateChat':
        privateChats();
        break;
      case 'ranking':
        ranking();
        break;

      default:
        attendeeRender();
        break;
    }
  }

  useEffect(() => {
    initComponent();
  }, [props]);

  return (
    <List.Item
      onClick={() => {
        props.type == 'privateChat'
          ? HandleGoToChat(
              cUser.value.uid,
              props.item.id,
              cUser.value.name ? cUser.value.name : cUser.value.names,
              'private',
              props.item,
              null
            )
          : '';
      }}
      className='efect-scale'
      style={props.type == 'privateChat' ? styleListPointer : styleList}
      actions={[actionCapture]}>
      <List.Item.Meta title={title} description={description} avatar={avatar} />
    </List.Item>
  );
}

export default UsersCard;
