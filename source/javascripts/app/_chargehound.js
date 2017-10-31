//= require ../lib/_jquery
;(function () {
  'use strict';

  window.getVersionFromPath = getVersionFromPath;
  window.getVersions = getVersions;
  window.selectVersion = selectVersion;
  window.setupVersion = setupVersion;

  function getVersionFromPath () {
    var selectedVersion
    var versionMatch = location.pathname.match(/\d{4}-\d{2}-\d{2}/);
    if (versionMatch) {
      versionMatch = versionMatch[0];
      return versionMatch;
    }

    return false;
  }

  function getVersions () {
    var versions =  $('#version-selector li').map(function () {
      var versionLi = $(this);
      return versionLi.data().version
    });

    return versions.toArray();
  }

  function selectVersion (version) {
    $('#version-selector .version-selected').text('Version ' + version);
    $('#version-selector li').each(function () {
      var versionLi = $(this);
      if (versionLi.data().version === version) {
        versionLi.addClass('selected');
      } else {
        versionLi.removeClass('selected');
      }
    })
  }

  function setupVersion () {
    var versions = getVersions();
    var selectedVersion = getVersionFromPath();

    // Default version is the latest version
    if (!selectedVersion) {
      selectedVersion = versions[0];
    }

    selectVersion(selectedVersion);
  }

  // if we click on the version dropdowm, show the list of versions
  $(function () {
    $('.dropdown-toggle').on('click', function () {
      $(this).parent().toggleClass('open');
      return false;
    });

    $('#version-selector').on('click', function (ev) {
      ev.stopPropagation();
    });

    $('html').click(function() {
      $('.dropdown-toggle').parent().removeClass('open');
    })
  });
})();

