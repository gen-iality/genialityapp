import { MenuItem } from './menuLandingProps';

export interface DefaultMenu {
  evento: MenuItem;
  agenda: MenuItem;
  speakers: MenuItem;
  certs: MenuItem;
  documents: MenuItem;
  wall: MenuItem;
  faqs: MenuItem;
  networking: MenuItem;
  informativeSection: MenuItem;
  informativeSection1: MenuItem;
  partners: MenuItem;
  ferias: MenuItem;
  noticias: MenuItem;
  producto: MenuItem;
  videos: MenuItem;
}

export type MenuKeys = keyof DefaultMenu;

