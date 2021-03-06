AutoForm.addHooks(['addInstitutionModalForm'], {
    before: {
        insert: function (doc) {
            doc.available = 1;
            _.each(doc.ipRange, function (obj) {
                if (obj.startIP) {
                    obj.startNum = Science.ipToNumber(obj.startIP);
                }
                if (obj.endIP) {
                    obj.endNum = Science.ipToNumber(obj.endIP);
                }
            });
            return doc;
        }
    }
}, true);