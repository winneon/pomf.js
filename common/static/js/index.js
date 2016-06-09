var $input = $("input");
var $label = $("label span");

var val = $label.html();
var cont = false;

function resize(){
	$("label > div > span").css("width", $("label").width());
}

function sharexClose(){
	$("div.config").off("click");
	$(document).off("keydown");
	$("div.sharex").removeClass("hide");

	$("div.config").animate({ opacity: "0" }, 250, () => {
		$("div.config").css("visibility", "hidden");
	});
}

$("form").ajaxForm({
	uploadProgress: function(event, position, total, percent){
		var complete = percent + "%";

		$("input").prop("disabled", true);
		$("label span").html(complete);
		$("label > div").width(complete);
	},
	complete: function(xhr){
		switch (xhr.status){
			case 200:
				$("label span").html(xhr.responseText);
				var width = $("label > div").width();

				$("label > span").html("");
				$("label > div > span").html("100%");
				$("label > span").changeElementType("a");

				$("label").addClass("fade");
				$("label").css("min-width", $("label").width() + 10);

				setTimeout(() => {
					$("label > div").hide();

					$("label > a").animate({ "min-width": width + "px" }, 500, () => {
						$("label > a").css("opacity", "0");
						$("label > a").html(xhr.responseText).attr("href", xhr.responseText);
						$("label > a").animate({ opacity: 1 }, 100);
					});
				}, 500);

				break;

			case 413:
				$("input").prop("disabled", true);
				$("label").addClass("no_hover");

				$("label").css("background-color", "#E06868");
				$("label span").html("Woah, too big!");
				$("label > div").animate({ width: "0%" }, 500);

				setTimeout(() => {
					// I'd love for this to work, but for some reason the button doesn't fire hte change event after this point.

					/*$("input").prop("disabled", false);
					$("label").removeClass("no_hover");

					$("label").animate({ backgroundColor: "transparent" }, 200, () => {
						$("label").css("background-color", "");
					});
					$("label span").html(val);*/

					window.location.reload();
				}, 1500);

				break;

			case 400:
			default:
				// do nothing on this one
				break;
		}
	}
});

$input.on("change", (event) => {
	var name = "";

	if (event.target.files && event.target.files.length > 1){
		name = ($(event.target).attr("data-caption") || "").replace("%count%", event.target.files.length);
	} else {
		name = event.target.value.split("\\").pop();
	}

	$input.prop("disabled", false);
	$label.html(name ? "0%" : val);

	resize();

	if (event.target.value !== ""){
		$("form").submit();
	}
});

$("div.sharex").on("click", (event) => {
	$("div.sharex").addClass("hide");
	$("div.config").css("visibility", "visible");

	$("div.config").animate({ opacity: "1" }, 250, () => {
		$("div.config").on("click", (event) => {
			if ($(event.target).hasClass("config")){
				sharexClose();
			}
		});

		$(document).on("keydown", (event) => {
			if (event.which == 27 && $("div.sharex").hasClass("hide")){
				sharexClose();
			}
		});
	});
});

// credit to http://stackoverflow.com/a/8584217
(function($) {
    $.fn.changeElementType = function(newType){
        var attrs = { };

        $.each(this[0].attributes, (idx, attr) => {
            attrs[attr.nodeName] = attr.nodeValue;
        });

        this.replaceWith(() => {
            return $("<" + newType + "/>", attrs).append($(this).html());
        });
    };
})(jQuery);

resize();
