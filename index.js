'use strict';

const regexEpisodeNcoreUrl = /(https:\/\/ncore\.)(cc)(\/[\s\S]+)(S\d+)(E\d+)/;
const regexSeriesNameIncludingSeasonEpisode = /([\s\S]+)(S\d+)(E\d+)/;

let lastEpisodeOriginalNcoreUrl = '';

function createSeasonNcoreLink(episodeNcoreLink, seasonNcoreUrl) {
  const seriesNameSeasonEpisodeText =
    document.getElementsByClassName('lbl')[0].parentElement &&
    document.getElementsByClassName('lbl')[0].parentElement.childNodes &&
    document.getElementsByClassName('lbl')[0].parentElement.childNodes.length &&
    document.getElementsByClassName('lbl')[0].parentElement.childNodes[0].textContent;
  if (!seriesNameSeasonEpisodeText) {
    return;
  }

  const match = seriesNameSeasonEpisodeText.match(regexSeriesNameIncludingSeasonEpisode);
  if (!match) {
    return;
  }
  const [ , seriesName, season] = match;

  const brElement = document.createElement('br');
  episodeNcoreLink.insertAdjacentElement('afterend', brElement);

  const brElement2 = document.createElement('br');
  brElement.insertAdjacentElement('afterend', brElement2);

  const brElement3 = document.createElement('br');
  brElement2.insertAdjacentElement('afterend', brElement3);

  const text = brElement3.insertAdjacentText('beforebegin', seriesName + season);

  const linkElement = document.createElement('a');
  linkElement.target = 'blank_';
  linkElement.href = seasonNcoreUrl;
  brElement3.insertAdjacentElement('afterend', linkElement);

  const imgElement = document.createElement('img');
  imgElement.src = '/images/nc.png';
  linkElement.insertAdjacentElement('afterbegin', imgElement);
}

function changeNcoreUrlAndCreateSeasonNcoreLink() {
  // This is not the best and will break if the logic changes but let's use this now since it was easy to implement.
  const episodeNcoreLink = document.body.getElementsByClassName('lbl').length ? document.getElementsByClassName('lbl')[0] : null;
  if (episodeNcoreLink && episodeNcoreLink.href) {
    if (lastEpisodeOriginalNcoreUrl !== episodeNcoreLink.href) {
      lastEpisodeOriginalNcoreUrl = episodeNcoreLink.href;

      const match = episodeNcoreLink.href.match(regexEpisodeNcoreUrl);
      if (match) {
        const [ , protocolAndDomain, tld, path, season, episode ] = match;
        episodeNcoreLink.href = protocolAndDomain + 'pro' + path + season + episode;

        createSeasonNcoreLink(episodeNcoreLink, protocolAndDomain + 'pro' + path + season);
      }
    }
  }
}

// MutationObserver didn't work properly for some reason so I use the easy/hacky way.
setInterval(changeNcoreUrlAndCreateSeasonNcoreLink, 300);
