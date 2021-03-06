this.fileExcel = new Meteor.Collection("file_excel");

fileExcelSchema  = new SimpleSchema({
	fileId: {
		type: String,
		autoform: {
			type: "cfs-file",
			collection: "excels"
		}
	}
});



Meteor.startup(function () {
	fileExcelSchema.i18n("schemas.fileExcel");
	fileExcel.attachSchema(fileExcelSchema);
});