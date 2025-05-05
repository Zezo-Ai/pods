import React from 'react';
import { isEqual } from 'lodash';
import PropTypes from 'prop-types';
import Marionette from 'backbone.marionette';

import { PodsDFVFieldModel } from 'dfv/src/core/pods-field-model';
import { FIELD_PROP_TYPE_SHAPE } from 'dfv/src/config/prop-types';

class MarionetteAdapter extends React.Component {
	constructor( props ) {
		super( props );

		this.state = {
			isMarionetteGlobalLoaded: false,
		};
	}

	componentDidMount() {
		const {
			fieldConfig = {},
		} = this.props;

		const htmlAttr = fieldConfig?.htmlAttr || {};

		this.fieldModel = new PodsDFVFieldModel( {
			htmlAttr,
			fieldConfig,
		} );

		// The Marionette global needs to be set once.
		if ( ! window.PodsMn ) {
			window.PodsMn = window.Backbone.Marionette.noConflict();
		}

		this.setState( {
			isMarionetteGlobalLoaded: true,
		} );

		// Initial render of the Marionette component.
		this.renderMarionetteComponent();
	}

	componentDidUpdate( prevProps, prevState ) {
		// Don't do anything if Marionette is not setup yet.
		if ( ! this.state.isMarionetteGlobalLoaded ) {
			return;
		}

		if (
			isEqual( prevProps.fieldConfig, this.props.fieldConfig ) &&
			isEqual( prevProps.value, this.props.value ) &&
			isEqual( prevState, this.state )
		) {
			return;
		}

		if ( this.marionetteComponent ) {
			this.marionetteComponent.destroy();
		}

		this.renderMarionetteComponent();
	}

	componentWillUnmount() {
		this.marionetteComponent.destroy();
	}

	renderMarionetteComponent() {
		const {
			View,
			value,
		} = this.props;

		this.marionetteComponent = new View( {
			model: this.fieldModel,
			fieldItemData: value,
		} );

		this.element.appendChild( this.marionetteComponent.el );

		this.marionetteComponent.render();

		this.marionetteComponent.collection.on( 'all', ( eventName, collection ) => {
			if ( ! [ 'update', 'remove', 'reset' ].includes( eventName ) ) {
				return;
			}

			if ( window.console ) {
				// eslint-disable-next-line no-console
				console.debug( 'collection changed', eventName, collection, collection.models );
			}

			this.props.setValue( collection.models || [] );
		} );

		// for debugging
		window.marionetteViews = window.marionetteViews || {};
		window.marionetteViews[ this.props.fieldConfig.name ] = this.marionetteComponent;
	}

	render() {
		const { className, fieldConfig } = this.props;
		const allowSingleFile = Number( fieldConfig?.file_limit ) === 1;
		// Add an extra class so we're able to hide the `Add file` button,
		// when an image or video is already being added into the field.
		const wrapperClasses = `pods-marionette-adapter-wrapper ${ allowSingleFile ? 'pods-marionette-adapter-wrapper-single-file' : '' }`;
		return (
			<div className={ wrapperClasses }>
				<div
					className={ className }
					ref={ ( element ) => this.element = element }
				/>
			</div>
		);
	}
}

MarionetteAdapter.propTypes = {
	className: PropTypes.string,
	htmlAttr: PropTypes.object,
	fieldConfig: FIELD_PROP_TYPE_SHAPE.isRequired,
	setValue: PropTypes.func.isRequired,
	value: PropTypes.oneOfType( [
		PropTypes.string,
		PropTypes.array,
		PropTypes.object,
	] ),
	View: PropTypes.func.isRequired,
};

export default MarionetteAdapter;
