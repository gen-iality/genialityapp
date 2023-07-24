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
            title: 'El correo electrónico ya existe',
            subTitle: 'Puede cambiar o agregar el usuario a tu organización',
        });
    };

    const resultUserExistIntoOrganization = (email: string) => {
        setresultData({
            title: 'EL usuario ya es miembro',
            subTitle: `El usuario con email: ${email} ya es miembro de esta organización`,
        });
        setbackToCreate(false);
        setLoadingRequest(false);
    };

    const resultUnexpectedError = () => {
        setresultData({ title: 'Error inesperado', subTitle: 'Ocurrió un error inesperado creando el usuario' });
    };

    const resultUserOrganizationSuccess = (name: string) => {
        setresultData({ title: 'Se creó correctamente', subTitle: `Se agregó el usuario ${name} a tu organiación` });
    };

    const resultUserOrganizationError = (name: string) => {
        setresultData({
            title: `Error al agregar el usuario`,
            subTitle: `No se agregó el usuario ${name} a tu organiación`,
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
