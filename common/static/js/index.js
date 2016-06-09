var $input = $("input");
var $label = $("label span");

var val = $label.html();
var cont = false;

function resize(){
	$("label > div > span").css("width", $("label").width());
}

$("form").ajaxForm({
	uploadProgress: function(event, position, total, percent){
		var complete = percent + "%";

		$("input").prop("disabled", true);
		$("label span").html(complete);
		$("label > div").animate({ width: complete }, 100);
	},
	complete: function(xhr){
		setTimeout(() => {
			if (xhr.responseText !== "cancel"){
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
			}
		}, 500);
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
