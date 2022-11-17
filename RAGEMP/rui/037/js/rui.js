$(document).ready(function(e)
{
	if(!window.mp)
	{
		window.mp = { invoke: () => {} };
		window.isBrowser = true;
	}
	
	$(window).resize(function()
	{
        $('body').css('min-height',$(window).height());
		$('.server-image').width($('.main-width').width());
    });
	
	$('.sort-arrow').click(function(e)
	{
        $(this).toggleClass('up');
    });
	
	let selectedTab = 0;
	
	$('.nav li:not(.disable) a').click(function(e)
	{
        if(!$(this).parent().is('.active') && $($(this).attr('href')).length > 0)
		{
			$('.tab-content, .nav li').removeClass('active');
			$(this).parent().addClass('active');
			$('.tab-content'+$(this).attr('href')).addClass('active');
			selectedTab = $('.nav li:not(.disable) a').index($(this));
		}
		return false;
    });
	
	$('#direct .entered').html($('#direct .input').val());
	$('#direct .input').keyup(function(e)
	{
		if(e.keyCode == 13)
		{
			let val = $(this).val();
			let pos = val.indexOf(':');
			if(pos != -1)
			{
				let ip = val.substr(0, pos);
				window.ui.connect(ip, parseInt(val.substr(pos + 1)), '', ip);
			}
		}
		
        $('#direct .entered').html($('#direct .input').val());
    });
	
	$('.input-search').focusin(function(e)
	{
        $(this).parent().css('border-color','#ffb900');
    });
	
	$('.input-search').focusout(function()
	{
		$(this).parent().css('border-color','rgba(255,255,255,0.15)');
	});
		
	let tabsList = ['home', 'servers', 'direct', 'settings', 'aboutus'];

	$( "body" ).keyup(function( event ) {
			if($(".input-search").is(":focus")
				|| $('#direct .input').is(":focus")
				|| $('input#nickname_change').is(":focus"))
				return;
			
			if (event.which == 65 || 
				event.which == 37)
			{
				$( ".tab-content, .nav li.active" ).removeClass("active");
				
				selectedTab--;
				
				if(selectedTab < 0)
				{
					selectedTab = (tabsList.length-1);
				}
				
				//$('.tab-content').css('display', 'none');

				//$('#'+tabsList[selectedTab]).fadeIn();

				$(".tab-content:eq(" + selectedTab + "), .nav li:eq(" + selectedTab + ")").addClass("active");
			}
			else if (event.which == 68 || 
				event.which == 39)
			{				
				$( ".tab-content.active, .nav li.active" ).removeClass("active");
			
				selectedTab++;
				
				if(selectedTab > (tabsList.length-1))
				{
					selectedTab = 0;
				}
				
				//$('.tab-content').css('display', 'none');

				//$('#'+tabsList[selectedTab]).fadeIn();

				$(".tab-content:eq(" + selectedTab + "), .nav li:eq(" + selectedTab + ")").addClass("active");
			}
		});
	
	let whitelistedGamemodes = ["roleplay", "stunt", "race", "deathmath", "team deathmath", "freeroam", "derby", "zomby"];

	window.ui =
	{
		ui_obj: $("#main_menu"),
		
		langs: ["en", "ru", "de", "fr", "es"],
		currentLang: 0,
		
		// "key": ["en", "ru", "de", "fr", "es"],
		translations:
		{
			"home":["Home", "Главная", "Startseite", "Accueil", "Inicio"],
			"servers":["Servers", "Сервера", "Server", "Serveurs", "Servidores"],
			"direct_connect":["Direct connect", "Быстрое подключение", "Direkt Verbindung", "Connection directe", "Conexión directa"],
			"directsub":["PLAY & ENJOY!", "Быстрое подключение к любимым серверам", "Spielen und Spaß haben", "PLAY & ENJOY!", "Juega y DIVIERTETE!"],
			"settings":["Settings", "Настройки", "Einstellungen", "Parametres", "Parametros"],
			"settingssub":["cuztomize, change, dominate!", "настройки мультиплеера", "Anpassen, verändern, dominieren!", "Parametres multijoueur", "Modifique, cambie, domine!"],
			"nickname":["In-game Nickname :", "Внутриигровое имя :", "Nickname im Spiel :", "Nom en jeu :", "Nickname del juego :"],
			"path":["Path to the game :", "Путь к игре :", "Pfad zum dem Spiel :", "Chemin du jeu :", "Ruta del juego :"],
			"aboutus":["About us", "О нас", "Über Uns", "A propos de nous", "Acerca de"],
			"support":["Support","Поддержка", "Hilfe", "Support", "Soporte"],
			"yeap":["Yeap", "Да!", "Ja!", "Oui", "Si"],
			"cpath":["Сhange the path?","Изменить путь?","Pfad verändern?","Change le chemin?","Cambia la ruta?"],
			"cnickname":["Сhange the nickname?","Изменить имя?","Nicknamen verändern?","Changer de nom?","Cambia el nickname?"],
			"quit":["Quit game", "Покинуть игру", "Quit game", "Quit game", "Salir del juego"],
		},
		
		activate: (state) =>
		{
			if(state != "disabled")
			{
				ui.ui_obj.fadeIn('fast', () => { $(window).resize(); });
			}
			else
			{
				ui.ui_obj.fadeOut('fast', () => { mp.invoke("exec", "hide"); });
			}
		},
		
		set_lang: (langName) =>
		{
			let lang = ui.langs.indexOf(langName);
			
			if(lang > 0
				&& lang < ui.langs.length)
			{
				$('.lang a.active').removeClass('active');
				$(".lang a:eq(" + lang + ")").addClass('active');				

				ui.currentLang = lang;
				
				for (var key in ui.translations)
				{
					$('.tr-' + key).html(ui.translations[key][lang]);
				}
			}
		},
		
		load: (data) =>
		{
			$('input#nickname_change').val(data.playerName);
			$('input#direct_connect_input').val(data.lastIP);
			ui.set_lang(data.lang);
			
			window.lastLoad = new Date();
			mp.invoke('exec', 'refresh');
		},
		
		loadServers: (data, old) =>
		{
			if(old == null)
				window.data = data;
			
			let table = $('#servers table tbody._server_list');
		
			if(data.length == 0)
			{
				table.html('<tr class="disabled"><td> Nothing found :( </td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>');
			}					
			else
			{
				table.hide();
				table.html("");
				
				for(let i = 0; i < data.length; i++)
				{
					let element = data[i];	
					let pingPicId = Math.floor(Math.min(element.ping, 75*3) / 75);				
					let gamemode = element.gamemode.toLowerCase();
					let gamemodePic = (whitelistedGamemodes.indexOf(gamemode) != -1) ? gamemode : "default";

					table.append(`<tr id="srv_${i}" data-players="${element.players}" data-name="${element.name}">
						<td><div class="server-star"></div><div class="server-image" style="background:#151e22 url(img/gamemodes/${gamemodePic}.png) no-repeat center; background-size:cover;"></div></td>
						<td>${element.name}
							<div class="server-desc">${element.desc}</div>
						</td>
						<td>${gamemode}</td>
						<td>${element.players}/${element.maxplayers}<div class="server-stat">Version<br>Max. Ping<br>Min. FPS</div></td>
						<td>${element.url}<div class="server-stat white">${element.minver}<br>${element.maxping}<br>${element.minfps}</div> </td>
						<td><img src="img/languages/${element.lang}.png" alt=""></td>
						<td><div class="ico-ping"><img src="img/ping/ping-${pingPicId}.png" alt=""></div> ${element.ping}</td>
						<td>${element.ip}:${element.port}<a href="javascript://" onclick="window.ui.connect('${element.ip}', ${element.port}, '', '${element.name}');" class="btn-connect">connect</a></td>
					</tr>`);

					setTimeout(function()
					{
						let el = table.children("tr#srv_" + i);
						
						el.click(function(e)
						{
							if($(this).is('.active'))
							{
								$(this).removeClass('active');
							}
							else
							{
								$('.table tr').removeClass('active');
								$(this).addClass('active');			
							}
						});
						
						el.fadeIn();
					}, 200 * (i*0.5));
				}	
				
				$('.server-image').width($('.main-width').width());
				
				table.show();
			}
		},
		
		connect: (ip, port, password, text) =>
		{
			mp.invoke('connect', ip, port, password ? password : "");
		},
		
		loadPings: (pings) =>
		{
			for (let id in pings)
			{
				let ping = pings[id];
				let element = $("#srv_" + id);
				
				/*if(ping == 999)
				{
					delete window.data[id];
					element.remove();
				}
				else
				{*/
					window.data[id].ping = ping;
					element.attr("data-ping", pings[id]);
					element.children("td:eq(6)").html(`<img src="img/ping/ping-${Math.floor(Math.min(ping, 75*3) / 75)}.png" alt="">&nbsp;&nbsp;${ping}`);
				//}
			}
		}
	};
	
		$('.lang a').on('click', function()
		{
			let id = $('.lang a').index($(this));
			
			if(id != ui.currentLang)
			{
				ui.currentLang = id;
				
				$('.lang a.active').removeClass('active');
				$(this).addClass('active');					
				
				mp.invoke("set_option", "lang", ui.langs[id]);
				
				$('._b').fadeOut('fast', function()
				{					
					for (var key in ui.translations)
					{
						$('.tr-' + key).html(ui.translations[key][ui.currentLang]);
					}
					
					$('._b').fadeIn('fast');
				});
			}
		});	
		
		let playersSortType = true;

		$('._players_sort').on('click', function()
		{
			 playersSortType = !playersSortType;
	
			$('#servers table tbody._server_list tr').sort(
				function(a, b)
			{
				let aVal = parseInt($(a).attr("data-players"));
				let bVal = parseInt($(b).attr("data-players"));
				
				if (aVal > bVal)
					return (playersSortType) ? 1 : -1;
				else if (aVal < bVal)
					return (playersSortType) ? -1 : 1;
					
				return 0;
			}).appendTo('#servers table tbody._server_list');				
		});
		
		let pingSortType = true;

		$('._ping_sort').on('click', function()
		{
			 pingSortType = !pingSortType;
	
			$('#servers table tbody._server_list tr').sort(
				function(a, b)
			{
				let aVal = parseInt($(a).attr("data-ping"));
				let bVal = parseInt($(b).attr("data-ping"));
				
				if (aVal > bVal)
					return (pingSortType) ? 1 : -1;
				else if (aVal < bVal)
					return (pingSortType) ? -1 : 1;
					
				return 0;
			}).appendTo('#servers table tbody._server_list');				
		});
		
		let lastIndexedValue = "";
		
		$( "input.input-search" ).bind('input', function()
		{
			let parentBlock = $('#servers table tbody._server_list');
			parentBlock.hide();
		
			let val = $(this).val().toLowerCase();
			
			if(!val.length)
			{
				parentBlock.children('tr').filter(":hidden").show();
			}
			else
			{
				if(val.indexOf(lastIndexedValue) != -1)
				{
					parentBlock.children('tr').each(function()
					{
						if($(this).css('display') != 'none' && $(this).attr("data-name").toLowerCase().indexOf(val) == -1)
							$(this).hide();
					});
				}
				else
				{
					parentBlock.children('tr').each(function()
					{
						if($(this).attr("data-name").toLowerCase().indexOf(val) != -1)
							$(this).show();
						else
							$(this).hide();
					});
				}
			}
			
			parentBlock.show();
			lastIndexedValue = val;
		});
	
	$('.direct_connect_button').click(function()
	{
		let val = $('#direct_connect_input').val();
		let pos = val.indexOf(':');
		if(pos != -1)
		{
			let ip = val.substr(0, pos);
			window.ui.connect(ip, parseInt(val.substr(pos + 1)), '', ip);
		}
	});
	
	$('.sort-arrow').click(function()
	{
		$(this).children("img").toggleClass("up");
	});
		
	$('._refresh_button').click(function()
	{
		let curr = new Date();
			
		let table = $('#servers table tbody._server_list');
		table.html('<tr class="disabled"><td> Loading... </td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>');
			
		if(!window.lastLoad
			|| ((curr - window.lastLoad) / 1000) > 5)
		{
			window.lastLoad = curr;
			mp.invoke('exec', 'refresh');		
		}
		else if(window.data)
		{
			setTimeout(() =>
			{			
				window.ui.loadServers(window.data, true);
			}, 500);
		}		
	});
	
	if(window.isBrowser)
		ui.activate("menu");
});