(function($){
	
	
	/**
	*  initialize_field
	*
	*  This function will initialize the $field.
	*
	*  @date	30/11/17
	*  @since	5.6.5
	*
	*  @param	n/a
	*  @return	n/a
	*/
	
	function initialize_field( $field ) {
		
		//$field.doStuff();
		
	}
	
	
	if( typeof acf.add_action !== 'undefined' ) {
	
		/*
		*  ready & append (ACF5)
		*
		*  These two events are called when a field element is ready for initizliation.
		*  - ready: on page load similar to $(document).ready()
		*  - append: on new DOM elements appended via repeater field or other AJAX calls
		*
		*  @param	n/a
		*  @return	n/a
		*/
		
		acf.add_action('ready_field/type=videos', initialize_field);
		acf.add_action('append_field/type=videos', initialize_field);

	} else {
		
		/*
		*  acf/setup_fields (ACF4)
		*
		*  These single event is called when a field element is ready for initizliation.
		*
		*  @param	event		an event object. This can be ignored
		*  @param	element		An element which contains the new HTML
		*  @return	n/a
		*/
		
		$(document).on('acf/setup_fields', function(e, postbox){
			
			// find all relevant fields
			$(postbox).find('.field[data-field_type="videos"]').each(function(){
				
				// initialize
				initialize_field( $(this) );
				
			});
		
		});
	
	}

	/*
	*
	*  Button click choose video
	*
	*/

	$(document).on('click', '.btn_video, .btn_edit', function(e){
		e.preventDefault();
		if ( typeof wp !== 'undefined' && wp.media && wp.media.editor) {
			var button = $(this);
			var input_id = $('#video-' + button.attr('data-id'));
			var embed_id = $('#embed-' + button.attr('data-id'));

			var new_media = wp.media({
				title: 'Choose video',
				multiple: false,
				button: {
					text: 'Use this video'
				},
				library: {
					type: [ 'video']
				}
			});

			new_media.on('select', function(){
				attachment = new_media.state().get('selection').first().toJSON();
				if(attachment.type == 'video'){
					input_id.val(attachment.id);
					input_id.parent().addClass('active');
					uci_generate_embed(attachment.url, embed_id);
				}
			})

			new_media.open();
			return false;
		}
	})

	/*
	*
	*  Remove video
	*
	*/

	$(document).on('click', '.btn_delete', function(e){
		e.preventDefault();
		var button = $(this);
		var input_id = $('#video-' + button.attr('data-id'));
		var embed_id = $('#embed-' + button.attr('data-id'));

		input_id.val('');
		input_id.parent().removeClass('active');
		embed_id.html('');
	})

	/*
	*
	*  Generate embed video
	*
	*/
	function uci_generate_embed(video_src, embed_id){
		$.ajax({
			url: admin_url,
			method: 'POST',
			data: {
				action: 'uci_generate_embed',
				video_src: video_src
			},
			success: function(resonse){
				if(resonse){
					embed_id.html(resonse);
				}
			}
		});
	}

})(jQuery);
