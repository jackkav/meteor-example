var pageSetting = new ReactiveDict();
var itemLimit = 10;
Template.solrFilterItem.events({
	'click .filter-me':function(e){
		e.preventDefault();
		SolrQuery.toggleFilterQuery(this.field,this.val,!this.selStatus);
		SolrQuery.resetStartPage();
		Router.go(SolrQuery.makeUrl());
	},
	'click .show-more':function(e,t){
		e.preventDefault();
		pageSetting.set(this.name,-1);// no limited
		t.$(".slimScroll").addClass('scroll-me');
	}
});

Template.solrFilterItem.helpers({
	class:function() {
		var fq         = SolrQuery.params("fq");
		fq             = fq && fq[this.field];
		this.selStatus = fq ? _.contains(fq, this.val) : false;
		return this.selStatus ? "filter-selected" : "";
	},
	getFilterOptions:function() {
		if(_.isEmpty(this.filterOptions))
			return;
		var scount = pageSetting.get(this.name) || itemLimit;
		return scount<0?this.filterOptions:_.first(this.filterOptions,scount);
	},
	isTooMany:function(){
		return pageSetting.get(this.name)!=-1 && this.filterOptions.length> itemLimit;
	}
});

Template.solrFilterItem.onRendered(function(){
	var filterName = this.data.name;
	if(!filterName)
		return;
	var currLimit = pageSetting.get(filterName);
	if(currLimit==-1){
		Template.instance().$(".slimScroll").addClass('scroll-me');
	}
});