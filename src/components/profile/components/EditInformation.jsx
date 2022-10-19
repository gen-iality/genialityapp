import { useState } from 'react';
import { Button, Card, Form, Input, Space, Upload, Alert, PageHeader } from 'antd';
import { PictureOutlined, UserOutlined, LoadingOutlined } from '@ant-design/icons';
import ImgCrop from 'antd-img-crop';
import { useIntl } from 'react-intl';
import { saveImageStorage } from '@helpers/helperSaveImage';
import { UsersApi } from '@helpers/request';
import ShieldAccountIcon from '@2fd/ant-design-icons/lib/ShieldAccount';
import { uploadImagedummyRequest } from '@Utilities/imgUtils';

const EditInformation = ({ cUser }) => {
  const { value, setCurrentUser } = cUser;
  const { names, picture, _id } = value;
  const validateDefaultPicture =
    picture === 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y' ? null : picture;

  let [imageAvatar, setImageAvatar] = useState(
    validateDefaultPicture ? [{ url: validateDefaultPicture }] : validateDefaultPicture
  );
  const [sendRecovery, setSendRecovery] = useState(null);
  const [userDataSentSuccessfullyOrWrongly, setUserDataSentSuccessfullyOrWrongly] = useState('initial');
  const [isLoading, setIsLoading] = useState(false);

  const intl = useIntl();

  const ruleName = [{ required: true, message: 'Ingrese un nombre para su cuenta en Evius!' }];

  const uploadNewUserPicture = async () => {
    const selectedLogo = imageAvatar ? imageAvatar[0] : imageAvatar;

    if (selectedLogo) {
      if (selectedLogo.thumbUrl) return await saveImageStorage(selectedLogo.thumbUrl);
      return selectedLogo.url;
    }

    return 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y';
  };

  const editUserData = async (value) => {
    setSendRecovery(null);
    setUserDataSentSuccessfullyOrWrongly('initial');
    setIsLoading(true);
    setSendRecovery(
      `${intl.formatMessage({
        id: 'modal.restore.alert.passwordRequest',
        defaultMessage: 'Actualizando informacion.',
      })}`
    );

    const nuewUserPicture = await uploadNewUserPicture();

    const body = {
      names: value.names,
      picture: nuewUserPicture,
    };
    setTimeout(async () => {
      try {
        const response = await UsersApi.editProfile(body, _id);
        setCurrentUser({ status: 'LOADED', value: response });
        setIsLoading(false);
        setSendRecovery(
          `${intl.formatMessage({
            id: 'modal.restore.alert.passwordSuccess',
            defaultMessage: 'Se ha actualizado la información satisfactoriamente',
          })}`
        );
        setUserDataSentSuccessfullyOrWrongly(true);
      } catch (error) {
        console.error(
          `%c📌debugger start, element Selected : error📌`,
          'font-family:calibri; background-color:#0be881; color: #1e272e; font-size:16px; border-radius:5px; margin:5px; padding:2px;border: 5px #fff; border-style: solid dashed',
          error
        );
        setIsLoading(false);
        setUserDataSentSuccessfullyOrWrongly(false);
        setSendRecovery(
          `${intl.formatMessage({
            id: 'modal.restore.alert.passwordError',
            defaultMessage: 'Error al actualizar la informacion',
          })}`
        );
      }
    }, 1000);
  };

  return (
    <Card style={{ borderRadius: '15px' }}>
      <ShieldAccountIcon
        style={{ position: 'absolute', right: '10px', bottom: '10px', fontSize: '50px', color: '#D0EFC1' }}
      />
      <PageHeader
        // avatar={{
        //   icon: <LockOutlined />,
        //   style: { backgroundColor: '#52C41A' },
        // }}
        title='Editar mi información'
      />
      <div style={{ padding: '24px' }}>
        <Form onFinish={editUserData} autoComplete='off' layout='vertical'>
          <Form.Item>
            <ImgCrop rotate shape='round'>
              <Upload
                accept='image/png,image/jpeg'
                onChange={(file) => {
                  if (file.fileList.length > 0) {
                    setImageAvatar(file.fileList);
                  } else {
                    setImageAvatar(null);
                  }
                }}
                customRequest={uploadImagedummyRequest}
                multiple={false}
                listType='picture'
                maxCount={1}
                fileList={imageAvatar}>
                {!imageAvatar && (
                  <Button
                    type='primary'
                    shape='circle'
                    style={{ height: !imageAvatar ? '150px' : '95px', width: !imageAvatar ? '150px' : '95px' }}>
                    <Space direction='vertical'>
                      <PictureOutlined style={{ fontSize: '40px' }} />
                      {intl.formatMessage({
                        id: 'modal.label.photo',
                        defaultMessage: 'Subir foto',
                      })}
                    </Space>
                  </Button>
                )}
              </Upload>
            </ImgCrop>
          </Form.Item>
          <Form.Item
            label={intl.formatMessage({
              id: 'modal.label.name',
              defaultMessage: 'Nombre',
            })}
            name='names'
            initialValue={names}
            hasFeedback
            style={{ marginBottom: '10px', textAlign: 'left' }}
            rules={ruleName}>
            <Input
              type='text'
              size='large'
              placeholder={'¿Como te llamas?'}
              prefix={<UserOutlined style={{ fontSize: '24px', color: '#c4c4c4' }} />}
            />
          </Form.Item>
          {sendRecovery !== null && (
            <Alert
              type={
                userDataSentSuccessfullyOrWrongly === 'initial'
                  ? 'info'
                  : userDataSentSuccessfullyOrWrongly
                  ? 'success'
                  : 'error'
              }
              message={sendRecovery}
              showIcon
              closable
              className='animate__animated animate__pulse'
              style={{
                boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                backgroundColor: '#FFFFFF',
                color: '#000000',
                borderLeft: `5px solid ${
                  userDataSentSuccessfullyOrWrongly === 'initial'
                    ? '#333F44'
                    : userDataSentSuccessfullyOrWrongly
                    ? '#52C41A'
                    : '#FF4E50'
                }`,
                fontSize: '14px',
                textAlign: 'start',
                borderRadius: '5px',
              }}
              icon={isLoading && <LoadingOutlined />}
            />
          )}
          <Form.Item style={{ marginBottom: '10px', marginTop: '30px' }}>
            <Button htmlType='submit' style={{ backgroundColor: '#52C41A', color: '#FFFFFF' }} size='large'>
              Guardar cambios
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Card>
  );
};

export default EditInformation;
