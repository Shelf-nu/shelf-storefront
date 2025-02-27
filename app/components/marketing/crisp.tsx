import {useEffect} from 'react';
import {Crisp} from 'crisp-sdk-web';

export function useCrisp(
  CRISP_WEBSITE_ID = undefined,
  email: undefined | string = undefined,
  nickname: undefined | string = undefined,
) {
  console.log('loading crisp...');
  useEffect(() => {
    if (CRISP_WEBSITE_ID) {
      Crisp.configure(CRISP_WEBSITE_ID, {autoload: true});
      if (email && nickname) {
        /** Set some user data in crisp */
        Crisp.user.setEmail(email);
        Crisp.user.setNickname(nickname);
      }
    }
  }, [CRISP_WEBSITE_ID, email, nickname]);
}
