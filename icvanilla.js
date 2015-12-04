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

//globals
var overlay = null;

//just an update test
$(document).ready(function()
{
      $('.Breadcrumbs').prepend('<span class="CrumbLabel" id="showChocolateSettings"><a href="#">ChocolateDiaper</a></div>');

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
      if(oldUsers !== null && oldUsers != '')
      {
        var hideUsersT = localStorage.getItem('hideUserThreads');
         var sp = oldUsers.split('|');
         $.each(sp, function()
         {
              if(hideUsersT == '1')
              {
                hideUserThreads(this);
              }
              $('a[title=' + this + ']').closest('.ItemComment').hide();
         });

      }

      $('#showChocolateSettings').click(function()
      {
        createUI();
      });

      hideThreads();

      //add styles
      addGlobalStyle('.tabs-menu { height: 30px; float: left; clear: both; }');
      addGlobalStyle('.tabs-menu li {    height: 30px;    line-height: 30px;    float: left;    margin-right: 10px;    background-color: #ccc;    border-top: 1px solid #d4d4d1;    border-right: 1px solid #d4d4d1; border-left: 1px solid #d4d4d1;}');
      addGlobalStyle('.tabs-menu li.current {    position: relative;    background-color: #fff;    border-bottom: 1px solid #fff;    z-index: 5;}');
      addGlobalStyle('.tabs-menu li a {    padding: 10px;    text-transform: uppercase;    color: #fff;    text-decoration: none; }');
      addGlobalStyle('.tabs-menu .current a {    color: #2e7da3;}');
      addGlobalStyle('.tab {    border: 1px solid #d4d4d1;    background-color: #fff;    float: left;    margin-bottom: 20px;    width: auto;}');
      addGlobalStyle('.tab-content {    width: 660px;    padding: 20px;    display: none; float: left;}');
      addGlobalStyle('#tab-1 { display: block; }');
      addGlobalStyle('.close { margin-right: 15px; }');
});

