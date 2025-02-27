import {useEffect} from 'react';
import {Crisp} from 'crisp-sdk-web';

export function useCrisp(
  CRISP_WEBSITE_ID: string | undefined,
  email: undefined | string = undefined,
  nickname: undefined | string = undefined,
) {
  useEffect(() => {
    console.log('loading crisp...', CRISP_WEBSITE_ID);

    if (CRISP_WEBSITE_ID) {
      Crisp.configure(CRISP_WEBSITE_ID);
      if (email && nickname) {
        /** Set some user data in crisp */
        Crisp.user.setEmail(email);
        Crisp.user.setNickname(nickname);
      }
    }
  }, [CRISP_WEBSITE_ID, email, nickname]);
}
