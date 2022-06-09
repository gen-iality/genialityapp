// import { useState } from 'react';
// import Dropzone from 'react-dropzone';
// import { Spin, Row, Col, Button, Typography } from 'antd';

// let ImageInput = (props) => {
//   //Esto es para detectar cuando despues de cargar una imagen, la imagen efectivamente cargo y quitar el loading
//   const [stillOldImage, setStillOldImage] = useState(false);
//   /* if (stillOldImage && stillOldImage !== props.picture) {
//     setStillOldImage(false);
//   }*/

//   // let width = (props.width) / 2 || 640;
//   // let height = (props.height) / 2 || 320;

//   let widthText = props.width || 1280;
//   let heighText = props.height || 960;

//   let style = props.style || {
//     cursor: 'pointer',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     position: 'relative',
//     height: 250,
//     width: '100%',
//     borderWidth: 2,
//     borderColor: '#b5b5b5',
//     borderStyle: 'dashed',
//     borderRadius: 10,
//   };
//   let contentDrop = props.contentDrop || (
//     <Row gutter={[8, 8]} justify='center' wrap>
//       <Col>
//         <Button
//           type='primary'
//           onClick={(e) => {
//             e.preventDefault();
//           }}
//           loading={stillOldImage}
//           size='large'
//           /* className={`is-primary is-inverted is-outlined ${stillOldImage ? "is-loading" : ""}`} */
//         >
//           Cambiar foto
//         </Button>
//       </Col>
//       <Col>
//         {props.btnRemove ? (
//           props.btnRemove
//         ) : (
//           <Button
//             type='danger'
//             size='large'
//             onClick={async (e) => {
//               e.stopPropagation();
//               setStillOldImage(true);
//               await props.changeImg('', props.indexImage);
//               setStillOldImage(false);
//             }}
//             /* className={`button is-primary is-inverted is-outlined`} */
//           >
//             Eliminar imagen
//           </Button>
//         )}
//       </Col>
//     </Row>
//   );
//   let divClass = props.divClass || 'drop-img';
//   let classDrop = props.classDrop || 'dropzone';

//   const ContainerDropzone = {
//     maxWidth: '100%',
//     minHeight: 'auto',
//   };

//   return (
//     <div className='inputImage' style={ContainerDropzone}>
//       {/* el #FFF es por un error que se nos fue a la base de datos*/}
//       {props.picture && props.picture !== '#FFF' ? (
//         <div className={divClass} style={ContainerDropzone}>
//           <img src={props.picture} alt={'Imagen'} />
//           <Dropzone
//             accept='image/*'
//             onDrop={async (e) => {
//               setStillOldImage(true);
//               await props.changeImg(e, props.indexImage);
//               setStillOldImage(false);
//             }}
//             className={classDrop}>
//             {contentDrop}
//           </Dropzone>
//         </div>
//       ) : (
//         <div>
//           <Dropzone
//             accept='image/*'
//             onDrop={async (e) => {
//               setStillOldImage(true);
//               await props.changeImg(e, props.indexImage);
//               setStillOldImage(false);
//             }}
//             style={style}>
//             {!stillOldImage && (
//               <div style={{ textAlign: 'center' }}>
//                 <Typography.Text strong style={{ fontSize: '16px' }}>
//                   Subir foto ({props.indexImage})
//                 </Typography.Text>
//                 <br />
//                 <small>
//                   (Tamaño recomendado: {widthText}px x {heighText}px)
//                 </small>
//               </div>
//             )}
//             {stillOldImage && <Spin />}
//           </Dropzone>
//           <span>{props.errImg}</span>
//         </div>
//       )}
//     </div>
//   );
// };
// export default ImageInput;