function createUI()
{
      if (overlay != null)
        return;
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

      var heading = document.createElement('H2');
      heading.appendChild(document.createTextNode('Chocolate Diaper Settings'));
      panel.appendChild(heading);

      var tabs = document.createElement('ul');
      tabs.className = 'tabs-menu';

      var tab1 = document.createElement('li');
      tab1.className = 'current';
      var lnk1 = document.createElement('a');

      lnk1.href ="#tab-1";
      lnk1.appendChild(document.createTextNode('General'));
      tab1.appendChild(lnk1);


      var tab2 = document.createElement('li');
      var lnk2 = document.createElement('a');
      lnk2.href ="#tab-2";
      lnk2.appendChild(document.createTextNode('Threads'));
      tab2.appendChild(lnk2);

      var tab3 = document.createElement('li');
      var lnk3 = document.createElement('a');
      lnk3.href ="#tab-3";
      lnk3.appendChild(document.createTextNode('Users'));
      tab3.appendChild(lnk3);

      tabs.appendChild(tab1);
      tabs.appendChild(tab2);
      tabs.appendChild(tab3);
      panel.appendChild(tabs);

      var close = document.createElement('a');
      close.appendChild(document.createTextNode('Close'));
      close.href = '#';
      close.onclick = clearUI;
      close.style.cssFloat = 'right';
      close.className = 'close';

      panel.appendChild(close);

      var tabDiv = document.createElement('div');
      tabDiv.className = 'tab';

      var tab_1 = document.createElement('div');
      tab_1.className = 'tab-content';
      tab_1.id = 'tab-1';

      var tab_2 = document.createElement('div');
      tab_2.className = 'tab-content';
      tab_2.id = 'tab-2';

      var tab_3 = document.createElement('div');
      tab_3.className = 'tab-content';
      tab_3.id = 'tab-3';

      var generalHead = document.createElement('h5');
      generalHead.appendChild(document.createTextNode('General Settings'));
      tab_1.appendChild(generalHead);
      var general = document.createElement('p');

      var clearItems = document.createElement('button');
      clearItems.appendChild(document.createTextNode('Clear Data'));
      clearItems.onclick = clearData;
      general.appendChild(clearItems);
      var general2 = document.createElement('p');

      var cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.id = 'cbHideThreads';

      var hideThreads = localStorage.getItem('hideUserThreads');
      if(hideThreads == '1')
      {
          cb.checked = true;
      }
      else
      {
          cb.checked = false;
      }

      general2.appendChild(cb);
      general2.appendChild(document.createTextNode('Hide threads and posts from a user'));

      tab_1.appendChild(general);
      tab_1.appendChild(general2);
      panel.appendChild(tab_1);

      var threadHead = document.createElement('h5');
      threadHead.appendChild(document.createTextNode('Hidden Threads'));
      tab_2.appendChild(threadHead);

      //panel.appendChild(threadHead);

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
      tab_2.appendChild(ul);
      panel.appendChild(tab_2);
      //panel.appendChild(ul);

      var userHead = document.createElement('h5');
      userHead.appendChild(document.createTextNode('Hidden Users'));
      tab_3.appendChild(userHead);

      //panel.appendChild(threadHead);

      var tmp = localStorage.getItem('users');
      var hidUsers = null;
      if(tmp != null)
      {
        hidUsers = tmp.split('|');
      }

      var ul = document.createElement('ul');
      if(hidUsers != null && hidUsers != '')
      {
        $.each(hidUsers, function()
        {
          if(this !== '' && this !== null && this != 'null')
          {
            var li = document.createElement('li');
            var lbltxt = this + ' ';
            var label = document.createElement('label');
            label.htmlFor = this;
            label.appendChild(document.createTextNode(lbltxt));

            var rm = document.createElement('a');
            rm.href='#';
            rm.title = '' + this + '';
            rm.appendChild(document.createTextNode('remove'));
            rm.onclick = removeUser;

            li.appendChild(label);
            li.appendChild(rm);
            ul.appendChild(li);
          }

        });
      }
      tab_3.appendChild(ul);
      panel.appendChild(tab_3);
      //panel.appendChild(ul);

      //panel.appendChild(tab_3);
      overlay = panel;
      $('body').append(panel);

      $('.tabs-menu a').click(function(event) {
          event.preventDefault();
          $(this).parent().addClass('current');
          $(this).parent().siblings().removeClass('current');
          var tab = $(this).attr('href');
          $('.tab-content').not(tab).css('display', 'none');
          $(tab).fadeIn();
      });

      $('#cbHideThreads').change(function() {
        var chk = $('#cbHideThreads').is(':checked');
        if(chk)
        {
          localStorage.setItem('hideUserThreads', '1')
        }
        else
        {
          localStorage.setItem('hideUserThreads', '0');
        }
      });

}


function confirmationDialog(txt)
{
  return window.confirm(txt);
}

function clearData()
{
  var confirm = confirmationDialog('Are you sure you want to clear your data?');

  if(confirm)
  {
    localStorage.setItem('items', null);
    localStorage.setItem('users', null);
    clearUI();
    createUI();
  }
  else {
    return;
  }


}
function clearUI()
{
  $('#chocolateSettings').remove();
  overlay = null;
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

function removeUser()
{
  var hidUsers = localStorage.getItem('users');
  if(hidUsers !== null)
  {
    var newvals = hidUsers.replace(this.title, '');
    if(newvals.charAt(0) === '|')
    {
      newvals = newvals.substr(1);
    }

    if(newvals.charAt(newvals.length -1) === '|')
    {
        newvals = newvals.slice(0, -1);
    }


    localStorage.setItem('users', newvals);
  }
  clearUI();
  createUI();
}

function hideUser()
{
  var user = $(this).closest('.AuthorWrap').find('.Author').find('.PhotoWrap').attr('title');
  $(this).closest('.ItemComment').hide();
  var oldvals = localStorage.getItem('users');
  var newvals = "";
  if(oldvals != null && oldvals != '') {
     newvals = oldvals + "|" + user;
  }
  else {
      newvals =  user;
  }

  localStorage.setItem('users', newvals);
  location.reload();
}

function hideThread()
  {
    var thread = $(this).closest('.ItemDiscussion').fadeOut();

    var oldvals = localStorage.getItem('items');

    var newvals = oldvals + "|#" + thread.attr('id');

    localStorage.setItem('items', newvals);

    return false;
  }

  function hideUserThreads(user)
  {

    $('.DataList.Discussions li > a[title="' + user + '"]').parent().hide()
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

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}
