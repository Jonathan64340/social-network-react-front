import React from "react";
import reactStringReplace from "react-string-replace";

/**
 *
 * @param {String} String
 * @description - Can return simple string or string with regex for parsing url
 */
const CustomRenderElement = ({ string, type }) => {
  const regex = new RegExp(
    /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/g
  );

  const youtubeRegex = new RegExp(
    // eslint-disable-next-line
    /youtu(?:.*\/v\/|.*v\=|\.be\/)([A-Za-z0-9_\-]{11})/)

  return reactStringReplace(string, regex, (match, i, offset) => {
    let ytId = string.match(youtubeRegex);
    if (typeof ytId !== 'undefined') {
      if (string.match(youtubeRegex)) {
        ytId = ytId[1]
        return <div style={{ marginTop: 10 }}>
          {type === 'publication' && (<div><span>{ytId[1].substr(12)}</span></div>)}
          <div className="video-wrapper">
            <div className="video">
              <iframe
                style={{ height: (window.innerHeight / 2)}}
                title="Vidéo"
                className="video-frame"
                src={`https://www.youtube.com/embed/${ytId}`}
                allowFullScreen
              />
            </div>
          </div>
        </div>
      }
    }
    return <a className="link-message" href={match} rel="noopener noreferrer" target="_blank">{match}</a>;
  });
};

export default CustomRenderElement;