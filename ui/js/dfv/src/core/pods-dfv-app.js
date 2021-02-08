/**
 * External dependencies
 */
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

/**
 * Pods dependencies
 */
import ConnectedFieldWrapper from 'dfv/src/components/connected-field-wrapper';
import { toBool } from 'dfv/src/helpers/booleans';

import { FIELD_PROP_TYPE_SHAPE } from 'dfv/src/config/prop-types';

const PodsDFVApp = ( { fieldsData } ) => {
	const fieldComponents = fieldsData.map( ( fieldData = {} ) => {
		const {
			directRender = false,
			fieldComponent: FieldComponent = null,
			parentNode,
			fieldConfig,
		} = fieldData;

		// Skip tags with the `disable_dfv` attribute set.
		if ( toBool( fieldConfig.disable_dfv ) ) {
			console.log( 'skipping this tag', fieldConfig.name );
			return null;
		}

		// Some components will have a React component passed in (eg. the Edit Pod field
		// for the Edit Pod screen), but most won't.
		const renderedFieldComponent = directRender
			? <FieldComponent />
			: <ConnectedFieldWrapper field={ fieldConfig } />;

		// Remove the loading indicator.
		parentNode.classList.remove( 'pods-dfv-field--unloaded' );
		parentNode.classList.add( 'pods-dfv-field--loaded' );

		const loadingIndicator = parentNode.querySelector( '.pods-dfv-field__loading-indicator' );

		if ( loadingIndicator ) {
			parentNode.removeChild( loadingIndicator );
		}

		// Create the Portal to render the field.
		return ReactDOM.createPortal(
			renderedFieldComponent,
			parentNode
		);
	} );

	// We don't *really* render anything in the main app, all
	// the fields get set up in Portals.
	return (
		<>
			{ fieldComponents }
		</>
	);
};

PodsDFVApp.propTypes = {
	fieldsData: PropTypes.arrayOf(
		PropTypes.shape( {
			directRender: PropTypes.bool.isRequired,
			fieldComponent: PropTypes.function,
			parentNode: PropTypes.any,
			fieldConfig: FIELD_PROP_TYPE_SHAPE,
		} ),
	),
};

export default PodsDFVApp;
