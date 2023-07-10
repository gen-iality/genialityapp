import { CertifiRow } from "../types";

export const defaultCertRows: CertifiRow[] = [
    { type: 'break', times: 19 },
    { type: 'h3', content: 'Certificamos que' },
    { type: 'break', times: 2 },
    { type: 'h4', content: '[user.names]' },
    { type: 'break', times: 3 },
    { type: 'h3', content: 'participo con éxito el curso' },
    { type: 'break' , times: 1},
    { type: 'h2', content: '[event.name]' },
    { type: 'break', times: 1 },
    { type: 'h4', content: 'realizado del [event.start] al [event.end]' },
  ]
  
  