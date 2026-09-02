
// Highlight current nav item
var hasCurrent = false;
var isindexpage = true;
$('#main-nav > li').each(function () {
	if(isindexpage){
		isindexpage = false;
		return true;
	  }
	var url = window.location.href;
	if(url.toUpperCase().indexOf($(this).attr("linktext").trim().toUpperCase()) != -1){
		$(this).addClass('current-menu-item current_page_item');
		hasCurrent = true;
	} else {
		$(this).removeClass('current-menu-item current_page_item');
	}
});

if (!hasCurrent) {
	$('#main-nav > li:first').addClass('current-menu-item current_page_item');
}



// Article TOC: keep it visible and highlight the section currently in view.
var toc = document.getElementById('toc');

if (toc != null) {
	var tocPosition = toc.getBoundingClientRect().top + window.pageYOffset;
	var tocLinks = Array.prototype.slice.call(toc.querySelectorAll('.nav-link'));
	var tocEntries = tocLinks.map(function (link) {
		var hash = link.getAttribute('href') || '';
		var id;
		try {
			id = decodeURIComponent(hash.replace(/^#/, ''));
		} catch (e) {
			id = hash.replace(/^#/, '');
		}
		return { link: link, heading: document.getElementById(id) };
	}).filter(function (entry) {
		return entry.heading;
	});
	var ticking = false;
	var currentLink = null;

	function activateTocLink(link) {
		if (!link || link === currentLink) return;
		currentLink = link;
		tocLinks.forEach(function (item) {
			item.classList.remove('active');
			var li = item.parentNode;
			if (li) li.classList.remove('active');
		});

		link.classList.add('active');
		var node = link.parentNode;
		while (node && node !== toc) {
			if (node.tagName === 'LI') node.classList.add('active');
			node = node.parentNode;
		}

		if (toc.classList.contains('toc-fixed')) {
			var linkTop = link.offsetTop;
			if (linkTop < toc.scrollTop || linkTop > toc.scrollTop + toc.clientHeight - 40) {
				toc.scrollTop = Math.max(0, linkTop - toc.clientHeight / 2);
			}
		}
	}

	function updateToc() {
		var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
		toc.classList.toggle('toc-fixed', scrollTop > tocPosition - 30);

		var marker = scrollTop + 110;
		var active = tocEntries.length ? tocEntries[0] : null;
		tocEntries.forEach(function (entry) {
			if (entry.heading.offsetTop <= marker) active = entry;
		});
		if (active) activateTocLink(active.link);
		ticking = false;
	}

	window.addEventListener('scroll', function () {
		if (!ticking) {
			window.requestAnimationFrame(updateToc);
			ticking = true;
		}
	}, { passive: true });
	window.addEventListener('resize', function () {
		if (!toc.classList.contains('toc-fixed')) {
			tocPosition = toc.getBoundingClientRect().top + window.pageYOffset;
		}
		updateToc();
	});
	updateToc();
}


$('#main-navigation').on('click', function(){
    if ($('#main-navigation').hasClass('main-navigation-open')){
      $('#main-navigation').removeClass('main-navigation-open');
    } else {
      $('#main-navigation').addClass('main-navigation-open');
    }
  });

$('#content').on('click', function(){
    if ($('#main-navigation').hasClass('main-navigation-open')){
      $('#main-navigation').removeClass('main-navigation-open');
    }
  });
