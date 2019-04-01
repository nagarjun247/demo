// import { fire } from '../firebase';
import axios from 'axios';
import * as utils from '../utils/utils';

const textToSpeech = async (_text) => {
  try {
    // const awsTTS = fire.func.httpsCallable('textToSpeech');
    // const result = await awsTTS({ text });

    const text = utils.filterText(_text);
    const ttsEndpoint = 'https://o0oh9xd75a.execute-api.us-east-1.amazonaws.com/default/textToSpeech';

    // const result = await axios.get(ttsEndpoint+'?text=querystring');
    const result = await axios.post(ttsEndpoint, { text });

    if (result.status === 200 && result.data.status === 'ok') {
      return result.data.url;
    } else {
      const code = 'custom/aws-lambda-error';
      const message = 'Some error occurred during AWS Lambda endpoint access.';
      throw { code, message };
    }
  } catch (error) {
    console.log(error.code, error.message);
  }

  return null;
};

const _load = async () => {
  const text = $('#textarea-narration').val() || '';
  const audioURL = await textToSpeech(text);

  if (utils.isUrl(audioURL)) {
    const playback = document.getElementById("playback");
    const playbackMedia = document.getElementById("playback-mp3");
    playbackMedia.src = audioURL;
    playback.load();
  } else {
    console.warn('Invalid audioURL:', audioURL);
  }

  // Ref: https://stackoverflow.com/questions/7692082/loading-audio-element-after-dynamically-changing-the-source
  // NOTE: This will work only when audio#playback itself contains media src attribute
  // const playback = document.getElementById("playback");
  // playback.src = url;
};

export {
  _load
};
