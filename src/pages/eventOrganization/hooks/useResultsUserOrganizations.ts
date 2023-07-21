import { useState } from 'react'

export const useResultsUserOrganizations = () => {
    const [backToCreate, setbackToCreate] = useState(false);
    const [loadingRequest, setLoadingRequest] = useState(false);
    const [resultData, setresultData] = useState({
        title: '',
        subTitle: '',
    });

    const onContinueCreating = () => {
        setbackToCreate(false);
    };


    const resultEmailExist = () => {
        setresultData({
            title: 'El correo electronico ya existe',
            subTitle: 'Puede cambiarlo o agregar el usuario a tu organizacion',
        });
    };

    const resultUserExistIntoOrganization = (email: string) => {
        setresultData({
            title: 'EL usuario ya es miembro',
            subTitle: `El usuario con email: ${email} ya es miembro de esta organizacion`,
        });
        setbackToCreate(false);
        setLoadingRequest(false);
    };

    const resultUnexpectedError = () => {
        setresultData({ title: 'Error inesperado', subTitle: 'Ocurrio un error inesperado creando el usuario' });
    };

    const resultUserOrganizationSuccess = (name: string) => {
        setresultData({ title: 'Se creo correctamente', subTitle: `Se agrego el usuario ${name} a tu organiacion` });
    };

    const resultUserOrganizationError = (name: string) => {
        setresultData({
            title: `Error al agregar el usuario`,
            subTitle: `No se agrego el usuario ${name} a tu organiacion`,
        });
    };


    return {
        backToCreate,
        loadingRequest,
        resultData,
        resultEmailExist,
        resultUserExistIntoOrganization,
        resultUnexpectedError,
        resultUserOrganizationSuccess,
        resultUserOrganizationError,
        onContinueCreating,
        setLoadingRequest,
        setbackToCreate
    }
}
