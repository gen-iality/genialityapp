import Datos from '@/components/events/datos';
import { OrganizationApi } from '../../helpers/request';

function TemplateMemberSettings(props) {
  const organizationId = props.org._id;
  const organization = props.org;

  async function updateTemplate(template, fields) {
    let newTemplate = {
      name: template.template.name,
      user_properties: fields,
    };
    let resp = await OrganizationApi.updateTemplateOrganization(organizationId, template.template._id, newTemplate);
    if (resp) {
      return true;
    }
    return false;
  }

  if (!organizationId) return;

  return (
    <>
      {organization && (
        <Datos
          type='organization'
          eventId={organizationId}
          org={organization}
          url={props.match.url}
          edittemplate={true}
          createNewField={async (fields, template, updateTable) => {
            let fieldsNew = Array.from(template.datafields || []);
            fieldsNew.push(fields);
            let resp = await updateTemplate(template, fieldsNew);
            if (resp) {
              updateTable(fieldsNew);
            }
          }}
          orderFields={async (fields, template, updateTable) => {
            let resp = await updateTemplate(template, fields);
            if (resp) {
              updateTable(fields);
            }
          }}
          editField={async (fieldId, fieldupdate, template, updateTable) => {
            template.datafields = template.datafields.map((field) => {
              return field?.order_weight == fieldupdate?.order_weight ? fieldupdate : field;
            });
            let resp = await updateTemplate(template, template.datafields);
            if (resp) {
              updateTable(template.datafields);
            }
          }}
          deleteField={async (nameField, template, updateTable) => {
            /* console.log(nameField, template); */
            let newtemplate = template.datafields?.filter((field) => field.name != nameField);

            let resp = await updateTemplate(template, newtemplate);
            if (resp) {
              updateTable(newtemplate);
            }
          }}
        />
      )}
    </>
  );
}

export default TemplateMemberSettings;
