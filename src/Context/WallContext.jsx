import { createContext, useState } from "react";


export const WallContext = createContext();


export const WallContextProvider = ({ children }) => {
    const [comment, setComment] = useState(null);
    const [itemcomment, setItemComment] = useState();  

    return (
        <WallContext.Provider
          value={{comment, setComment,itemcomment, setItemComment}}
           >
          {children}
        </WallContext.Provider>
      );


}
export default WallContext;
