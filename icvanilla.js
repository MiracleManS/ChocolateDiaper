// ==UserScript==
// @name        ChocolateDiaper
// @namespace   MiraclemanS.Vanilla
// @description Does way too much crap
// @include     http://icrontic.com/*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js
// @version     2.0
// @downloadURL
// @updateURL
// @grant       none
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);

//just an update test
$(document).ready(function()
{
  $('.Breadcrumbs').prepend('<span class="CrumbLabel" id="showChocolateSettings"><a href="#">ChocolateDiaper</a></div>');

  //GM_log(items);

  var list = $(".Meta-Discussion");
  $.each(list, function()
  {
    var ele = document.createElement("a");
    ele.href='#';
    ele.appendChild(document.createTextNode('Hide'));
    ele.onclick = hideThread;

    this.appendChild(ele);
  });

    var listu = $(".Username");
  $.each(listu, function()
  {
    var eleu = document.createElement("a");
    eleu.style.color = 'red';
    eleu.href='#';
    eleu.appendChild(document.createTextNode('Mute'));
    eleu.onclick = hideUser;

    $(this).closest('.Author').after(eleu);
  });

  var oldUsers = localStorage.getItem('users');
  if(oldUsers !== null)
  {
     var sp = oldUsers.split('|');
      $.each(sp, function()
      {

          $('a[title=' + this + ']').closest('.ItemComment').hide();
      });
  }

  $('#showChocolateSettings').click(function()
  {
    createUI();
  });

  hideThreads();

});

function createUI()
{
      var panel = document.createElement('div');
      panel.id = 'chocolateSettings';
      panel.style.color = 'black';
      panel.style.background = 'white';
      panel.style.position = 'absolute';
      panel.style.width = '500px';
      panel.style.margin = '0 auto';
      panel.style.border = 'solid';
      panel.style.left = '10%';
      panel.style.top = '10%';
      panel.style.height = '500px';

      var close = document.createElement('a');
      close.appendChild(document.createTextNode('Close'));
      close.href = '#';
      close.onclick = clearUI;
      close.style.cssFloat = 'right';

      panel.appendChild(close);

      var heading = document.createElement('H2');
      heading.appendChild(document.createTextNode('Chocolate Diaper Settings'));
      panel.appendChild(heading);




      var threadHead = document.createElement('h5');
      threadHead.appendChild(document.createTextNode('Hidden Threads'));
      panel.appendChild(threadHead);

      var hidThreads = localStorage.getItem('items').split('|');
      var ul = document.createElement('ul');
      if(hidThreads != null)
      {
        $.each(hidThreads, function()
        {
          if(this !== '' && this !== null && this != 'null')
          {
            var li = document.createElement('li');
            var lbltxt = $(this + " .Title a").text();
            var label = document.createElement('label');
            label.htmlFor = this;
            label.appendChild(document.createTextNode(lbltxt));

            var rm = document.createElement('a');
            rm.href='#';
            rm.title = this;
            rm.appendChild(document.createTextNode('remove'));
            rm.onclick = removeThread;

            li.appendChild(label);
            li.appendChild(rm);
            ul.appendChild(li);
          }

        });
      }
      panel.appendChild(ul);
      $('body').append(panel);

}

function clearUI()
{
  $('#chocolateSettings').remove();
}

function removeThread()
{
  var hidThreads = localStorage.getItem('items');
  if(hidThreads !== null)
  {
    var newvals = hidThreads.replace(this.title, '');
    if(newvals.charAt(0) === '|')
    {
      newvals = newvals.substr(1);
    }

    if(newvals.charAt(newvals.length -1) === '|')
    {
        newvals = newvals.slice(0, -1);
    }


    localStorage.setItem('items', newvals);
  }
  clearUI();
  createUI();
}

function hideUser()
  {
    var user = $(this).closest('.AuthorWrap').find('.Author').find('.PhotoWrap').attr('title');
    $(this).closest('.ItemComment').hide();
    var oldvals = localStorage.getItem('users');

    var newvals = oldvals + "|" + user;

    localStorage.setItem('users', newvals);
  }

function hideThread()
  {
    var thread = $(this).closest('.ItemDiscussion').hide();

    var oldvals = localStorage.getItem('items');

    var newvals = oldvals + "|#" + thread.attr('id');

    localStorage.setItem('items', newvals);
  }

  function unHideThread()
  {

    var thread = $(this).closest('.ItemDiscussion');
    thread.css('background-color', 'transparent');
    var oldvals = localStorage.getItem('items').replace('|#' + thread.attr('id'), '');
    $(this).hide();
    localStorage.setItem('items', oldvals);
  }

function showItems()
{
  $('#showhid').hide();
  var old = localStorage.getItem('items');
  //alert(old);
  if(old != null)
  {
	  var spl = old.split('|');

	  $.each(spl, function()
	  {
        var ele = document.createElement("a");
		    ele.href='#';
		    ele.appendChild(document.createTextNode('Unhide'));
		    ele.onclick = unHideThread;
        $('' + this + '').show().css('background-color', '#c0f2ff').append(ele);
    });
  }
}

function hideThreads()
{
  var items = localStorage.getItem('items');
  if (items !== null)
  {
    var spl = items.split('|');
    $.each(spl, function ()
    {
      $('' +this+ '').hide();
    });
  }
}
