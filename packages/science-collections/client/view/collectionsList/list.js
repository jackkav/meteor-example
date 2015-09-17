Template.collectionsList.helpers({
	collections:function(){
        var journalId = Session.get("currentJournalId");
		var pubId = Session.get('filterPublisher');
		var first = Session.get('firstLetter');
		var numPerPage = Session.get('PerPage');
		if(numPerPage === undefined){
			numPerPage = 10;
		}
		var q = {};
		pubId && (q.publisherId = pubId);
        journalId &&(q.journalId = journalId);
        var reg;
        if(first && first == "other"){
            reg="^[^A-Z]"
        }else{
            reg = "^" + first;
        }
		first && (q.title = {$regex:reg, $options: "i"});
		return collPaginator.find(q,{itemsPerPage:numPerPage});
	}
});

Template.updateCollectionForm.helpers({
	getTitle: function () {
		return TAPi18n.__("Update");
	}
})

Template.oneCollection.events({
	"click a.fa-trash":function(e){
		e.preventDefault();
		var collId = this._id;
		confirmDelete(e,function(){
			ArticleCollections.remove({_id: collId});
		})
	}
})