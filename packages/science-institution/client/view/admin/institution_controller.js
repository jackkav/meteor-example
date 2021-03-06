this.InstitutionPanelController = RouteController.extend({
	template: "InstitutionPanel",

	onBeforeAction: function() {
		/*BEFORE_FUNCTION*/
		this.next();
	},

	action: function() {
		this.redirect('institution.detail', {insId: this.params.insId});
		/*ACTION_FUNCTION*/
	},

	isReady: function() {


		var subs = [
		];
		var ready = true;
		_.each(subs, function(sub) {
			if(!sub.ready())
				ready = false;
		});
		return ready;
	},

	data: function() {


		return {
			params: this.params || {}
		};
		/*DATA_FUNCTION*/
	}
});