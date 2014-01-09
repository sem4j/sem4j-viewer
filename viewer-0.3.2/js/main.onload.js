
$(function() {
	
	// List Namespaces
	listNodeIndexes();
	
	// Submit Concept
	$('input#submitConcept').click(function(){
		clearRes();
		searchConcept($('#selectNamespace option:selected').val());
	});
	
	// Window Height
	$('#container').height(($(window).height() - 30));
	$(window).resize(function() {
		$('#container').height(($(window).height() - 30));
	});
	
	// Tab Panel
	$('ul.panel li:not(' + $('ul.tab li a.selected').attr('name') + ')').hide();
	$('ul.tab li a').click(function(){
		showPanel(this);
		// When Tab4 is selected
		if($('ul.tab li a.selected').attr('name') == '#tab4'){
			setTypeConcept();
			setTypeRelation();
		}
	});
	
	// Float Window
	$('#titlebar_search').click(function(){
		$('#floatWindowSearch').fadeIn('fast');
		return false;
	});
	$('#titlebar_log').click(function(){
		$('#floatWindowLog').fadeIn('fast');
		return false;
	});
	$('div.floatWindow a.close').click(function(e){
		$(this).parent('div').fadeOut('fast');
		return false;
	});
	$('div.floatWindow dl dt').mousedown(function(e){
		var div_floatWindow = $(this).parents('div');
		div_floatWindow
			.data('clickPointX' , e.pageX - div_floatWindow.offset().left)
			.data('clickPointY' , e.pageY - div_floatWindow.offset().top);
		$(document).mousemove(function(e){
			div_floatWindow.css({
				top:e.pageY  - div_floatWindow.data('clickPointY')+'px',
				left:e.pageX - div_floatWindow.data('clickPointX')+'px'
			});
		});
		return false;
	})
	.mouseup(function(){
		$(document).unbind('mousemove');
		return false;
	});
});
