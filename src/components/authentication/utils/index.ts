export const attendee_status = (cUser : any, cEventUser: any) => {
    let status = 'NO_USER';
    status = cUser?._id ? 'WITH_USER' : status;
    status = cUser?._id && cEventUser.value?._id ? 'WITH_ASSISTANT' : status;
    return status;
};