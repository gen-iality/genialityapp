import { Typography } from 'antd';
import { TLegalAnchor, TLegalContent, TLegalParagraph, TLegalTitle } from '../typings/interfaces';
import { convertFormat } from '@/helpers/utils';

const privacySections = {
	LOREM_IPSUM: 'Lorem Ipsum',
};
export const privacyTitle: TLegalTitle = 'POLÍTICA DE TRATAMIENTO DE DATOS';
export const privacyParagraph: TLegalParagraph = '';
export const privacyAnchor: TLegalAnchor = [
	{ title: privacySections.LOREM_IPSUM, anchor: convertFormat(privacySections.LOREM_IPSUM) },
];

export const privacyContent: TLegalContent = [
	{
		title: <>{privacyAnchor[0].title}</>,
		anchor: privacyAnchor[0].anchor,
		content: (
			<Typography.Paragraph>
				<Typography.Paragraph>
					Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ab earum aspernatur quisquam quae dolorum vel
					voluptate qui pariatur laborum blanditiis corporis ad debitis assumenda, facilis excepturi illo. Nam, debitis
					eligendi. Ea atque reiciendis impedit deleniti alias nemo aliquid quaerat veritatis esse! Voluptates quo
					sapiente cupiditate exercitationem dolorum, blanditiis tenetur laboriosam obcaecati, beatae molestiae sit
					deserunt natus expedita. Expedita, quasi totam!
				</Typography.Paragraph>
				<Typography.Paragraph>
					Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque natus ex aliquid modi odit maiores voluptates.
					Amet reprehenderit blanditiis at ab nihil dolores maxime corrupti sunt officiis! Nemo, incidunt sunt.
				</Typography.Paragraph>
				<Typography.Paragraph>
					Lorem ipsum dolor sit, amet consectetur adipisicing elit. Unde praesentium doloremque illo exercitationem
					blanditiis ratione, assumenda doloribus autem voluptate quod nobis cum sapiente saepe dolorum beatae numquam
					molestias quaerat maiores.
				</Typography.Paragraph>
			</Typography.Paragraph>
		),
	},
];
