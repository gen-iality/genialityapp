import { Drawer } from "antd"
import { renderTypeComponent } from "../hooks/functions";

 const DrawerPreview = ({dataSource,visibleDrawer,setVisibleDrawer}) => {
  return (
    <Drawer title="Previsualización" placement="right" onClose={()=>setVisibleDrawer(false)} visible={visibleDrawer}>
       {dataSource.map((section)=>{
       return (renderTypeComponent(section.type,section.value))
       })}
      </Drawer>
  )
}
export default DrawerPreview;
