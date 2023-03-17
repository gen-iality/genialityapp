import { DispatchMessageService } from '@/context/MessageService';
import { useForm } from '@/hooks/useForm';
import React, { createRef, useContext, useEffect, useState } from 'react'
import { NetworkingContext } from '../context/NetworkingContext';
import { FormMeeting, IMeeting, IParticipants, TransferType, typeAttendace } from '../interfaces/Meetings.interfaces';

export const useMeetingFormLogic = () => {
    const dataContext = useContext(
        NetworkingContext
    );

    const formRef = createRef<any>();

    const [AttendeesKeyTarget, setAttendeesKeyTarget] = useState<string[]>([]);
    const [selectedAttendesKeys, setSelectedAttendeesKey] = useState<string[]>([]);
    const [attendeesTransfer, setDataTransfer] = useState<TransferType[]>([]);
    const { formState, onInputChange, onResetForm } = useForm<IMeeting>(dataContext.meentingSelect);

    useEffect(() => {
        if (dataContext.edicion) {
            setAttendeesKeyTarget(dataContext.meentingSelect.participants.map((item: any) => item.id));
        }

        //Tranformar todos los asistentes al evento para el transfer
        setDataTransfer(
            dataContext.attendees.map((asistente: any) => ({
                id: asistente.user._id,
                name: asistente.user.names,
                key: asistente.user._id,
                email: asistente.user.email,
                attendance: typeAttendace.unconfirmed,
            }))
        );
    }, []);

    const onChange = (nextAttendeeKeyTarget: string[]) => {
        setAttendeesKeyTarget(nextAttendeeKeyTarget);
    };

    const onSelectChange = (sourceSelectedKeys: string[], targetSelectedKeys: string[]) => {
        setSelectedAttendeesKey([...sourceSelectedKeys, ...targetSelectedKeys]);
    };

    const onSubmit = (datos: FormMeeting) => {
        DispatchMessageService({
            type: 'loading',
            key: 'loading',
            msj: ' Por favor espere mientras se guarda la información...',
            action: 'show',
        })
        try {
            //Buscar los datos de los asistentes
            const participants: IParticipants[] = attendeesTransfer.filter((attendeeTransfer: any) => AttendeesKeyTarget.includes(attendeeTransfer.key));

            //objeto de creacion
            const meeting: Omit<IMeeting, 'id'> = {
                name: datos.name,
                date: datos.date.toString(),
                participants: participants,
                place: datos.place,
                horas: [datos.horas[0].toString(), datos.horas[1].toString()],
                dateUpdated: Date.now(),
            };

            if (dataContext.edicion && datos.id) {
                dataContext.updateMeeting(datos.id, { ...meeting, id: datos.id });
                DispatchMessageService({
                    key: 'loading',
                    action: 'destroy',
                });
                return dataContext.closeModal();
            }
            dataContext.createMeeting(meeting);
            DispatchMessageService({
                key: 'loading',
                action: 'destroy',
            });
            dataContext.closeModal();
        } catch (e: any) {
            DispatchMessageService({
                key: 'loading',
                action: 'destroy',
            });
            DispatchMessageService({
                type: 'error',
                msj: e.response.data.message || e.response.status,
                action: 'show',
            });
            console.log(`Ocurrio un problema al ${dataContext.edicion ? 'editar' : 'guardar'} la reunion`);
            dataContext.closeModal();
        }
    };

    return {
        ...dataContext,
        formRef,
        onSubmit,
        onSelectChange,
        onChange,
        AttendeesKeyTarget,
        selectedAttendesKeys,
        attendeesTransfer,
        formState
    }
}
