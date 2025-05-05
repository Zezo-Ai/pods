import sanitizeHtml from 'sanitize-html';
import { deburr } from 'lodash';

const sanitizeSlug = ( value, separator = '_' ) => {
	if ( undefined === value || null === value ) {
		return '';
	}

	const withoutTags = sanitizeHtml(
		value.replace( /\&/g, '' ),
		{
			allowedTags: [],
			parser: { decodeEntities: false },
		},
	);

	return deburr( withoutTags )
		.replace( /[\s\./\\+=]+/g, separator )
		.replace( /[^\w\-_]+/g, '' )
		.toLowerCase();
};

export default sanitizeSlug;
