Meteor.startup(function () {
    // if (Publishers.find().count() === 0) {
    //   for (var i = 0; i <= 3; i++) {
    //     Publishers.insert({
    //       name: Fake.word(),
    //       chinesename: Fake.word(),
    //       description: Fake.paragraph(4)
    //     });
    //   };
    // }


/*    if (Topics.find().count() === 0) {
        var names = [
        "Acoustics",
        "Astronomy and astrophysics",
        "Biological physics",
        "Condensed matter physics",
        "Energy",
        "General physics",
        "Geophysics",
        "Interdisciplinary physics",
        "Materials science",
        "Mathematical physics",
        "Nanotechnology",
        "Nuclear physics",
        "Optics and optical physics",
        "Particle physics",
        "Physical chemistry",
        "Plasma physics",
        "Quantum mechanics",
        "Rheology and fluid dynamics",
        "Society and organization",
        "Statistical physics"
        ];
        _.each(names, function (name) {
            Topics.insert({
                name: name
            });
        });
        for (var i = 0; i <= 5; i++) {
            _.each(names, function (name) {
                Topics.insert({
                    name: Fake.word(),
                    parentName: name
                });
            });
        }
    }*/

    Topics.remove({})
    if (Topics.find().count() === 0) {
         var names = [
             {e:"Acoustics",c: "声学"},
             {e:"Astronomy and astrophysics",c: "天文与天体物理学报"},
             {e:"Biological physics",c: "生物物理"},
             {e:"Condensed matter physics",c: "凝聚体物理学"},
             {e:"Energy",c: "能量"},
             {e:"General physics",c: "物理"},
             {e:"Geophysics",c: "地球物理学"},
             {e:"Interdisciplinary physics",c: "跨学科物理"},
             {e:"Materials science",c: "材料科学"},
             {e:"Mathematical physics",c: "数理物理"},
             {e:"Nanotechnology",c: "纳米技术"},
             {e:"Nuclear physics",c: "核物理"},
             {e:"Optics and optical physics",c: "光学和光学物理"},
             {e:"Particle physics",c: "粒子物理学"},
             {e:"Physical chemistry",c: "物理化学"},
             {e:"Plasma physics",c: "等离子物理"},
             {e:"Quantum mechanics",c: "量子力学"},
             {e:"Rheology and fluid dynamics",c: "流变学和流体动力学"},
             {e:"Society and organization",c: "社会和组织"},
             {e:"Statistical physics",c: "统计物理"}
         ];
         _.each(names, function (name) {
             Topics.insert({
                 name: name.c,
                 englishName: name.e

             });
         });
         for (var i = 0; i <= 2; i++) {
             _.each(names, function (name) {
                 var parent = Topics.findOne({'name': name.c});
                 Topics.insert({
                     parentId: parent._id,
                     name: Fake.word()+i,
                     englishName: Fake.word()+i
                 });
             });
         }
    }

});
