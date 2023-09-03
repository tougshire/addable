function showAddButton(perm, button_id) {
  if('True'==perm) {
    var buttonAdd = document.getElementById(button_id);
    if( buttonAdd != null ) {
      var style=buttonAdd.getAttribute('style');
      if( '' < style ) {
        buttonAdd.setAttribute('style', style.replace('display:none',''));
      }
    } else {
      var buttonAdds = document.getElementsByClassName("button_addable");
      for( b=0; b<buttonAdds.length; b++ ) {
        var buttonAdd = buttonAdds[b];
        if( buttonAdd.id.match(button_id)) {
          var style=buttonAdd.getAttribute('style');
          if( '' < style ) {
            buttonAdd.setAttribute('style', style.replace('display:none',''));
          }
        }
      }
    }
  }
}

function openModelForm(select) {

  var iframe = document.createElement('iframe');
  iframe.id = 'iframe_' + select.id;
  iframe.setAttribute('data-add_url', select.getAttribute('data-add_url'));
  iframe.setAttribute('data-primary', select.id );
  iframe.setAttribute('data-secondaries', select.getAttribute('data-secondaries'));
  iframe.src = select.getAttribute('data-add_url');
  iframe.style.width="100%";

  var iframeContainer=select.parentNode;
  while (!(iframeContainer.getAttribute('data-addable_container')>'') && !(iframeContainer.tagName=="BODY")) {
    iframeContainer = iframeContainer.parentNode;
  }

  iframeContainer.appendChild(iframe);
  iframe.style.width="100%";
  iframe.addEventListener('load', function() {
    iframe.height = iframe.contentWindow.document.body.scrollHeight + "px";
  });

  submit_button = document.createElement('button');
  submit_button.type = "button";
  submit_button.id=('button_submit_' + select.id);
  submit_button.setAttribute('data-add_url', select.getAttribute('data-add_url'));
  submit_button.setAttribute('data-primary', select.id );
  submit_button.setAttribute('data-secondaries', select.getAttribute('data-secondaries'));
  submit_button.innerHTML="Submit";

  submit_button.addEventListener('click', function(e) {
    e.preventDefault();
    submitModelForm(e.target);
  });
  iframeContainer.appendChild(submit_button);

  cancel_button = document.createElement('button');
  cancel_button.type = "button";
  cancel_button.id=('button_cancel_' + select.id);
  cancel_button.setAttribute('data-add_url', select.getAttribute('data-add_url'));
  cancel_button.setAttribute('data-primary', select.id );
  cancel_button.setAttribute('data-secondaries', select.getAttribute('data-secondaries'));
  cancel_button.innerHTML="Cancel";

  cancel_button.addEventListener('click', function(e) {
    e.preventDefault();
    closeModelForm(e.target);
  });

  iframeContainer.appendChild(cancel_button);

}

function closeModelForm(button) {

  var idbase = button.id.substr('button_cancel_'.length);

  var iframe = document.getElementById("iframe_" + idbase);
  iframe.remove();
  var parent = button.parentNode;

  submit_button = document.getElementById('button_submit_' + idbase);
  submit_button.remove();

  button.remove();
}

function submitModelForm(button) {

  var idbase = button.id.substr('button_submit_'.length);

  var iframe = document.getElementById('iframe_' + idbase);
	iframe.contentDocument.getElementById('form').submit();
}

function updateSelects( iframe, optionValue, optionInner ) {

  var idbase = iframe.id.substr('iframe_'.length);

  option = document.createElement('option');
  option.setAttribute('value', optionValue);
  option.innerHTML = optionInner;

  var selectNames = iframe.getAttribute('data-secondaries').split(',');
  for( s=0; s < selectNames.length; s++ ) {
        var selectName = selectNames[s].trim();
        if( '' < selectName ) {
            var select = document.getElementById(selectNames[s]);
            if(select != null) {
                select.appendChild(option);
            }
        }
  }
  optionClone=option.cloneNode(true);
  optionClone.setAttribute('selected', 'selected');
  var primary = document.getElementById(iframe.getAttribute('data-primary'));
  primary.appendChild(optionClone);

	submit_button = document.getElementById('button_submit_' + idbase);
	submit_button.remove();
	cancel_button = document.getElementById('button_cancel_' + idbase);
	cancel_button.remove();
	iframe.remove();
}

if( typeof(addable_loaded)=='undefined' ) {
	document.addEventListener('change', function(e) {
		if(e.target.tagName=='select' || e.target.tagName=='SELECT') {
			select=e.target;
			if( select.value=='[addable_new]' ) {
				select.value='';
				openModelForm(select);
			}
		}
	});
}

var addable_loaded = {'loaded':1}
