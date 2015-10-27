/**
 * Created by jiangkai on 15/10/21.
 */
JET.initEditor = function () {
	JET.editor().summernote({
		height: 300,
		lang  : "zh-CN"//not work
	});
};

JET.compile = function () {
	var result = false;
	try {
		var content = JET.editor().code().trim();
		if (!content) {
			sweetAlert("Compile failed", "Please fill some thing into the editor", "error");
			return;
		}
		var compiledStr = SpacebarsCompiler.compile(content, {
			isTemplate: true
		});
		JET.previewTemplate.set(content);
		delete Template[JET.tempName];
		Template.__define__(JET.tempName, eval(compiledStr));
		result          = true;
	} catch (e) {
		sweetAlert("Compile failed", e.message, "error");
		throw e;
	}
	return result;
};

JET.editor = function () {
	return $(JET.selector);
};

JET.save = function () {
	var verifyData = function(){
		if(_.isEmpty(JET.previewData.get())){
			sweetConfirm("Warning","您没有添加示例数据",function(){
				doSave();
			});
		}else{
			doSave();
		}
	};
	var doSave=function(){
		if (JET.compile()) {
			var obj = {
				name:JET.name,
				description:JET.description,
				previewData:JET.previewData.get(),
				content: JET.previewTemplate.get()
			};
			var existObj=JET.store.findOne({name:obj.name});
			if(existObj){
				JET.store.update({_id:existObj._id},obj);
			}else{
				JET.store.insert(obj);
			}
			sweetAlert("Saved successfully","保存成功！", "success");
		}
	}
	if(!JET.verifyName(JET.name,"empty")){
		sweetAlert("Save Failed","please set a name for the template","error");
		return;
	}
	if(!JET.verifyName(JET.name,"reg")){
		sweetAlert("Save Failed","模板名称只能包含半角英文字母、数字及下划线，且必须以英文字母开头","error");
		return;
	}
	if(JET.description===""){
		JET.sweetConfirm("Warning","您没有设置模板介绍信息",function(){
			verifyData();
		});
	}else{
		verifyData();
	}
};

JET.sweetConfirm = function(title,text,callback){
	sweetAlert({
		title             : title,
		text              : text,
		type              : "warning",
		showCancelButton  : true,
		confirmButtonColor: "#DD6B55",
		confirmButtonText : "Yes",
		cancelButtonText  : "Cancel",
		closeOnConfirm    : true
	}, function () {
		callback && callback();
	});
}