function buildUI_tools(){
	var session = get_session();

    var uni =  get_uni();
    if(uni == 'UOCi'){
        gat = 'EXPIB';
    } else {
        gat = 'EXP';
    }
    var root_url_gate = root_url_ssl+'/tren/trenacc?modul=GAT_'+gat;

    var urls = new Array();
    urls.push({url: '.INFCONSULTA/inici', title: 'Expediente antiguo (no funciona)'});
    urls.push({url: '.NOTESAVAL/rac.rac&tipus=1', title: 'REC antiguo (no funciona)'});
    urls.push({url: '.NOTESAVAL/NotesEstudiant.inici', title: 'Resumen de notas'});
    urls.push({url: '.EXASOLREVISION/consrevision.consrevision', title: 'Revisión de exámen'});
    urls.push({url: '.PAPERETES/paperetes.paperetes', title: 'Notas finales'});
    urls.push({url: '.ESTADNOTES/estadis.inici', title: 'Estadísticas'});

    var text = '<div class="container-fluid resources">';
    var par = -1;
    var link;
    for (var x in urls) {
        link = root_url_gate + urls[x].url + '&s=';
		text += get_general_link(link, urls[x].title, par);
		par = -par;
    }
    // New expedient
	link = root_url + '/webapps/seleccioexpedient/cerca.html?s=';
	text += get_general_link(link, 'Expediente', par);
	par = -par;

    text += '</div>';
    return text;
}

function get_general_link(link, title, par){
	var ret = "";
	if(par == -1){
    	ret += '<div class="row">';
    }
	ret += '<div class="col-xs-6 resource" link="'+link+'"><a href="#" class="linkResource">'+title+'</a></div>';
	if(par == 1){
		ret += '</div>';
	}
	return ret;
}


function buildUI_classroom(classroom){
	var resources_html = '';
	for(var j in classroom.resources){
		resources_html += buildUI_resource(classroom.resources[j], classroom.code);
	}
	return '<div class="classroom panel panel-warning" classroom="'+classroom.code+'">  \
				<div class="panel-heading container-fluid" '+buildUI_color(classroom)+' data-parent="#classrooms" data-toggle="collapse" data-target="#detail_'+classroom.code+'">	\
					<div class="row">	\
						<div class="col-xs-2">' + buildUI_picture(classroom) + '</div> \
						<div class="col-xs-7">' + classroom.title + '</div> \
						<div class="col-xs-3">' + buildUI_badge(classroom.messages, 'linkAula') + '</div> \
					</div> \
				</div> \
				<div class="panel-body bg-info text-info collapse" id="detail_'+classroom.code+'">  \
						' + buildUI_rac(classroom) + ' \
						<ul class="container-fluid resources"> \
							' + resources_html + ' \
						</ul> \
				</div> \
			</div>';
}

function buildUI_news(){
	return get_news();
}

function buildUI_agenda(){
	session = get_session();
	if(!session) return "";

	var api = 'http%253A%252F%252Fcv.uoc.edu%252Fwebapps%252FAgenda%252FAgendaServlet%253Foperacion%253Dical';
	var libs = '/rb/inici/javascripts/prototype.js,/rb/inici/javascripts/effects.js,/rb/inici/javascripts/application.js,/rb/inici/javascripts/prefs.js,%2Frb%2Finici%2Fuser_modul%2Flibrary%2F944745.js%3Ffeatures%3Dlibrary%3Asetprefs%3Adynamic-height';
	var src = 'http://cv.uoc.edu/webapps/widgetsUOC/widgetsIcalServlet?up_items=7&up_icalUrlServiceAPI='+api+'&up_targetMonth=agMonthlyView.jsp&up_target=agDailyView.jsp&libs='+libs+'&s='+session;
	var text = '<iframe src="'+src+'"></iframe>';
	return text;
}

function buildUI_picture(classroom){
	if(classroom.picture){
		return '<img class="foto img-rounded" src="'+classroom.picture+'"/>';
	}
	return "";
}

function buildUI_rac(classroom){
	if(classroom.type != 'TUTORIA'){
		return '<a href="#" class="linkNotas pull-right">Notas</a>';
	}
	return "";
}

function buildUI_color(classroom){
	if(classroom.color){
		return 'style="border-color:#'+classroom.color+'; background: linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.20) 100%), #'+classroom.color+' no-repeat; color:white;"';
	}
	return "";
}


