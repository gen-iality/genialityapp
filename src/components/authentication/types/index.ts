
export type Lang = 'es' | 'en'

export interface Extra {
    name:                  string;
    brand:                 string;
    lastFour:              string;
    externalIdentifier:    string;
    processorResponseCode: string;
  }
export interface Transaction {
    redirectUrl:       string;
    amountInCents:     number;
    reference:         string;
    currency:          string;
    signature:         null;
    shippingAddress:   null;
    taxes:             any[];
    customerData:      CustomerData;
    customerEmail:     string;
    merchantUserId:    string;
    sessionId:         string;
    paymentMethodType: string;
    paymentMethod:     PaymentMethod;
    billingData:       BillingData;
    id:                string;
    createdAt:         Date;
    finalizedAt:       null;
    status:            Status;
    statusMessage:     null;
    paymentSourceId:   null;
    paymentLinkId:     null;
    billId:            null;
    merchant:          Merchant;
  }
  
  export interface BillingData {
    legalIdType: string;
    legalId:     string;
  }
  
  export interface CustomerData {
    fullName:    string;
    phoneNumber: string;
  }
  
  export interface Merchant {
    name:        string;
    legalName:   string;
    contactName: string;
    phoneNumber: string;
    logoUrl:     null;
    legalIdType: string;
    email:       string;
    legalId:     string;
  }
  
  export interface PaymentMethod {
    type:         string;
    extra:        Extra;
    installments: number;
  }
  
  export enum Status {
    APPROVED  = "APPROVED",
    DECLINED  = "DECLINED",
    VOIDED    = "VOIDED",
    ERROR     = "ERROR",
    PENDING   = "PENDING",
  }