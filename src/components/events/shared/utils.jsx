import { SettingOutlined, SolutionOutlined, IdcardOutlined, NotificationOutlined, ApartmentOutlined, EditOutlined, BarChartOutlined } from '@ant-design/icons';
const handleClick = (e) => {
    if (!navigator.onLine) e.preventDefault();
};


export const MenuItems = [
    {
        name: 'Configuración General',
        icon: <SettingOutlined />,
        key: 'main',
        items: [
            {
                name: 'Datos del evento',
                path: '/main',
                key: 'datos-evento',
                onClick: handleClick
            }, {
                name: '  Apariencia del evento',
                path: '/styles',
                key: 'apariencia-evento',
                onClick: handleClick
            }, {
                name: 'Habilitar secciones del evento',
                path: '/menuLanding',
                key: 'habilitar-secciones',
                onClick: handleClick
            }, {
                name: 'Configuración de tickets',
                path: '/ticketsEvent',
                key: 'configuracion-tickets',
                onClick: handleClick
            }
        ]
    },
    {
        name: 'Contenido del evento',
        icon: <EditOutlined />,
        key: 'event-content',
        items: [
            {
                name: 'Agenda/Actividades',
                path: '/agenda',
                key: 'agenda',
                onClick: handleClick
            }, {
                name: 'Empresas',
                path: '/empresas',
                key: 'empresas',
                onClick: handleClick
            }, {
                name: 'Host/Anfitriones',
                path: '/speakers',
                key: 'speakers',
                onClick: handleClick
            }, {
                name: 'Espacios',
                path: '/espacios',
                key: 'espacios',
                onClick: handleClick
            }, {
                name: 'Certificados',
                path: '/certificados',
                key: 'certificados',
                onClick: handleClick
            }, {
                name: 'Encuestas',
                path: '/trivia',
                key: 'encuestas',
                onClick: handleClick
            }, {
                name: 'Noticias',
                path: '/news',
                key: 'noticias',
                onClick: handleClick
            }, {
                name: 'Preguntas Frecuentes',
                path: '/faqs',
                key: 'preguntas-frecuentes',
                onClick: handleClick
            }, {
                name: 'Documentos',
                path: '/documents',
                key: 'documentos',
                onClick: handleClick
            }, {
                name: ' Contenido Informativo',
                path: '/informativesection',
                key: 'contenido-informativo',
                onClick: handleClick
            }, {
                name: '  Reporte de Networking',
                path: '/reportNetworking',
                key: 'reporte-networking',
                onClick: handleClick
            }, {
                name: 'Producto',
                path: '/product',
                key: 'producto',
                onClick: handleClick
            }
        ]
    },
    {
        name: 'Configuración Asistentes',
        icon: <SolutionOutlined />,
        key: 'attende-config',
        items: [ {
            name: ' Datos/Campos a recolectar de asistentes',
            path: '/datos',
            key: 'datos-campos-asistentes',
            onClick: handleClick
        }, {
            name: 'Confirmación registro',
            path: '/confirmacion-registro',
            key: 'confirmacion-registro',
            onClick: handleClick
        }, {
            name: ' Organizadores',
            path: '/staff',
            key: 'organizadores',
            onClick: handleClick
        }

        ]
    },
    {
        name: 'Asistentes',
        icon: <IdcardOutlined />,
        key: 'attendesCms',
        items: [
            {
                name: ' Asistentes / Checkin',
                path: '/assistants',
                key: 'asistentes-checkin',
                onClick: handleClick
            }, {
                name: ' Check In por Actividad',
                path: '/checkin-actividad',
                key: 'checkin-actividad',
                onClick: handleClick
            }, {
                name: ' Gestion de Chats',
                path: '/chatexport',
                key: 'gestion-chats',
                onClick: handleClick
            }, {
                name: '  Enviar Correos a Asistentes',
                path: '/invitados',
                key: 'enviar-correos-asistentes',
                onClick: handleClick
            }
        ]
    },
    {
        name: 'Comunicaciones',
        icon: <NotificationOutlined />,
        key: 'Comunicaciones',
        items: [
            {
                name: 'Comunicaciones enviadas',
                path: '/messages',
                key: 'comunicaciones-enviadas',
                onClick: handleClick
            }, {
                name: 'Enviar información a asistentes',
                path: '/invitados',
                key: 'enviar-informacion-asistentes',
                onClick: handleClick
            }
        ]
    },
    {
        name: 'Estadisticas',
        icon: <BarChartOutlined />,
        key: 'estadisticas',
        items: [
            {
                name: 'Estadísticas del evento',
                path: '/dashboard',
                key: 'estadisticas-evento',
                onClick: handleClick
            }

        ]
    },

]