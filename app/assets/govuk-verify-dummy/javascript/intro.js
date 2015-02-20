verify = (typeof verify === 'undefined') ? {} : verify;

verify.intro = {

	init: function(options){

		var changeStep = function(delta){

			$stepWrap = $('#step-wrap');

			var newStep = oldStep = Number($('#progress li.selected').attr('id').replace('progress-step-',''));

			if (delta == 1){

				$stepWrap.scrollLeft($stepWrap.scrollLeft() + 960);

				newStep++;

			} else {

				if (oldStep == 1){
					return;
				}

				$stepWrap.scrollLeft($stepWrap.scrollLeft() - 960);

				newStep--;

			}

			// if (newStep == 2 && oldStep == 1){

			// 	$('.next').hide();
			// 	$('.start').toggleClass('visible', true);

			// } else if (newStep == 1 && oldStep == 2){

			// 	$('.next').show();
			// 	$('.start').toggleClass('visible', false);

			// }

			$('#progress li').removeClass('selected');

			$('#progress-step-' + newStep).addClass('selected');

		};

		/*$('.next').on('click', function(e){

			e.preventDefault();

			var beenVerified = $('input[name="beenVerified"]:checked').val();

			if (beenVerified == "false"){

				window.location.href="/intro-2?requestId=" + options.requestId;

			} else if (beenVerified == "true"){

				window.location.href="/sign-in?requestId=" + options.requestId;

			} else {

				return;

			}

		});*/

		// $('.next').on('click', function(e){

		// 	e.preventDefault();

		// 	changeStep(1);

		// });


		// $('.back').on('click', function(e){

		// 	e.preventDefault();

		// 	changeStep(-1);

		// });

	}

};