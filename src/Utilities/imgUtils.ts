/** request para no mostrar el error que genera el component upload de antd */
export const uploadImagedummyRequest = ({ file, onSuccess }: any) => {
  setTimeout(() => {
    onSuccess('done');
  }, 1000);
};

export function readUrlImg({ files, setImage }: any) {
  var reader = new FileReader();
  reader.onloadend = function async() {
    const imageData = reader.result;
    setImage(imageData);
  };
  if (files) {
    reader.readAsDataURL(files);
  }
}
