/**
 * External dependencies
 */
import React from 'react';
import { omit } from 'lodash';
import PropTypes from 'prop-types';

/**
 * Pods components
 */
import HelpTooltip from 'dfv/src/components/help-tooltip';

/**
 * Other Pods dependencies
 */
import useConditionalLogic from 'dfv/src/hooks/useConditionalLogic';
import { FIELD_PROP_TYPE } from 'dfv/src/config/prop-types';

const BooleanGroupSubfield = ( {
	subfieldConfig,
	checked,
	toggleChange,
	allPodValues,
	allPodFieldsMap,
} ) => {
	const {
		htmlAttr: htmlAttributes = {},
		help: helpText,
		label,
		name,
	} = subfieldConfig;

	const meetsConditionalLogic = useConditionalLogic(
		subfieldConfig,
		allPodValues,
		allPodFieldsMap,
	);

	const idAttribute = !! htmlAttributes.id ? htmlAttributes.id : name;

	// Sort out different shapes that we could get the help text in.
	// It's possible to get an array of strings for the help text, but it
	// will usually be a string.
	const shouldShowHelpText = helpText && ( 'help' !== helpText );

	const helpTextString = Array.isArray( helpText ) ? helpText[ 0 ] : helpText;
	const helpLink = ( Array.isArray( helpText ) && !! helpText[ 1 ] )
		? helpText[ 1 ]
		: undefined;

	if ( ! meetsConditionalLogic ) {
		return null;
	}

	return (
		<li className="pods-boolean-group__option">
			<div className="pods-field pods-boolean">
				{ /* eslint-disable-next-line jsx-a11y/label-has-for */ }
				<label
					className="pods-form-ui-label pods-checkbox-pick__option__label"
				>
					<input
						name={ htmlAttributes.name || name }
						id={ idAttribute }
						className="pods-form-ui-field-type-pick"
						type="checkbox"
						checked={ checked }
						onChange={ toggleChange }
					/>
					{ label }
				</label>

				{ shouldShowHelpText && (
					<span className="pods-field-label__tooltip-wrapper">
						{ '\u00A0' /* &nbsp; */ }
						<HelpTooltip
							helpText={ helpTextString }
							helpLink={ helpLink }
						/>
					</span>
				) }
			</div>
		</li>
	);
};

BooleanGroupSubfield.propTypes = {
	/**
	 * Field config for the subfield being rendered.
	 */
	subfieldConfig: PropTypes.exact(
		omit( FIELD_PROP_TYPE, [ 'id' ] )
	),

	/**
	 * True if checked.
	 */
	checked: PropTypes.bool.isRequired,

	/**
	 * Handles the value change.
	 */
	toggleChange: PropTypes.func.isRequired,

	/**
	 * All field values for the Pod to use for
	 * validating dependencies.
	 */
	allPodValues: PropTypes.object.isRequired,

	/**
	 * All fields from the Pod, including ones that belong to other groups. This
	 * should be a Map object, keyed by the field name, to make lookup easier.
	 */
	allPodFieldsMap: PropTypes.object,
};
export default BooleanGroupSubfield;
