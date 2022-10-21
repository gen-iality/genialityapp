/**
 * NOTE: This component can be put in another side because it is very generic.
 */

  import { useState, useMemo } from 'react';
 
 import {
   Card,
   Badge,
   Typography,
 } from 'antd';
 
 const { Ribbon } = Badge;
 const { Title, Paragraph } = Typography;
 
 export interface SelectableCardProps {
   title?: string,
   selected?: boolean,
   description?: string,
   image?: string,
   onSelect: () => void,
 };
 
 function SelectableCard(props: SelectableCardProps) {
   const [isLoaded, setIsLoaded] = useState(false);
 
   const {
     title,
     image,
     description = '',
     selected = false,
     onSelect,
   } = props;
 
   const borderStyles = useMemo(() => {
     if (selected) return {
       borderColor: '#2593FC',
       borderStyle: 'solid',
       borderWidth: '4px',
       borderRadius: '6px',
     };
     return {};
   }, [selected]);
 
   const badgeStyles = useMemo(() => {
     if (selected) return {};
     return { display: 'none'  };
   }, [selected]);
 
   const cardStyles = useMemo(() => {
     return {
       width: '100%',
       borderRadius: '8px',
       minHeight: description.length > 0 ? '333px' : 'auto',
     };
   }, [description.length]);
 
   return (
     <Ribbon text="Selected" color="#2593FC" style={badgeStyles}>
       <div onClick={() => onSelect()} style={borderStyles}>
       <Card
           loading={!isLoaded}
           hoverable={true}
           style={cardStyles}
           cover={
             <img
               onLoad={() => setIsLoaded(true)}
               style={{ objectFit: 'cover', backgroundColor: '#F2F2F2' }}
               alt={(title || '').replace(/ /g, "_") + '-Image'}
               src={image}
               height={150}
             />
           }>
           <Card.Meta
             style={{ textAlign: 'center' }}
             title={title ? (
               <Title
                 style={{ userSelect: 'none' }}
                 level={5}>{title}
               </Title>
             ) : undefined}
             description={
               <Paragraph type='secondary' style={{ userSelect: 'none' }}>
                 {description}
               </Paragraph>
             }
           />
         </Card>
       </div>
     </Ribbon>
   );
 }
 
 export default SelectableCard;
 