function buildUI_resource(resource, classroom_code){
	var badge = get_badge(resource.messages);
	if(resource.link != 'undefined'){
		var link = 'link="'+resource.link+'"';
	}
	return '<li class="row resource" '+link+' resource="'+resource.code+'"> \
				<div class="col-xs-8"><a href="#" class="linkResource">'+resource.title+'</a></div> \
				<div class="col-xs-4">'+buildUI_badge(resource.messages, 'linkResource', resource.all_messages) + '</div> \
			</li>';
}

function buildUI_badge(messages, classes, allmessages){
	var badge = get_badge(messages);
	if (!isNaN(allmessages)) {
		return '<div class="btn-group btn-group-justified btn-group-xs ' + classes + '" role="group"> \
					<div class="btn-group btn-group-xs" role="group"><button type="button" class="btn '+badge+' button_details">' + messages + '</button></div> \
		  			<div class="btn-group btn-group-xs" role="group"><button type="button" class="btn '+badge+' button_details">' + allmessages + '</button></div> \
				</div>';
	} else {
		return '<button type="button" class="' + classes + ' btn btn-xs '+badge+' button_details btn-group-justified">' + messages + '</button>';
	}
}

function get_badge(messages){
	var critical = get_critical();
	if(isNaN(messages)) return "btn-info";
	if( messages >= critical ) return "btn-danger";
	if( messages > 0 ) return "btn-warning";
	return "btn-success";
}

function show_total_messages(){
	$('#total_messages').addClass(get_badge(Classes.notified_messages))
	$('#total_messages').html(""+Classes.notified_messages)
}

function handleEvents(){

	$('.linkCampus').on('click',function(){
		var url = root_url + '/cgi-bin/uocapp';
		open_tab(url);
	});

	$('.linkAula').on('click',function(){
		var classroom_code = $(this).parents('.classroom').attr('classroom');
		var classroom = Classes.search_code(classroom_code);

		var url = root_url + '/webapps/classroom/'+classroom.template+'/frameset.jsp';
		var data = {domainCode: classroom.code};
		open_tab(url, data);
	});

	$('.linkNotas').on('click',function(){
		var classroom_code = $(this).parents('.classroom').attr('classroom');
		var classroom = Classes.search_code(classroom_code);

		var url = root_url + '/webapps/rac/listEstudiant.action';
		var data = {domainId: classroom.domain};
		open_tab(url, data);
	});

	$('.linkResource').on('click',function(){
		var resource_link = $(this).parents('.resource').attr('link');
		if(resource_link && resource_link != 'undefined'){
			var url = resource_link;
			var data = {};
		} else {
			var resource_code = $(this).parents('.resource').attr('resource');
			var url = root_url + '/cgi-bin/ma_mainMailFS';
			var data = {l: resource_code};
		}
		open_tab(url, data);
	});
}

function open_tab(url, data){
	var session = get_session();
	if(session){
		if(url.indexOf('?') == -1){
			if(!data) data = {};
			data.s = session;
			url += '?'+uri_data(data);
		} else {
			url += session;
		}
		chrome.tabs.create({url : url});
	}
}

function buildUI(){
	//DEBUG
	//check_messages(false);

	var classrooms = Classes.get_notified();
	show_total_messages();

	var visibles = 0;
	var class_html = "";
	for(var i in classrooms){
		class_html += buildUI_classroom(classrooms[i]);
		visibles++;
	}
	$('#classrooms').html(class_html);

	var tools_html = buildUI_tools();
	$('#detail_campus').html(tools_html);

	var news_html = buildUI_news();
	$('#detail_news').html(news_html);

	var agenda_html = buildUI_agenda();
	$('#detail_agenda').html(agenda_html);

	setTimeout( handleEvents, 100);

	if( !visibles ){
		$('#classrooms').html("<div class='alert'><h4>Atención</h4>No hay aulas visibles. Confirma en la configuración las aulas que quieres visualizar</div>")
		return;
	}

	$('.details').collapse({toggle: false});
	$('.button_details').on('click', function () {
		var val = this.value;
		$('.button_details:not(#button_'+val+')').removeClass('active');
		if ( $(this).hasClass('active') ){
			// Does not have active class yet
			$('.details').collapse('hide');
	   	} else {
			$('.details:not(#detail_'+val+')').collapse('hide');
	   		$('#detail_'+val).collapse('show');
	   	}
	});
}

$(document).ready(function(){
	session = get_session();
	if(!session){
		$("#classrooms").html("Waiting to log in...");
		return;
	}
	buildUI();
	return;
});
