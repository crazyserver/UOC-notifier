function setup_alarm() {
	chrome.alarms.get('refresh', function(alarm) {
		if (!alarm) {
			var delay = get_interval();
			chrome.alarms.create('refresh', {periodInMinutes: delay});
		}
	});
}

function reset_alarm() {
	chrome.alarms.clear('refresh');
	setup_alarm();
}

function onAlarm(alarm) {
	if (alarm && alarm.name == 'refresh') {
		check_messages();
	}
}

function onStartup(alarm){
	reset_session();
	if (has_username_password()) {
		setup_alarm();
		check_messages(show_PAC_notifications);
	}
}

function onInstall(alarm){
	reset_session();
	if (has_username_password()) {
		setup_alarm();
		check_messages(show_PAC_notifications);
	} else {
		chrome.tabs.create({ url: "options.html" });
	}
}

if (chrome.runtime && chrome.runtime.onStartup) {
	chrome.runtime.onStartup.addListener(onStartup);
}

chrome.runtime.onInstalled.addListener(onInstall);
chrome.alarms.onAlarm.addListener(onAlarm);
