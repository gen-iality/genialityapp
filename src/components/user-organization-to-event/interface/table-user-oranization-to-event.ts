import React, { ReactNode } from "react";

export interface UserOrganizationToEvent {
  id: string;
  name: string;
  rol: string;
  email: string
  isAlreadyEventUser: boolean
}

export interface UserOrganizationToEventDataType {
  key: React.Key;
  name: string;
  action: ReactNode;
}

export interface ErrorRequest {
  haveError: boolean;
  messageError: string;
}

