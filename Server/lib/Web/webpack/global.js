/**
 * Rule the words! KKuTu Online
 * Copyright (C) 2017 JJoriping(op@jjo.kr)
 * Copyright (C) 2024 Studio Moremi(op@kkutu.store)
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * 볕뉘 수정사항:
 * getCookie 코드오류로 인한 코드 수정
 */

(function(){
	var size;
	var _setTimeout = setTimeout;
	/*function setCookie(cName, cValue, cDay) {
		// 쿠키와 달리 로컬 스토리지에는 만료일이 없으므로 별도의 처리가 필요하지 않습니다.
		localStorage.setItem(cName, JSON.stringify(cValue)); // 데이터를 문자열로 변환하여 저장합니다.
	}
	
	function getCookie(cName) {
		var data = localStorage.getItem(cName);
		if (data) {
			return JSON.parse(data); // 저장된 데이터를 JSON 형태로 파싱하여 반환합니다.
		}
		return null;
	}*/
	
	function setCookie(name, value, days) {
		var expires = "";
		if (days) {
		  var date = new Date();
		  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
		  expires = "; expires=" + date.toUTCString();
		}
		document.cookie = name + "=" + (value || "") + expires + "; path=/";
	  }
    function getCookie(cName) {
        //볕뉘 수정
        var cName = cName+"=";
		var allCookie = decodeURIComponent(document.cookie).split(';');
		var cval = [];
		for(var i=0; i < allCookie.length; i++) {
			if (allCookie[i].trim().indexOf(cName) == 0) {
				cval = allCookie[i].trim().split("=");
			}
		}
		return unescape((cval.length > 0) ? cval[1] : "");
		//볕뉘 수정 끝
    }
	
	
	
	$.prototype.hotkey = function($f, code){
		var $this = $(this);
		($f || $(window)).on("keydown", function(e){
			if(!e.shiftKey){
				if(e.keyCode == code){
					// $("#JJoSearchTF").expl();
					$this.trigger("click");
					e.preventDefault();
				}
			}
		});
		return $this;
	};
	$.prototype.color = function(hex){
		return $(this).css({ 'color': hex });
	};
	$.prototype.bgColor = function(hex){
		return $(this).css({ 'background-color': hex });
	};
	$.cookie = function(key, value, expire){
		if(value === undefined){
			return getCookie(key);
		}else{
			setCookie(key, value, 30);
		}
	};
	$(document).ready(function(e){
		const LANG = {
			'ko_KR': "한국어",
			'en_US': "English",
			'ja_JP': "日本語",
			'es_MX': "Español"
		};
		var $gn = $("#global-notice").hide();
		var $c;
		var explSize;
		var gn = $("#gn-content").html() || "";
		
		globalThis.profile = $("#profile").html();
		if(globalThis.profile) globalThis.profile = JSON.parse(globalThis.profile);
		else globalThis.profile = {};
		
		$.cookie('test', "good");
		if($.cookie('test') != "good"){
			$gn.html(gn = "쿠키 사용이 차단되어 있습니다. 로그인 관련 기능이 제한됩니다.<br>제한을 풀기 위해서는 브라우저 설정에서 쿠키 사용을 허용하도록 설정해야 합니다.<br>" + gn);
		}else{
			$.cookie('test', "");
		}
		if(gn.length > 1) $gn.show();
		$gn.on('click', function(e){ $gn.hide(); });
		
		$(window).on('resize', function(e){
			size = [ $(window).width(), $(window).height() ];
			

			$("#Bottom").width(size[0]);
		}).on('mousemove', function(e){
			if(explSize == null) return;
			$(".expl-active").css({ 'left': Math.min(e.clientX + 5, size[0] - explSize[0] - 12), 'top': Math.min(e.clientY + 23, size[1] - explSize[1] - 12) });
		}).trigger('resize');
	
	// 계정
		if($.cookie('lc') == "") $.cookie('lc', "ko_KR");
		
		if (globalThis.profile.token) {
			$("#account-info").html((globalThis.profile.nickname || globalThis.profile.title || globalThis.profile.name) + '<span class="topText">님</span>').on('click', function(e){
				if (confirm(L['ASK_LOGOUT'])) requestLogout(e);
			});
		}else{
			if(window['FB']){
				try{
					FB.logout();
				}catch(e){
					_setTimeout(function(){ FB.logout(); }, 1000);
				}
			}
			$("#account-info").html(L['LOGIN']).on('click', requestLogin);
		}
		/*if($.cookie('forlogout')){
			requestLogout();
		}*/
		globalThis.watchInput($("#quick-search-tf"));
		(globalThis.expl = function($mother){
			var $q = $mother ? $mother.find(".expl") : $(".expl");
			
			$q.parent().addClass("expl-mother").on('mouseenter', function(e){
				var $e = $(e.currentTarget).children(".expl");
				
				explSize = [ $e.width(), $e.height() ];
				$(".expl-active").removeClass("expl-active");
				$e.addClass("expl-active");
			}).on('mouseleave', function(e){
				$(e.currentTarget).children(".expl").removeClass("expl-active");
			});
		})();
	});
	
	function requestLogin(e){
		var tl = [ (size[0] - 200) * 0.5, (size[1] - 300) * 0.5 ];
		
		// $.cookie('preprev', location.href);
		location.href = "/login";
	}
	function requestLogout(e){
		/*if(location.host == "kkutu.kr"){
			// $.cookie('forlogout', "true");
			location.href = "/logout";
			return;
		}*/
		//볕뉘 수정 구문 삭제(161~167, facebook js SDK 대응코드 삭제)
		location.href = "/logout";
	}
	function onWatchInput($o, prev){
		var cid = $o.attr('id');
		var $ac = $("#ac-"+cid);
		
		if($o.val() != prev){
			if(prev = $o.val()){
				$.get("http://jjo.kr/search?q=" + encodeURI(prev), function(res){
					var i, c = 0;
					
					$ac.empty();
					global['wl-'+cid] = res.list.slice(0, 10);
					global['wi-'+cid] = -1;
					for(i in res.list){
						if(c++ >= 10) break;
						$ac.append($("<div>")
							.attr('id', "aci-" + res.list[i]._id)
							.addClass("autocomp-item ellipse")
							.html(res.list[i].profile.name)
							.on('click', function(e){
								location.href = "http://jjo.kr/users/" + $(e.currentTarget).attr('id').slice(4);
							})
						);
					}
					if(c){
						$ac.show();
						$o.css('border-bottom-left-radius', 0);
					}else{
						$ac.hide();
						$o.css('border-bottom-left-radius', "");
					}
				});
			}else{
				$ac.hide();
				$o.css('border-bottom-left-radius', "");
			}
		}
		_setTimeout(onWatchInput, 200, $o, prev);
	}
	globalThis.watchInput = function($tf){
		var cid = $tf.attr('id');
		
		$tf.after($("<div>")
			.addClass("autocomp")
			.attr('id', "ac-"+cid)
			.css({
				'margin-top': $tf.outerHeight(),
				'width': $tf.outerWidth() - 6
			})
			.hide()
		).on('keydown', function(e){
			var dir = (e.keyCode == 38) ? -1 : (e.keyCode == 40) ? 1 : 0;
			var list;
			
			if(!dir) return;
			if(!(list = global['wl-'+cid])) return;
			if(global['wi-'+cid] == -1) if(dir == -1) dir = 0;
			
			$(".autocomp-select").removeClass("autocomp-select");
			global['wi-'+cid] += dir;
			if(global['wi-'+cid] < 0) global['wi-'+cid] += list.length;
			if(global['wi-'+cid] >= list.length) global['wi-'+cid] = 0;
			
			$("#aci-" + list[global['wi-'+cid]]._id).addClass("autocomp-select");
			e.preventDefault();
		});
		return _setTimeout(onWatchInput, 200, $tf, $tf.val());
	};
	globalThis.zeroPadding = function(num, len){ var s = num.toString(); return "000000000000000".slice(0, Math.max(0, len - s.length)) + s; };
	globalThis.onPopup = function(url){
		location.href = url;
	};
})();