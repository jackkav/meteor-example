Template.Admin.rendered = function() {
	
};

Template.Admin.events({
	
});

Template.Admin.helpers({
	
});

Template.AdminSideMenu.rendered = function() {
	$(".menu-item-collapse .dropdown-toggle").each(function() {
		if($(this).find("li.active")) {
			$(this).removeClass("collapsed");
		}
		$(this).parent().find(".collapse").each(function() {
			if($(this).find("li.active").length) {
				$(this).addClass("in");
			}
		});
	});

	
};

Template.AdminSideMenu.events({
	
});

Template.AdminSideMenu.helpers({
	
});
