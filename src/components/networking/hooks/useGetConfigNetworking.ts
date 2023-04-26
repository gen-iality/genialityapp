import { useEffect, useState } from "react";
import { networkingGlobalConfig } from "../interfaces/Index.interfaces";
import * as serviceConfig from '../services/configuration.service';


const useGetConfigNetworking = (eventId : string) => {
  const [globalConfig, setGlogbalConfig] = useState<null | networkingGlobalConfig>(null);
  useEffect(() => {
    if (!!eventId) {
      const unsubscribeConfig = serviceConfig.ListenConfig(eventId, setGlogbalConfig);
      return () => {
        unsubscribeConfig();
      };
    }
  }, []);

  return {
    globalConfig
  }
};

export default useGetConfigNetworking;
