import React, { useEffect, useState, useContext } from 'react'
import { List, Tag, Avatar, Badge, Image, Tooltip, Popover, Typography } from 'antd'
import { MessageTwoTone, CrownFilled, EyeOutlined } from '@ant-design/icons';
import PopoverInfoUser from '../socialZone/hooks/Popover';
import { HelperContext } from '../../Context/HelperContext';
import { UseCurrentUser } from '../../Context/userContext';
import moment from 'moment';

const { Paragraph } = Typography

/** estilos list item */
const styleListAttende = {
    background: 'white',
    color: '#333F44',
    padding: 5,
    margin: 4,
    display: 'flex',
    borderRadius: '5px',
    fontWeight: '500',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
};

function UsersCard(props) {
    let cUser = UseCurrentUser();
    let {
        createNewOneToOneChat,
        HandleChatOrAttende,
        HandlePublicPrivate,
        imageforDefaultProfile,
    } = useContext(HelperContext);
    const [actionCapture, setActionCapture] = useState([])
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [avatar, setAvatar] = useState('')
    const { names, name, imageProfile, status, uid, participants, ultimo_mensaje, score } = props.item

    function getPrivateChatImg() {
        let userLogo = null
        if (participants) {
            const filtererdImg = participants?.filter((part) => part.idparticipant != cUser.value.uid)

            userLogo = filtererdImg[0]?.profilePicUrl
            return userLogo
        }
        return true
    }

    function formatName(name) {
        const result = decodeURIComponent(name);
        return result;
    }

    function podiumValidate() {
        switch (props.position + 1) {
            case 1:
                return <CrownFilled style={{ fontSize: '30px', color: 'yellow' }} rotate={-45} />
            case 2:
                return <CrownFilled style={{ fontSize: '30px', color: 'gray' }} rotate={-45} />
            case 3:
                return <CrownFilled style={{ fontSize: '30px', color: 'brown' }} rotate={-45} />
            default:
                break;
        }
    }

    function attendeeRender() {
        setActionCapture(() => {
            return (<>
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
                        <Tooltip title={'Chatea'}>
                            <MessageTwoTone style={{ fontSize: '27px' }} />
                        </Tooltip>
                    </a>
                ) : null}
            </>)
        })
        setTitle(() => {
            return (
                <>{props.propsAttendees ? <Popover
                    trigger='hover'

                    placement='leftTop'
                    content={<PopoverInfoUser item={props.item} props={props.propsAttendees} />}>
                    <Paragraph
                        ellipsis={{ rows: 2 }}
                        style={{
                            color: 'black',
                            cursor: 'pointer',
                            width: '85%',
                            fontSize: '15px',
                            whiteSpace: 'break-spaces'
                        }}
                        key='list-loadmore-edit'>
                        {names || name}
                    </Paragraph>
                </Popover> : <Paragraph
                    ellipsis={{ rows: 2 }}
                    style={{
                        color: 'black',
                        width: '85%',
                        fontSize: '15px',
                        whiteSpace: 'break-spaces'
                    }}
                    key='list-loadmore-edit'>
                    {names || name}
                </Paragraph>
                }
                </>
            )
        })
        setDescription(() => {
            return (
                status === 'online' ? (
                    <span style={{ color: '#52C41A' }}>En linea</span>
                ) : (
                    <span style={{ color: '#CCCCCC' }}>Offline</span>
                )
            )
        })
        setAvatar(() => {
            return (
                <Avatar src={<Image src={imageProfile !== imageforDefaultProfile ? imageProfile : 'error'} preview={{ mask: <EyeOutlined /> }} fallback={imageProfile} />} size={45} />
            )
        })
    }

    function privateChats() {
        setActionCapture(() => {
            /** Validar que la hora se guarde en firebase */
            return (ultimo_mensaje && <span>{moment().format('h:mm A')}</span>)
        })
        setTitle(() => {
            return (
                <Paragraph
                    ellipsis={{ rows: 2 }}
                    style={{
                        color: 'black',
                        width: '85%',
                        fontSize: '15px',
                        whiteSpace: 'break-spaces'
                    }}
                    key='list-loadmore-edit'>
                    {names || name}
                </Paragraph>

            )
        })
        setDescription(() => {
            return (
                ultimo_mensaje ? (
                    <span style={{ color: '#52C41A' }}>{ultimo_mensaje}</span>
                ) : (
                    <span style={{ color: '#CCCCCC' }}>No hay mensajes nuevos</span>
                )
            )
        })
        setAvatar(() => {
            return (
                <Avatar src={<Image src={getPrivateChatImg() !== imageforDefaultProfile ? getPrivateChatImg() : 'error'
                }
                    preview={{ mask: <EyeOutlined /> }} fallback={getPrivateChatImg()} />}
                    size={45} />
            )
        })
    }

    function ranking() {
        setActionCapture(<span>{props.position + 1}</span>)
        setTitle(() => {
            return (
                <Paragraph
                    ellipsis={{ rows: 2 }}
                    style={{
                        color: 'black',
                        width: '85%',
                        fontSize: '15px',
                        whiteSpace: 'break-spaces'
                    }}
                    key='list-loadmore-edit'>
                    {formatName(name || names)}
                </Paragraph>

            )
        })
        setDescription(() => {
            return (
                <span >{score}</span>
            )
        })
        setAvatar(() => {
            return (
                <Badge offset={[-40, 2]} count={podiumValidate()}><Avatar size={45}>{name && name.charAt(0).toUpperCase()}</Avatar></Badge>

            )
        })
    }

    function initComponent() {
        switch (props.type) {
            case 'attendees':
                attendeeRender()
                break;
            case 'privateChat':
                privateChats()
                break;
            case 'ranking':
                ranking()
                break;

            default:
                attendeeRender()
                break;
        }

    }

    useEffect(() => {
        initComponent()
    }, [ultimo_mensaje, status])

    return (
        <List.Item
            style={styleListAttende}
            actions={[actionCapture]}>
            <List.Item.Meta
                title={title}
                description={description}
                avatar={avatar}
            />
        </List.Item>
    )
}

export default UsersCard
