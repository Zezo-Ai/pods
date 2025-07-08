/* global _ */
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';

import template from 'dfv/src/fields/file/views/file-upload-queue.html';

export const FileUploadQueueModel = Backbone.Model.extend( {
	defaults: {
		id: 0,
		filename: '',
		progress: 0,
		errorMsg: '',
	},
} );

export const FileUploadQueueItem = Marionette.View.extend( {
	model: FileUploadQueueModel,

	tagName: 'li',

	template: _.template( template ),

	attributes() {
		return {
			class: 'pods-dfv-list-item',
			id: this.model.get( 'id' ),
		};
	},

	modelEvents: {
		change: 'onModelChanged',
	},

	onModelChanged() {
		this.render();
	},
} );

export const FileUploadQueue = Marionette.CollectionView.extend( {
	tagName: 'ul',

	className: 'pods-dfv-list pods-dfv-list-queue',

	childView: FileUploadQueueItem,
} );
