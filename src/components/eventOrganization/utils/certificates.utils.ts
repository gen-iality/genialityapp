import { Certificates } from "@/components/agenda/types"

export const haveUserCertificate=(certificate:Certificates, list_type_user:string) => {
    if(!certificate.userTypes || certificate.userTypes.length === 0){
        return true
      }
      return certificate.userTypes?.includes(list_type_user)
}